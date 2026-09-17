"use client";

import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, Clock, Sparkles } from "lucide-react";
import { SiteFooter } from "@/components/landing/site-footer";
import { BrandLogo } from "@/components/shared/brand-logo";
import type { BlogArticlePageProps } from "@/types";
import { BlogGraphicCard } from "./blog-graphics";

export function BlogArticlePage({ post, relatedPosts = [] }: BlogArticlePageProps) {
  return (
    <div className="min-h-screen bg-surface text-on-surface">
      {/* Top Header Navigation */}
      <header className="border-b border-border-hairline bg-surface/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a
              href="/blog"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-muted hover:text-on-surface transition-colors"
            >
              <ArrowLeft size={14} />
              <span>Back to Blog</span>
            </a>
            <span className="text-border-hairline hidden sm:inline">|</span>
            <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-text-muted">
              <span>Blog</span>
              <span>/</span>
              <span className="text-on-surface font-bold truncate max-w-[200px]">{post.title}</span>
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

      {/* Article Content Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
        {/* Article Header Meta */}
        <div className="space-y-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-surface-container-lowest border border-border-hairline text-primary">
            <BookOpen size={13} />
            <span>{post.categoryLabel}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold text-on-surface tracking-tight leading-tight">
            {post.title}
          </h1>

          <p className="text-base sm:text-lg text-on-surface-variant leading-relaxed max-w-2xl mx-auto">
            {post.subtitle}
          </p>

          <div className="pt-3 flex items-center justify-center gap-4 text-xs text-text-muted border-t border-border-hairline max-w-md mx-auto">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-secondary text-white text-[10px] font-bold flex items-center justify-center">
                {post.author.avatarText}
              </div>
              <div className="text-left">
                <span className="font-bold text-on-surface block">{post.author.name}</span>
                <span className="text-[10px] text-text-muted">{post.author.role}</span>
              </div>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Clock size={13} />
              <span>{post.readTimeMinutes} min read</span>
            </div>
          </div>
        </div>

        {/* Hero Cartoon Graphic */}
        <div className="shadow-xs rounded-2xl overflow-hidden">
          <BlogGraphicCard type={post.coverGraphic} />
        </div>

        {/* Key Takeaways Highlight Box */}
        <div className="bg-surface-container-low border border-border-hairline rounded-2xl p-6 sm:p-7 space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-primary" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-on-surface">
              Key Executive Takeaways
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            {post.takeaways.map((t, idx) => (
              <div key={idx} className="bg-card border border-border-hairline rounded-xl p-4 space-y-1">
                <h3 className="text-xs font-bold text-on-surface flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-tertiary shrink-0" />
                  <span>{t.title}</span>
                </h3>
                <p className="text-[11px] text-on-surface-variant leading-relaxed">{t.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Editorial Body Sections */}
        <div className="space-y-8 text-sm sm:text-base text-on-surface leading-relaxed">
          {post.sections.map((sec, sIdx) => (
            <section key={sIdx} className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-on-surface pt-2">
                {sec.heading}
              </h2>

              {sec.body.map((paragraph, pIdx) => (
                <p key={pIdx} className="leading-relaxed">
                  {paragraph}
                </p>
              ))}

              {/* Optional Inline Cartoon Graphic */}
              {sec.graphic && sec.graphic !== post.coverGraphic && (
                <div className="py-2">
                  <BlogGraphicCard type={sec.graphic} />
                </div>
              )}

              {/* Optional Tip Box */}
              {sec.tipBox && (
                <div className="bg-tertiary-container border border-tertiary/20 rounded-xl p-4 text-xs sm:text-sm text-on-tertiary-container space-y-1">
                  <span className="font-bold uppercase tracking-wider text-[10px] text-tertiary block">
                    Strategic Multiple Fact:
                  </span>
                  <p>{sec.tipBox}</p>
                </div>
              )}

              {/* Optional Pull Quote */}
              {sec.quote && (
                <div className="border-l-2 border-primary pl-4 py-2 my-4 italic text-base text-on-surface bg-surface-container-low rounded-r-xl pr-4">
                  "{sec.quote}"
                </div>
              )}
            </section>
          ))}
        </div>

        {/* Interactive Bottom CTA Box */}
        <div className="bg-surface-container-low border border-border-hairline rounded-3xl p-8 sm:p-10 text-on-surface space-y-4 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-lg">
            <h3 className="text-xl sm:text-2xl font-bold text-on-surface">
              {post.callToAction.title}
            </h3>
          </div>
          <a
            href={post.callToAction.buttonHref}
            className="bg-primary hover:bg-primary-hover text-white px-6 py-3.5 rounded-xl text-xs font-semibold hover:shadow-xs transition-all flex items-center gap-2 shrink-0 shadow-xs cursor-pointer"
          >
            <span>{post.callToAction.buttonLabel}</span>
            <ArrowRight size={14} />
          </a>
        </div>

        {/* Related Articles */}
        {relatedPosts.length > 0 && (
          <div className="border-t border-border-hairline pt-10 space-y-4">
            <h3 className="text-lg font-bold text-on-surface">
              Related Illustrated Guides
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relatedPosts.map(rel => (
                <a
                  key={rel.slug}
                  href={`/blog/${rel.slug}`}
                  className="bg-card border border-border-hairline hover:border-primary/40 p-5 rounded-2xl transition-all block group"
                >
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary block">
                    {rel.categoryLabel}
                  </span>
                  <h4 className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors mt-1">
                    {rel.title}
                  </h4>
                  <p className="text-xs text-on-surface-variant line-clamp-2 mt-1">{rel.excerpt}</p>
                </a>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <SiteFooter />
    </div>
  );
}
