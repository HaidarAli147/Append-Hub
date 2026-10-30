/* Go Wall — multi-sport scoreboard. No build step, no dependencies. */
'use strict';


/* ================================================================
   Language (Arabic is the source text; EN maps it to English)
   ================================================================ */
const EN = {
  'الشوط الأول': 'First half', 'الشوط الثاني': 'Second half',
  'الشوط الإضافي الأول': 'Extra time 1st', 'الشوط الإضافي الثاني': 'Extra time 2nd',
  'الفريق الأول': 'Team One', 'الفريق الثاني': 'Team Two', 'فريق اليد أ': 'Handball A', 'فريق اليد ب': 'Handball B',
  'اللاعب الأول': 'Player One', 'اللاعب الثاني': 'Player Two',
  'لا يوجد ما يمكن التراجع عنه': 'Nothing to undo', 'تم التراجع': 'Undone',
  'تأكيد': 'Confirm', 'إلغاء': 'Cancel', 'حفظ': 'Save', 'حسنًا': 'OK', 'تخطي': 'Skip',
  'اكتب الوقت بصيغة': 'Type the time as', 'دقائق:ثواني': 'min:sec', 'مثل': 'e.g.',
  'اختصارات لوحة المفاتيح': 'Keyboard shortcuts',
  'تشغيل / إيقاف الساعة': 'Start / stop the clock',
  'هدف / نقطة للفريق (اللاعب) الأول أو الثاني': 'Goal / point for the first or second team (player)',
  'إنقاص هدف (كرة القدم واليد)': 'Remove a goal (football, handball)',
  'تراجع عن آخر إجراء': 'Undo the last action',
  'وضع العرض على الشاشة الكبيرة': 'Display mode for the big screen',
  'ملء الشاشة': 'Fullscreen', 'كتم / تشغيل الصوت': 'Mute / unmute sound',
  'المعلق الصوتي': 'Toggle the commentator', 'هذه القائمة': 'This list',
  'نصيحة: اضغط على الساعة لتعديل الوقت يدويًا.': 'Tip: click the clock to edit the time by hand.',
  'انتهى الوقت الأصلي — بدأ الوقت المحتسب بدل الضائع': 'Regular time over — stoppage time',
  'انتهى الشوط الأول': 'First half over', 'انتهت المباراة': 'Full time',
  'انتهى الشوط — انتقل للشوط التالي أو أعد الوقت': 'Half over — go to the next half or reset the clock',
  'جووول!': 'GOAL!', 'هدف لفريق': 'A goal for', 'من سجّل الهدف؟': 'who scored?',
  'اسم اللاعب (اختياري)': 'Scorer name (optional)', 'إعلان الهدف': 'Announce goal',
  'هدف سجله': 'Goal scored by', 'جووووول!': 'GOOOOAL!',
  'تعديل وقت المباراة': 'Edit match time', 'تعديل الوقت المتبقي': 'Edit time remaining',
  'استُنفدت الأوقات المستقطعة': 'No timeouts left', 'هذا هو الشوط الأخير': 'This is the last half',
  'انتهت المباراة — ابدأ مباراة جديدة': 'Match over — start a new match', 'يفوز بالمباراة': 'wins the match',
  'كرة القدم': 'Football', 'كرة اليد': 'Handball', 'التنس': 'Tennis', 'التنس الأرضي': 'Tennis',
  'تصفير المباراة؟': 'Reset the match?', 'سيتم تصفير نتيجة وساعة': 'This resets the score and clock of',
  '(تبقى أسماء الفرق وألوانها).': '(team names are kept).', 'نعم، صفّر': 'Yes, reset',
  'جو وول': 'Go Wall',
  'اسم الفريق': 'Team name', 'إنقاص': 'Decrease', 'زيادة': 'Increase',
  'صاحب الأرض': 'Home', 'الضيف': 'Away', 'هدف': 'Goal', 'إنذار': 'Booking', 'طرد': 'Red card',
  'أخطاء': 'Fouls', 'إنذارات': 'Bookings', 'لا توجد أحداث بعد': 'No events yet',
  'اضغط لتعديل الوقت': 'Click to edit the time', 'الوقت المنقضي': 'Elapsed time', 'الوقت المتبقي': 'Time remaining',
  'إيقاف': 'Stop', 'بدء': 'Start', 'د': 'min', 'الشوط': 'Half', 'مدة الشوط': 'Half duration', 'تعديل مدة الشوط': 'Edit half duration', 'مدة غير صالحة': 'Invalid duration', 'حد المباراة': 'Match limit', 'دقائق لكل شوط': 'Minutes per half', 'مجموعات': 'Sets', 'أحداث المباراة': 'Match events',
  'وقت مستقطع:': 'Timeouts:', 'وقت مستقطع': 'Timeout', 'إيقاف دقيقتين': '2-min suspension',
  'إعادة 30د': 'Reset 30 min', 'الشوط التالي': 'Next half',
  'المجموعات': 'Sets', 'المُرسِل': 'Server', 'تحديد المرسل': 'Set the server', 'إرسال': 'Serve',
  'اسم اللاعب': 'Player name', '+ نقطة': '+ Point', 'اللاعب': 'Player', 'الأشواط': 'Games', 'النقاط': 'Points',
  'شوط فاصل': 'Tie-break', 'المجموعة': 'Set', 'أفضل من': 'Best of', 'عدد المجموعات': 'Number of sets',
  'بدون أفضلية (No-Ad)': 'No-Ad scoring', 'مباراة جديدة': 'New match',
  'اضغط «إرسال» لتغيير المُرسِل · التبديل يتم تلقائيًا بعد كل شوط · الشوط الفاصل عند 6-6 حتى 7 بفارق نقطتين':
    'Tap “Serve” to change the server · it switches automatically after each game · tie-break at 6-6, first to 7 by two',
  'مستبعد': 'Suspended', 'إلغاء الإيقاف': 'Remove suspension', 'لا توجد إيقافات حالية': 'No active suspensions',
  'وضع العرض — اضغط T أو ✕ للخروج (الاختصارات تعمل)': 'Display mode — press T or ✕ to exit (shortcuts still work)',
  'المعلق يعمل': 'Commentator on', 'المعلق متوقف': 'Commentator off',
  'سيتم مسح نتيجة المباراة الحالية.': 'The current match score will be cleared.', 'ابدأ': 'Start',
};
const setLangAttrs = () => { document.documentElement.lang = state.lang; document.documentElement.dir = state.lang === 'en' ? 'ltr' : 'rtl'; };
const L = k => (state.lang === 'en' && k in EN) ? EN[k] : k;
const DEFAULT_NAMES = ['الفريق الأول', 'الفريق الثاني', 'فريق اليد أ', 'فريق اليد ب', 'اللاعب الأول', 'اللاعب الثاني'];
const swapName = n => {
  const en = Object.entries(EN);
  if (state.lang === 'en') { return DEFAULT_NAMES.includes(n) ? EN[n] : n; }
  const hit = en.find(([k, v]) => v === n && DEFAULT_NAMES.includes(k));
  return hit ? hit[0] : n;
};

/* ================================================================
   Constants & helpers
   ================================================================ */
