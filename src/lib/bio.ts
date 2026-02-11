import * as fs from "fs";
import * as path from "path";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";

function preprocessMarkdown(md: string): string {
  // CommonMark spec: closing ** must be right-flanking, requiring
  // whitespace or punctuation after it. CJK chars are neither,
  // so **text**한글 fails. Convert to <strong> HTML.
  return md.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
}

function markdownToHtml(markdown: string): string {
  const result = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .processSync(preprocessMarkdown(markdown));
  return String(result);
}

function loadMarkdown(filename: string): string | null {
  try {
    const filePath = path.join(process.cwd(), "content", filename);
    return fs.readFileSync(filePath, "utf-8");
  } catch {
    return null;
  }
}

export function getBio(): { ko: string; en: string } | null {
  const koMd = loadMarkdown("bio.md");
  const enMd = loadMarkdown("bio-en.md");

  if (!koMd && !enMd) return null;

  return {
    ko: koMd ? markdownToHtml(koMd) : "",
    en: enMd ? markdownToHtml(enMd) : "",
  };
}
