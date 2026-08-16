import type { Metadata } from "next";
import { getAllArticles, type Article } from "../../lib/articles";

export const metadata: Metadata = {
  title: "文章 - 李立浩",
  description: "李立浩的 AI 产品思考与记录，2024.08 至今。",
};

function groupByYear(articles: Article[]): [string, Article[]][] {
  const map = new Map<string, Article[]>();
  for (const article of articles) {
    const year = article.date.slice(0, 4) || "未标注";
    const list = map.get(year) ?? [];
    list.push(article);
    map.set(year, list);
  }
  return [...map.entries()].sort((a, b) => (a[0] < b[0] ? 1 : -1));
}

export default function ArticlesPage() {
  const articles = getAllArticles();
  const years = groupByYear(articles);
  const total = articles.length;

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

      <main className="article-page">
        <div className="article-page-head">
          <h1 className="article-page-title">文章</h1>
          <p className="article-page-sub">
            共 {total} 篇 · 关于 AI 产品、真实需求与产品落地的思考
            （2024.08 — 2026.08）
          </p>
        </div>

        <div className="article-layout">
          <div className="article-list-col">
            {years.map(([year, yearArticles]) => (
              <section
                id={`year-${year}`}
                className="year-section"
                key={year}
              >
                <h2 className="year-title">
                  {year}
                  <span className="year-title-count">{yearArticles.length} 篇</span>
                </h2>
                <div className="article-list">
                  {yearArticles.map((article) => (
                    <article className="article-card" key={article.slug}>
                      <a href={`/articles/${article.slug}`}>
                        <h3 className="article-card-title">{article.title}</h3>
                      </a>
                      <time className="article-card-date">{article.date}</time>
                      <p className="article-card-desc">{article.description}</p>
                      <a
                        className="read-more"
                        href={`/articles/${article.slug}`}
                        aria-label={`阅读全文：${article.title}`}
                      >
                        阅读全文 <span aria-hidden="true">→</span>
                      </a>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <aside className="article-rail">
            <nav className="year-nav" aria-label="按年查看">
              <p className="year-nav-title">按年查看</p>
              {years.map(([year, yearArticles], index) => (
                <details
                  className="year-group"
                  key={year}
                  open={index === 0}
                >
                  <summary>
                    <span>{year}</span>
                    <span className="year-count">{yearArticles.length} 篇</span>
                  </summary>
                  <ul>
                    {yearArticles.map((article) => (
                      <li key={article.slug}>
                        <a href={`/articles/${article.slug}`}>
                          {article.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </details>
              ))}
            </nav>
          </aside>
        </div>
      </main>
    </div>
  );
}