const STORE_KEY = 'gowall.v2';
const FB_PERIODS = [
  { name: 'الشوط الأول', start: 0, len: 45 },
  { name: 'الشوط الثاني', start: 45, len: 45 },
  { name: 'الشوط الإضافي الأول', start: 90, len: 15 },
  { name: 'الشوط الإضافي الثاني', start: 105, len: 15 },
];
const FB_DEFAULT_HALF = 45;
function fbPeriods(f) {
  const half = Number.isInteger(f.halfMinutes) && f.halfMinutes >= 1 && f.halfMinutes <= 180 ? f.halfMinutes : FB_DEFAULT_HALF;
  return [
    { name: 'الشوط الأول', start: 0, len: half },
    { name: 'الشوط الثاني', start: half, len: half },
    { name: 'الشوط الإضافي الأول', start: 2 * half, len: 15 },
    { name: 'الشوط الإضافي الثاني', start: 2 * half + 15, len: 15 },
  ];
}
const HB_HALF = 30 * 60000;
const HB_PENALTY = 2 * 60000;
const HB_TIMEOUTS = 3;
const UNDO_LIMIT = 80;

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const pad = n => String(n).padStart(2, '0');
const fmt = ms => {
  const s = Math.max(0, Math.floor(ms / 1000));
  return `${pad(Math.floor(s / 60))}:${pad(s % 60)}`;
};
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const clone = o => JSON.parse(JSON.stringify(o));

/* ================================================================
   State
   ================================================================ */
const newTeam = (name, color) => ({ name, color, score: 0, fouls: 0, yellow: 0, red: 0, timeouts: HB_TIMEOUTS });

function defaults() {
  return {
    sport: 'football',
    sound: true,
    voice: true,
    lang: 'ar',
    fb: { teams: [newTeam('الفريق الأول', '#00f0ff'), newTeam('الفريق الثاني', '#ff2d6f')], period: 0, elapsed: 0, halfMinutes: FB_DEFAULT_HALF, log: [] },
    hb: { teams: [newTeam('فريق اليد أ', '#ff6a00'), newTeam('فريق اليد ب', '#00c2ff')], half: 1, remaining: HB_HALF, halfMinutes: 30, pens: [[], []] },
    tn: newTennis(),
  };
}

function newTennis(prev) {
  return {
    names: prev ? prev.names : ['اللاعب الأول', 'اللاعب الثاني'],
    colors: prev ? prev.colors : ['#39ff14', '#00f0ff'],
    bestOf: prev ? prev.bestOf : 3,
    noAd: prev ? prev.noAd : false,
    pts: [0, 0], games: [0, 0], sets: [0, 0],
    history: [],            // [{g:[a,b], tb:[a,b]|null}]
    server: 0, tiebreak: false, tbStart: 0, tbCount: 0,
    winner: null,
  };
}

let state = load();
const run = { fb: false, hb: false };   // clocks are runtime-only: never resume on reload
let undoStack = [];

function load() {
  const base = defaults();
  try {
    const saved = JSON.parse(localStorage.getItem(STORE_KEY));
    if (!saved || typeof saved !== 'object') return base;
    for (const k of ['sport', 'sound', 'voice', 'lang']) if (k in saved) base[k] = saved[k];
    for (const k of ['fb', 'hb', 'tn']) if (saved[k]) base[k] = { ...base[k], ...saved[k] };
    if (!Number.isInteger(base.fb.halfMinutes) || base.fb.halfMinutes < 1 || base.fb.halfMinutes > 180) base.fb.halfMinutes = FB_DEFAULT_HALF;
    if (!Number.isInteger(base.hb.halfMinutes) || base.hb.halfMinutes < 1 || base.hb.halfMinutes > 180) base.hb.halfMinutes = 30;
  } catch { /* corrupted or unavailable storage: start fresh */ }
  return base;
}

let saveTimer = 0;
function save() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(saveNow, 150);
}
function saveNow() {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch { /* quota/private mode */ }
}

/* Undo covers scoring/stat changes, never the clocks. */
function pushUndo() {
  undoStack.push(JSON.stringify({ fb: state.fb, hb: state.hb, tn: state.tn }));
  if (undoStack.length > UNDO_LIMIT) undoStack.shift();
}
function undo() {
  const snap = undoStack.pop();
  if (!snap) return toast(L('لا يوجد ما يمكن التراجع عنه'));
  const s = JSON.parse(snap);
  const { elapsed, period, halfMinutes } = state.fb;
  const { remaining, half, halfMinutes } = state.hb;
  state.fb = { ...s.fb, elapsed, period, halfMinutes };
  state.hb = { ...s.hb, remaining, half, halfMinutes };
  state.tn = s.tn;
  sound('beep');
  toast(L('تم التراجع'));
  commit();
}
function mutate(fn) { pushUndo(); fn(); commit(); }
function commit() { save(); render(); }

/* ================================================================
   Sound (Web Audio, no assets)
   ================================================================ */
let actx = null;
function sound(kind) {
  if (!state.sound) return;
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    if (actx.state === 'suspended') actx.resume();
    const tone = (freq, dur, type = 'sine', vol = 0.12, at = 0, slideTo) => {
      const t = actx.currentTime + at;
      const o = actx.createOscillator(), g = actx.createGain();
      o.type = type; o.frequency.setValueAtTime(freq, t);
      if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
      g.gain.setValueAtTime(vol, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + dur);
      o.connect(g).connect(actx.destination);
      o.start(t); o.stop(t + dur);
    };
    if (kind === 'beep') tone(820, 0.12);
    else if (kind === 'goal') { tone(660, 0.14, 'triangle', .16); tone(880, 0.14, 'triangle', .16, .14); tone(1100, 0.3, 'triangle', .16, .28); }
    else if (kind === 'whistle') tone(2600, 0.45, 'triangle', .22, 0, 1900);
    else if (kind === 'buzzer') tone(180, 1.1, 'sawtooth', .18);
    else if (kind === 'roar') {           // synthesised stadium crowd: shaped noise swell
      const len = actx.sampleRate * 4, nb = actx.createBuffer(1, len, actx.sampleRate), d = nb.getChannelData(0);
      let last = 0;
      for (let i = 0; i < len; i++) { last = (last + (Math.random() * 2 - 1) * 0.12) * 0.985; d[i] = last * 3; }
      const src = actx.createBufferSource(), bp = actx.createBiquadFilter(), g = actx.createGain(), t = actx.currentTime;
      src.buffer = nb; bp.type = 'bandpass'; bp.frequency.value = 900; bp.Q.value = 0.5;
      g.gain.setValueAtTime(0.001, t); g.gain.exponentialRampToValueAtTime(0.28, t + 0.5); g.gain.exponentialRampToValueAtTime(0.001, t + 3.8);
      src.connect(bp).connect(g).connect(actx.destination); src.start(t);
    }
  } catch { /* audio blocked until first gesture */ }
}

/* ---------- Commentator ----------
   One fixed male voice for every browser: pre-recorded clips (audio/*.mp3, made by tools/gen_voice.py)
   chained into sentences, instead of each browser's own text-to-speech. */
const pickOne = arr => arr[Math.floor(Math.random() * arr.length)];
/* Clips are decoded with Web Audio, trimmed of their leading/trailing silence and scheduled
   back-to-back, so chained phrases flow like one sentence. Loudness is boosted and compressed. */
