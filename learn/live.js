import { Room, RoomEvent, Track } from 'livekit-client';

const video = document.getElementById('live-player');
const status = document.getElementById('live-status');
const offline = document.getElementById('offline-screen');
const connecting = document.getElementById('connecting-screen');
const retry = document.getElementById('retry-button');
const enableAudio = document.getElementById('enable-audio-button');
const playerWrapper = document.querySelector('.live-player-wrapper');
const arabic = new URLSearchParams(location.search).get('lang') === 'ar'
  || document.documentElement.lang === 'ar'
  || (navigator.language || '').toLowerCase().startsWith('ar');
const liveDebug = ['localhost', '127.0.0.1', '[::1]'].includes(location.hostname)
  && new URLSearchParams(location.search).get('debugLive') === '1';
const debugStartedAt = performance.now();

function debugTiming(event, details = {}) {
  if (!liveDebug) return;
  console.debug(`[AppendHub Live +${Math.round(performance.now() - debugStartedAt)}ms] ${event}`, details);
}

if (arabic) {
  document.documentElement.lang = 'ar';
  playerWrapper.dir = 'rtl';
} else {
  document.documentElement.lang = 'en';
  playerWrapper.dir = 'ltr';
}

const copy = arabic
  ? { offline: 'البث غير متصل حالياً.', next: 'انضم إلينا في درس الجمعة القادم!', connecting: 'جارٍ الاتصال بالبث المباشر…', live: 'مباشر', off: 'غير متصل', unavailable: 'تعذر التحقق من حالة البث.', endpointMissing: 'لم يتم العثور على خدمة رمز البث. شغّل خادم التطوير من مجلد المشروع.', setupMissing: 'إعدادات خدمة البث غير متوفرة على الخادم.', connectionFailed: 'تعذر الاتصال بخدمة البث. تحقق من اتصال الشبكة ثم أعد المحاولة.', retry: 'تحقق من البث', audio: 'تفعيل الصوت' }
  : { offline: 'The stream is currently offline.', next: 'Join us for our next Friday lesson!', connecting: 'Connecting to AppendHub Live…', live: 'LIVE', off: 'OFFLINE', unavailable: 'Live status could not be checked.', endpointMissing: 'The Live token endpoint was not found. Start the project development server from the repository folder.', setupMissing: 'LiveKit server environment variables are missing or unavailable.', connectionFailed: 'Could not connect to LiveKit. Check the network and try again.', retry: 'Check Stream', audio: 'Enable Audio' };

offline.querySelectorAll('p')[0].textContent = copy.offline;
offline.querySelectorAll('p')[1].textContent = copy.next;
connecting.querySelector('p').textContent = copy.connecting;
retry.textContent = copy.retry;
enableAudio.textContent = copy.audio;

let room = null;
let connectingPromise = null;
let audioElements = [];
const attachedTracks = new Map();
let pageLeaving = false;

function showOffline() {
  status.textContent = copy.off;
  status.classList.remove('active');
  offline.querySelectorAll('p')[0].textContent = copy.offline;
  offline.querySelectorAll('p')[1].textContent = copy.next;
  offline.querySelectorAll('p')[1].hidden = false;
  connecting.hidden = true;
  offline.hidden = false;
  enableAudio.hidden = true;
  retry.hidden = false;
}

function showUnavailable(message) {
  status.textContent = copy.unavailable;
  status.classList.remove('active');
  offline.querySelectorAll('p')[0].textContent = message;
  offline.querySelectorAll('p')[1].hidden = true;
  connecting.hidden = true;
  offline.hidden = false;
  enableAudio.hidden = true;
  retry.hidden = false;
}

function showConnecting() {
  status.textContent = copy.off;
  status.classList.remove('active');
  offline.hidden = true;
  connecting.hidden = false;
  retry.hidden = true;
}

function showLive() {
  status.textContent = copy.live;
  status.classList.add('active');
  connecting.hidden = true;
  offline.hidden = true;
  enableAudio.hidden = false;
  retry.hidden = true;
}

function hasRemoteVideo(activeRoom) {
  for (const participant of activeRoom.remoteParticipants.values()) {
    for (const publication of participant.trackPublications.values()) {
      if (publication.kind === Track.Kind.Video) return true;
    }
  }
  return false;
}

function clearMedia() {
  for (const [track, element] of attachedTracks) track.detach(element);
  attachedTracks.clear();
  for (const audio of audioElements) {
    audio.pause();
    audio.srcObject = null;
    audio.remove();
  }
  audioElements = [];
  video.pause();
  video.srcObject = null;
}

