import Link from "next/link";
import Image from "next/image";
import { Clock } from "lucide-react";
import type { NotionPost } from "@/types/notion";

interface PostCardProps {
  post: NotionPost;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <article className="glass-card gradient-border group relative overflow-hidden hover:glass-card-hover">
      {post.thumbnail && (
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={post.thumbnail}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}
      <div className="p-5">
        <div className="flex items-center gap-2 text-xs text-text-secondary">
          <time dateTime={post.date}>
            {new Date(post.date).toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
          <span className="flex items-center gap-1">
            <Clock size={12} />
            {post.readingTime}분
          </span>
        </div>
        <h2 className="mt-2 font-display text-lg font-semibold text-text-primary transition-colors group-hover:text-accent line-clamp-2">
          <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0">
            {post.title}
          </Link>
        </h2>
        <p className="mt-2 text-sm text-text-secondary line-clamp-2">
          {post.description}
        </p>
        <div className="relative z-10 mt-3 flex flex-wrap gap-1.5">
          {post.tags.map((tag) => (
            <Link
              key={tag}
              href={`/blog/tags/${tag}`}
              className="rounded-full border border-accent/20 bg-accent/5 px-2.5 py-0.5 text-xs font-medium text-accent transition-colors hover:bg-accent/15"
            >
              {tag}
            </Link>
          ))}
        </div>
      </div>
    </article>
  );
}
