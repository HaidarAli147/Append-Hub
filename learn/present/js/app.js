import { PptxRenderer } from "pptx-browser";

const $ = (id) => document.getElementById(id);
const canvas = $("slide-canvas");
const viewer = $("presentation-viewer");
const message = $("message");
const counter = $("slide-counter");
const previous = $("previous");
const next = $("next");
const fullscreen = $("fullscreen");
const title = $("presentation-title");
const quizButton = $("quiz-button");
const backButton = $("back-button");
const languageButton = $("language-button");
const finalQuizButton = $("final-quiz-button");
const params = new URLSearchParams(location.search);
const arabic = params.get("lang") === "ar" || document.referrer.includes("/learn/ar/");
const labels = arabic
  ? { back: "العودة إلى الدرس", quiz: "ابدأ الاختبار", finalQuiz: "وقت الاختبار!", previous: "السابق", next: "التالي", fullscreen: "ملء الشاشة", exitFullscreen: "إنهاء ملء الشاشة", hint: "استخدم ← → أو اسحب للتنقل · F لملء الشاشة", loading: "جارٍ تحميل العرض…", loadingSlide: "جارٍ عرض الشريحة…", failed: "تعذر تحميل العرض. تأكد من وجود ملف presentation.pptx وأنه ملف PowerPoint صالح.", badFile: "الملف ليس عرض PowerPoint صالحًا أو أنه تالف.", noSlides: "لم يتم العثور على شرائح في هذا العرض." }
  : { back: "Back to Lesson", quiz: "Start Quiz", finalQuiz: "Quiz time!", previous: "Previous", next: "Next", fullscreen: "Fullscreen", exitFullscreen: "Exit Fullscreen", hint: "Use ← → or swipe to change slides · F for fullscreen", loading: "Loading presentation…", loadingSlide: "Rendering slide…", failed: "Could not load the presentation. Check that presentation.pptx exists and is a valid PowerPoint file.", badFile: "This is not a valid PowerPoint presentation, or the file is corrupted.", noSlides: "No slides were found in this presentation." };

document.documentElement.lang = arabic ? "ar" : "en";
document.documentElement.dir = arabic ? "rtl" : "ltr";
document.body.lang = arabic ? "ar" : "en";
document.body.dir = arabic ? "rtl" : "ltr";
document.querySelectorAll("[data-i18n]").forEach((el) => { el.textContent = labels[el.dataset.i18n]; });
if (arabic) {
  previous.setAttribute("aria-label", "الشريحة السابقة");
  next.setAttribute("aria-label", "الشريحة التالية");
  fullscreen.setAttribute("aria-label", "ملء الشاشة");
}

