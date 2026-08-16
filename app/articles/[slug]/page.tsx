import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllArticles, getArticle } from "../../../lib/articles";
import { renderMarkdown } from "../../../lib/markdown";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllArticles().map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return { title: "文章不存在 - 李立浩" };
  return {
    title: `${article.title} - 李立浩`,
    description: article.description,
  };
}

export default async function ArticleDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const html = renderMarkdown(article.content);

  return (
    <div className="site-page">
      <div className="space-bg" aria-hidden="true"></div>
      <div className="stars" aria-hidden="true"></div>

      <header className="header">
        <div className="header-left">
          <a className="back-top" href="/articles">
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

      <main className="article-detail">
        <a className="back-link" href="/articles">
          <span aria-hidden="true">←</span> 返回文章列表
        </a>
        <h1>{article.title}</h1>
        <time className="article-detail-date">{article.date}</time>
        <div
          className="article-body"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </main>
    </div>
  );
}
