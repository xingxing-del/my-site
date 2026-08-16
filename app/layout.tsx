import type { Metadata } from "next";
import "./globals.css";
import "./site.css";

export const metadata: Metadata = {
  title: "李立浩 - 把 AI 能力做成可用产品的人",
  description: "李立浩，AI 产品经理。关注真实需求、产品落地与 AI 带来的新机会。",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
