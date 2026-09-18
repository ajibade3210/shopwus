"use client";

import { ArrowLeft, ArrowRight, Clock } from "lucide-react";
import { useState } from "react";
import { SiteFooter } from "@/components/landing/site-footer";
import { BrandLogo } from "@/components/shared/brand-logo";
import { BLOG_CATEGORIES, BLOG_POSTS } from "@/constants/blog";
import { BlogGraphicCard } from "./blog-graphics";

export function BlogListingPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredPosts =
    selectedCategory === "all"
      ? BLOG_POSTS
      : BLOG_POSTS.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      {/* Top Header Navigation */}
      <header className="border-b border-border-hairline bg-surface/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-muted hover:text-on-surface transition-colors"
            >
              <ArrowLeft size={14} />
              <span>Back to Home</span>
            </a>
            <span className="text-border-hairline hidden sm:inline">|</span>
            <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-text-muted">
              <span>Resources</span>
              <span>/</span>
              <span className="text-on-surface font-bold">Blog</span>
            </div>
          </div>

          <BrandLogo className="public-logo" />

          <div className="flex items-center gap-3">
            <a
              href="/valuation-calculator"
              className="text-xs font-semibold text-primary hover:underline hidden sm:inline"
            >
              Valuation Calculator
            </a>
            <a
              href="/signup"
              className="bg-primary hover:bg-primary-hover text-white px-3.5 py-2 rounded-xl text-xs font-semibold hover:shadow-xs transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <span>Start Free Trial</span>
              <ArrowRight size={13} />
            </a>
          </div>
        </div>
      </header>

      {/* Hero Header */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10 sm:space-y-12">
        <section className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-tertiary-container text-on-tertiary-container border border-tertiary/20">
            <span>Illustrated Series</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-on-surface tracking-tight leading-tight">
            Visual Insights for High-Growth Vendors & Businesses
          </h1>
          <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed">
            Graphic breakdowns on customer retention, digital brand equity, and audit-ready
            financial architecture to maximize your business value.
          </p>

          {/* Category Filter Pills */}
          <div className="pt-3 flex flex-wrap items-center justify-center gap-2">
            {BLOG_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? "bg-primary text-white shadow-xs"
                    : "bg-card border border-border-hairline text-on-surface hover:border-primary/40"
                }`}
              >
                {cat.label} ({cat.count})
              </button>
            ))}
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {filteredPosts.map(post => (
            <article
              key={post.slug}
              className="bg-card border border-border-hairline rounded-2xl overflow-hidden shadow-card hover:border-primary/50 hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Cartoon Graphic Hero Thumbnail */}
                <div className="border-b border-border-hairline overflow-hidden bg-surface-container-low">
                  <BlogGraphicCard
                    type={post.coverGraphic}
                    className="border-none rounded-none p-4 scale-95 group-hover:scale-100 transition-transform duration-300"
                  />
                </div>

                {/* Article Content */}
                <div className="p-6 space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-text-muted">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full font-bold uppercase tracking-wider text-[9px] bg-surface-container-lowest border border-border-hairline text-primary">
                      {post.categoryLabel}
                    </span>
                    <div className="flex items-center gap-1 font-medium">
                      <Clock size={12} />
                      <span>{post.readTimeMinutes} min read</span>
                    </div>
                  </div>

                  <h2 className="text-lg font-bold text-on-surface group-hover:text-primary transition-colors leading-snug">
                    <a href={`/blog/${post.slug}`}>{post.title}</a>
                  </h2>

                  <p className="text-xs text-on-surface-variant line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>

                  <div className="pt-2 border-t border-border-hairline flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-secondary text-white text-[10px] font-bold flex items-center justify-center">
                      {post.author.avatarText}
                    </div>
                    <div className="text-[11px]">
                      <span className="font-bold text-on-surface block">{post.author.name}</span>
                      <span className="text-text-muted block text-[10px]">{post.author.role}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer Link */}
              <div className="px-6 pb-6 pt-0">
                <a
                  href={`/blog/${post.slug}`}
                  className="w-full bg-surface-container-lowest hover:bg-primary hover:text-white text-on-surface border border-border-hairline hover:border-primary py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Read Illustrated Guide</span>
                  <ArrowRight size={13} />
                </a>
              </div>
            </article>
          ))}
        </section>

        {/* Featured Valuation Tool Box */}
        <section className="bg-surface-container-low border border-border-hairline rounded-3xl p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl text-center sm:text-left">
            <h3 className="text-2xl font-bold text-on-surface">
              Want to see what your business is worth right now?
            </h3>
          </div>
          <a
            href="/valuation-calculator"
            className="bg-primary hover:bg-primary-hover text-white px-6 py-3.5 rounded-xl text-xs font-semibold hover:shadow-xs transition-all flex items-center gap-2 shrink-0 shadow-xs cursor-pointer"
          >
            <span>Launch Free Valuation Calculator</span>
            <ArrowRight size={14} />
          </a>
        </section>
      </main>

      {/* Footer */}
      <SiteFooter />
    </div>
  );
}
