# Go-Wall on AppendHub

Go-Wall is integrated as a dedicated product at `/go-wall/`. Its original bilingual static PWA is preserved in `app/` and opens at `/go-wall/app/`.

The app provides scoreboards for football, handball, and tennis; local save and undo; display mode and keyboard controls; and pre-recorded Arabic/English commentary. It has no build dependencies. Serve the directory over HTTP or HTTPS to enable its service worker and installable PWA behavior.

Source copied from `https://github.com/HaidarAli147/go-wall`, branch `main`, commit `cbcac54f13909de3096dd2244ec3473b71d757ad` (2026-09-30). The original README, MIT license, app assets, audio, service worker, and voice-generation tool are kept in `app/`.

## LAN controller and separate display

The original single-device scoreboard is unchanged. To run a separate phone controller and big-screen display **on the same Wi-Fi/LAN**, start a local companion server:

```bash
cd go-wall/lan
npm install
npm start
```

The terminal prints the LAN display URL and a fresh six-digit pairing code. Open the **display URL** on the big screen first, then open `http://DISPLAY_IP:8765/go-wall/lan/` on your phone, enter the code, and press **Pair**. Both devices must reach the same local computer on port 8765; guest Wi-Fi/client isolation can block this. No public cloud relay is used. This mode needs a local Node.js server and is **not available by simply opening the Vercel-hosted site**.

The display is authoritative for match state and timers. Remote controls include football, handball, tennis scoring, clock start/pause, undo, sound, language, and selected sport-specific controls. Other advanced options remain available on the display. The existing standalone offline PWA continues to work without the companion server.

**Security:** use only on a trusted private network. The pairing code changes on server restart. The companion server listens on LAN interfaces and serves the AppendHub site locally; do not port-forward 8765 or expose it to the internet. The current prototype does not provide encrypted transport or user accounts, so avoid untrusted public Wi-Fi.

## Browser-only controller and display (appendhub.com)

Open https://www.appendhub.com/go-wall/app/ on both devices. On the display, select **Display** and note the eight-digit pairing code. On your phone, select **Controller** and enter the code. The controller can operate the score, timer, sports, sound, and undo. The display is the authoritative match state.

This mode uses the public PeerJS signaling service to introduce browsers, then attempts a direct WebRTC data channel **without STUN/TURN servers**. Devices should be on the same local network, with client isolation disabled. Internet access is required for initial signaling and the PeerJS CDN; the data channel is direct if established. Some networks and browsers block local peer connections, so pairing is not guaranteed. It does not independently verify Wi-Fi SSID or cryptographically prove same-LAN membership. The previous Node LAN companion remains an alternative.

**Privacy:** Pair only on trusted networks. An eight-digit code protects the session from casual discovery but is not strong authentication. Do not use for high-security applications.
