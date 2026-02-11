import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkRehype from "remark-rehype";
import rehypeKatex from "rehype-katex";
import rehypeStringify from "rehype-stringify";
import rehypePrettyCode from "rehype-pretty-code";
import * as fs from "fs/promises";
import * as fsSync from "fs";
import * as path from "path";
import * as crypto from "crypto";

import type {
  NotionPost,
  NotionProject,
  NotionAbout,
  TocItem,
  SearchIndexItem,
} from "../src/types/notion";

// ── .env 로드 (dotenv 없이) ──

function loadEnv(): void {
  const envFiles = [".env.local", ".env"];
  for (const file of envFiles) {
    const filePath = path.join(process.cwd(), file);
    try {
      const content = fsSync.readFileSync(filePath, "utf-8");
      for (const line of content.split("\n")) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const eqIndex = trimmed.indexOf("=");
        if (eqIndex === -1) continue;
        const key = trimmed.slice(0, eqIndex).trim();
        const value = trimmed.slice(eqIndex + 1).trim();
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    } catch {
      // 파일 없으면 skip
    }
  }
}

loadEnv();

// ── 상수 ──

const NOTION_DATA_DIR = path.join(process.cwd(), ".notion-data");
const IMAGES_DIR = path.join(process.cwd(), "public", "notion-images");
const BASE_PATH = process.env.BASE_PATH || "";

// ── 환경변수 검증 ──

function getEnvVar(name: string, required = true): string {
  const value = process.env[name] || "";
  if (required && !value) {
    console.error(`❌ Missing required environment variable: ${name}`);
    process.exit(1);
  }
  return value;
}

const NOTION_TOKEN = getEnvVar("NOTION_TOKEN");
const BLOG_DB_ID = getEnvVar("NOTION_BLOG_DB_ID");
const PROJECTS_DB_ID = getEnvVar("NOTION_PROJECTS_DB_ID", false);
const ABOUT_PAGE_ID = getEnvVar("NOTION_ABOUT_PAGE_ID", false);
const ABOUT_EN_PAGE_ID = getEnvVar("NOTION_ABOUT_EN_PAGE_ID", false);

// ── Notion 클라이언트 ──

const notion = new Client({ auth: NOTION_TOKEN });
const n2m = new NotionToMarkdown({
  notionClient: notion,
  config: { parseChildPages: false, separateChildPage: false },
});

// callout 커스텀 트랜스포머
n2m.setCustomTransformer("callout", async (block: unknown) => {
  const b = block as { callout?: { icon?: { emoji?: string }; rich_text?: Array<{ plain_text: string }> } };
  const callout = b.callout;
  if (!callout) return "";
  const icon = callout.icon?.emoji || "💡";
  const text = callout.rich_text?.map((t) => t.plain_text).join("") || "";
  return `<div class="callout"><span class="callout-icon">${icon}</span><div class="callout-content">${text}</div></div>`;
});

// bookmark 커스텀 트랜스포머
n2m.setCustomTransformer("bookmark", async (block: unknown) => {
  const b = block as { bookmark?: { url?: string; caption?: Array<{ plain_text: string }> } };
  const bookmark = b.bookmark;
  if (!bookmark?.url) return "";
  const caption = bookmark.caption?.map((t) => t.plain_text).join("") || bookmark.url;
  return `<a class="bookmark-link" href="${bookmark.url}" target="_blank" rel="noopener noreferrer">${caption}</a>`;
});

// ── Notion property 헬퍼 ──

/* eslint-disable @typescript-eslint/no-explicit-any */
type Props = Record<string, any>;

function getTitle(props: Props, key: string): string {
  const p = props[key];
  if (p?.type === "title" && p.title?.length > 0) {
    return p.title.map((t: any) => t.plain_text).join("");
  }
  return "";
}

function getRichText(props: Props, key: string): string {
  const p = props[key];
  if (p?.type === "rich_text" && p.rich_text?.length > 0) {
    return p.rich_text.map((t: any) => t.plain_text).join("");
  }
  return "";
}

function getMultiSelect(props: Props, key: string): string[] {
  const p = props[key];
  if (p?.type === "multi_select") {
    return p.multi_select.map((s: any) => s.name);
  }
  return [];
}

function getCheckbox(props: Props, key: string): boolean {
  const p = props[key];
  return p?.type === "checkbox" ? p.checkbox : false;
}

