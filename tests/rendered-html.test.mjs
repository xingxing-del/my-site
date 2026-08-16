import assert from "node:assert/strict";
import test from "node:test";

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${path}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("homepage renders the personal site with an articles link", async () => {
  const response = await render("/");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /李立浩/);
  assert.match(html, /把 AI 能力/);
  assert.match(html, /href="\/articles"/);
});

test("articles list renders all articles sorted by date desc and grouped by year", async () => {
  const response = await render("/articles");
  assert.equal(response.status, 200);

  const html = await response.text();

  // 右侧“按年查看”导航
  assert.match(html, /按年查看/);
  assert.match(html, /year-2026/);
  assert.match(html, /year-2025/);
  assert.match(html, /year-2024/);

  // 年份从新到旧
  const idx2026 = html.indexOf('id="year-2026"');
  const idx2025 = html.indexOf('id="year-2025"');
  const idx2024 = html.indexOf('id="year-2024"');
  assert.ok(
    idx2026 >= 0 && idx2025 > idx2026 && idx2024 > idx2025,
    "年份应按从新到旧分组",
  );

  // 同一年内按 date 从新到旧
  const idxNewest = html.indexOf("AI 产品经理的田野笔记"); // 2026-08-01
  const idxMiddle = html.indexOf("为什么 Agent 还不够"); // 2026-06-12
  const idxOldest = html.indexOf("为什么很多 AI 产品只是把 AI 塞进旧流程"); // 2026-05-20
  assert.ok(
    idxNewest >= 0 && idxMiddle > idxNewest && idxOldest > idxMiddle,
    "同年内文章应按 date 字段从新到旧排序",
  );

  // 2024/2025 新增文章已收录
  assert.match(html, /href="\/articles\/ai-product-observation-start"/);
  assert.match(html, /href="\/articles\/rag-not-a-silver-bullet"/);
  assert.match(html, /href="\/articles\/2025-ai-product-review"/);
});

test("article detail page renders title, date and content", async () => {
  const response = await render("/articles/why-agent-is-not-enough");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /为什么 Agent 还不够/);
  assert.match(html, /2026-06-12/);
  assert.match(html, /Agent 的能力不是瓶颈/);
  assert.match(html, /返回文章列表/);
});

test("unknown article slug returns 404", async () => {
  const response = await render("/articles/does-not-exist");
  assert.equal(response.status, 404);
});