function context() {
  const legacy = params.get("ppt");
  let lessonUrl;
  if (legacy) {
    let ppt = new URL(legacy, location.origin);
    if (ppt.origin !== location.origin || !ppt.pathname.toLowerCase().endsWith(".pptx") || ppt.search || ppt.hash) throw new Error("Invalid presentation path.");
    if (ppt.pathname === "/beta/present/lesson-1/presentation.pptx") {
      ppt = new URL("/learn/present/lessons/ar/coding/python-part-1/presentation.pptx", location.origin);
    } else if (ppt.pathname.startsWith("/present/lessons/")) {
      ppt.pathname = ppt.pathname.replace(/^\/present\//, "/learn/present/");
    }
    const projectPresentation = ppt.pathname.startsWith("/projects/retro-tv/presentations/");
    if (!ppt.pathname.startsWith("/learn/present/lessons/") && !projectPresentation) throw new Error("Invalid presentation path.");
    lessonUrl = new URL("./", ppt);
    const quiz = params.get("quiz");
    const quizPath = quiz ? new URL(quiz, location.origin) : null;
    const back = params.get("back");
    const backPath = back ? new URL(back, location.origin) : null;
    if ((quizPath && quizPath.origin !== location.origin) || (backPath && backPath.origin !== location.origin)) throw new Error("Invalid lesson link.");
    return { ppt: ppt.pathname, lesson: lessonUrl.pathname, quiz: quizPath?.pathname, back: backPath?.pathname, projectPresentation };
  }
  const ref = document.referrer ? new URL(document.referrer) : null;
  if (ref && ref.origin === location.origin && ref.pathname.startsWith("/learn/present/lessons/")) {
    const directory = ref.pathname.slice(0, ref.pathname.lastIndexOf("/") + 1);
    return { ppt: `${directory}presentation.pptx`, lesson: directory };
  }
  throw new Error(arabic ? "لم يتم تحديد الدرس. افتح العرض من صفحة الدرس." : "No lesson selected. Open AppendHub Present from a lesson page.");
}

let renderer;
let current = 0;
let count = 0;
let busy = false;
let startX = null;
let lessonPath = "";
let hasQuiz = false;
let resizeFrame = 0;
let resizePending = false;

function slideRenderWidth() {
  if (!renderer?.slideSize) return Math.max(320, viewer.clientWidth);
  const ratio = renderer.slideSize.cx / renderer.slideSize.cy;
  const availableWidth = viewer.clientWidth;
  const availableHeight = Math.min(viewer.clientHeight, window.visualViewport?.height || window.innerHeight);
  const cssWidth = Math.max(1, Math.min(availableWidth, availableHeight * ratio));
  return Math.min(2400, Math.max(320, Math.round(cssWidth * devicePixelRatio)));
}

function status(text, state = "") { message.textContent = text; message.dataset.state = state; }
function controls() {
  counter.textContent = `${count ? current + 1 : 0} / ${count}`;
  counter.dir = "ltr";
  counter.lang = "en";
  previous.disabled = busy || !count || current === 0;
  next.disabled = busy || !count || current === count - 1;
  fullscreen.disabled = !count;
  finalQuizButton.hidden = !hasQuiz || !count || current !== count - 1;
}
async function showSlide(index) {
  if (!count || busy || index < 0 || index >= count) return;
  busy = true; controls(); status(labels.loadingSlide, "loading");
  try {
    await renderer.renderSlide(index, canvas, slideRenderWidth());
    const ratio = renderer.slideSize.cx / renderer.slideSize.cy;
    canvas.style.width = `min(100%, ${Math.round(slideRenderWidth() / devicePixelRatio)}px)`;
    canvas.style.height = "auto";
    viewer.style.setProperty("--slide-ratio", `${ratio}`);
    current = index;
    canvas.setAttribute("aria-label", `${arabic ? "الشريحة" : "Slide"} ${index + 1} ${arabic ? "من" : "of"} ${count}`);
    status("");
  } catch (error) {
    console.error("AppendHub Present slide rendering failed:", error);
    status(arabic ? "تعذر عرض هذه الشريحة." : "This slide could not be rendered.", "error");
  } finally {
    busy = false;
    controls();
    if (resizePending && count) {
      resizePending = false;
      resizeFrame = requestAnimationFrame(() => showSlide(current));
    }
  }
}

function scheduleSlideResize() {
  cancelAnimationFrame(resizeFrame);
  resizeFrame = requestAnimationFrame(() => {
    if (!count) return;
    if (busy) { resizePending = true; return; }
    showSlide(current);
  });
}

async function load() {
  status(labels.loading, "loading");
  try {
    const lesson = context();
    lessonPath = lesson.lesson;
    hasQuiz = !lesson.projectPresentation;
    const folder = decodeURIComponent(lessonPath.split("/").filter(Boolean).at(-1) || "Presentation").replace(/[-_]+/g, " ");
    const arabicTitles = {
      "python part 1": "بايثون، الجزء الأول",
      "algebra addition": "الجمع الجبري",
      "digestive system": "الجهاز الهضمي",
    };
    title.textContent = params.get("title") || (arabic ? arabicTitles[folder.toLocaleLowerCase()] : null) || folder.replace(/\b\p{L}/gu, (c) => c.toLocaleUpperCase());
    backButton.href = lesson.back || `${lessonPath}index.html`;
    quizButton.href = lesson.quiz || `${lessonPath}quiz.html`;
    finalQuizButton.href = quizButton.href;
    finalQuizButton.innerHTML = `${labels.finalQuiz} <svg class="ui-icon" aria-hidden="true"><use href="/assets/icons.svg#trophy"></use></svg>`;
    const languageFolder = arabic
      ? lessonPath.replace("/lessons/ar/", "/lessons/en/")
      : lessonPath.replace("/lessons/en/", "/lessons/ar/");
    languageButton.hidden = Boolean(lesson.projectPresentation);
    if (!lesson.projectPresentation) languageButton.href = `/present/?ppt=${encodeURIComponent(`${languageFolder}presentation.pptx`)}&lang=${arabic ? "en" : "ar"}`;
    languageButton.textContent = arabic ? "English" : "العربية";
    quizButton.hidden = !hasQuiz;
    const response = await fetch(lesson.ppt, { cache: "no-cache" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.arrayBuffer();
    if (!data.byteLength) throw new Error("Empty PowerPoint file");
    renderer = new PptxRenderer();
    await renderer.load(data, (progress, detail) => {
      if (progress < 1) status(`${labels.loading} ${Math.round(progress * 100)}%`, "loading");
    });
    count = renderer.slideCount;
    if (!Number.isInteger(count) || count < 1) throw new Error(labels.noSlides);
    controls();
    await showSlide(0);
  } catch (error) {
    console.error("AppendHub Present load failed:", error);
    count = 0; controls();
    const detail = String(error.message || "");
    const notFound = detail.includes("404") || detail.includes("HTTP 4");
    status(notFound ? (arabic ? "لم يتم العثور على ملف العرض presentation.pptx في مجلد الدرس." : "Presentation file not found. Add presentation.pptx to this lesson folder.") : (detail.includes("No lesson selected") || detail.includes("لم يتم تحديد") || detail.includes("Invalid")) ? detail : detail === labels.noSlides ? labels.noSlides : labels.badFile, "error");
  }
}

previous.addEventListener("click", () => showSlide(current - 1));
next.addEventListener("click", () => showSlide(current + 1));
fullscreen.addEventListener("click", async () => {
  try { if (document.fullscreenElement) await document.exitFullscreen(); else await viewer.requestFullscreen(); }
  catch (error) { status(arabic ? "تعذر تشغيل وضع ملء الشاشة." : "Fullscreen is unavailable in this browser.", "error"); }
});
document.addEventListener("fullscreenchange", () => {
  const active = Boolean(document.fullscreenElement);
  const text = fullscreen.querySelector("[data-i18n]");
  text.textContent = active ? labels.exitFullscreen : labels.fullscreen;
  fullscreen.setAttribute("aria-label", active ? labels.exitFullscreen : labels.fullscreen);
});
document.addEventListener("keydown", (event) => {
  if (event.altKey || event.ctrlKey || event.metaKey || /INPUT|TEXTAREA|SELECT|BUTTON|A/.test(document.activeElement?.tagName || "")) return;
  if (["ArrowRight", "PageDown", " "].includes(event.key)) { event.preventDefault(); showSlide(current + (arabic && event.key.startsWith("Arrow") ? -1 : 1)); }
  else if (["ArrowLeft", "PageUp"].includes(event.key)) { event.preventDefault(); showSlide(current + (arabic && event.key.startsWith("Arrow") ? 1 : -1)); }
  else if (event.key === "Home") showSlide(0);
  else if (event.key === "End") showSlide(count - 1);
  else if (event.key.toLowerCase() === "f") fullscreen.click();
});
viewer.addEventListener("touchstart", (event) => { startX = event.changedTouches[0].clientX; }, { passive: true });
viewer.addEventListener("touchend", (event) => {
  if (startX === null) return;
  const distance = event.changedTouches[0].clientX - startX;
  if (Math.abs(distance) > 45) showSlide(current + (distance < 0 ? 1 : -1));
  startX = null;
}, { passive: true });
const resizeObserver = new ResizeObserver(() => {
  scheduleSlideResize();
});
resizeObserver.observe(viewer);
window.visualViewport?.addEventListener("resize", scheduleSlideResize);
window.addEventListener("orientationchange", () => {
  setTimeout(scheduleSlideResize, 150);
});
window.addEventListener("pagehide", () => { resizeObserver.disconnect(); renderer?.destroy(); });
load();
