export type BlogCategory = "growth" | "branding" | "finance" | "operations";

export type BlogGraphicType = "retention_flywheel" | "whatsapp_vs_atelier" | "shoebox_vs_dashboard";

export interface BlogAuthor {
  name: string;
  role: string;
  avatarText: string;
}

export interface BlogKeyTakeaway {
  title: string;
  description: string;
}

export interface BlogSection {
  heading: string;
  body: string[];
  graphic?: BlogGraphicType;
  tipBox?: string;
  quote?: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  subtitle: string;
  category: BlogCategory;
  categoryLabel: string;
  publishedDate: string;
  readTimeMinutes: number;
  author: BlogAuthor;
  coverGraphic: BlogGraphicType;
  excerpt: string;
  keyBenefit: string;
  takeaways: BlogKeyTakeaway[];
  sections: BlogSection[];
  callToAction: {
    title: string;
    description: string;
    buttonLabel: string;
    buttonHref: string;
  };
}

export interface BlogListingPageProps {
  posts?: BlogPost[];
}

export interface BlogArticlePageProps {
  post: BlogPost;
  relatedPosts?: BlogPost[];
}

export interface BlogGraphicCardProps {
  type: BlogGraphicType;
  className?: string;
}

export interface ResourcesDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onToggle: () => void;
}

export interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export interface BlogGraphicProps {
  className?: string;
}
