const { randomUUID } = require('node:crypto');
const { AccessToken, RoomServiceClient, TrackType } = require('livekit-server-sdk');

const ROOM_NAME = 'brackstudy-live';
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 10;
const requestsByIp = new Map();

function send(res, status, body) {
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.status(status).json(body);
}

function isSameOrigin(req) {
  const origin = req.headers.origin;
  if (!origin) return true;
  const forwardedHost = req.headers['x-forwarded-host'];
  const host = (Array.isArray(forwardedHost) ? forwardedHost[0] : forwardedHost) || req.headers.host;
  const forwardedProto = req.headers['x-forwarded-proto'];
  const proto = (Array.isArray(forwardedProto) ? forwardedProto[0] : forwardedProto)
    || (req.socket?.encrypted ? 'https' : 'http');
  try {
    return new URL(origin).host === host && new URL(origin).protocol === `${proto}:`;
  } catch {
    return false;
  }
}

function allowRequest(req, res) {
  const forwarded = req.headers['x-forwarded-for'];
  const ip = (Array.isArray(forwarded) ? forwarded[0] : forwarded || '').split(',')[0].trim() || 'unknown';
  const now = Date.now();
  if (requestsByIp.size > 5000) {
    for (const [key, value] of requestsByIp) {
      if (now - value.startedAt >= WINDOW_MS) requestsByIp.delete(key);
    }
  }
  const entry = requestsByIp.get(ip);
  if (!entry || now - entry.startedAt >= WINDOW_MS) {
    requestsByIp.set(ip, { startedAt: now, count: 1 });
    return true;
  }
  if (entry.count >= MAX_REQUESTS) {
    res.setHeader('Retry-After', String(Math.ceil((WINDOW_MS - (now - entry.startedAt)) / 1000)));
    send(res, 429, { error: 'rate_limited' });
    return false;
  }
  entry.count += 1;
  return true;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return send(res, 405, { error: 'method_not_allowed' });
  }
  if (!isSameOrigin(req)) return send(res, 403, { error: 'origin_not_allowed' });
  if (!allowRequest(req, res)) return;

  const { LIVEKIT_URL, LIVEKIT_API_KEY, LIVEKIT_API_SECRET } = process.env;
  if (!LIVEKIT_URL || !LIVEKIT_API_KEY || !LIVEKIT_API_SECRET) {
    return send(res, 503, { error: 'live_service_unavailable' });
  }

  try {
    const apiHost = LIVEKIT_URL.replace(/^wss:/i, 'https:').replace(/^ws:/i, 'http:');
    const roomService = new RoomServiceClient(apiHost, LIVEKIT_API_KEY, LIVEKIT_API_SECRET);
    const rooms = await roomService.listRooms([ROOM_NAME]);
    if (!rooms.some((room) => room.name === ROOM_NAME)) {
      return send(res, 409, { error: 'stream_offline' });
    }

    const participants = await roomService.listParticipants(ROOM_NAME);
    const videoIsPublished = participants.some((participant) =>
      (participant.tracks || []).some((track) => track.type === TrackType.VIDEO || track.type === 'VIDEO'),
    );
    if (!videoIsPublished) return send(res, 409, { error: 'stream_offline' });

    const token = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, {
      identity: `viewer-${randomUUID()}`,
      ttl: 600,
    });
    token.addGrant({
      room: ROOM_NAME,
      roomJoin: true,
      canSubscribe: true,
      canPublish: false,
      canPublishData: false,
    });
    return send(res, 200, { token: await token.toJwt(), url: LIVEKIT_URL });
  } catch (error) {
    console.error('AppendHub Live token request failed:', error?.message || error);
    return send(res, 503, { error: 'live_service_unavailable' });
  }
};
