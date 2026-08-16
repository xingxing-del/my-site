/**
 * 文章数据层：自动读取 content/articles/*.md 下的所有 Markdown 文件。
 *
 * 新增一篇文章 = 往 content/articles/ 里放一个新的 .md 文件，
 * 无需修改任何代码（Vite import.meta.glob 会自动收集）。
 *
 * 文件格式：
 * ---
 * title: 文章标题
 * date: 2026-05-20        # 发布日期，手动填写，支持任意日期
 * description: 一句话简介
 * slug: article-slug      # 唯一链接，/articles/article-slug
 * ---
 * 这里写正文（Markdown）。
 */

export interface Article {
  title: string;
  date: string;
  description: string;
  slug: string;
  content: string;
}

// Vite 编译期收集所有文章文件，正文以字符串内联进构建产物，
// 运行时（Cloudflare Workers）无需文件系统，因此部署后依然可用。
const rawModules = import.meta.glob("../content/articles/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

function parseFrontmatter(raw: string, filePath: string): Article {
  const body = raw.replace(/^\uFEFF/, "");
  let frontmatter = "";
  let content = body;

  const match = body.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (match) {
    frontmatter = match[1];
    content = body.slice(match[0].length);
  }

  const fields: Record<string, string> = {};
  for (const line of frontmatter.split(/\r?\n/)) {
    const idx = line.indexOf(":");
    if (idx > 0) {
      fields[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
    }
  }

  const fallbackSlug =
    filePath.split("/").pop()?.replace(/\.md$/, "") ?? "untitled";

  return {
    title: fields.title || fallbackSlug,
    date: fields.date || "",
    description: fields.description || "",
    slug: fields.slug || fallbackSlug,
    content: content.trim(),
  };
}

function byDateDesc(a: Article, b: Article): number {
  // ISO 格式 YYYY-MM-DD 可直接按字符串比较，从新到旧排序
  if (a.date < b.date) return 1;
  if (a.date > b.date) return -1;
  return a.slug.localeCompare(b.slug);
}

/** 全部文章，按 date 字段从新到旧排序（与文件创建/上传时间无关）。 */
export function getAllArticles(): Article[] {
  return Object.entries(rawModules)
    .map(([path, raw]) => parseFrontmatter(raw, path))
    .sort(byDateDesc);
}

/** 按 slug 取单篇文章。 */
export function getArticle(slug: string): Article | undefined {
  return getAllArticles().find((a) => a.slug === slug);
}