let vctx = null, vgain = null, speechGen = 0, pending = null, speaking = false, activeSources = [];
function voiceCtx() {
  if (!vctx) {
    vctx = new (window.AudioContext || window.webkitAudioContext)();
    const comp = vctx.createDynamicsCompressor();
    comp.threshold.value = -18; comp.ratio.value = 6; comp.attack.value = 0.003; comp.release.value = 0.15;
    vgain = vctx.createGain(); vgain.gain.value = 1.9;
    vgain.connect(comp); comp.connect(vctx.destination);
  }
  if (vctx.state === 'suspended') vctx.resume();
  return vctx;
}
const clipCache = {};
function clip(id) {
  const key = `${state.lang}/${id}`;
  return clipCache[key] || (clipCache[key] = fetch(`audio/${key}.mp3`)
    .then(r => { if (!r.ok) throw new Error(key); return r.arrayBuffer(); })
    .then(ab => voiceCtx().decodeAudioData(ab))
    .then(buf => {
      const d = buf.getChannelData(0), th = 0.015;
      let i = 0, j = d.length - 1;
      while (i < j && Math.abs(d[i]) < th) i++;
      while (j > i && Math.abs(d[j]) < th) j--;
      const from = Math.max(0, i / buf.sampleRate - 0.02), to = Math.min(buf.duration, j / buf.sampleRate + 0.06);
      return { buf, from, dur: Math.max(0.05, to - from) };
    })
    .catch(() => { delete clipCache[key]; return null; }));
}
const sleep = ms => new Promise(r => setTimeout(r, ms));

/* Mixed recorded commentary and spoken custom team names. */
async function sayCustomName(name, gen) {
 if (!('speechSynthesis' in window) || !name) return;
 await new Promise(resolve => {
  const u=new SpeechSynthesisUtterance(name);
  u.lang=/[\u0600-\u06ff]/.test(name)?'ar-SA':state.lang==='ar'?'ar-SA':'en-US';
  u.rate=0.95;u.volume=1;
  const voices=speechSynthesis.getVoices();
  const chosen=voices.find(v=>v.lang.toLowerCase().startsWith(u.lang.slice(0,2).toLowerCase()));
  if(chosen)u.voice=chosen;
  u.onend=resolve;u.onerror=resolve;
  if(gen!==speechGen)return resolve();
  speechSynthesis.speak(u);
 });
}
async function playSequence(ids, gen) {
 const ctx=voiceCtx();
 activeSources=[];
 for (const id of ids) {
  if(gen!==speechGen)return;
  if(typeof id==='string'&&id.startsWith('name:')){
   await sayCustomName(id.slice(5),gen);
   continue;
  }
  const c=await clip(id);
  if(gen!==speechGen)return;
  if(!c)continue;
  await new Promise(resolve=>{
   const src=ctx.createBufferSource();src.buffer=c.buf;src.connect(vgain);
   activeSources.push(src);src.onended=resolve;
   try{src.start(0,c.from,c.dur)}catch{resolve()}
  });
 }
 if(gen===speechGen){speaking=false;if(pending){const n=pending;pending=null;startSpeech(n)}}
}
function startSpeech(ids) { speaking = true; playSequence(ids, ++speechGen); }
function cutSpeech() { if('speechSynthesis' in window)speechSynthesis.cancel(); activeSources.forEach(s => { try { s.stop(); } catch { /* already ended */ } }); activeSources = []; }
/* urgent: cut off whatever is being said. Otherwise wait for the current line; only the newest waiting line is kept. */
function speak(ids, urgent = false) {
  if (!state.sound || !state.voice) return;
  if (urgent || !speaking) { pending = null; cutSpeech(); startSpeech(ids); }
  else pending = ids;
}
function stopSpeech() { speechGen++; pending = null; speaking = false; cutSpeech(); }
const NUM = n => 'n' + Math.max(0, Math.min(120, n | 0));
const TEAM = (i,sp) => sp && state[sp]?.teams?.[i]?.name ? 'name:' + state[sp].teams[i].name : 't' + (i + 1);
const scoreSeq = sp => { const [a, b] = state[sp].teams; return [TEAM(0,sp), NUM(a.score), TEAM(1,sp), NUM(b.score)]; };
// Warm the cache after the first tap (browsers block audio until then anyway).
const PRELOAD = ['goal_1', 'goal_2', 'goal_3', 'goal_4', 'goal_for', 'score_is', 't1', 't2', 'vs', 'in_min', 'kick_off', 'yellow', 'red',
  'first_goal', 'equalizer', 'comeback', 'takes_lead', 'extends', 'pulls_back', 'late_goal', 'cheer_1', 'cheer_2', 'cheer_3', 'cheer_4', 'cheer_conceded',
  'p1', 'p2', 'scores_point', 'nice_1', 'nice_2', 'nice_3', 'amb_1', 'amb_2', 'amb_3', 'amb_4', 'amb_5', 'amb_6', 'amb_7'];
document.addEventListener('pointerdown', () => { voiceCtx(); PRELOAD.forEach(clip); for (let i = 0; i <= 45; i++) clip(NUM(i)); }, { once: true });

function toast(msg) {
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = msg.replace(/[\u{1F000}-\u{1FAFF}\u2190-\u21FF\u2300-\u23FF\u2600-\u27BF\uFE0F]/gu, '').trim();
  $('#toasts').append(el);
  setTimeout(() => el.remove(), 2600);
}

/* ================================================================
   Modal helpers
   ================================================================ */
function modal(html) {
  const dlg = $('#modal');
  dlg.innerHTML = html;
  if (!dlg.open) dlg.showModal();
  return dlg;
}
function confirmBox(title, text, okLabel = L('تأكيد')) {
  return new Promise(resolve => {
    const dlg = modal(`<form method="dialog"><h2>${esc(title)}</h2><p>${esc(text)}</p>
      <div class="actions"><button class="btn" value="no">${L('إلغاء')}</button><button class="btn danger" value="yes" autofocus>${esc(okLabel)}</button></div></form>`);
    dlg.onclose = () => resolve(dlg.returnValue === 'yes');
  });
}
function promptTime(title, current) {
  return new Promise(resolve => {
    const dlg = modal(`<form method="dialog"><h2>${esc(title)}</h2><p>${L('اكتب الوقت بصيغة')} <b>${L('دقائق:ثواني')}</b> ${L('مثل')} 12:30</p>
      <input type="text" id="time-in" value="${esc(current)}" inputmode="numeric" pattern="[0-9]{1,3}(:[0-5]?[0-9])?" autofocus>
      <div class="actions"><button class="btn" value="no" formnovalidate>${L('إلغاء')}</button><button class="btn go" value="yes">${L('حفظ')}</button></div></form>`);
    dlg.onclose = () => {
      if (dlg.returnValue !== 'yes') return resolve(null);
      const m = $('#time-in', dlg).value.trim().match(/^(\d{1,3})(?::([0-5]?\d))?$/);
      resolve(m ? (+m[1] * 60 + +(m[2] || 0)) * 1000 : null);
    };
  });
}
function showHelp() {
  const row = (k, v) => `<tr><td>${k}</td><td>${L(v)}</td></tr>`;
  modal(`<form method="dialog"><h2>${L('اختصارات لوحة المفاتيح')}</h2><table>
    ${row('<kbd>Space</kbd>', 'تشغيل / إيقاف الساعة')}
    ${row('<kbd>1</kbd> <kbd>2</kbd>', 'هدف / نقطة للفريق (اللاعب) الأول أو الثاني')}
    ${row('<kbd>Shift</kbd>+<kbd>1</kbd>/<kbd>2</kbd>', 'إنقاص هدف (كرة القدم واليد)')}
    ${row('<kbd>Z</kbd>', 'تراجع عن آخر إجراء')}
    ${row('<kbd>T</kbd>', 'وضع العرض على الشاشة الكبيرة')}
    ${row('<kbd>F</kbd>', 'ملء الشاشة')}
    ${row('<kbd>V</kbd>', 'المعلق الصوتي')}
    ${row('<kbd>M</kbd>', 'كتم / تشغيل الصوت')}
    ${row('<kbd>?</kbd>', 'هذه القائمة')}</table>
    <p>${L('نصيحة: اضغط على الساعة لتعديل الوقت يدويًا.')}</p>
    <div class="actions"><button class="btn primary" style="--tc:var(--accent)">${L('حسنًا')}</button></div></form>`);
}