function getDate(props: Props, key: string): string | null {
  const p = props[key];
  if (p?.type === "date" && p.date?.start) {
    return p.date.start;
  }
  return null;
}

function getUrl(props: Props, key: string): string | null {
  const p = props[key];
  return p?.type === "url" ? p.url || null : null;
}

function getNumber(props: Props, key: string): number {
  const p = props[key];
  return p?.type === "number" ? p.number || 0 : 0;
}

function getFiles(props: Props, key: string): any[] {
  const p = props[key];
  return p?.type === "files" ? p.files || [] : [];
}
/* eslint-enable @typescript-eslint/no-explicit-any */

// ── Markdown 전처리 (CJK emphasis 이슈 fix) ──

function preprocessMarkdown(md: string): string {
  // CommonMark spec: closing ** must be a right-flanking delimiter,
  // which requires it to be followed by whitespace or punctuation.
  // CJK characters (Korean, Chinese, Japanese) are neither, so
  // **text**한글 fails to parse. Convert **...** to <strong> HTML.
  return md.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
}

// ── Markdown → HTML 파이프라인 ──

async function markdownToHtml(markdown: string): Promise<string> {
  const processed = preprocessMarkdown(markdown);
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeKatex)
    .use(rehypePrettyCode, {
      theme: "catppuccin-mocha",
      keepBackground: true,
      defaultLang: "plaintext",
    })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(processed);

  return String(result);
}

// ── 이미지 다운로드 ──

async function downloadImage(url: string): Promise<string | null> {
  try {
    const urlObj = new URL(url);
    // Hash only the pathname (stable), not query params (signed, expires hourly)
    const hash = crypto.createHash("md5").update(urlObj.pathname).digest("hex");
    const ext = path.extname(urlObj.pathname).split("?")[0] || ".png";
    const filename = `${hash}${ext}`;
    const localPath = path.join(IMAGES_DIR, filename);

    // 캐시: 이미 존재하면 skip
    try {
      await fs.access(localPath);
      return `${BASE_PATH}/notion-images/${filename}`;
    } catch {
      // 파일 없음 → 다운로드 진행
    }

    const response = await fetch(url);
    if (!response.ok) {
      console.warn(`  ⚠️  Failed to download image: ${response.status}`);
      return null;
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    await fs.writeFile(localPath, buffer);

    return `${BASE_PATH}/notion-images/${filename}`;
  } catch (error) {
    console.warn(`  ⚠️  Image download error:`, error);
    return null;
  }
}

async function downloadThumbnail(
  files: Array<{ type: string; file?: { url: string }; external?: { url: string } }>
): Promise<string | null> {
  if (!files || files.length === 0) return null;
  const first = files[0];
  const url = first.type === "file" ? first.file?.url : first.external?.url;
  if (!url) return null;
  return downloadImage(url);
}

// ── HTML 내 이미지 URL 치환 ──

async function processImages(html: string): Promise<string> {
  const imgRegex = /<img[^>]+src="([^"]+)"[^>]*>/g;
  const matches = [...html.matchAll(imgRegex)];
  const uniqueUrls = [
    ...new Set(
      matches
        .map((m) => m[1])
        .filter(
          (url) =>
            url.includes("secure.notion-static.com") ||
            url.includes("prod-files-secure") ||
            url.includes("s3.us-west-2.amazonaws.com")
        )
    ),
  ];

  // 병렬 다운로드 (동시성 3)
  const urlMap = new Map<string, string>();
  for (let i = 0; i < uniqueUrls.length; i += 3) {
    const batch = uniqueUrls.slice(i, i + 3);
    const results = await Promise.all(
      batch.map(async (url) => {
        const local = await downloadImage(url);
        return [url, local] as const;
      })
    );
    for (const [url, local] of results) {
      if (local) urlMap.set(url, local);
    }
  }

  let processed = html;
  for (const [original, local] of urlMap) {
    processed = processed.replaceAll(original, local);
  }
  return processed;
}

