import Link from "next/link";

export default function NotFound() {
  return (
    <div className="site-page">
      <div className="space-bg" aria-hidden="true"></div>
      <div className="stars" aria-hidden="true"></div>
      <header className="header">
        <div className="header-left">
          <a className="back-top" href="/">
            <span aria-hidden="true">←</span> 返回
          </a>
          <a className="brand" href="/">
            <span>李立浩</span>
            <span className="brand-mark">✱</span>
          </a>
        </div>
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
      <main className="not-found">
        <h1>404</h1>
        <p>页面不存在或已被移除。</p>
        <Link href="/">返回首页</Link>
      </main>
    </div>
  );
}
