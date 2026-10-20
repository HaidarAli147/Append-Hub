const fs = require("node:fs");
const path = require("node:path");

const file = path.join(__dirname, "..", "node_modules", "pptx-browser", "src", "render.js");
if (!fs.existsSync(file)) {
  console.warn("pptx-browser source not found; skipping local renderer fix.");
  process.exit(0);
}

let source = fs.readFileSync(file, "utf8");
const broken = `    // ── Bullet / list marker ─────────────────────────────────────────────────
    const bullet = pPr ? parseBullet(pPr, defRPr, themeColors, themeData) : null;

    // Spacing
    const spcBef = g1(pPr, 'spcBef');
    const spcAft = g1(pPr, 'spcAft');
    const lnSpc = g1(pPr, 'lnSpc');
    const defRPr = g1(pPr, 'defRPr');`;
const fixed = `    // Spacing and paragraph defaults must exist before bullet parsing.
    const spcBef = g1(pPr, 'spcBef');
    const spcAft = g1(pPr, 'spcAft');
    const lnSpc = g1(pPr, 'lnSpc');
    const defRPr = g1(pPr, 'defRPr');

    // ── Bullet / list marker ─────────────────────────────────────────────────
    const bullet = pPr ? parseBullet(pPr, defRPr, themeColors, themeData) : null;`;
const oldDraw = `        ctx.fillText(text, rx, drawY);`;
const newDraw = `        ctx.fillStyle = readableTextColor(ctx, runColor, rx + sw / 2, drawY - fi.szPx * 0.45);
        ctx.fillText(text, rx, drawY);`;
const contrastLine = `        ctx.fillStyle = readableTextColor(ctx, runColor, rx + sw / 2, drawY - fi.szPx * 0.45);`;
const oldSegment = `const drawRunSegment = (text, rx, drawY, fi, underline, strike) => {`;
const newSegment = `const drawRunSegment = (text, rx, drawY, fi, underline, strike, runColor) => {`;
const oldCalls = `drawRunSegment(parts[pi], runX, drawY, fi, run.underline, run.strikethrough);`;
const newCalls = `drawRunSegment(parts[pi], runX, drawY, fi, run.underline, run.strikethrough, c);`;
const oldCall = `drawRunSegment(run.text, runX, drawY, fi, run.underline, run.strikethrough);`;
const newCall = `drawRunSegment(run.text, runX, drawY, fi, run.underline, run.strikethrough, c);`;
const oldSignature = `export async function renderTextBody(ctx, txBody, bx, by, bw, bh, scale, themeColors, themeData, defaultFontSz = 1800) {`;
const contrastHelper = `function readableTextColor(ctx, color, x, y) {
  const original = color || { r: 0, g: 0, b: 0 };
  const luminance = ({ r, g, b }) => {
    const channel = (value) => {
      const normalized = value / 255;
      return normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
    };
    return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
  };
  try {
    const px = Math.max(0, Math.min(ctx.canvas.width - 1, Math.round(x)));
    const py = Math.max(0, Math.min(ctx.canvas.height - 1, Math.round(y)));
    const data = ctx.getImageData(px, py, 1, 1).data;
    const background = { r: data[0], g: data[1], b: data[2] };
    const textLum = luminance(original), backgroundLum = luminance(background);
    const contrast = (Math.max(textLum, backgroundLum) + 0.05) / (Math.min(textLum, backgroundLum) + 0.05);
    if (contrast >= 4.5) return color ? colorToCss(color) : '#000000';
    const blackContrast = (backgroundLum + 0.05) / 0.05;
    const whiteContrast = 1.05 / (backgroundLum + 0.05);
    return whiteContrast >= blackContrast ? '#ffffff' : '#111111';
  } catch (_) {
    return color ? colorToCss(color) : '#000000';
  }
}

${oldSignature}`;

let changed = false;
function replaceEither(oldText, newText, label) {
  if (source.includes(oldText)) {
    source = source.replace(oldText, newText);
    changed = true;
  } else if (!source.includes(newText)) {
    throw new Error(`pptx-browser render.js changed; refusing to apply the ${label} patch.`);
  }
}

replaceEither(broken, fixed, "paragraph rendering");
if (!source.includes("function readableTextColor(")) {
  replaceEither(oldSignature, contrastHelper, "text contrast");
} else if (!source.includes(oldSignature)) {
  throw new Error("pptx-browser renderTextBody signature changed; refusing to apply the text contrast patch.");
}
replaceEither(oldSegment, newSegment, "text contrast");
replaceEither(oldCalls, newCalls, "text contrast");
replaceEither(oldCall, newCall, "text contrast");
const sourceLines = source.split("\n");
const normalizedLines = [];
for (const line of sourceLines) {
  if (line === contrastLine && normalizedLines.at(-1) === contrastLine) {
    changed = true;
    continue;
  }
  normalizedLines.push(line);
}
source = normalizedLines.join("\n");
if (!source.includes(newDraw)) replaceEither(oldDraw, newDraw, "text contrast");
if (changed) {
  fs.writeFileSync(file, source);
  console.log("Applied AppendHub Present paragraph rendering and text contrast fixes.");
} else {
  console.log("AppendHub Present renderer fixes are already applied.");
}

const rtlFile = path.join(__dirname, "..", "node_modules", "pptx-browser", "src", "render.js");
if (fs.existsSync(rtlFile)) {
  let rtlSource = fs.readFileSync(rtlFile, "utf8");
  const rtlChanges = [
    [
      "    const algn = attr(pPr, 'algn', 'l'); // l, ctr, r, just, dist",
      "    const algn = attr(pPr, 'algn', 'l'); // l, ctr, r, just, dist\n    const rtl = attr(pPr, 'rtl', '0') === '1' || /[\\u0600-\\u06FF\\u0750-\\u077F\\u08A0-\\u08FF]/.test(para.textContent || '');",
    ],
    [
      "paraLayouts.push({ lines: paraLines, algn, marL, indent, spaceBefore, spaceAfter, lnSpcPx, emptyPara: false, bullet });",
      "paraLayouts.push({ lines: paraLines, algn, marL, indent, spaceBefore, spaceAfter, lnSpcPx, emptyPara: false, bullet, rtl });",
    ],
    [
      "const { lines, algn, marL, indent, spaceBefore, spaceAfter, lnSpcPx, emptyPara, bullet } = paraLayout;",
      "const { lines, algn, marL, indent, spaceBefore, spaceAfter, lnSpcPx, emptyPara, bullet, rtl } = paraLayout;\n    ctx.direction = rtl ? 'rtl' : 'ltr';\n    ctx.textAlign = 'left';",
    ],
    [
      "      for (const run of runs) {\n        const c = run.color;",
      "      const visualRuns = rtl ? [...runs].reverse() : runs;\n      for (const run of visualRuns) {\n        const c = run.color;",
    ],
  ];
  let rtlChanged = false;
  for (const [oldText, newText] of rtlChanges) {
    if (rtlSource.includes(newText)) {
      continue;
    } else if (rtlSource.includes(oldText)) {
      rtlSource = rtlSource.replace(oldText, newText);
      rtlChanged = true;
    } else {
      throw new Error("pptx-browser render.js changed; refusing to apply the Arabic bidirectional text patch.");
    }
  }
  if (rtlChanged) {
    fs.writeFileSync(rtlFile, rtlSource);
    console.log("Applied AppendHub Present Arabic bidirectional text rendering fix.");
  }
}
