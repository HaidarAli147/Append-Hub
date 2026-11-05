# جو وول · Go Wall

لوحة نتائج احترافية متعددة الرياضات تعمل بالكامل داخل المتصفح — **بدون تثبيت وبدون إنترنت**.
A pro multi-sport scoreboard for **football, handball and tennis**. Pure HTML/CSS/JS, zero dependencies, installable as a PWA.

## المزايا · Features

**عام / General**
- حفظ تلقائي في المتصفح (تبقى النتيجة بعد إغلاق الصفحة) · auto-save
- تراجع (Undo) عن أي هدف أو نقطة أو بطاقة · unlimited-ish undo (80 steps)
- **وضع العرض (TV mode)** للشاشات الكبيرة مع منع انطفاء الشاشة · Wake Lock
- اختصارات لوحة المفاتيح، أصوات مولّدة برمجيًا، ألوان فرق قابلة للتغيير
- ساعات دقيقة مبنية على الطوابع الزمنية (لا تتأخر عند تصغير التبويب)
- PWA: يعمل offline ويمكن تثبيته على الهاتف/الحاسوب

**⚽ كرة القدم** — ساعة تصاعدية بأربعة أشواط (أصلي + إضافي) مع **وقت بدل الضائع +MM:SS**، تعديل الوقت يدويًا، أخطاء، بطاقات صفراء/حمراء، وسجل أحداث بالدقيقة.

**🤾 كرة اليد** — ساعة تنازلية 30:00 لكل شوط، أوقات مستقطعة (3)، **إيقافات دقيقتين** تُحتسب مع الساعة فقط وتنتقل بين الشوطين، صافرة نهاية الشوط.

**🎾 التنس** — نظام نقاط كامل (15/30/40/AD)، **Tie-break عند 6-6**، تبديل المرسل تلقائيًا (بما فيه الشوط الفاصل)، أفضل من 1/3/5 مجموعات، وضع No-Ad، سجل المجموعات وإعلان الفائز.

## اللغة · Language

عربي / English بزر واحد في أعلى الصفحة (يتذكّر اختيارك). الواجهة والمعلق الصوتي يتبدّلان معًا.
Arabic / English with one button in the header (remembered). The UI and the commentator switch together.

## المعلق الصوتي · Commentator

صوت ذكوري حماسي **ثابت في كل المتصفحات**: مقاطع صوتية جاهزة (`audio/ar`, `audio/en`) تُركَّب في جمل، بدل صوت المتصفح.
يُشغَّل بمحرّك Web Audio: تُقصّ فترات الصمت وتُوصَل المقاطع كأنها جملة واحدة مع رفع الصوت. يعلّق بحسب سياق المباراة (الهدف الأول، التعادل، التقدّم، العودة، هدف في الوقت القاتل، الدقيقة) ويملأ الفراغ بتعليقات حيّة أثناء اللعب وهتاف جمهور مُولَّد. يعلّق على الأهداف والبطاقات والأخطاء والأشواط والوقت المستقطع والإيقافات ونقاط التنس. يُشغَّل/يُوقَف بزر 🎙️ أو `V`.
لإعادة توليد المقاطع أو تغيير الصوت: `pip install edge-tts && python tools/gen_voice.py` (الصوت الحالي `ar-SA-HamedNeural`).

## الاختصارات · Shortcuts

| المفتاح | الوظيفة |
|---|---|
| `Space` | تشغيل/إيقاف الساعة |
| `1` / `2` | هدف أو نقطة للفريق 1 / 2 (`Shift` للإنقاص) |
| `Z` | تراجع |
| `T` | وضع العرض |
| `F` | ملء الشاشة |
| `M` | كتم الصوت |
| `?` | المساعدة |

## التشغيل · Run

ملف ثابت — افتح `index.html`، أو شغّل خادمًا محليًا (مطلوب لتفعيل PWA):

```bash
python -m http.server 8000
# ثم افتح http://localhost:8000
```

## النشر · Deploy

أي استضافة ثابتة تعمل (GitHub Pages، Netlify، Cloudflare Pages…).

## الهيكل · Structure

```
index.html            الواجهة
css/style.css         التصميم (RTL، متجاوب، وضع العرض)
js/app.js             المنطق: الحالة، الساعات، التنس، العرض
sw.js                 Service Worker (offline)
manifest.webmanifest  PWA
```

## الرخصة · License

MIT — انظر [LICENSE](LICENSE).


## VAR camera recording, exports and QR pairing

1. On the scoreboard screen choose **Display**, then use **📱 Scan to connect** to show the controller QR code. Scan it on the controller phone to open the controller link and connect. The eight-digit code remains available if scanning is unavailable.
2. Once the controller is paired, scan its **camera QR code** on each additional phone and allow camera access. Multiple phones can be connected as separate cameras. Keep the browser tabs open and the phones powered.
3. On the controller, select **Record whole match (all cameras)** near kickoff and **Stop recording** at the end. Recording starts for every currently connected camera; a camera joining later starts recording on connection.
4. Use **Save all camera recordings (ZIP)** to download a bundle containing separate camera video files, or use **Save match** for an individual camera. A disconnected camera's completed segment remains in the ZIP; reconnection may create another segment.
5. Use **Replay last clip**, then **Save replay**, to download or share the short replay. The recent replay buffer is still limited, so save important clips promptly.

**Important limitations:** Recording takes place inside the controller browser and is temporarily held in memory. It is **not** automatically copied to the photo gallery and does not survive closing/reloading the browser. Use download or Share (where supported) to keep the files. Some phones save video to Files/Downloads first; move it to Photos/Gallery from there. The ZIP contains individual camera videos, **not** one synchronized, edited multi-camera video. Very long matches or many cameras may exhaust browser memory; test on your devices and consider shorter recording sessions. QR code and ZIP creation libraries currently load from CDNs, so pairing QR and ZIP export require them to be available.


### Temporary 15-second VAR replays

Each connected VAR camera keeps **only the latest completed 15-second replay clip** in memory. Once the next segment is finalized, it replaces the previous segment. The replay is not saved to localStorage, IndexedDB, the filesystem, or the gallery. Refreshing/closing the tab or browser discards its temporary replay data. The **Save replay** button can deliberately download/share a copy that will remain on the user's device. The separate, explicit **Record whole match** feature is unaffected.

A completed segment becomes available after roughly 15 seconds. This implementation does **not** offer frame-accurate instant rewind of the rolling last 15 seconds; the newest incomplete segment isn't playable until finalized. Reliable frame-accurate instant rewind would require a more advanced segmented-media pipeline.


### Announcements on iPhone / Android displays

Mobile browsers can block incoming WebRTC audio until the receiving device has received a user tap. When using a phone as the **Display**, tap **🔊 Enable announcement audio** on the display device and leave its Goaaal browser page visible. If autoplay is blocked, the button appears again so that audio can be started explicitly. The controller must grant microphone permission, and the display must have its media volume enabled. This does not bypass iOS/Android background playback restrictions or network/WebRTC issues: when a stream cannot connect (for instance across restrictive NATs without TURN relay), browser code alone cannot guarantee a connection. Test PC→phone and phone→phone with both devices on the same network before testing other networks.
