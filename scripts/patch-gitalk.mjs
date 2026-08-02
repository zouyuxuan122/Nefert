// 修复 gitalk 1.8.0 fork 版：把 GitHub API 请求改为走站内同源代理 /api/gh
// (next.config.ts 的 rewrites 会把 /api/gh/* 转发到 api.github.com/*)
// 由 package.json 的 postinstall 在每次 npm install 后自动执行
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const file = join(root, "node_modules", "gitalk", "dist", "gitalk.js");

if (!existsSync(file)) {
  console.log("[patch-gitalk] gitalk.js not found, skip");
  process.exit(0);
}

const src = readFileSync(file, "utf8");

const target = `var axiosGithub = exports.axiosGithub = _axios2.default.create({
  baseURL: 'https://api.github.com',
  headers: {
    'Accept': 'application/json'
  }
});`;

const replaced = `var axiosGithub = exports.axiosGithub = _axios2.default.create({
  baseURL: '/api/gh',
  headers: {
    'Accept': 'application/json'
  }
});
axiosGithub.interceptors.request.use(function (config) {
  config.url = String(config.url).replace(/^https?:\\/\\/api\\.github\\.com\\//, '/api/gh/');
  return config;
});`;

if (src.includes(target)) {
  writeFileSync(file, src.replace(target, replaced), "utf8");
  console.log("[patch-gitalk] patched: baseURL -> /api/gh (with absolute URL fallback)");
} else if (src.includes("baseURL: '/api/gh'")) {
  console.log("[patch-gitalk] already patched, skip");
} else {
  console.error("[patch-gitalk] pattern not found, manual fix required");
  process.exit(1);
}
