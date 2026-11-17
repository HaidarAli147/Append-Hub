# Goaaal ad

- `goaaal-ad-silent.mp4` – 33 s, 1920×1080, 30 fps ad (no audio)
- `AUDIO-BRIEF.md` – music prompt, VO script, SFX cue sheet, mix settings
- `source/ad.html` – the animation (all timing is in this file); `source/render.js` renders it to MP4
- `assets/` – real brand logos / Retro TV art / Lalezar font used

Re-render: `cd source && NODE_PATH=$(npm root -g) node render.js ../goaaal-ad-silent.mp4`