/* ================================================================
   Clock engine — timestamp based, so background-tab throttling can't drift it
   ================================================================ */
let lastTick = performance.now();
const fbNotified = { period: -1 };

let ambientIn = 90000;
function tick() {
  const now = performance.now();
  const dt = now - lastTick;
  lastTick = now;

  if (run.fb) {
    ambientIn -= dt;
    if (ambientIn <= 0) { ambientIn = 75000 + Math.random() * 75000; speak([pickOne(['amb_1', 'amb_2', 'amb_3', 'amb_4', 'amb_5', 'amb_6', 'amb_7'])]); }
    const f = state.fb, p = fbPeriods(f)[f.period];
    const before = f.elapsed;
    f.elapsed += dt;
    const end = (p.start + p.len) * 60000;
    if (before < end && f.elapsed >= end && fbNotified.period !== f.period) {
      fbNotified.period = f.period;
      sound('whistle');
      toast(L('انتهى الوقت الأصلي — بدأ الوقت المحتسب بدل الضائع'));
      speak(['regular_end'], true);
    }
    updateFbClock();
  }

  if (run.hb) {
    const h = state.hb;
    h.remaining -= dt;
    const expired = expirePenalties();
    expired.forEach(i => speak(['pen_back', TEAM(i)]));
    if (h.remaining <= 0) {
      h.remaining = 0;
      run.hb = false;
      sound('buzzer');
      toast(h.half === 1 ? L('انتهى الشوط الأول') : L('انتهت المباراة'));
      speak([h.half === 1 ? 'half_end' : 'match_end', ...scoreSeq('hb'), h.half === 1 ? 'well_played' : 'gg'], true);
      commit();
      return;
    }
    if (expired.length) sound('beep');
    updateHbClock();
    renderPenalties();
  }
}

function expirePenalties() {
  const h = state.hb, back = [];
  h.pens = h.pens.map((list, i) => {
    const keep = list.filter(endsAt => h.remaining > endsAt);
    for (let k = keep.length; k < list.length; k++) back.push(i);
    return keep;
  });
  return back;
}

/* Setting the handball clock keeps each suspension's remaining duration intact. */
function setHbRemaining(ms) {
  const h = state.hb, delta = ms - h.remaining;
  h.pens = h.pens.map(list => list.map(e => e + delta));
  h.remaining = ms;
}

function fbLabel() {
  const f = state.fb, p = fbPeriods(f)[f.period], end = p.start + p.len;
  const m = Math.floor(f.elapsed / 60000);
  return m >= end ? `${end}+${m - end + 1}'` : `${m + 1}'`;
}

/* ================================================================
   Football / Handball actions
   ================================================================ */
function toggleClock() {
  const sp = state.sport === 'football' ? 'fb' : state.sport === 'handball' ? 'hb' : null;
  if (!sp) return;
  if (sp === 'hb' && !run.hb && state.hb.remaining <= 0) return toast(L('انتهى الشوط — انتقل للشوط التالي أو أعد الوقت'));
  run[sp] = !run[sp];
  lastTick = performance.now();
  sound(run[sp] ? 'whistle' : 'beep');
  if (run[sp]) {
    const fresh = sp === 'fb' ? state.fb.elapsed === fbPeriods(state.fb)[state.fb.period].start * 60000 : state.hb.remaining === state.hb.halfMinutes * 60000;
    speak(fresh ? ['kick_off', sp === 'fb' ? `period_${state.fb.period}` : `period_${state.hb.half - 1}`, 'kick_extra'] : [pickOne(['resume', 'resume_2'])], true);
  } else speak(['paused']);
  render();
}
function pauseAll() { run.fb = run.hb = false; }

function setScore(sp, team, delta) {
  const T = state[sp].teams[team];
  if (delta < 0 && T.score === 0) return;
  mutate(() => {
    T.score += delta;
    if (sp === 'fb') {
      if (delta > 0) state.fb.log.unshift({ icon: '⚽', team, label: fbLabel() });
      else { const i = state.fb.log.findIndex(e => e.icon === '⚽' && e.team === team); if (i >= 0) state.fb.log.splice(i, 1); }
    }
  });
  if (delta > 0) goalFlow(sp, team);
  else speak(['score_fixed', ...scoreSeq(sp)]);
}

/* Goals announce immediately without a player-name dialog. */
function goalFlow(sp,team){
 sound('goal');
 announceGoal(sp,team,'');
}
let goalTimer = 0;
function announceGoal(sp, team, who) {
  const T = state[sp].teams[team];
  const line = L('هدف لفريق');
  let el = $('#goal-banner');
  if (!el) { el = document.createElement('div'); el.id = 'goal-banner'; el.setAttribute('role', 'alert'); document.body.append(el); }
  el.dataset.side = team;
  el.innerHTML = `<div class="g-word">${L('جووووول!')}</div><div class="g-line">${esc(line)}</div><div class="g-team">${esc(T.name)}</div>`;
  el.classList.remove('show'); void el.offsetWidth; el.classList.add('show');
  clearTimeout(goalTimer);
  goalTimer = setTimeout(() => el.classList.remove('show'), 6000);
  sound('roar');
  const me = state[sp].teams[team].score, them = state[sp].teams[1 - team].score, before = me - 1;
  const minute = Math.min(120, Math.floor(state.fb.elapsed / 60000) + 1);
  const late = sp === 'fb' && minute >= 85 && state.fb.period >= 1 && minute <= 95;
  let ctx = null;
  if (sp === 'fb' && me + them === 1) ctx = 'first_goal';
  else if (me === them && them >= 2 && before <= them - 2) ctx = 'comeback';
  else if (me === them) ctx = 'equalizer';
  else if (before === them) ctx = 'takes_lead';
  else if (me < them) ctx = 'pulls_back';
  else if (me - them >= 2) ctx = 'extends';
  if (late && ctx !== 'first_goal') ctx = 'late_goal';
  speak([pickOne(['goal_1', 'goal_2', 'goal_3', 'goal_4']), 'goal_for', TEAM(team,sp),
    ...(sp === 'fb' ? ['in_min', NUM(minute)] : []),
    'score_is', ...scoreSeq(sp),
    ...(ctx ? [ctx] : [pickOne(['cheer_1', 'cheer_2', 'cheer_3', 'cheer_4'])]),
    ...(ctx && Math.random() < 0.5 ? [me < them || ctx === 'pulls_back' ? 'cheer_conceded' : pickOne(['cheer_1', 'cheer_2', 'cheer_3', 'cheer_4'])] : [])], true);
}

