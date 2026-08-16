/**
 * 极简 Markdown 渲染器（零依赖）。
 * 支持：标题、段落、粗体、斜体、行内代码、链接、无序/有序列表、
 * 引用、代码块、分隔线。覆盖文章正文的常见写法。
 */

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function inline(text: string): string {
  return text
    .replace(/`([^`]+)`/g, (_, c: string) => `<code>${c}</code>`)
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/__([^_]+)__/g, "<strong>$1</strong>")
    .replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>")
    .replace(/(^|[^_])_([^_\n]+)_/g, "$1<em>$2</em>")
    .replace(
      /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g,
      '<a href="$2" target="_blank" rel="noreferrer">$1</a>',
    );
}

export function renderMarkdown(md: string): string {
  const lines = md.split(/\r?\n/);
  const html: string[] = [];

  let inCode = false;
  let codeBuf: string[] = [];
  let list: "ul" | "ol" | null = null;
  let listBuf: string[] = [];
  let para: string[] = [];

  const flushPara = () => {
    if (para.length) {
      html.push(`<p>${inline(escapeHtml(para.join(" ")))}</p>`);
      para = [];
    }
  };
  const flushList = () => {
    if (list && listBuf.length) {
      html.push(`<${list}>${listBuf.join("")}</${list}>`);
    }
    list = null;
    listBuf = [];
  };

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();

    if (/^```/.test(line)) {
      if (inCode) {
        inCode = false;
        html.push(`<pre><code>${escapeHtml(codeBuf.join("\n"))}</code></pre>`);
        codeBuf = [];
      } else {
        flushPara();
        flushList();
        inCode = true;
      }
      continue;
    }
    if (inCode) {
      codeBuf.push(line);
      continue;
    }
    if (/^\s*$/.test(line)) {
      flushPara();
      flushList();
      continue;
    }
    const heading = line.match(/^(#{1,6})\s+(.*)$/);
    if (heading) {
      flushPara();
      flushList();
      const level = heading[1].length;
      html.push(
        `<h${level}>${inline(escapeHtml(heading[2]))}</h${level}>`,
      );
      continue;
    }
    if (/^>\s?/.test(line)) {
      flushPara();
      flushList();
      html.push(
        `<blockquote><p>${inline(escapeHtml(line.replace(/^>\s?/, "")))}</p></blockquote>`,
      );
      continue;
    }
    const ul = line.match(/^\s*[-*]\s+(.*)$/);
    if (ul) {
      flushPara();
      if (list !== "ul") {
        flushList();
        list = "ul";
      }
      listBuf.push(`<li>${inline(escapeHtml(ul[1]))}</li>`);
      continue;
    }
    const ol = line.match(/^\s*\d+\.\s+(.*)$/);
    if (ol) {
      flushPara();
      if (list !== "ol") {
        flushList();
        list = "ol";
      }
      listBuf.push(`<li>${inline(escapeHtml(ol[1]))}</li>`);
      continue;
    }
    if (/^-{3,}\s*$/.test(line)) {
      flushPara();
      flushList();
      html.push("<hr />");
      continue;
    }
    // 普通段落行
    flushList();
    para.push(line.trim());
  }

  flushPara();
  flushList();
  if (inCode) {
    html.push(`<pre><code>${escapeHtml(codeBuf.join("\n"))}</code></pre>`);
  }
  return html.join("\n");
}
