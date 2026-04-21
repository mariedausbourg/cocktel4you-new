export type BlogPostRow = {
  id: string;
  author_id: string | null;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  featured_image_path: string | null;
  featured_image_url: string | null;
  featured_image_alt: string | null;
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string[];
  focus_keyword: string | null;
  canonical_url: string | null;
  og_title: string | null;
  og_description: string | null;
  og_image_url: string | null;
  meta_robots: string;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type BlogPostInput = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  featuredImagePath?: string | null;
  featuredImageUrl?: string | null;
  featuredImageAlt?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  seoKeywords?: string[];
  focusKeyword?: string | null;
  canonicalUrl?: string | null;
  ogTitle?: string | null;
  ogDescription?: string | null;
  ogImageUrl?: string | null;
  metaRobots?: string | null;
  isPublished?: boolean;
};

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  featuredImagePath: string | null;
  featuredImageUrl: string | null;
  featuredImageAlt: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string[];
  focusKeyword: string | null;
  canonicalUrl: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  ogImageUrl: string | null;
  metaRobots: string;
  isPublished: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  readingTimeMinutes: number;
};

export type BlogPostFormValues = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string;
  featuredImageAlt: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  focusKeyword: string;
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImageUrl: string;
  metaRobots: string;
  isPublished: boolean;
};

export const defaultBlogPostFormValues: BlogPostFormValues = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  category: 'Conseils',
  tags: '',
  featuredImageAlt: '',
  seoTitle: '',
  seoDescription: '',
  seoKeywords: '',
  focusKeyword: '',
  canonicalUrl: '',
  ogTitle: '',
  ogDescription: '',
  ogImageUrl: '',
  metaRobots: 'index,follow',
  isPublished: false,
};

export function createSlug(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

export function splitCommaSeparatedValues(value: string) {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

export function estimateReadingTime(content: string) {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
}

export function formatBlogDate(value: string | null) {
  if (!value) return 'Brouillon';

  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(value));
}

export function mapBlogPostRow(row: BlogPostRow): BlogPost {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    content: row.content,
    category: row.category,
    tags: row.tags ?? [],
    featuredImagePath: row.featured_image_path,
    featuredImageUrl: row.featured_image_url,
    featuredImageAlt: row.featured_image_alt,
    seoTitle: row.seo_title,
    seoDescription: row.seo_description,
    seoKeywords: row.seo_keywords ?? [],
    focusKeyword: row.focus_keyword,
    canonicalUrl: row.canonical_url,
    ogTitle: row.og_title,
    ogDescription: row.og_description,
    ogImageUrl: row.og_image_url,
    metaRobots: row.meta_robots,
    isPublished: row.is_published,
    publishedAt: row.published_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    readingTimeMinutes: estimateReadingTime(row.content),
  };
}

export function buildBlogPayload(values: BlogPostFormValues, image?: { path: string | null; url: string | null }): BlogPostInput {
  return {
    title: values.title.trim(),
    slug: createSlug(values.slug || values.title),
    excerpt: values.excerpt.trim(),
    content: values.content.trim(),
    category: values.category.trim() || 'Conseils',
    tags: splitCommaSeparatedValues(values.tags),
    featuredImageAlt: values.featuredImageAlt.trim() || null,
    featuredImagePath: image?.path ?? null,
    featuredImageUrl: image?.url ?? null,
    seoTitle: values.seoTitle.trim() || null,
    seoDescription: values.seoDescription.trim() || null,
    seoKeywords: splitCommaSeparatedValues(values.seoKeywords),
    focusKeyword: values.focusKeyword.trim() || null,
    canonicalUrl: values.canonicalUrl.trim() || null,
    ogTitle: values.ogTitle.trim() || null,
    ogDescription: values.ogDescription.trim() || null,
    ogImageUrl: values.ogImageUrl.trim() || image?.url || null,
    metaRobots: values.metaRobots.trim() || 'index,follow',
    isPublished: values.isPublished,
  };
}

export function mapPostToFormValues(post: BlogPost): BlogPostFormValues {
  return {
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    category: post.category,
    tags: post.tags.join(', '),
    featuredImageAlt: post.featuredImageAlt ?? '',
    seoTitle: post.seoTitle ?? '',
    seoDescription: post.seoDescription ?? '',
    seoKeywords: post.seoKeywords.join(', '),
    focusKeyword: post.focusKeyword ?? '',
    canonicalUrl: post.canonicalUrl ?? '',
    ogTitle: post.ogTitle ?? '',
    ogDescription: post.ogDescription ?? '',
    ogImageUrl: post.ogImageUrl ?? '',
    metaRobots: post.metaRobots,
    isPublished: post.isPublished,
  };
}
