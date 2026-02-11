import type { Metadata } from "next";
import { getAllPosts, getAllTags } from "@/lib/notion";
import PostCard from "@/components/blog/PostCard";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog",
  description: "개발 블로그 포스트 목록",
};

export default function BlogPage() {
  const posts = getAllPosts();
  const tags = getAllTags();

  return (
    <div className="content-width py-12">
      <h1 className="font-display text-3xl font-bold text-text-primary sm:text-4xl">
        Blog
      </h1>
      <p className="mt-2 text-text-secondary">
        {posts.length}개의 포스트
      </p>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Link
              key={tag}
              href={`/blog/tags/${tag}`}
              className="rounded-full border border-border px-3 py-1 text-sm text-text-secondary transition-colors hover:border-accent hover:text-accent"
            >
              {tag}
            </Link>
          ))}
        </div>
      )}

      {/* Posts grid */}
      {posts.length > 0 ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="mt-16 text-center">
          <p className="text-text-secondary">아직 작성된 포스트가 없습니다.</p>
        </div>
      )}
    </div>
  );
}