function setStat(sp, team, key, delta) {
  const T = state[sp].teams[team];
  if (delta < 0 && T[key] === 0) return;
  mutate(() => {
    T[key] += delta;
    if (sp === 'fb' && (key === 'yellow' || key === 'red')) {
      const icon = key === 'yellow' ? '🟨' : '🟥';
      if (delta > 0) state.fb.log.unshift({ icon, team, label: fbLabel() });
      else { const i = state.fb.log.findIndex(e => e.icon === icon && e.team === team); if (i >= 0) state.fb.log.splice(i, 1); }
    }
  });
  sound('beep');
  if (delta > 0 && sp === 'fb') {
    if (key === 'fouls') speak([pickOne(['foul_on', 'foul_ref']), TEAM(team,sp), ...(Math.random() < 0.5 ? ['foul_c'] : [])]);
    else if (key === 'yellow') speak(['yellow', TEAM(team,sp)], true);
    else if (key === 'red') speak(['red', TEAM(team,sp), 'red_after'], true);
  }
}

function setPeriod(i) {
  const f = state.fb;
  f.period = i;
  f.elapsed = fbPeriods(f)[i].start * 60000;
  fbNotified.period = -1;
  run.fb = false;
  sound('beep');
  speak(['get_ready', `period_${i}`]);
  commit();
}
async function editHalfDuration() {
  const f = state.fb;
  const dlg = modal(`<form method="dialog"><h2>${L('تعديل مدة الشوط')}</h2>
    <label for="half-minutes">${L('مدة الشوط')} (1–180 ${L('د')})</label>
    <input id="half-minutes" type="number" min="1" max="180" step="1" value="${f.halfMinutes}" required autofocus>
    <div class="actions"><button class="btn" value="no" formnovalidate>${L('إلغاء')}</button><button class="btn go" value="yes">${L('حفظ')}</button></div></form>`);
  dlg.onclose = () => {
    if (dlg.returnValue !== 'yes') return;
    const value = Number($('#half-minutes', dlg).value);
    if (!Number.isInteger(value) || value < 1 || value > 180) return toast(L('مدة غير صالحة'));
    if (value === f.halfMinutes) return;
    const elapsedInPeriod = Math.max(0, f.elapsed - fbPeriods(f)[f.period].start * 60000);
    f.halfMinutes = value;
    f.elapsed = fbPeriods(f)[f.period].start * 60000 + elapsedInPeriod;
    fbNotified.period = -1;
    commit();
  };
}
function nudgeFb(min) {
  const f = state.fb;
  f.elapsed = Math.max(0, f.elapsed + min * 60000);
  fbNotified.period = -1;
  sound('beep');
  commit();
}

async function editClock() {
  const sp = state.sport;
  if (sp === 'football') {
    const cur = fmt(state.fb.elapsed);
    const ms = await promptTime(L('تعديل وقت المباراة'), cur);
    if (ms != null) { state.fb.elapsed = ms; fbNotified.period = -1; commit(); }
  } else if (sp === 'handball') {
    const ms = await promptTime(L('تعديل الوقت المتبقي'), fmt(state.hb.remaining));
    if (ms != null) { setHbRemaining(Math.min(ms, state.hb.halfMinutes * 60000)); commit(); }
  }
}

function hbTimeout(team) {
  const T = state.hb.teams[team];
  if (T.timeouts <= 0) return toast(L('استُنفدت الأوقات المستقطعة'));
  mutate(() => { T.timeouts--; });
  run.hb = false;
  sound('whistle');
  speak(['timeout', TEAM(team), 'left', NUM(state.hb.teams[team].timeouts), 'timeout_c'], true);
  render();
}
function hbPenalty(team) {
  mutate(() => state.hb.pens[team].push(state.hb.remaining - HB_PENALTY));
  sound('beep');
  speak(['pen2', TEAM(team)], true);
}
function hbRemovePenalty(team, idx) {
  mutate(() => state.hb.pens[team].splice(idx, 1));
}
function hbNextHalf() {
  const h = state.hb;
  if (h.half >= 2) return toast(L('هذا هو الشوط الأخير'));
  run.hb = false;
  // Carry active suspensions across the break with their remaining time intact.
  h.pens = h.pens.map(list => list.map(e => h.halfMinutes * 60000 - (h.remaining - e)).filter(e => e < h.halfMinutes * 60000));
  h.half = 2;
  h.remaining = h.halfMinutes * 60000;
  sound('beep');
  speak(['break']);
  commit();
}
function hbResetHalf() {
  run.hb = false;
  setHbRemaining(state.hb.halfMinutes * 60000);
  sound('beep');
  commit();
}

/* ================================================================
   Tennis
   ================================================================ */
const PT = ['0', '15', '30', '40'];
function tnLabel(i) {
  const t = state.tn;
  if (t.tiebreak) return String(t.pts[i]);
  const a = t.pts[i], b = t.pts[1 - i];
  if (a <= 3 && b <= 3 && !(a === 3 && b === 3)) return PT[a];
  if (a === b || t.noAd) return '40';
  return a > b ? 'AD' : '40';
}

function tbServer(t) {
  const n = t.tbCount;
  return Math.floor((n + 1) / 2) % 2 === 0 ? t.tbStart : 1 - t.tbStart;
}

function tnPoint(p) {
  const t = state.tn;
  if (t.winner !== null) return toast(L('انتهت المباراة — ابدأ مباراة جديدة'));
  pushUndo();
  const o = 1 - p;
  t.pts[p]++;
  if (t.tiebreak) {
    t.tbCount++;
    if (t.pts[p] >= 7 && t.pts[p] - t.pts[o] >= 2) tnFinishSet(p, true);
    else t.server = tbServer(t);
  } else {
    const won = t.noAd ? t.pts[p] >= 4 : t.pts[p] >= 4 && t.pts[p] - t.pts[o] >= 2;
    if (won) tnWinGame(p);
  }
  sound('beep');
  commit();
  tnCommentary(p);
}

function tnCommentary(p) {
  const t = state.tn, P = i => 'p' + (i + 1);
  if (t.winner !== null) { t._ev = null; return speak(['match_over', P(t.winner), 'congrats', 'gg'], true); }
  if (t._ev) { const e = t._ev; t._ev = null; return speak([...e, pickOne(['nice_1', 'nice_2', 'nice_3'])], true); }
  if (t.tiebreak) return speak(['tb', NUM(t.pts[0]), 'vs', NUM(t.pts[1])]);
  const a = tnLabel(0), b = tnLabel(1);
  if (a === 'AD' || b === 'AD') return speak([`adv_${P(a === 'AD' ? 0 : 1)}`]);
  if (t.pts[0] >= 3 && t.pts[0] === t.pts[1]) return speak(['deuce']);
  speak([P(p), 'scores_point', NUM(+a), 'vs', NUM(+b), ...(Math.random() < 0.45 ? [pickOne(['nice_1', 'nice_2', 'nice_3'])] : [])]);
}

