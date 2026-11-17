# Goaaal ad – Audio brief (33.0 s, 30 fps, 1920×1080)

Video file: `goaaal-ad-silent.mp4` (no audio track). Build the audio as **one 48 kHz / 24-bit stereo WAV, exactly 33.000 s**, then mux:

```bash
ffmpeg -i goaaal-ad-silent.mp4 -i goaaal-ad-audio.wav -c:v copy -c:a aac -b:a 256k -shortest goaaal-ad.mp4
```

## 1. Global settings
| Item | Value |
|---|---|
| Length | 33.000 s (hard stop; tail fades to silence by 33.0) |
| Tempo / key | 124 BPM, 4/4, C minor → lifts to C major at the end card (28.2 s) |
| Bar length | 1.935 s (beat = 0.484 s) – the picture cuts land on bar lines |
| Loudness | −14 LUFS integrated, true peak ≤ −1 dBTP (social/YouTube/Reels) |
| Mix balance | Music −18 LUFS under VO, VO −14 LUFS, SFX peaks −8 dBFS |
| Ducking | Music −6 dB while VO speaks (attack 20 ms, release 250 ms) |
| Stems to deliver | Music, VO, SFX separately (so levels can be re-balanced) |

## 2. Music prompt (Suno / Udio / ElevenLabs Music / Stable Audio)
> Upbeat modern football-stadium pop-electronic instrumental, 124 BPM. Chunky four-on-the-floor kick, clapping stadium claps on 2 and 4, punchy analog bass, bright plucked synth arpeggio, a small brass/horn stab riff, and a crowd-chant "oh-oh-oh" vocal texture (no words). Starts tense with a rising filtered build and a snare roll for the first 3 seconds, **hits a huge drop on the goal at 2.9 s**, then a confident groove with a half-time breakdown at 10.4 s and 16.3 s (filtered, then back to full), builds again from 23 s, and finishes with a bright major-key final chord and a short cymbal swell at 28.5 s, ending cleanly at 33 s. Fun, energetic, family-friendly, no explicit lyrics. Instrumental only.

Negative prompt: no spoken words, no sad/ambient pads, no heavy metal guitars, no real-song melodies.

## 3. Voice-over script (English, ~60 words, warm, confident, smiling)
Voice: young adult, friendly sports-presenter energy, medium pace (~150 wpm), slight smile. Record dry; add light room reverb only on the first word.

| Time | Line |
|---|---|
| 0.4 – 2.7 | *(no VO – crowd noise and ticking clock; let the tension build)* |
| 3.0 | **"GOAAAAAL!"** (stretched shout, 1.2 s, tail into the drop) |
| 4.6 – 7.5 | "Your phone is the controller… any screen is the scoreboard." |
| 10.9 – 14.8 | "Plug in a camera. Get VAR replays — in your pocket." |
| 17.0 – 21.5 | "New: send the live match straight to Retro TV." |
| 23.8 – 27.5 | "Controller. Display. VAR. Live TV." |
| 29.0 – 32.2 | "Goaaal. Score it. Replay it. Broadcast it. appendhub dot com slash go-wall." |

**TTS settings (ElevenLabs-style):** stability 40 %, similarity 75 %, style exaggeration 35 %, speed 1.0, speaker boost on. Use the English "energetic male/female sports presenter" voice you prefer. For an **Arabic version** use the same timing with a Gulf/MSA presenter voice, and keep "GOAAAAAL!" (the app itself offers Arabic + English commentary).

## 4. Sound-effect cue sheet (sync to picture)
| Time (s) | Picture | SFX |
|---|---|---|
| 0.0 | Scoreboard pops in | Soft whoosh + low stadium crowd bed (stays under until 2.9) |
| 0.5 – 2.8 | Clock racing 88:10 → 90:00 | Fast digital tick-tick-tick, pitch rising, heartbeat sub-bass at 1×/s |
| 2.85 | Flash / score 2 | **Crowd roar** swell (0.1 s hit, 2 s tail), air-horn, net "swish", bass drop |
| 3.0 – 4.2 | Confetti | Confetti pops, whistle blast at 3.4 |
| 4.2 | Scene change | Whoosh (short) |
| 5.0 – 6.1 | Code digits typed | 8 soft keypad "tick" sounds, one per 0.14 s |
| 6.15 | Pair button | UI click |
| 6.5 | "Connected" | Positive 2-note chime (up a fifth) |
| 7.4 / 8.15 / 8.9 / 9.6 | +1 taps, clock start | Tap "pop" each; on score change a short stadium cheer (0.5 s) |
| 10.4 | VAR scene | Whoosh; low camera-shutter "click" at 11.1 and 11.35 (thumbs) |
| 13.2 | **VAR stamp** | Heavy stamp thud + digital "scan" riser |
| 13.6 – 16.5 | Replay | Tape-rewind zip (0.6 s) then slowed-down crowd murmur, low pass filter |
| 16.3 | Retro TV scene | Whoosh |
| 16.9 | "NEW" burst | Cartoon pop + sparkle |
| 18.5 | Send live match tap | UI click |
| 18.55 – 19.5 | Dotted beam, packets | 4 quick data "blips" travelling left → right |
| 19.0 – 19.8 | TV static | Analog static burst (0.7 s) then CRT "power-on" thunk |
| 19.8 | Live picture | Soft broadcast "ding" |
| 23.8 / 24.1 / 24.4 / 24.7 | Four cards pop | Four ascending marimba-pop hits |
| 28.6 | Logo pop | Big brand hit (impact + shimmer), music resolves to major |
| 29.3 / 29.9 | Tagline / URL | Whoosh then UI click |
| 32.0 – 33.0 | End | Music tail fades, one last whistle at 32.6 |

## 5. Generation steps (quickest workflow)
1. Generate the music with the prompt above; trim/stretch to 33 s so the drop lands at **2.9 s** (cut at a bar line, 1.935 s per bar).
2. Generate the VO lines separately (one file per row of §3) and place them at the times shown.
3. Layer SFX from §4 (freesound/ElevenLabs SFX/Epidemic). Search terms are listed in the table.
4. Mix per §1, export WAV, run the ffmpeg command above.
5. Check loudness: `ffmpeg -i goaaal-ad.mp4 -af ebur128 -f null -`
