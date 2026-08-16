import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Vercel 静态部署时（STATIC_EXPORT=1）生成全静态页面；
  // 本地开发与 Cloudflare 构建不受影响。
  output: process.env.STATIC_EXPORT === "1" ? "export" : undefined,
};

export default nextConfig;