function tnWinGame(p) {
  const t = state.tn, o = 1 - p;
  t.games[p]++;
  t.pts = [0, 0];
  t.server = 1 - t.server;
  sound('whistle');
  t._ev = ['game_for', 'p' + (p + 1), 'games_are', NUM(t.games[0]), 'vs', NUM(t.games[1])];
  if (t.games[p] >= 6 && t.games[p] - t.games[o] >= 2) return tnFinishSet(p, false);
  if (t.games[0] === 6 && t.games[1] === 6) {
    t.tiebreak = true; t.tbStart = t.server; t.tbCount = 0;
    t._ev = ['tb_start'];
  }
}

function tnFinishSet(p, viaTiebreak) {
  const t = state.tn;
  const entry = { g: [...t.games], tb: null };
  if (viaTiebreak) { entry.g[p] = 7; entry.tb = [...t.pts]; }
  t.history.push(entry);
  t.sets[p]++;
  t.games = [0, 0];
  t.pts = [0, 0];
  if (viaTiebreak) t.server = 1 - t.tbStart;
  t.tiebreak = false; t.tbCount = 0;
  sound('goal');
  t._ev = ['set_for', 'p' + (p + 1), NUM(entry.g[0]), 'vs', NUM(entry.g[1])];
  if (t.sets[p] >= Math.ceil(t.bestOf / 2)) {
    t.winner = p;
    toast(`${t.names[p]} ${L('يفوز بالمباراة')}`);
  }
}

/* ================================================================
   Reset
   ================================================================ */
async function resetCurrent() {
  const names = { football: 'كرة القدم', handball: 'كرة اليد', tennis: 'التنس' };
  const ok = await confirmBox(L('تصفير المباراة؟'), `${L('سيتم تصفير نتيجة وساعة')} ${L(names[state.sport])} ${L('(تبقى أسماء الفرق وألوانها).')}`, L('نعم، صفّر'));
  if (!ok) return;
  pauseAll();
  const d = defaults();
  if (state.sport === 'football') { d.fb.teams.forEach((t, i) => { t.name = state.fb.teams[i].name; t.color = state.fb.teams[i].color; }); d.fb.halfMinutes = state.fb.halfMinutes; state.fb = d.fb; fbNotified.period = -1; }
  else if (state.sport === 'handball') { d.hb.teams.forEach((t, i) => { t.name = state.hb.teams[i].name; t.color = state.hb.teams[i].color; }); d.hb.halfMinutes = state.hb.halfMinutes; d.hb.remaining = d.hb.halfMinutes * 60000; state.hb = d.hb; }
  else if(state.sport==='thirty'){Thirty.perform('reset');}
  else state.tn = newTennis(state.tn);
  undoStack = [];
  sound('beep');
  commit();
}

/* ================================================================
   Rendering
   ================================================================ */
const prevBump = {};

function render() {
  const sp = state.sport;
  for (const s of ['football', 'handball', 'tennis', 'thirty']) {
    const tab = $(`#tab-${s}`);
    tab.setAttribute('aria-selected', String(s === sp));
    $(`#panel-${s}`).hidden = s !== sp;
  }
  $('#voice-btn').classList.toggle('off', !state.voice);
  $('#sound-btn').classList.toggle('off', !state.sound);
  document.title = `${L('جو وول')} | ${L(state.sport === 'tennis' ? 'التنس' : state.sport === 'football' ? 'كرة القدم' : state.sport === 'thirty' ? 'ثلاثين' : 'كرة اليد')}`;

  if (sp === 'football') $('#panel-football').innerHTML = footballHTML();
  else if (sp === 'handball') $('#panel-handball').innerHTML = handballHTML();
  else if(sp==='tennis') $('#panel-tennis').innerHTML = tennisHTML();
  else Thirty.render();

  $$('[data-bump]').forEach(el => {
    const k = el.dataset.bump, v = el.textContent;
    if (k in prevBump && prevBump[k] !== v) { el.classList.add('bump'); }
    prevBump[k] = v;
  });
  updateFbClock(); updateHbClock(); renderPenalties();
}

function nameField(sp, i, T) {
  return `<input class="name-input" data-name="${sp}" data-team="${i}" value="${esc(T.name)}" maxlength="24" aria-label="${L('اسم الفريق')} ${i + 1}">`;
}
function stat(label, sp, i, key, value) {
  return `<div class="stat"><span class="lbl">${label}</span>
    <button class="mini" data-action="stat" data-sport="${sp}" data-team="${i}" data-key="${key}" data-delta="-1" aria-label="${L('إنقاص')}">−</button>
    <b>${value}</b>
    <button class="mini" data-action="stat" data-sport="${sp}" data-team="${i}" data-key="${key}" data-delta="1" aria-label="${L('زيادة')}">+</button></div>`;
}

function footballHTML() {
  const f = state.fb;
  const card = i => {
    const T = f.teams[i];
    return `<article class="box team" data-side="${i}">
      <div class="team-head">${nameField('fb', i, T)}<span class="chip">${L(i === 0 ? 'صاحب الأرض' : 'الضيف')}</span></div>
      <div class="score" data-bump="fb-${i}">${T.score}</div>
      <div class="btn-row">
        <button class="btn primary big" data-action="score" data-sport="fb" data-team="${i}" data-delta="1">+1 ${L('هدف')}</button>
        <button class="btn big" data-action="score" data-sport="fb" data-team="${i}" data-delta="-1">&lrm;−1</button>
      </div>
      <div class="stats">
        ${stat(L('أخطاء'), 'fb', i, 'fouls', T.fouls)}
        ${stat(L('إنذارات'), 'fb', i, 'yellow', T.yellow)}
        ${stat(L('طرد'), 'fb', i, 'red', T.red)}
      </div></article>`;
  };
  const log = f.log.length
    ? f.log.slice(0, 30).map(e => `<li data-side="${e.team}"><b>${esc(e.label)}</b><span><strong>${L({ '⚽': 'هدف', '🟨': 'إنذار', '🟥': 'طرد' }[e.icon] || '')}</strong>${esc(f.teams[e.team].name)}${e.who ? ' — ' + esc(e.who) : ''}</span></li>`).join('')
    : `<span class="empty">${L('لا توجد أحداث بعد')}</span>`;
  return `
    <div class="box statusbar" style="--sc:var(--accent)">
      <div class="period"><span class="dot ${run.fb ? 'live' : ''}"></span>${L(fbPeriods(f)[f.period].name)}</div>
      <div class="clock-wrap" data-action="edit-clock" title="${L('اضغط لتعديل الوقت')}">
        <span class="clock" id="fb-clock">00:00</span>
        <div class="clock-sub"><span>${L('الوقت المنقضي')}</span><span class="extra" id="fb-extra"></span></div>
      </div>
      <div class="clock-ctl">
        <button class="btn ${run.fb ? 'pause' : 'go'}" data-action="toggle">${run.fb ? L('إيقاف') : L('بدء')}</button>
        <button class="btn sm" data-action="nudge" data-min="-1">&lrm;−1 ${L('د')}</button>
        <button class="btn sm" data-action="nudge" data-min="1">&lrm;+1 ${L('د')}</button>
        <label>${L('حد المباراة')} (${L('دقائق لكل شوط')}) <input class="sel" style="width:5em" type="number" min="1" max="180" step="1" data-fb-limit value="${f.halfMinutes}"></label>
        <select class="sel" data-period aria-label="${L('الشوط')}">
          ${fbPeriods(f).map((p, i) => `<option value="${i}" ${i === f.period ? 'selected' : ''}>${L(p.name)} (${p.len}${L('د')})</option>`).join('')}
        </select>
      </div>
    </div>
    <div class="grid2">${card(0)}${card(1)}</div>
    <div class="box log"><h3>${L('أحداث المباراة')}</h3><ul>${log}</ul></div>`;
}

