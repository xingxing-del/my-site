import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "李立浩 - 把 AI 能力做成可用产品的人",
  description:
    "李立浩，AI 产品经理。关注真实需求、产品落地与 AI 带来的新机会。",
};

export default function Home() {
  return (
    <main className="home-page" id="home">
      <div className="space-bg" aria-hidden="true"></div>
      <div className="stars" aria-hidden="true"></div>
      <div className="robot-stage" aria-hidden="true">
        <video
          className="robot-video"
          id="robotVideo"
          src="/robot-transparent.webm"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        ></video>
      </div>

      <header className="header">
        <a className="brand" href="/">
          <span>李立浩</span>
          <span className="brand-mark">✱</span>
        </a>
        <nav className="nav" aria-label="主导航">
          <a
            className="status"
            href="https://github.com/xingxing-del"
            target="_blank"
            rel="noreferrer"
          >
            <span>GitHub</span>
          </a>
          <a href="/articles">文章</a>
          <a href="mailto:lilihao154@gmail.com">邮箱</a>
        </nav>
      </header>

      <section className="content">
        <div className="copy">
          <h1 className="fade-in delay-1">
            把 AI 能力
            <br />
            做成可用产品的人
          </h1>
          <p className="intro fade-in delay-2">
            我是李立浩，一名 AI
            产品经理。关注真实需求、产品落地，以及技术如何转化为用户愿意持续使用的产品。
          </p>
          <div className="actions fade-in delay-3">
            <a
              className="button"
              href="https://github.com/xingxing-del"
              target="_blank"
              rel="noreferrer"
            >
              GitHub <span aria-hidden="true">↗</span>
            </a>
            <a className="button" href="/articles">
              文章 <span aria-hidden="true">↗</span>
            </a>
            <a className="button" href="mailto:lilihao154@gmail.com">
              lilihao154@gmail.com <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
