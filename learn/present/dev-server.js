const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
if (typeof process.loadEnvFile === "function") {
  try { process.loadEnvFile(path.join(root, ".env.local")); }
  catch (error) { if (error.code !== "ENOENT") throw error; }
}
const types = { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".json": "application/json; charset=utf-8", ".txt": "text/plain; charset=utf-8", ".xml": "application/xml; charset=utf-8", ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml", ".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation" };
const server = http.createServer((req, res) => {
  let pathname;
  try { pathname = decodeURIComponent(new URL(req.url, "http://localhost").pathname); }
  catch { res.writeHead(400).end("Bad request"); return; }
  if (pathname === "/api/live-token") {
    try {
      const handler = require(path.join(root, "api/live-token.js"));
      const functionResponse = {
        setHeader: res.setHeader.bind(res),
        status(code) { res.statusCode = code; return this; },
        json(body) {
          if (!res.hasHeader("Content-Type")) res.setHeader("Content-Type", "application/json; charset=utf-8");
          res.end(JSON.stringify(body));
          return this;
        },
      };
      Promise.resolve(handler(req, functionResponse)).catch((error) => {
        console.error("Local Live token function failed:", error?.message || error);
        if (!res.writableEnded) res.writeHead(500).end("Live token function failed");
      });
    } catch (error) {
      console.error("Could not load local Live token function:", error?.message || error);
      res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" }).end("Live token function unavailable");
    }
    return;
  }
  const file = path.resolve(root, `.${pathname}`);
  if (!file.startsWith(root + path.sep) && file !== root) { res.writeHead(403).end("Forbidden"); return; }
  fs.stat(file, (statError, stat) => {
    const target = !statError && stat.isDirectory() ? path.join(file, "index.html") : file;
    fs.readFile(target, (error, data) => {
      if (error) { res.writeHead(error.code === "ENOENT" ? 404 : 500, { "Content-Type": "text/plain; charset=utf-8" }).end(error.code === "ENOENT" ? "Not found" : "Server error"); return; }
      res.writeHead(200, { "Content-Type": types[path.extname(target).toLowerCase()] || "application/octet-stream", "X-Content-Type-Options": "nosniff", "Cache-Control": "no-cache" }).end(data);
    });
  });
});
const port = Number(process.env.PORT || 4173);
server.listen(port, "0.0.0.0", () => console.log(`AppendHub Learn dev server: http://localhost:${port}`));