function attachTrack(track, subscribedAt = null) {
  if (attachedTracks.has(track)) return;
  const attachStartedAt = performance.now();
  if (track.kind === Track.Kind.Video) {
    track.attach(video);
    attachedTracks.set(track, video);
    debugTiming('video attached', { attachMs: Math.round(performance.now() - attachStartedAt) });
    if (typeof video.requestVideoFrameCallback === 'function') {
      video.requestVideoFrameCallback(() => debugTiming('first video frame rendered', {
        sinceSubscriptionMs: subscribedAt === null ? null : Math.round(performance.now() - subscribedAt),
      }));
    } else {
      video.addEventListener('playing', () => debugTiming('video playing'), { once: true });
    }
    video.muted = true;
    video.play().catch(() => {});
    showLive();
    return;
  }
  if (track.kind === Track.Kind.Audio) {
    const audio = document.createElement('audio');
    audio.autoplay = true;
    audio.playsInline = true;
    audio.volume = video.volume;
    audio.muted = video.muted;
    playerWrapper.append(audio);
    track.attach(audio);
    debugTiming('audio attached', { attachMs: Math.round(performance.now() - attachStartedAt) });
    attachedTracks.set(track, audio);
    audioElements.push(audio);
    audio.play().catch(() => { enableAudio.hidden = false; });
  }
}

function setupRoom(activeRoom) {
  activeRoom.on(RoomEvent.TrackSubscribed, (track, publication, participant) => {
    const subscribedAt = performance.now();
    debugTiming('track subscribed', {
      kind: track.kind,
      participant: participant.identity,
      publicationSid: publication.trackSid,
    });
    attachTrack(track, subscribedAt);
  });
  activeRoom.on(RoomEvent.TrackUnsubscribed, (track) => {
    const element = attachedTracks.get(track);
    track.detach(element);
    attachedTracks.delete(track);
    if (element && element !== video) {
      element.pause();
      element.srcObject = null;
      element.remove();
      audioElements = audioElements.filter((audio) => audio !== element);
    }
    if (track.kind === Track.Kind.Video && !hasRemoteVideo(activeRoom)) {
      clearMedia();
      showOffline();
    }
  });
  activeRoom.on(RoomEvent.ParticipantDisconnected, () => {
    if (!hasRemoteVideo(activeRoom)) {
      clearMedia();
      showOffline();
    }
  });
  activeRoom.on(RoomEvent.Reconnecting, () => {
    debugTiming('reconnecting');
    showConnecting();
  });
  activeRoom.on(RoomEvent.Reconnected, () => {
    debugTiming('reconnected');
    if (video.srcObject) showLive();
  });
  activeRoom.on(RoomEvent.Disconnected, () => {
    debugTiming('disconnected');
    clearMedia();
    showOffline();
  });
}

async function connectToLive() {
  if (connectingPromise || pageLeaving) return connectingPromise;
  connectingPromise = (async () => {
    showConnecting();
    retry.disabled = true;
    try {
      const tokenStartedAt = performance.now();
      debugTiming('token request started');
      const response = await fetch('/api/live-token', {
        method: 'GET',
        headers: { Accept: 'application/json' },
        cache: 'no-store',
        credentials: 'same-origin',
      });
      let body = {};
      try { body = await response.json(); } catch {}
      debugTiming('token response received', {
        status: response.status,
        requestMs: Math.round(performance.now() - tokenStartedAt),
      });
      if (!response.ok) {
        if (response.status === 409 && body.error === 'stream_offline') {
          showOffline();
          return;
        }
        const message = response.status === 404
          ? copy.endpointMissing
          : response.status === 503
            ? copy.setupMissing
            : copy.connectionFailed;
        showUnavailable(message);
        return;
      }
      if (pageLeaving) return;

      const activeRoom = new Room({ adaptiveStream: true, dynacast: false });
      room = activeRoom;
      setupRoom(activeRoom);
      const connectStartedAt = performance.now();
      debugTiming('room connect started');
      await activeRoom.connect(body.url, body.token, { autoSubscribe: true });
      debugTiming('room connected', { connectMs: Math.round(performance.now() - connectStartedAt) });
      for (const participant of activeRoom.remoteParticipants.values()) {
        for (const publication of participant.trackPublications.values()) {
          if (publication.track) attachTrack(publication.track);
        }
      }
      if (!video.srcObject) showOffline();
    } catch (error) {
      if (!pageLeaving) {
        console.info('AppendHub Live is not available:', error?.message || error);
        if (room) {
          room.removeAllListeners();
          room.disconnect();
          room = null;
        }
        clearMedia();
        showUnavailable(copy.connectionFailed);
      }
    } finally {
      retry.disabled = false;
      connectingPromise = null;
    }
  })();
  return connectingPromise;
}

enableAudio.addEventListener('click', async () => {
  video.muted = false;
  await Promise.all(audioElements.map((audio) => {
    audio.muted = false;
    return audio.play().catch(() => {});
  }));
  await video.play().catch(() => {});
});

video.addEventListener('volumechange', () => {
  for (const audio of audioElements) {
    audio.volume = video.volume;
    audio.muted = video.muted;
  }
});

retry.addEventListener('click', async () => {
  if (room) {
    room.disconnect();
    room = null;
  }
  clearMedia();
  await connectToLive();
});

window.addEventListener('pagehide', () => {
  pageLeaving = true;
  room?.disconnect();
  room = null;
  clearMedia();
}, { once: true });

connectToLive();
