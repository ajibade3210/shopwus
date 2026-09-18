import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogArticlePage } from "@/components/blog/blog-article-page";
import { getBlogPostBySlug, getRelatedBlogPosts } from "@/services/api/blog.service";
import type { BlogPostPageProps } from "@/types";

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: "Article Not Found | Shopwus",
    };
  }

  return {
    title: `${post.title} | Shopwus Journal`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
    },
  };
}

export default async function BlogPostRoute({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedBlogPosts(slug, 2);

  return <BlogArticlePage post={post} relatedPosts={relatedPosts} />;
}
