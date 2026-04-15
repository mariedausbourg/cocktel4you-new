import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { mapBlogPostRow } from '@/lib/blog';
import { requireAdmin } from '@/lib/admin-auth';

const blogPayloadSchema = z.object({
  title: z.string().min(3),
  slug: z.string().min(3),
  excerpt: z.string().min(20),
  content: z.string().min(50),
  category: z.string().min(2),
  tags: z.array(z.string()).default([]),
  featuredImagePath: z.string().nullable().optional(),
  featuredImageUrl: z.string().url().nullable().optional(),
  featuredImageAlt: z.string().nullable().optional(),
  seoTitle: z.string().nullable().optional(),
  seoDescription: z.string().nullable().optional(),
  seoKeywords: z.array(z.string()).default([]),
  focusKeyword: z.string().nullable().optional(),
  canonicalUrl: z.string().url().nullable().optional(),
  ogTitle: z.string().nullable().optional(),
  ogDescription: z.string().nullable().optional(),
  ogImageUrl: z.string().url().nullable().optional(),
  metaRobots: z.string().nullable().optional(),
  isPublished: z.boolean().default(false),
});

export async function GET(request: NextRequest) {
  try {
    const { supabase } = await requireAdmin(request);
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({
      posts: (data ?? []).map((row) => mapBlogPostRow(row)),
    });
  } catch (error) {
    return handleAdminError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { supabase, user } = await requireAdmin(request);
    const payload = blogPayloadSchema.parse(await request.json());
    const { data, error } = await supabase
      .from('blog_posts')
      .insert({
        author_id: user.id,
        title: payload.title,
        slug: payload.slug,
        excerpt: payload.excerpt,
        content: payload.content,
        category: payload.category,
        tags: payload.tags,
        featured_image_path: payload.featuredImagePath ?? null,
        featured_image_url: payload.featuredImageUrl ?? null,
        featured_image_alt: payload.featuredImageAlt ?? null,
        seo_title: payload.seoTitle ?? null,
        seo_description: payload.seoDescription ?? null,
        seo_keywords: payload.seoKeywords,
        focus_keyword: payload.focusKeyword ?? null,
        canonical_url: payload.canonicalUrl ?? null,
        og_title: payload.ogTitle ?? null,
        og_description: payload.ogDescription ?? null,
        og_image_url: payload.ogImageUrl ?? payload.featuredImageUrl ?? null,
        meta_robots: payload.metaRobots ?? 'index,follow',
        is_published: payload.isPublished,
      })
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ post: mapBlogPostRow(data) }, { status: 201 });
  } catch (error) {
    return handleAdminError(error);
  }
}

function handleAdminError(error: unknown) {
  if (error instanceof Error) {
    if (error.message === 'SUPABASE_NOT_CONFIGURED') {
      return NextResponse.json({ error: 'Supabase n est pas configure sur cet environnement.' }, { status: 500 });
    }

    if (error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Session admin invalide.' }, { status: 401 });
    }

    if (error.message === 'FORBIDDEN') {
      return NextResponse.json({ error: 'Ce compte n est pas autorise a gerer le blog.' }, { status: 403 });
    }

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Le formulaire blog est incomplet.' }, { status: 400 });
    }
  }

  return NextResponse.json({ error: 'Impossible de charger ou creer les articles.' }, { status: 500 });
}
