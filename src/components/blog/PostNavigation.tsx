import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { NotionPost } from "@/types/notion";

interface PostNavigationProps {
  prevPost: NotionPost | null;
  nextPost: NotionPost | null;
}

export default function PostNavigation({
  prevPost,
  nextPost,
}: PostNavigationProps) {
  if (!prevPost && !nextPost) return null;

  return (
    <nav className="mt-12 flex gap-4 border-t border-border pt-8">
      {prevPost ? (
        <Link
          href={`/blog/${prevPost.slug}`}
          className="glass flex-1 p-4 transition-shadow hover:shadow-lg"
        >
          <span className="flex items-center gap-1 text-xs text-text-secondary">
            <ChevronLeft size={14} /> 이전 글
          </span>
          <p className="mt-1 text-sm font-medium text-text-primary line-clamp-1">
            {prevPost.title}
          </p>
        </Link>
      ) : (
        <div className="flex-1" />
      )}
      {nextPost ? (
        <Link
          href={`/blog/${nextPost.slug}`}
          className="glass flex-1 p-4 text-right transition-shadow hover:shadow-lg"
        >
          <span className="flex items-center justify-end gap-1 text-xs text-text-secondary">
            다음 글 <ChevronRight size={14} />
          </span>
          <p className="mt-1 text-sm font-medium text-text-primary line-clamp-1">
            {nextPost.title}
          </p>
        </Link>
      ) : (
        <div className="flex-1" />
      )}
    </nav>
  );
}
