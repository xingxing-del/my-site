/**
 * Vercel 部署专用 Vite 配置（纯静态导出，不依赖服务器函数，最可靠）。
 * 构建命令：STATIC_EXPORT=1 vite build --config vite.vercel.config.ts
 * 输出目录：dist/client（生成的 *.html 静态页面）
 */
import { defineConfig } from "vite";
import vinext from "vinext";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [vinext(), tailwindcss()],
});
