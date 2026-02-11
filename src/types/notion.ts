export interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

export interface NotionPost {
  id: string;
  slug: string;
  title: string;
  description: string;
  date: string;
  updatedAt: string | null;
  tags: string[];
  thumbnail: string | null;
  readingTime: number;
  contentHtml: string;
  toc: TocItem[];
}

export interface NotionProject {
  id: string;
  name: string;
  description: string;
  techStack: string[];
  githubUrl: string | null;
  demoUrl: string | null;
  thumbnail: string | null;
  featured: boolean;
  order: number;
}

export interface NotionAbout {
  id: string;
  contentHtml: string;
  contentHtmlEn: string | null;
  lastEdited: string;
}

export interface SearchIndexItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  plainText: string;
  date: string;
  tags: string[];
}
