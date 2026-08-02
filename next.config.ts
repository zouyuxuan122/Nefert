import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 🚨 核心修改 1：关掉纯静态导出，让 Vercel 帮你把 API 跑起来！
  // output: 'export',

  // 🚨 核心修改 2：Vercel 不需要强制加斜杠，关掉它能避免很多 API 路径匹配错误
  // trailingSlash: true,

  // 下面这些可以保留
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true, // 忽略 TS 错误，方便快速部署
  },

  // 🌟 Gitalk 评论 API 同源代理：服务端转发到 api.github.com，规避国内直连不稳定
  async rewrites() {
    return [
      {
        source: "/api/gh/:path*",
        destination: "https://api.github.com/:path*",
      },
    ];
  },
};

export default nextConfig;