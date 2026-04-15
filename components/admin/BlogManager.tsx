'use client';

import type { FormEvent } from 'react';
import { useEffect, useMemo, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { CheckCircle2, FileText, ImagePlus, Loader2, LogOut, PencilLine, Plus, ShieldCheck, Trash2 } from 'lucide-react';
import {
  BlogPost,
  BlogPostFormValues,
  buildBlogPayload,
  createSlug,
  defaultBlogPostFormValues,
  formatBlogDate,
  mapPostToFormValues,
} from '@/lib/blog';
import { getSupabaseBrowserClient } from '@/lib/supabase/browser';

type UploadState = {
  file: File | null;
  previewUrl: string | null;
  existingPath: string | null;
  existingUrl: string | null;
};

const initialUploadState: UploadState = {
  file: null,
  previewUrl: null,
  existingPath: null,
  existingUrl: null,
};

export default function BlogManager() {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [session, setSession] = useState<Session | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authMessage, setAuthMessage] = useState<string | null>(null);
  const [loadingSession, setLoadingSession] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [savingPost, setSavingPost] = useState(false);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<BlogPostFormValues>(defaultBlogPostFormValues);
  const [uploadState, setUploadState] = useState<UploadState>(initialUploadState);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [manualSlug, setManualSlug] = useState(false);

  useEffect(() => {
    if (!supabase) {
      setLoadingSession(false);
      return;
    }

    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      setLoadingSession(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setLoadingSession(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  useEffect(() => {
    if (!formValues.title || manualSlug) return;

    setFormValues((current) => ({
      ...current,
      slug: createSlug(current.title),
    }));
  }, [formValues.title, manualSlug]);

  useEffect(() => {
    if (!session?.access_token) {
      setPosts([]);
      return;
    }

    void loadPosts(session.access_token);
  }, [session]);

  async function loadPosts(accessToken: string) {
    setLoadingPosts(true);
    setStatusMessage(null);

    try {
      const response = await fetch('/api/admin/blog-posts', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error ?? 'Impossible de charger les articles.');
      }

      setPosts(payload.posts ?? []);
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : 'Impossible de charger les articles.');
    } finally {
      setLoadingPosts(false);
    }
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAuthMessage(null);
    if (!supabase) return;

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setAuthMessage(error.message);
      return;
    }

    setEmail('');
    setPassword('');
  }

  async function handleLogout() {
    if (!supabase) return;
    await supabase.auth.signOut();
    resetEditor();
  }

  function resetEditor() {
    setSelectedPostId(null);
    setFormValues(defaultBlogPostFormValues);
    setUploadState(initialUploadState);
    setStatusMessage(null);
    setManualSlug(false);
  }

  function startEditing(post: BlogPost) {
    setSelectedPostId(post.id);
    setFormValues(mapPostToFormValues(post));
    setUploadState({
      file: null,
      previewUrl: post.featuredImageUrl,
      existingPath: post.featuredImagePath,
      existingUrl: post.featuredImageUrl,
    });
    setManualSlug(true);
    setStatusMessage(null);
  }

  async function handleImageSelection(file: File | null) {
    if (!file) return;

    try {
      const converted = await convertImageToWebP(file);
      const previewUrl = URL.createObjectURL(converted);

      setUploadState((current) => {
        if (current.previewUrl && current.previewUrl.startsWith('blob:')) {
          URL.revokeObjectURL(current.previewUrl);
        }

        return {
          ...current,
          file: converted,
          previewUrl,
        };
      });
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : 'Conversion WebP impossible.');
    }
  }

  async function uploadCoverIfNeeded(accessToken: string) {
    if (!uploadState.file) {
      return {
        path: uploadState.existingPath,
        url: uploadState.existingUrl,
      };
    }

    const formData = new FormData();
    formData.append('file', uploadState.file);

    const response = await fetch('/api/admin/blog-images', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    });
    const payload = await response.json();

    if (!response.ok) {
      throw new Error(payload.error ?? 'Upload impossible.');
    }

    return {
      path: payload.path as string,
      url: payload.url as string,
    };
  }

  async function handleSavePost(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!session?.access_token) {
      setStatusMessage('Reconnecte-toi pour enregistrer un article.');
      return;
    }

    setSavingPost(true);
    setStatusMessage(null);

    try {
      const image = await uploadCoverIfNeeded(session.access_token);
      const payload = {
        ...buildBlogPayload(formValues, image),
        previousFeaturedImagePath: uploadState.existingPath,
      };
      const endpoint = selectedPostId
        ? `/api/admin/blog-posts/${selectedPostId}`
        : '/api/admin/blog-posts';
      const method = selectedPostId ? 'PUT' : 'POST';
      const response = await fetch(endpoint, {
        method,
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const body = await response.json();

      if (!response.ok) {
        throw new Error(body.error ?? 'Enregistrement impossible.');
      }

      const post = body.post as BlogPost;
      setPosts((current) => {
        const nextPosts = selectedPostId
          ? current.map((item) => (item.id === post.id ? post : item))
          : [post, ...current];

        return nextPosts.sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
      });
      setStatusMessage(selectedPostId ? 'Article mis a jour.' : 'Article cree.');
      startEditing(post);
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : 'Enregistrement impossible.');
    } finally {
      setSavingPost(false);
    }
  }

  async function handleDeletePost(post: BlogPost) {
    if (!session?.access_token) {
      return;
    }

    const confirmed = window.confirm(`Supprimer l article "${post.title}" ?`);

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/blog-posts/${post.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });
      const body = await response.json();

      if (!response.ok) {
        throw new Error(body.error ?? 'Suppression impossible.');
      }

      setPosts((current) => current.filter((item) => item.id !== post.id));

      if (selectedPostId === post.id) {
        resetEditor();
      }

      setStatusMessage('Article supprime.');
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : 'Suppression impossible.');
    }
  }

  if (loadingSession) {
    return (
      <section className="bg-card rounded-3xl border border-border p-6 md:p-8">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin" />
          Verification de la session admin...
        </div>
      </section>
    );
  }

  if (!supabase) {
    return (
      <section className="bg-card rounded-3xl border border-border p-6 md:p-8">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-extrabold text-foreground">Supabase non configure</h2>
          <p className="text-muted-foreground mt-3">
            Ajoute `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` et `SUPABASE_SERVICE_ROLE_KEY` dans `.env.local`,
            puis redemarre `npm run dev`.
          </p>
        </div>
      </section>
    );
  }

  if (!session) {
    return (
      <section className="bg-card rounded-3xl border border-border p-6 md:p-8">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-green-50 px-4 py-2 text-sm font-semibold text-brand-green-700">
            <ShieldCheck className="w-4 h-4" />
            Connexion admin Supabase
          </div>
          <h2 className="text-2xl font-extrabold text-foreground mt-5">Pilote ton blog depuis le compte admin</h2>
          <p className="text-muted-foreground mt-3">
            Connecte-toi avec ton utilisateur Supabase Auth. Une fois connecte, seuls les comptes presentes dans
            `admin_profiles` peuvent publier et modifier les articles.
          </p>

          <form onSubmit={handleLogin} className="grid gap-4 mt-8">
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Email admin"
              className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-green-500"
              required
            />
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Mot de passe"
              className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-green-500"
              required
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-2xl bg-brand-green-500 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-green-600"
            >
              Se connecter
            </button>
          </form>

          {authMessage ? <p className="text-sm text-red-600 mt-4">{authMessage}</p> : null}

          <div className="rounded-2xl border border-dashed border-border bg-muted/40 p-4 mt-6 text-sm text-muted-foreground">
            Pense a rattacher ton utilisateur auth a la table `admin_profiles`. La fonction SQL `bootstrap_admin_profile`
            a ete creee pour t aider a promouvoir ton compte en owner.
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-card rounded-3xl border border-border p-6 md:p-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between mb-8">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-green-50 px-4 py-2 text-sm font-semibold text-brand-green-700">
            <FileText className="w-4 h-4" />
            Blog SEO pilote par Supabase
          </div>
          <h2 className="text-2xl font-extrabold text-foreground mt-5">Creation, edition et suppression d articles</h2>
          <p className="text-muted-foreground mt-3 max-w-3xl">
            Chaque article gere son slug, sa meta description, ses mots-cles, ses balises Open Graph et sa couverture.
            Les images deposees ici sont converties en WebP avant upload dans le bucket public `blog-covers`.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="rounded-2xl border border-border px-4 py-3 text-sm">
            Connecte en tant que <span className="font-semibold text-foreground">{session.user.email}</span>
          </div>
          <button
            type="button"
            onClick={resetEditor}
            className="inline-flex items-center gap-2 rounded-2xl border border-border px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:border-brand-green-500"
          >
            <Plus className="w-4 h-4" />
            Nouvel article
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-2xl border border-border px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:border-red-400 hover:text-red-600"
          >
            <LogOut className="w-4 h-4" />
            Deconnexion
          </button>
        </div>
      </div>

      <div className="grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-foreground">Articles existants</h3>
            {loadingPosts ? <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" /> : null}
          </div>

          {posts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-6 text-sm text-muted-foreground">
              Aucun article pour le moment. Cree le premier brouillon ou publie ton premier guide SEO.
            </div>
          ) : (
            posts.map((post) => (
              <article
                key={post.id}
                className={`rounded-2xl border p-5 transition-colors ${
                  selectedPostId === post.id ? 'border-brand-green-500 bg-brand-green-50/40' : 'border-border'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
                        {post.category}
                      </span>
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          post.isPublished
                            ? 'bg-brand-green-50 text-brand-green-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {post.isPublished ? 'Publie' : 'Brouillon'}
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-foreground mt-3">{post.title}</h4>
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{post.excerpt}</p>
                  </div>
                  {post.featuredImageUrl ? (
                    <img
                      src={post.featuredImageUrl}
                      alt={post.featuredImageAlt ?? post.title}
                      className="w-20 h-20 rounded-2xl object-cover border border-border"
                    />
                  ) : null}
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mt-4">
                  <span>/{post.slug}</span>
                  <span>{post.readingTimeMinutes} min</span>
                  <span>{formatBlogDate(post.publishedAt || post.updatedAt)}</span>
                </div>

                <div className="flex flex-wrap items-center gap-2 mt-5">
                  <button
                    type="button"
                    onClick={() => startEditing(post)}
                    className="inline-flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-sm font-semibold text-foreground transition-colors hover:border-brand-green-500"
                  >
                    <PencilLine className="w-4 h-4" />
                    Modifier
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeletePost(post)}
                    className="inline-flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-sm font-semibold text-red-600 transition-colors hover:border-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                    Supprimer
                  </button>
                </div>
              </article>
            ))
          )}
        </div>

        <div className="rounded-3xl border border-border bg-background p-5 md:p-6">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-lg font-bold text-foreground">
                {selectedPostId ? 'Edition de l article' : 'Nouveau brouillon'}
              </h3>
              <p className="text-sm text-muted-foreground mt-2">
                Renseigne le contenu, le SEO et la couverture. Le slug est genere automatiquement tant que tu ne le modifies pas.
              </p>
            </div>
            {statusMessage ? (
              <div className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-2 text-xs text-muted-foreground">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand-green-500" />
                {statusMessage}
              </div>
            ) : null}
          </div>

          <form onSubmit={handleSavePost} className="grid gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <LabeledInput
                label="Titre"
                value={formValues.title}
                onChange={(value) => setFormValues((current) => ({ ...current, title: value }))}
                placeholder="Ex: Comment choisir la bonne reparation iPhone"
              />
              <LabeledInput
                label="Categorie"
                value={formValues.category}
                onChange={(value) => setFormValues((current) => ({ ...current, category: value }))}
                placeholder="Conseils, Guide, Comparatif..."
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <LabeledInput
                label="Slug"
                value={formValues.slug}
                onChange={(value) => {
                  setManualSlug(true);
                  setFormValues((current) => ({ ...current, slug: createSlug(value) }));
                }}
                placeholder="comment-choisir-la-bonne-reparation-iphone"
              />
              <LabeledInput
                label="Tags"
                value={formValues.tags}
                onChange={(value) => setFormValues((current) => ({ ...current, tags: value }))}
                placeholder="iphone, batterie, reparation"
              />
            </div>

            <LabeledTextarea
              label="Extrait"
              value={formValues.excerpt}
              onChange={(value) => setFormValues((current) => ({ ...current, excerpt: value }))}
              rows={3}
              placeholder="Resume visible dans la liste du blog et les apercus SEO."
            />

            <LabeledTextarea
              label="Contenu"
              value={formValues.content}
              onChange={(value) => setFormValues((current) => ({ ...current, content: value }))}
              rows={12}
              placeholder="Redige l article avec des paragraphes separes par des lignes vides."
            />

            <div className="rounded-2xl border border-dashed border-border p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="text-sm font-semibold text-foreground">Couverture de l article</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Depose une image, elle sera compressee et convertie en WebP avant envoi dans Supabase.
                  </div>
                </div>
                <label className="inline-flex items-center gap-2 rounded-2xl border border-border px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:border-brand-green-500 cursor-pointer">
                  <ImagePlus className="w-4 h-4" />
                  Choisir une image
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(event) => void handleImageSelection(event.target.files?.[0] ?? null)}
                  />
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-[180px_1fr] mt-5">
                <div className="aspect-[4/3] rounded-2xl bg-muted overflow-hidden border border-border">
                  {uploadState.previewUrl ? (
                    <img src={uploadState.previewUrl} alt="Apercu couverture" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground px-4 text-center">
                      Aucune couverture selectionnee
                    </div>
                  )}
                </div>
                <LabeledInput
                  label="Texte alternatif de la couverture"
                  value={formValues.featuredImageAlt}
                  onChange={(value) => setFormValues((current) => ({ ...current, featuredImageAlt: value }))}
                  placeholder="Description precise pour accessibilite et SEO image"
                />
              </div>
            </div>

            <div className="rounded-2xl border border-border p-4">
              <h4 className="text-sm font-bold text-foreground mb-4">Bloc SEO</h4>
              <div className="grid gap-4 md:grid-cols-2">
                <LabeledInput
                  label="Meta title"
                  value={formValues.seoTitle}
                  onChange={(value) => setFormValues((current) => ({ ...current, seoTitle: value }))}
                  placeholder="Titre SEO optimisé"
                />
                <LabeledInput
                  label="Mot-cle principal"
                  value={formValues.focusKeyword}
                  onChange={(value) => setFormValues((current) => ({ ...current, focusKeyword: value }))}
                  placeholder="reparation iphone saint jean de luz"
                />
              </div>
              <LabeledTextarea
                label="Meta description"
                value={formValues.seoDescription}
                onChange={(value) => setFormValues((current) => ({ ...current, seoDescription: value }))}
                rows={3}
                placeholder="Description concise pour Google, environ 150 a 160 caracteres."
              />
              <div className="grid gap-4 md:grid-cols-2">
                <LabeledInput
                  label="Mots-cles SEO"
                  value={formValues.seoKeywords}
                  onChange={(value) => setFormValues((current) => ({ ...current, seoKeywords: value }))}
                  placeholder="seo, blog, iphone"
                />
                <LabeledInput
                  label="Canonical URL"
                  value={formValues.canonicalUrl}
                  onChange={(value) => setFormValues((current) => ({ ...current, canonicalUrl: value }))}
                  placeholder="https://www.cocktel4you.fr/blog/slug"
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <LabeledInput
                  label="OG title"
                  value={formValues.ogTitle}
                  onChange={(value) => setFormValues((current) => ({ ...current, ogTitle: value }))}
                  placeholder="Titre pour partages sociaux"
                />
                <LabeledInput
                  label="OG image URL"
                  value={formValues.ogImageUrl}
                  onChange={(value) => setFormValues((current) => ({ ...current, ogImageUrl: value }))}
                  placeholder="Laisse vide pour reutiliser la couverture"
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <LabeledTextarea
                  label="OG description"
                  value={formValues.ogDescription}
                  onChange={(value) => setFormValues((current) => ({ ...current, ogDescription: value }))}
                  rows={3}
                  placeholder="Description Open Graph"
                />
                <LabeledInput
                  label="Meta robots"
                  value={formValues.metaRobots}
                  onChange={(value) => setFormValues((current) => ({ ...current, metaRobots: value }))}
                  placeholder="index,follow"
                />
              </div>
            </div>

            <label className="inline-flex items-center gap-3 rounded-2xl border border-border bg-muted/40 px-4 py-3 text-sm text-foreground">
              <input
                type="checkbox"
                checked={formValues.isPublished}
                onChange={(event) =>
                  setFormValues((current) => ({
                    ...current,
                    isPublished: event.target.checked,
                  }))
                }
                className="w-4 h-4 rounded border-border"
              />
              Publier immediatement cet article sur le blog
            </label>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="submit"
                disabled={savingPost}
                className="inline-flex items-center gap-2 rounded-2xl bg-brand-green-500 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-green-600 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {savingPost ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                {selectedPostId ? 'Mettre a jour' : 'Creer l article'}
              </button>
              <button
                type="button"
                onClick={resetEditor}
                className="inline-flex items-center gap-2 rounded-2xl border border-border px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:border-brand-green-500"
              >
                Reinitialiser
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

function LabeledInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <label className="block">
      <div className="text-sm font-semibold text-foreground mb-2">{label}</div>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-green-500"
      />
    </label>
  );
}

function LabeledTextarea({
  label,
  value,
  onChange,
  rows,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows: number;
  placeholder: string;
}) {
  return (
    <label className="block">
      <div className="text-sm font-semibold text-foreground mb-2">{label}</div>
      <textarea
        rows={rows}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-green-500"
      />
    </label>
  );
}

async function convertImageToWebP(file: File) {
  const imageUrl = URL.createObjectURL(file);

  try {
    const image = await loadImage(imageUrl);
    const maxWidth = 1600;
    const scale = Math.min(1, maxWidth / image.width);
    const width = Math.max(1, Math.round(image.width * scale));
    const height = Math.max(1, Math.round(image.height * scale));
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');

    if (!context) {
      throw new Error('Canvas indisponible pour la conversion WebP.');
    }

    context.drawImage(image, 0, 0, width, height);

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, 'image/webp', 0.82);
    });

    if (!blob) {
      throw new Error('La conversion WebP a echoue.');
    }

    const safeName = file.name.replace(/\.[^.]+$/, '') || 'cover';
    return new File([blob], `${safeName}.webp`, {
      type: 'image/webp',
      lastModified: Date.now(),
    });
  } finally {
    URL.revokeObjectURL(imageUrl);
  }
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new window.Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Impossible de lire cette image.'));
    image.src = src;
  });
}
