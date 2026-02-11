import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getAllTags, getPostsByTag } from "@/lib/notion";
import PostCard from "@/components/blog/PostCard";

export function generateStaticParams() {
  return getAllTags().map((tag) => ({ tag }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);
  return {
    title: `#${decoded}`,
    description: `${decoded} 태그의 포스트 목록`,
  };
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);
  const posts = getPostsByTag(decoded);

  return (
    <div className="content-width py-12">
      <Link
        href="/blog"
        className="mb-6 inline-flex items-center gap-1 text-sm text-text-secondary transition-colors hover:text-text-primary"
      >
        <ArrowLeft size={14} /> 전체 포스트
      </Link>
      <h1 className="font-display text-3xl font-bold text-text-primary sm:text-4xl">
        #{decoded}
      </h1>
      <p className="mt-2 text-text-secondary">{posts.length}개의 포스트</p>

      {posts.length > 0 ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="mt-16 text-center">
          <p className="text-text-secondary">해당 태그의 포스트가 없습니다.</p>
        </div>
      )}
    </div>
  );
}
