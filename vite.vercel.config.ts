/**
 * Vercel 部署专用 Vite 配置（不影响本地开发与 Cloudflare 构建）。
 * 依据 vinext 文档：vinext + Nitro 可部署到 Vercel，
 * 构建命令：NITRO_PRESET=vercel npx vite build --config vite.vercel.config.ts
 * 输出目录：.output
 */
import { defineConfig } from "vite";
import vinext from "vinext";
import { nitro } from "nitro/vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [vinext(), nitro(), tailwindcss()],
});