// ── TOC + heading ID ──

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) =>
      String.fromCharCode(parseInt(hex, 16))
    )
    .replace(/&#(\d+);/g, (_, dec) =>
      String.fromCharCode(parseInt(dec, 10))
    );
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\uAC00-\uD7AF\u3131-\u3163\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function injectHeadingIds(html: string): string {
  const seen = new Map<string, number>();
  return html.replace(
    /<h([23])([^>]*)>(.*?)<\/h[23]>/gi,
    (_match, level, attrs, content) => {
      if (attrs.includes("id=")) return _match;
      const text = decodeHtmlEntities(content.replace(/<[^>]*>/g, "").trim());
      let id = slugify(text);
      const count = seen.get(id) ?? 0;
      seen.set(id, count + 1);
      if (count > 0) id = `${id}-${count}`;
      return `<h${level}${attrs} id="${id}">${content}</h${level}>`;
    }
  );
}

function extractToc(html: string): TocItem[] {
  const toc: TocItem[] = [];
  const seen = new Map<string, number>();
  const regex = /<h([23])[^>]*>(.*?)<\/h[23]>/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    const level = parseInt(match[1]) as 2 | 3;
    const text = decodeHtmlEntities(match[2].replace(/<[^>]*>/g, "").trim());
    let id = slugify(text);
    const count = seen.get(id) ?? 0;
    seen.set(id, count + 1);
    if (count > 0) id = `${id}-${count}`;
    if (text) toc.push({ id, text, level });
  }
  return toc;
}

// ── 텍스트 유틸 ──

function htmlToPlainText(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function calculateReadingTime(html: string): number {
  const plainText = htmlToPlainText(html);
  return Math.max(1, Math.ceil(plainText.length / 500));
}

// ── DB 쿼리 (페이지네이션) ──

async function queryAllPages(
  databaseId: string,
  filter?: object,
  sorts?: Array<{ property: string; direction: "ascending" | "descending" }>
) {
  const pages: Array<Record<string, unknown>> = [];
  let cursor: string | undefined;

  do {
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: filter as Parameters<typeof notion.databases.query>[0]["filter"],
      sorts,
      start_cursor: cursor,
    });
    pages.push(...(response.results as Array<Record<string, unknown>>));
    cursor = response.has_more
      ? (response.next_cursor as string) ?? undefined
      : undefined;
  } while (cursor);

  return pages;
}

// ── 블로그 fetch ──

async function fetchBlogPosts(): Promise<NotionPost[]> {
  console.log("\n📝 Fetching blog posts...");

  const pages = await queryAllPages(
    BLOG_DB_ID,
    { property: "Published", checkbox: { equals: true } },
    [{ property: "Date", direction: "descending" }]
  );

  const posts: NotionPost[] = [];

  for (const page of pages) {
    if (!("properties" in page)) continue;
    const props = page.properties as Props;

    const slug = getRichText(props, "Slug");
    const title = getTitle(props, "Title");
    if (!slug || !title) {
      console.warn(`  ⚠️  Skipping post without slug or title: ${page.id}`);
      continue;
    }

    console.log(`  → Processing: ${title}`);

    const mdBlocks = await n2m.pageToMarkdown(page.id as string);
    const mdString = n2m.toMarkdownString(mdBlocks);
    const markdown = mdString.parent;

    let html = await markdownToHtml(markdown);
    html = await processImages(html);
    html = injectHeadingIds(html);

    const toc = extractToc(html);
    const thumbnail = await downloadThumbnail(getFiles(props, "Thumbnail"));

    posts.push({
      id: page.id as string,
      slug,
      title,
      description: getRichText(props, "Description"),
      date: getDate(props, "Date") || new Date().toISOString(),
      updatedAt: getDate(props, "UpdatedAt"),
      tags: getMultiSelect(props, "Tags"),
      thumbnail,
      readingTime: calculateReadingTime(html),
      contentHtml: html,
      toc,
    });
  }

  console.log(`✅ Fetched ${posts.length} posts`);
  return posts;
}

// ── 프로젝트 fetch ──