function handballHTML() {
  const h = state.hb;
  const card = i => {
    const T = h.teams[i];
    return `<article class="box team" data-side="${i}">
      <div class="team-head">${nameField('hb', i, T)}<span class="pill">${L('وقت مستقطع:')} <b>${T.timeouts}</b>/${HB_TIMEOUTS}</span></div>
      <div class="score" data-bump="hb-${i}">${T.score}</div>
      <div class="btn-row">
        <button class="btn primary big" data-action="score" data-sport="hb" data-team="${i}" data-delta="1">+1 ${L('هدف')}</button>
        <button class="btn big" data-action="score" data-sport="hb" data-team="${i}" data-delta="-1">&lrm;−1</button>
      </div>
      <div class="row-2">
        <button class="btn" data-action="hb-timeout" data-team="${i}" ${T.timeouts ? '' : 'disabled'}>${L('وقت مستقطع')}</button>
        <button class="btn danger" data-action="hb-penalty" data-team="${i}">${L('إيقاف دقيقتين')}</button>
      </div>
      <div class="pens" id="pens-${i}"></div>
    </article>`;
  };
  return `
    <div class="box statusbar" style="--sc:var(--orange)">
      <div class="period"><span class="dot ${run.hb ? 'live' : ''}"></span>${L('كرة اليد')} · ${L(h.half === 1 ? 'الشوط الأول' : 'الشوط الثاني')}</div>
      <div class="clock-wrap" data-action="edit-clock" title="${L('اضغط لتعديل الوقت')}">
        <span class="clock" id="hb-clock">${fmt(h.remaining)}</span>
        <div class="clock-sub"><span>${L('الوقت المتبقي')}</span></div>
      </div>
      <div class="clock-ctl">
        <button class="btn ${run.hb ? 'pause' : 'go'}" data-action="toggle">${run.hb ? L('إيقاف') : L('بدء')}</button>
        <button class="btn sm" data-action="hb-reset-half">${L('إعادة 30د')}</button><label>${L('حد المباراة')} (${L('دقائق لكل شوط')}) <input class="sel" style="width:5em" type="number" min="1" max="180" step="1" data-hb-limit value="${h.halfMinutes}"></label>
        <button class="btn sm" data-action="hb-next-half" ${h.half >= 2 ? 'disabled' : ''}>${L('الشوط التالي')}</button>
      </div>
    </div>
    <div class="grid2">${card(0)}${card(1)}</div>`;
}

function tennisHTML() {
  const t = state.tn;
  const row = i => {
    const serving = t.server === i;
    const sets = t.history.map(s => {
      const won = s.g[i] > s.g[1 - i];
      const sup = s.tb && s.g[i] === 6 ? `<sup>${s.tb[i]}</sup>` : '';
      return `<span class="tn-set ${won ? 'won' : ''}">${s.g[i]}${sup}</span>`;
    }).join('');
    const need = Math.ceil(t.bestOf / 2);
    const pips = t.bestOf > 1 ? `<div class="pips" title="${L('المجموعات')}">${Array.from({ length: need }, (_, k) => `<span class="pip ${k < t.sets[i] ? 'on' : ''}"></span>`).join('')}</div>` : '';
    return `<div class="tn-row ${serving ? 'serving' : ''}" data-side="${i}">
      <button class="serve-btn ${serving ? 'on' : ''}" data-action="tn-server" data-p="${i}" title="${L('المُرسِل')}" aria-label="${L('تحديد المرسل')}">${L('إرسال')}</button>
      <input class="name-input" data-tname="${i}" value="${esc(t.names[i])}" maxlength="24" aria-label="${L('اسم اللاعب')} ${i + 1}">
      <div class="tn-sets">${sets}</div>
      <div class="tn-games" data-bump="tn-g${i}">${t.games[i]}</div>
      <div><div class="tn-points" data-bump="tn-p${i}">${tnLabel(i)}</div>${pips}</div>
      <button class="btn primary big" style="font-size:18px" data-action="tn-point" data-p="${i}" ${t.winner !== null ? 'disabled' : ''}>${L('+ نقطة')}</button>
    </div>`;
  };
  const head = `<div class="tn-head"><span></span><span>${L('اللاعب')}</span><span>${L('المجموعات')}</span><span>${L('الأشواط')}</span><span>${L('النقاط')}</span><span></span></div>`;
  const banner = t.winner !== null ? `<div class="winner">${esc(t.names[t.winner])} ${L('يفوز بالمباراة')}.</div>` : '';
  const stateLabel = t.tiebreak ? `<span class="badge-tb">${L('شوط فاصل')}</span>` : '';
  return `
    <div class="box">
      <div class="tn-bar">
        <div class="period"><span class="dot live"></span>${L('التنس الأرضي')} ${stateLabel}</div>
        <div class="tn-opts">
          <span>${L('المجموعة')} <b>${Math.min(t.history.length + 1, 9)}</b></span>
          <label>${L('أفضل من')}
            <input class="sel" style="width:5em" type="number" min="1" max="15" step="2" data-bestof value="${t.bestOf}" aria-label="${L('عدد المجموعات')}"></label>
          <label><input type="checkbox" data-noad ${t.noAd ? 'checked' : ''}> ${L('بدون أفضلية (No-Ad)')}</label>
          <button class="btn sm" data-action="tn-new">${L('مباراة جديدة')}</button>
        </div>
      </div>
      <div class="tn-board">${head}${row(0)}${row(1)}</div>
    </div>
    ${banner}
    <p class="tn-caption">${L('اضغط «إرسال» لتغيير المُرسِل · التبديل يتم تلقائيًا بعد كل شوط · الشوط الفاصل عند 6-6 حتى 7 بفارق نقطتين')}</p>`;
}

/* Cheap, targeted updates called every tick (no full re-render). */
function updateFbClock() {
  const el = $('#fb-clock');
  if (!el) return;
  const f = state.fb, p = fbPeriods(f)[f.period], end = (p.start + p.len) * 60000;
  if (f.elapsed > end) {
    el.textContent = fmt(end);
    $('#fb-extra').textContent = '+' + fmt(f.elapsed - end);
  } else {
    el.textContent = fmt(f.elapsed);
    $('#fb-extra').textContent = '';
  }
}
function updateHbClock() {
  const el = $('#hb-clock');
  if (el) el.textContent = fmt(Math.ceil(state.hb.remaining / 1000) * 1000);
}
function renderPenalties() {
  for (const i of [0, 1]) {
    const box = $(`#pens-${i}`);
    if (!box) continue;
    const list = state.hb.pens[i];
    box.innerHTML = list.length
      ? list.map((e, k) => `<div class="pen"><span>${L('مستبعد')} ${k + 1}</span><span>${fmt(Math.ceil((state.hb.remaining - e) / 1000) * 1000)}</span>
          <button data-action="hb-pen-del" data-team="${i}" data-idx="${k}" aria-label="${L('إلغاء الإيقاف')}">✕</button></div>`).join('')
      : `<span class="empty" style="text-align:center">${L('لا توجد إيقافات حالية')}</span>`;
  }
}

