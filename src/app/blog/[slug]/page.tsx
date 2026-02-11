import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Clock, Calendar } from "lucide-react";
import Link from "next/link";
import { getAllPosts, getPostBySlug } from "@/lib/notion";
import TableOfContents from "@/components/blog/TableOfContents";
import PostNavigation from "@/components/blog/PostNavigation";
import CodeBlockEnhancer from "@/components/ui/CodeBlockEnhancer";

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Not Found" };

  return {
    title: post.title,
    description: post.description,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const allPosts = getAllPosts();
  const currentIndex = allPosts.findIndex((p) => p.slug === slug);
  const prevPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;
  const nextPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;

  return (
    <div className="content-width py-12">
      <div className="lg:flex lg:gap-10">
        {/* Main content */}
        <article className="min-w-0 flex-1">
          {/* Header */}
          <header>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/blog/tags/${tag}`}
                  className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent"
                >
                  {tag}
                </Link>
              ))}
            </div>
            <h1 className="mt-4 font-display text-3xl font-bold text-text-primary sm:text-4xl">
              {post.title}
            </h1>
            <p className="mt-3 text-text-secondary">{post.description}</p>
            <div className="mt-4 flex items-center gap-4 text-sm text-text-secondary">
              <span className="flex items-center gap-1">
                <Calendar size={14} />
                {new Date(post.date).toLocaleDateString("ko-KR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={14} />
                {post.readingTime}분
              </span>
            </div>
          </header>

          {/* Body */}
          <CodeBlockEnhancer html={post.contentHtml} className="mt-10" />

          {/* Navigation */}
          <PostNavigation prevPost={prevPost} nextPost={nextPost} />
        </article>

        {/* Sidebar TOC */}
        {post.toc.length > 0 && (
          <aside className="hidden w-60 shrink-0 lg:block">
            <div className="sticky top-20">
              <TableOfContents toc={post.toc} />
            </div>
          </aside>
        )}
      </div>

      {/* Mobile TOC */}
      <div className="lg:hidden">
        <TableOfContents toc={post.toc} />
      </div>
    </div>
  );
}
