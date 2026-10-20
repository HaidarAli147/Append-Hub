# AppendHub

AppendHub is the parent technology brand. AppendHub Learn is its bilingual learning platform.

## Project map

- index.html and ar/index.html: English and Arabic AppendHub company homepages.
- learn/: AppendHub Learn homepages, subject pages, quizzes, presentation viewer and lessons, Live, and OG Mode.
- desktop/: AppendHub Desktop Public Beta product page, copied source, local ZIP source archive, and SHA-256 checksum. Debian 13 with X11 is the documented target; see desktop/README.md.
- browser/ and ar/browser/: English and Arabic AppendHub Browser Coming Soon pages.
- go-wall/ and ar/go-wall/: English and Arabic Go-Wall product pages; the preserved bilingual scoreboard PWA is under go-wall/app/.
- shared/: company site styles and Learn global navigation.
- assets/: official brand marks and shared lesson and interface images.
- api/live-token.js: serverless AppendHub Live token endpoint.
- AppendHub_Archive/: preserved historical AI tutor pages and legacy media.

Learn routes use /learn/, /learn/en/, /learn/ar/, /learn/og-mode/, /learn/present/, and /learn/live.html. The English OG Mode directory has two spaces in its name to preserve the original URL. Vercel redirects legacy English and Arabic subject routes, quizzes, OG Mode, Present, and Live URLs to their Learn locations. The local server and Vercel redirect existing Learn links to the canonical copies under learn/. The former root homepage is now the AppendHub company homepage. Arabic company pages use /ar/ and Arabic Learn uses /learn/ar/. Go-Wall has one bilingual app route at /go-wall/app/.

## Presentation development

Install dependencies with npm install, build the viewer with npm run build:present, and run the local preview with npm run dev. The preview serves the repository root on port 4173 by default and also runs the AppendHub Live token function locally; set PORT to use another port. The server listens on all network interfaces for local-network testing.

Each presentation lesson lives in its own folder under learn/present/lessons/<language>/<subject>/<lesson>/. Keep its index.html, presentation.pptx, and quiz.html together. Subject pages link directly to the shared AppendHub Present viewer at /learn/present/. The generated viewer bundle is learn/present/js/bundle.js.

## AppendHub Live

AppendHub Live receives the existing LiveKit broadcast in the browser. The broadcast room and infrastructure are unchanged. Build its browser bundle with npm run build:live; the separate npm run build:present command is unchanged. Vercel's vercel-build script rebuilds both bundles for deployment. npm run dev serves the pages and routes /api/live-token to the same local Node handler.

For local playback, create an ignored .env.local file in the repository root with these values. The dev server loads it automatically. Set the same server-only variables in Vercel for Development, Preview, and Production as needed:

    LIVEKIT_URL=wss://brack-0n3t932a.livekit.cloud
    LIVEKIT_API_KEY=your_livekit_api_key
    LIVEKIT_API_SECRET=your_livekit_api_secret

Do not prefix these variables with VITE_, NEXT_PUBLIC_, or another client-exposure prefix. The token function remains at api/live-token.js. Alternatively, link the project with the Vercel CLI, run vercel env pull .env.local, and then npm run dev. Opening /learn/live.html requests a viewer token only when the function confirms the room has a published video track. The viewer token expires after 10 minutes and cannot publish tracks or data. The endpoint allows up to 10 requests per IP per minute per active serverless instance.

For a live playback check, start the existing OBS broadcast through the configured LiveKit RTMP ingress, open /learn/live.html, wait for the LIVE status, and press Enable Audio if the browser blocks autoplay. Stop OBS and use Check Stream to verify the offline screen. No student camera or microphone permissions are requested.

## Go-Wall and AppendHub Desktop

Go-Wall is served from /go-wall/ with its original PWA under /go-wall/app/. The app supports Arabic and English, football, handball, tennis, and offline use; its source, MIT license, audio, and assets are kept intact. AppendHub Desktop is a Public Beta based on the latest available brack-tdx main commit. Its product page offers a locally prepared source ZIP and checksum, and documents the verified Debian 13 X11 target and installer behavior. The package has not been tested on multiple machines; the upstream source contains no license file. No GitHub release was uploaded.
