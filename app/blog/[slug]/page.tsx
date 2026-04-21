import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Clock3, Tag } from 'lucide-react';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { formatBlogDate, mapBlogPostRow } from '@/lib/blog';

type PageProps = {
  params: {
    slug: string;
  };
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const supabase = createServerSupabaseClient();

  if (!supabase) {
    return {
      title: 'Configuration Supabase manquante | Cocktel4you',
    };
  }

  const { data } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', params.slug)
    .eq('is_published', true)
    .maybeSingle();

  if (!data) {
    return {
      title: 'Article introuvable | Cocktel4you',
    };
  }

  const post = mapBlogPostRow(data);

  return {
    title: post.seoTitle ?? post.title,
    description: post.seoDescription ?? post.excerpt,
    keywords: post.seoKeywords.length > 0 ? post.seoKeywords.join(', ') : undefined,
    robots: post.metaRobots,
    alternates: post.canonicalUrl
      ? {
          canonical: post.canonicalUrl,
        }
      : undefined,
    openGraph: {
      title: post.ogTitle ?? post.seoTitle ?? post.title,
      description: post.ogDescription ?? post.seoDescription ?? post.excerpt,
      images: post.ogImageUrl || post.featuredImageUrl ? [post.ogImageUrl ?? post.featuredImageUrl ?? ''] : undefined,
      type: 'article',
      publishedTime: post.publishedAt ?? undefined,
    },
  };
}

export default async function BlogArticlePage({ params }: PageProps) {
  const supabase = createServerSupabaseClient();

  if (!supabase) {
    return (
      <div className="min-h-screen pt-24">
        <div className="max-w-4xl mx-auto section-padding py-20">
          <div className="rounded-3xl border border-border bg-card p-8">
            <h1 className="text-3xl font-extrabold text-foreground">Configuration Supabase manquante</h1>
            <p className="text-muted-foreground mt-4">
              Le blog ne peut pas charger les articles tant que les variables d environnement Supabase ne sont pas lues par Next.js.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const { data } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', params.slug)
    .eq('is_published', true)
    .maybeSingle();

  if (!data) {
    return (
      <div className="min-h-screen pt-24">
        <div className="max-w-4xl mx-auto section-padding py-20">
          <div className="rounded-3xl border border-border bg-card p-8">
            <h1 className="text-3xl font-extrabold text-foreground">Article introuvable</h1>
            <p className="text-muted-foreground mt-4">
              Cet article n existe pas encore ou n est pas publie.
            </p>
            <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-green-600 mt-6">
              <ArrowLeft className="w-4 h-4" />
              Retour au blog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const post = mapBlogPostRow(data);
  const paragraphs = post.content.split(/\n{2,}/).map((item) => item.trim()).filter(Boolean);

  return (
    <div className="min-h-screen pt-20">
      <article className="max-w-4xl mx-auto section-padding py-12">
        <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-green-600">
          <ArrowLeft className="w-4 h-4" />
          Retour au blog
        </Link>

        <div className="mt-8">
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span className="inline-flex rounded-full bg-brand-green-50 px-3 py-1 font-semibold text-brand-green-700">
              {post.category}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock3 className="w-4 h-4" />
              {post.readingTimeMinutes} min
            </span>
            <span>{formatBlogDate(post.publishedAt)}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground mt-5 leading-tight">{post.title}</h1>
          <p className="text-lg text-muted-foreground mt-5 leading-relaxed">{post.excerpt}</p>
        </div>

        {post.featuredImageUrl ? (
          <div className="mt-10 rounded-3xl overflow-hidden border border-border">
            <img
              src={post.featuredImageUrl}
              alt={post.featuredImageAlt ?? post.title}
              className="w-full aspect-[16/9] object-cover"
            />
          </div>
        ) : null}

        <div className="flex flex-wrap gap-2 mt-8">
          {post.tags.map((tag) => (
            <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
              <Tag className="w-3 h-3" />
              {tag}
            </span>
          ))}
        </div>

        <div className="prose prose-slate max-w-none mt-10">
          {paragraphs.map((paragraph) => (
            <p key={paragraph} className="text-base leading-8 text-foreground mb-6">
              {paragraph}
            </p>
          ))}
        </div>
      </article>
    </div>
  );
}