async function fetchProjects(): Promise<NotionProject[]> {
  if (!PROJECTS_DB_ID) {
    console.log("\n📦 Skipping projects (NOTION_PROJECTS_DB_ID not set)");
    return [];
  }

  console.log("\n📦 Fetching projects...");

  const pages = await queryAllPages(PROJECTS_DB_ID, undefined, [
    { property: "Order", direction: "ascending" },
  ]);

  const projects: NotionProject[] = [];

  for (const page of pages) {
    if (!("properties" in page)) continue;
    const props = page.properties as Props;

    const name = getTitle(props, "Name");
    if (!name) continue;

    const thumbnail = await downloadThumbnail(getFiles(props, "Thumbnail"));

    projects.push({
      id: page.id as string,
      name,
      description: getRichText(props, "Description"),
      techStack: getMultiSelect(props, "TechStack"),
      githubUrl: getUrl(props, "GitHub"),
      demoUrl: getUrl(props, "Demo"),
      thumbnail,
      featured: getCheckbox(props, "Featured"),
      order: getNumber(props, "Order"),
    });
  }

  console.log(`✅ Fetched ${projects.length} projects`);
  return projects;
}

// ── About fetch ──

async function fetchAbout(): Promise<NotionAbout | null> {
  if (!ABOUT_PAGE_ID) {
    console.log("\n👤 Skipping about (NOTION_ABOUT_PAGE_ID not set)");
    return null;
  }

  console.log("\n👤 Fetching about page...");

  const page = await notion.pages.retrieve({ page_id: ABOUT_PAGE_ID });
  const mdBlocks = await n2m.pageToMarkdown(ABOUT_PAGE_ID);
  const mdString = n2m.toMarkdownString(mdBlocks);
  const markdown = mdString.parent;

  let html = await markdownToHtml(markdown);
  html = await processImages(html);
  html = injectHeadingIds(html);

  const lastEdited =
    "last_edited_time" in page
      ? (page.last_edited_time as string)
      : new Date().toISOString();

  // 영문 About 페이지
  let contentHtmlEn: string | null = null;
  if (ABOUT_EN_PAGE_ID) {
    console.log("  → Fetching English about page...");
    const enBlocks = await n2m.pageToMarkdown(ABOUT_EN_PAGE_ID);
    const enMdString = n2m.toMarkdownString(enBlocks);
    let enHtml = await markdownToHtml(enMdString.parent);
    enHtml = await processImages(enHtml);
    enHtml = injectHeadingIds(enHtml);
    contentHtmlEn = enHtml;
  }

  console.log("✅ Fetched about page");

  return { id: ABOUT_PAGE_ID, contentHtml: html, contentHtmlEn, lastEdited };
}

// ── 검색 인덱스 생성 ──

function buildSearchIndex(posts: NotionPost[]): SearchIndexItem[] {
  return posts.map((post) => ({
    id: post.id,
    slug: post.slug,
    title: post.title,
    description: post.description,
    plainText: htmlToPlainText(post.contentHtml).slice(0, 5000),
    date: post.date,
    tags: post.tags,
  }));
}

// ── 메인 ──

async function main(): Promise<void> {
  console.log("🚀 Starting Notion data fetch...");

  await fs.mkdir(NOTION_DATA_DIR, { recursive: true });
  await fs.mkdir(IMAGES_DIR, { recursive: true });

  const posts = await fetchBlogPosts();
  const projects = await fetchProjects();
  const about = await fetchAbout();
  const searchIndex = buildSearchIndex(posts);

  await fs.writeFile(
    path.join(NOTION_DATA_DIR, "posts.json"),
    JSON.stringify(posts, null, 2),
    "utf-8"
  );
  await fs.writeFile(
    path.join(NOTION_DATA_DIR, "projects.json"),
    JSON.stringify(projects, null, 2),
    "utf-8"
  );
  await fs.writeFile(
    path.join(NOTION_DATA_DIR, "about.json"),
    JSON.stringify(about, null, 2),
    "utf-8"
  );
  await fs.writeFile(
    path.join(NOTION_DATA_DIR, "search-index.json"),
    JSON.stringify(searchIndex, null, 2),
    "utf-8"
  );

  // 이미지 카운트
  let imageCount = 0;
  try {
    const images = await fs.readdir(IMAGES_DIR);
    imageCount = images.length;
  } catch {
    /* empty */
  }

  console.log("\n========================================");
  console.log("✅ Notion data fetch complete!");
  console.log(`   Posts:    ${posts.length}`);
  console.log(`   Projects: ${projects.length}`);
  console.log(`   About:    ${about ? "yes" : "skipped"}`);
  console.log(`   Search:   ${searchIndex.length} entries`);
  console.log(`   Images:   ${imageCount} files`);
  console.log("========================================\n");
}

main().catch((error) => {
  console.error("\n❌ Fetch failed:", error);
  process.exit(1);
});