/* ================================================================
   Global UI actions
   ================================================================ */
let wakeLock = null;
async function setWake(on) {
  try {
    if (on && 'wakeLock' in navigator) wakeLock = await navigator.wakeLock.request('screen');
    else if (wakeLock) { await wakeLock.release(); wakeLock = null; }
  } catch { /* not supported / denied */ }
}
function toggleTv() {
  const on = document.body.classList.toggle('tv');
  setWake(on);
  if (on) toast(L('وضع العرض — اضغط T أو ✕ للخروج (الاختصارات تعمل)'));
}
function toggleFullscreen() {
  if (!document.fullscreenElement) document.documentElement.requestFullscreen?.().catch(() => {});
  else document.exitFullscreen?.();
}
function switchSport(s) {
  if (s === state.sport) return;
  pauseAll();
  state.sport = s;
  sound('beep');
  commit();
}

const N = el => +el.dataset.team;
const actions = {
  sport: d => switchSport(d.sport),
  undo,
  sound: () => { state.sound = !state.sound; commit(); if (state.sound) sound('beep'); },
  lang: () => {
    state.lang = state.lang === 'en' ? 'ar' : 'en';
    ['fb', 'hb'].forEach(k => state[k].teams.forEach(tm => { tm.name = swapName(tm.name); }));
    state.tn.names = state.tn.names.map(swapName);
    applyStaticLang(); stopSpeech(); commit();
  },
  voice: () => { state.voice = !state.voice; if (!state.voice) stopSpeech(); commit(); toast(state.voice ? L('المعلق يعمل') : L('المعلق متوقف')); speak(['voice_on'], true); },
  tv: toggleTv,
  fullscreen: toggleFullscreen,
  help: showHelp,
  reset: resetCurrent,
  toggle: toggleClock,
  score: d => setScore(d.sport, +d.team, +d.delta),
  stat: d => setStat(d.sport, +d.team, d.key, +d.delta),
  nudge: d => nudgeFb(+d.min),
  'edit-clock': editClock,
  'edit-half-duration': editHalfDuration,
  'hb-timeout': d => hbTimeout(+d.team),
  'hb-penalty': d => hbPenalty(+d.team),
  'hb-pen-del': d => hbRemovePenalty(+d.team, +d.idx),
  'hb-next-half': hbNextHalf,
  'hb-reset-half': hbResetHalf,
  'tn-point': d => tnPoint(+d.p),
  'tn-server': d => mutate(() => { state.tn.server = +d.p; if (state.tn.tiebreak && state.tn.tbCount === 0) state.tn.tbStart = +d.p; }),
  'tn-new': async () => { if (await confirmBox(L('مباراة جديدة'), L('سيتم مسح نتيجة المباراة الحالية.'), L('ابدأ'))) { state.tn = newTennis(state.tn); undoStack = []; commit(); } },
};

document.addEventListener('click', e => {
  const el = e.target.closest('[data-action]');
  if (!el || el.disabled) return;
  const fn = actions[el.dataset.action];
  el.blur?.();   // keep Space reserved for the clock, not the last-clicked button
  if (fn) fn(el.dataset);
});

document.addEventListener('input', e => {
  const t = e.target;
  if (t.dataset.name) {                 // team name (no re-render: keep caret)
    state[t.dataset.name].teams[+t.dataset.team].name = t.value;
    save();
  } else if (t.dataset.tname !== undefined) {
    state.tn.names[+t.dataset.tname] = t.value;
    save();
  } else if (t.dataset.color) {
    if (t.dataset.color === 'tn') state.tn.colors[+t.dataset.team] = t.value;
    else state[t.dataset.color].teams[+t.dataset.team].color = t.value;
    t.closest('.team')?.style.setProperty('--tc', t.value);
    save();
  }
});

document.addEventListener('change', e => {
  const t = e.target;
  if ('fbLimit' in t.dataset) {
    const n = Number(t.value), f = state.fb;
    if (!Number.isInteger(n) || n < 1 || n > 180) { t.value = f.halfMinutes; return; }
    const offset = Math.max(0, f.elapsed - fbPeriods(f)[f.period].start * 60000);
    f.halfMinutes = n; f.elapsed = fbPeriods(f)[f.period].start * 60000 + offset;
    fbNotified.period = -1; commit();
  } else if ('hbLimit' in t.dataset) {
    const n = Number(t.value), h = state.hb;
    if (!Number.isInteger(n) || n < 1 || n > 180) { t.value = h.halfMinutes; return; }
    setHbRemaining(Math.max(0, h.remaining + (n - h.halfMinutes) * 60000));
    h.halfMinutes = n; commit();
  } else if ('period' in t.dataset) setPeriod(+t.value);
  else if ('bestof' in t.dataset) { const n = Number(t.value); if (!Number.isInteger(n) || n < 1 || n > 15 || n % 2 === 0) { t.value = state.tn.bestOf; return; } state.tn.bestOf = n; commit(); }
  else if ('noad' in t.dataset) { state.tn.noAd = t.checked; commit(); }
});

document.addEventListener('keydown', e => {
  if (e.target.matches('input, select, textarea') || $('#modal').open || e.ctrlKey || e.metaKey || e.altKey) return;
  const sp = state.sport, code = e.code;
  if (code === 'Space' && sp!=='thirty') { e.preventDefault(); toggleClock(); }
  else if (code === 'KeyZ') (sp==='thirty'?Thirty.perform('undo'):undo());
  else if (code === 'KeyT') toggleTv();
  else if (code === 'KeyF') toggleFullscreen();
  else if (code === 'KeyM') actions.sound();
  else if (code === 'KeyV') actions.voice();
  else if (e.key === '?' || e.key === '؟' || code === 'Slash') showHelp();
  else if (code === 'Digit1' || code === 'Digit2') {
    const i = code === 'Digit1' ? 0 : 1;
    if (sp === 'thirty') return;
    if (sp === 'tennis') tnPoint(i);
    else setScore(sp === 'football' ? 'fb' : 'hb', i, e.shiftKey ? -1 : 1);
  }
});

document.addEventListener('click', e => { if (e.target.closest('#goal-banner')) e.target.closest('#goal-banner').classList.remove('show'); });
window.addEventListener('pagehide', saveNow);
document.addEventListener('visibilitychange', () => { if (document.hidden) saveNow(); else lastTick = performance.now(); });

/* Static page text carries its English in data-en / data-en-title (see index.html). */
function applyStaticLang() {
  setLangAttrs();
  const companyHome = document.getElementById('appendhub-home');
  if (companyHome) companyHome.href = state.lang === 'en' ? '/' : '/ar/';
  $$('[data-en]').forEach(el => {
    if (el.dataset.ar === undefined) el.dataset.ar = el.innerHTML;
    el.innerHTML = state.lang === 'en' ? el.dataset.en : el.dataset.ar;
  });
  $$('[data-en-title]').forEach(el => {
    if (el.dataset.arTitle === undefined) el.dataset.arTitle = el.title;
    el.title = state.lang === 'en' ? el.dataset.enTitle : el.dataset.arTitle;
  });
}

/* ================================================================
   Boot
   ================================================================ */
setInterval(tick, 100);
applyStaticLang();
render();

if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
