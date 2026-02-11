import * as fs from "fs";
import * as path from "path";
import type {
  NotionPost,
  NotionProject,
  NotionAbout,
  SearchIndexItem,
} from "@/types/notion";

const DATA_DIR = path.join(process.cwd(), ".notion-data");

function loadJsonFile<T>(filename: string, fallback: T): T {
  try {
    const filePath = path.join(DATA_DIR, filename);
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    console.warn(
      `[notion] Could not load ${filename}. Run "npm run fetch" first.`
    );
    return fallback;
  }
}

// ── Posts ──

export function getAllPosts(): NotionPost[] {
  return loadJsonFile<NotionPost[]>("posts.json", []);
}

export function getPostBySlug(slug: string): NotionPost | undefined {
  return getAllPosts().find((post) => post.slug === slug);
}

export function getAllTags(): string[] {
  const tagSet = new Set<string>();
  for (const post of getAllPosts()) {
    for (const tag of post.tags) {
      tagSet.add(tag);
    }
  }
  return [...tagSet].sort();
}

export function getPostsByTag(tag: string): NotionPost[] {
  return getAllPosts().filter((post) => post.tags.includes(tag));
}

// ── Projects ──

export function getAllProjects(): NotionProject[] {
  return loadJsonFile<NotionProject[]>("projects.json", []);
}

export function getFeaturedProjects(): NotionProject[] {
  return getAllProjects()
    .filter((p) => p.featured)
    .sort((a, b) => a.order - b.order);
}

// ── About ──

export function getAbout(): NotionAbout | null {
  return loadJsonFile<NotionAbout | null>("about.json", null);
}

// ── Search ──

export function getSearchIndex(): SearchIndexItem[] {
  return loadJsonFile<SearchIndexItem[]>("search-index.json", []);
}
