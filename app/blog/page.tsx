import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Clock3, Tag } from 'lucide-react';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { formatBlogDate, mapBlogPostRow } from '@/lib/blog';

export const metadata: Metadata = {
  title: 'Blog | Cocktel4you',
  description: 'Guides, conseils et articles SEO pour reparer, entretenir et acheter votre smartphone a Saint-Jean-de-Luz.',
};

export default async function BlogPage() {
  const supabase = createServerSupabaseClient();

  if (!supabase) {
    return (
      <div className="min-h-screen pt-24">
        <div className="max-w-5xl mx-auto section-padding py-20">
          <div className="rounded-3xl border border-border bg-card p-8">
            <h1 className="text-3xl font-extrabold text-foreground">Configuration Supabase manquante</h1>
            <p className="text-muted-foreground mt-4">
              Ajoute `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY`, puis redemarre le serveur Next.js.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('is_published', true)
    .order('published_at', { ascending: false });

  if (error) {
    return (
      <div className="min-h-screen pt-24">
        <div className="max-w-5xl mx-auto section-padding py-20">
          <div className="rounded-3xl border border-border bg-card p-8">
            <h1 className="text-3xl font-extrabold text-foreground">Blog indisponible</h1>
            <p className="text-muted-foreground mt-4">
              Les articles ne sont pas encore accessibles. Verifie que la table `blog_posts` existe et que des articles sont publies.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const posts = (data ?? []).map((row) => mapBlogPostRow(row));
  const featured = posts[0];
  const remainingPosts = posts.slice(1);

  return (
    <div className="min-h-screen pt-20">
      <section className="bg-gradient-to-br from-brand-green-50 to-background py-16">
        <div className="max-w-6xl mx-auto section-padding">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full bg-card px-4 py-2 text-sm font-semibold text-brand-green-700 border border-brand-green-100">
              Blog SEO connecte a Supabase
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground mt-5">
              Guides smartphone, comparatifs et conseils utiles
            </h1>
            <p className="text-lg text-muted-foreground mt-4">
              Retrouve ici les articles publies depuis l espace admin pour nourrir ton SEO local et repondre aux vraies questions de tes clients.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto section-padding py-12">
        {!featured ? (
          <div className="rounded-3xl border border-dashed border-border p-8 text-muted-foreground">
            Aucun article publie pour le moment. Cree un brouillon depuis l espace admin et active l option de publication.
          </div>
        ) : (
          <>
            <article className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] rounded-3xl border border-border bg-card overflow-hidden">
              <div className="aspect-[16/10] overflow-hidden bg-muted">
                {featured.featuredImageUrl ? (
                  <img
                    src={featured.featuredImageUrl}
                    alt={featured.featuredImageAlt ?? featured.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    Couverture article
                  </div>
                )}
              </div>
              <div className="p-8 flex flex-col justify-center">
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  <span className="inline-flex rounded-full bg-brand-green-50 px-3 py-1 font-semibold text-brand-green-700">
                    {featured.category}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock3 className="w-4 h-4" />
                    {featured.readingTimeMinutes} min
                  </span>
                  <span>{formatBlogDate(featured.publishedAt)}</span>
                </div>
                <h2 className="text-3xl font-extrabold text-foreground mt-5">{featured.title}</h2>
                <p className="text-muted-foreground mt-4 leading-relaxed">{featured.excerpt}</p>
                <div className="flex flex-wrap gap-2 mt-6">
                  {featured.tags.map((tag) => (
                    <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                      <Tag className="w-3 h-3" />
                      {tag}
                    </span>
                  ))}
                </div>
                <Link
                  href={`/blog/${featured.slug}`}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-brand-green-600 mt-8"
                >
                  Lire l article
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </article>

            {remainingPosts.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 mt-8">
                {remainingPosts.map((post) => (
                  <article key={post.id} className="rounded-3xl border border-border bg-card overflow-hidden">
                    <div className="aspect-[16/10] bg-muted overflow-hidden">
                      {post.featuredImageUrl ? (
                        <img
                          src={post.featuredImageUrl}
                          alt={post.featuredImageAlt ?? post.title}
                          className="w-full h-full object-cover"
                        />
                      ) : null}
                    </div>
                    <div className="p-6">
                      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        <span className="inline-flex rounded-full bg-brand-green-50 px-3 py-1 font-semibold text-brand-green-700">
                          {post.category}
                        </span>
                        <span>{post.readingTimeMinutes} min</span>
                      </div>
                      <h3 className="text-lg font-bold text-foreground mt-4">{post.title}</h3>
                      <p className="text-sm text-muted-foreground mt-3 line-clamp-3">{post.excerpt}</p>
                      <div className="text-xs text-muted-foreground mt-4">{formatBlogDate(post.publishedAt)}</div>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-brand-green-600 mt-5"
                      >
                        Ouvrir l article
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            ) : null}
          </>
        )}
      </section>
    </div>
  );
}
