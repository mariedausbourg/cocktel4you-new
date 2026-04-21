'use client';

import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import { CheckCircle2, FileText, ImagePlus, Loader2, PencilLine, Plus, Trash2 } from 'lucide-react';
import {
  BlogPost,
  BlogPostFormValues,
  buildBlogPayload,
  createSlug,
  defaultBlogPostFormValues,
  formatBlogDate,
  mapPostToFormValues,
} from '@/lib/blog';

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

export default function BlogManager({ token }: { token: string }) {
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [savingPost, setSavingPost] = useState(false);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<BlogPostFormValues>(defaultBlogPostFormValues);
  const [uploadState, setUploadState] = useState<UploadState>(initialUploadState);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [manualSlug, setManualSlug] = useState(false);

  useEffect(() => {
    void loadPosts();
  }, []);

  useEffect(() => {
    if (!formValues.title || manualSlug) return;
    setFormValues((current) => ({
      ...current,
      slug: createSlug(current.title),
    }));
  }, [formValues.title, manualSlug]);

  async function loadPosts() {
    setLoadingPosts(true);
    setStatusMessage(null);
    try {
      const response = await fetch('/api/admin/blog-posts', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? 'Impossible de charger les articles.');
      setPosts(payload.posts ?? []);
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : 'Impossible de charger les articles.');
    } finally {
      setLoadingPosts(false);
    }
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
        return { ...current, file: converted, previewUrl };
      });
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : 'Conversion WebP impossible.');
    }
  }

  async function uploadCoverIfNeeded() {
    if (!uploadState.file) {
      return { path: uploadState.existingPath, url: uploadState.existingUrl };
    }
    const formData = new FormData();
    formData.append('file', uploadState.file);
    const response = await fetch('/api/admin/blog-images', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error ?? 'Upload impossible.');
    return { path: payload.path as string, url: payload.url as string };
  }

  async function handleSavePost(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSavingPost(true);
    setStatusMessage(null);
    try {
      const image = await uploadCoverIfNeeded();
      const payload = {
        ...buildBlogPayload(formValues, image),
        previousFeaturedImagePath: uploadState.existingPath,
      };
      const endpoint = selectedPostId ? `/api/admin/blog-posts/${selectedPostId}` : '/api/admin/blog-posts';
      const response = await fetch(endpoint, {
        method: selectedPostId ? 'PUT' : 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error ?? 'Enregistrement impossible.');
      const post = body.post as BlogPost;
      setPosts((current) => {
        const nextPosts = selectedPostId
          ? current.map((item) => (item.id === post.id ? post : item))
          : [post, ...current];
        return nextPosts.sort((l, r) => r.updatedAt.localeCompare(l.updatedAt));
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
    if (!window.confirm(`Supprimer l article "${post.title}" ?`)) return;
    try {
      const response = await fetch(`/api/admin/blog-posts/${post.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error ?? 'Suppression impossible.');
      setPosts((current) => current.filter((item) => item.id !== post.id));
      if (selectedPostId === post.id) resetEditor();
      setStatusMessage('Article supprime.');
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : 'Suppression impossible.');
    }
  }

  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-6">
        <div>
          <h2 className="text-2xl font-extrabold text-foreground">Blog</h2>
          <p className="text-muted-foreground text-sm mt-1">
            {posts.length} article{posts.length !== 1 ? 's' : ''} · Images converties en WebP automatiquement
          </p>
        </div>
        <div className="flex items-center gap-3">
          {loadingPosts && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
          <button
            type="button"
            onClick={resetEditor}
            className="inline-flex items-center gap-2 rounded-2xl bg-brand-green-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-green-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nouvel article
          </button>
        </div>
      </div>

      {statusMessage && (
        <div className="mb-4 rounded-2xl bg-muted px-4 py-3 text-sm text-muted-foreground flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-brand-green-500 flex-shrink-0" />
          {statusMessage}
        </div>
      )}

      <div className="grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
        {/* Articles list */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wide">Articles existants</h3>
          {posts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-6 text-sm text-muted-foreground">
              Aucun article pour le moment.
            </div>
          ) : (
            posts.map((post) => (
              <article
                key={post.id}
                className={`rounded-2xl border p-5 transition-colors ${
                  selectedPostId === post.id
                    ? 'border-brand-green-500 bg-brand-green-50/40 dark:bg-brand-green-900/10'
                    : 'border-border bg-card'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="inline-flex rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">{post.category}</span>
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${post.isPublished ? 'bg-brand-green-50 text-brand-green-700 dark:bg-brand-green-900/30 dark:text-brand-green-300' : 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'}`}>
                        {post.isPublished ? 'Publié' : 'Brouillon'}
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-foreground">{post.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{post.excerpt}</p>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mt-3">
                      <span>/{post.slug}</span>
                      <span>{post.readingTimeMinutes} min</span>
                      <span>{formatBlogDate(post.publishedAt || post.updatedAt)}</span>
                    </div>
                  </div>
                  {post.featuredImageUrl && (
                    <img src={post.featuredImageUrl} alt={post.featuredImageAlt ?? post.title} className="w-16 h-16 rounded-xl object-cover border border-border flex-shrink-0" />
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-4">
                  <button type="button" onClick={() => startEditing(post)} className="inline-flex items-center gap-1.5 rounded-xl border border-border px-3 py-1.5 text-sm font-semibold text-foreground hover:border-brand-green-500 transition-colors">
                    <PencilLine className="w-3.5 h-3.5" />
                    Modifier
                  </button>
                  <button type="button" onClick={() => handleDeletePost(post)} className="inline-flex items-center gap-1.5 rounded-xl border border-border px-3 py-1.5 text-sm font-semibold text-red-600 hover:border-red-300 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                    Supprimer
                  </button>
                </div>
              </article>
            ))
          )}
        </div>

        {/* Editor */}
        <div className="rounded-3xl border border-border bg-background p-5 md:p-6">
          <h3 className="text-lg font-bold text-foreground mb-1">
            {selectedPostId ? 'Édition de l article' : 'Nouveau brouillon'}
          </h3>
          <p className="text-sm text-muted-foreground mb-6">
            Le slug est généré automatiquement tant que tu ne le modifies pas manuellement.
          </p>

          <form onSubmit={handleSavePost} className="grid gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <LabeledInput label="Titre" value={formValues.title} onChange={(v) => setFormValues((c) => ({ ...c, title: v }))} placeholder="Comment choisir la bonne réparation iPhone" />
              <LabeledInput label="Catégorie" value={formValues.category} onChange={(v) => setFormValues((c) => ({ ...c, category: v }))} placeholder="Conseils, Guide, Comparatif..." />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <LabeledInput label="Slug" value={formValues.slug} onChange={(v) => { setManualSlug(true); setFormValues((c) => ({ ...c, slug: createSlug(v) })); }} placeholder="comment-choisir-la-bonne-reparation-iphone" />
              <LabeledInput label="Tags" value={formValues.tags} onChange={(v) => setFormValues((c) => ({ ...c, tags: v }))} placeholder="iphone, batterie, reparation" />
            </div>
            <LabeledTextarea label="Extrait" value={formValues.excerpt} onChange={(v) => setFormValues((c) => ({ ...c, excerpt: v }))} rows={3} placeholder="Résumé visible dans la liste du blog et les aperçus SEO." />
            <LabeledTextarea label="Contenu" value={formValues.content} onChange={(v) => setFormValues((c) => ({ ...c, content: v }))} rows={12} placeholder="Rédige l article..." />

            {/* Image upload */}
            <div className="rounded-2xl border border-dashed border-border p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="text-sm font-semibold text-foreground">Couverture de l article</div>
                  <div className="text-sm text-muted-foreground mt-1">Glisse ou sélectionne une image — convertie en WebP automatiquement.</div>
                </div>
                <label className="inline-flex items-center gap-2 rounded-2xl border border-border px-4 py-2.5 text-sm font-semibold text-foreground hover:border-brand-green-500 cursor-pointer transition-colors">
                  <ImagePlus className="w-4 h-4" />
                  Choisir une image
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => void handleImageSelection(e.target.files?.[0] ?? null)} />
                </label>
              </div>
              <div className="grid gap-4 md:grid-cols-[180px_1fr] mt-4">
                <div className="aspect-[4/3] rounded-2xl bg-muted overflow-hidden border border-border">
                  {uploadState.previewUrl ? (
                    <img src={uploadState.previewUrl} alt="Aperçu" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground px-4 text-center">Aucune couverture</div>
                  )}
                </div>
                <LabeledInput label="Texte alternatif (SEO)" value={formValues.featuredImageAlt} onChange={(v) => setFormValues((c) => ({ ...c, featuredImageAlt: v }))} placeholder="Description précise pour l accessibilité" />
              </div>
            </div>

            {/* SEO */}
            <div className="rounded-2xl border border-border p-4">
              <h4 className="text-sm font-bold text-foreground mb-4">Bloc SEO</h4>
              <div className="grid gap-4 md:grid-cols-2">
                <LabeledInput label="Meta title" value={formValues.seoTitle} onChange={(v) => setFormValues((c) => ({ ...c, seoTitle: v }))} placeholder="Titre SEO optimisé" />
                <LabeledInput label="Mot-clé principal" value={formValues.focusKeyword} onChange={(v) => setFormValues((c) => ({ ...c, focusKeyword: v }))} placeholder="reparation iphone saint jean de luz" />
              </div>
              <LabeledTextarea label="Meta description" value={formValues.seoDescription} onChange={(v) => setFormValues((c) => ({ ...c, seoDescription: v }))} rows={3} placeholder="Description concise pour Google, 150-160 caractères." />
              <div className="grid gap-4 md:grid-cols-2">
                <LabeledInput label="Mots-clés SEO" value={formValues.seoKeywords} onChange={(v) => setFormValues((c) => ({ ...c, seoKeywords: v }))} placeholder="seo, blog, iphone" />
                <LabeledInput label="Canonical URL" value={formValues.canonicalUrl} onChange={(v) => setFormValues((c) => ({ ...c, canonicalUrl: v }))} placeholder="https://cocktel4you.fr/blog/slug" />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <LabeledInput label="OG title" value={formValues.ogTitle} onChange={(v) => setFormValues((c) => ({ ...c, ogTitle: v }))} placeholder="Titre pour partages sociaux" />
                <LabeledInput label="OG image URL" value={formValues.ogImageUrl} onChange={(v) => setFormValues((c) => ({ ...c, ogImageUrl: v }))} placeholder="Laisse vide pour réutiliser la couverture" />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <LabeledTextarea label="OG description" value={formValues.ogDescription} onChange={(v) => setFormValues((c) => ({ ...c, ogDescription: v }))} rows={3} placeholder="Description Open Graph" />
                <LabeledInput label="Meta robots" value={formValues.metaRobots} onChange={(v) => setFormValues((c) => ({ ...c, metaRobots: v }))} placeholder="index,follow" />
              </div>
            </div>

            <label className="inline-flex items-center gap-3 rounded-2xl border border-border bg-muted/40 px-4 py-3 text-sm text-foreground cursor-pointer">
              <input
                type="checkbox"
                checked={formValues.isPublished}
                onChange={(e) => setFormValues((c) => ({ ...c, isPublished: e.target.checked }))}
                className="w-4 h-4 rounded accent-brand-green-500"
              />
              Publier immédiatement cet article sur le blog
            </label>

            <div className="flex flex-wrap gap-3 pt-2">
              <button type="submit" disabled={savingPost} className="inline-flex items-center gap-2 rounded-2xl bg-brand-green-500 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-green-600 disabled:opacity-60 transition-colors">
                {savingPost ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                {selectedPostId ? 'Mettre à jour' : 'Créer l article'}
              </button>
              <button type="button" onClick={resetEditor} className="inline-flex items-center gap-2 rounded-2xl border border-border px-5 py-3 text-sm font-semibold text-foreground hover:border-brand-green-500 transition-colors">
                Réinitialiser
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function LabeledInput({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <label className="block">
      <div className="text-sm font-semibold text-foreground mb-2">{label}</div>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-green-500" />
    </label>
  );
}

function LabeledTextarea({ label, value, onChange, rows, placeholder }: { label: string; value: string; onChange: (v: string) => void; rows: number; placeholder: string }) {
  return (
    <label className="block">
      <div className="text-sm font-semibold text-foreground mb-2">{label}</div>
      <textarea rows={rows} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-green-500" />
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
    if (!context) throw new Error('Canvas indisponible pour la conversion WebP.');
    context.drawImage(image, 0, 0, width, height);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/webp', 0.82));
    if (!blob) throw new Error('La conversion WebP a échoué.');
    const safeName = file.name.replace(/\.[^.]+$/, '') || 'cover';
    return new File([blob], `${safeName}.webp`, { type: 'image/webp', lastModified: Date.now() });
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
