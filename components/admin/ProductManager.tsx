'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  AlertTriangle,
  Edit2,
  ImagePlus,
  Loader2,
  Package,
  Plus,
  Save,
  Trash2,
  X,
} from 'lucide-react';

export type Product = {
  id: string;
  name: string;
  brand: string | null;
  category: string;
  description: string | null;
  price: number;
  original_price: number | null;
  stock: number;
  badge: string | null;
  image_path: string | null;
  image_url: string | null;
  image_alt: string | null;
  is_active: boolean;
  created_at: string;
};

const CATEGORIES = ['Coques', 'Verres trempés', 'Chargeurs', 'Reconditionnés', 'Accessoires'];
const BRANDS = ['Apple', 'Samsung', 'Xiaomi', 'Huawei', 'OnePlus', 'Google', 'Autre'];

const emptyForm = {
  name: '',
  brand: '',
  category: 'Coques',
  description: '',
  price: '',
  original_price: '',
  stock: '0',
  badge: '',
  image_alt: '',
  is_active: true,
};

type UploadState = {
  file: File | null;
  previewUrl: string | null;
  existingPath: string | null;
  existingUrl: string | null;
};

const initialUpload: UploadState = { file: null, previewUrl: null, existingPath: null, existingUrl: null };

async function convertToWebP(file: File): Promise<File> {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((res, rej) => {
      const i = new window.Image();
      i.onload = () => res(i);
      i.onerror = () => rej(new Error('Lecture image impossible'));
      i.src = url;
    });
    const maxW = 1200;
    const scale = Math.min(1, maxW / img.width);
    const w = Math.max(1, Math.round(img.width * scale));
    const h = Math.max(1, Math.round(img.height * scale));
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas indisponible');
    ctx.drawImage(img, 0, 0, w, h);
    const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, 'image/webp', 0.85));
    if (!blob) throw new Error('Conversion WebP échouée');
    const safeName = (file.name.replace(/\.[^.]+$/, '') || 'product') + '.webp';
    return new File([blob], safeName, { type: 'image/webp', lastModified: Date.now() });
  } finally {
    URL.revokeObjectURL(url);
  }
}

export default function ProductManager({ token }: { token: string }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [upload, setUpload] = useState<UploadState>(initialUpload);
  const [dragOver, setDragOver] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    void loadProducts();
  }, []);

  useEffect(() => {
    return () => {
      if (upload.previewUrl) URL.revokeObjectURL(upload.previewUrl);
    };
  }, [upload.previewUrl]);

  async function loadProducts() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/products', { headers: { Authorization: `Bearer ${token}` } });
      const json = await res.json();
      setProducts(json.products ?? []);
    } catch {
      setStatus('Chargement échoué');
      setIsError(true);
    } finally {
      setLoading(false);
    }
  }

  function openNew() {
    setEditing(null);
    setForm(emptyForm);
    setUpload(initialUpload);
    setStatus(null);
    setShowForm(true);
  }

  function openEdit(p: Product) {
    setEditing(p);
    setForm({
      name: p.name,
      brand: p.brand ?? '',
      category: p.category,
      description: p.description ?? '',
      price: String(p.price),
      original_price: p.original_price ? String(p.original_price) : '',
      stock: String(p.stock),
      badge: p.badge ?? '',
      image_alt: p.image_alt ?? '',
      is_active: p.is_active,
    });
    setUpload({ file: null, previewUrl: null, existingPath: p.image_path, existingUrl: p.image_url });
    setStatus(null);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditing(null);
    setStatus(null);
  }

  async function handleFile(file: File) {
    if (!file.type.startsWith('image/')) {
      setStatus('Fichier non supporté. Utilisez JPG, PNG ou WebP.');
      setIsError(true);
      return;
    }
    const webp = file.type === 'image/webp' ? file : await convertToWebP(file);
    const previewUrl = URL.createObjectURL(webp);
    setUpload((prev) => {
      if (prev.previewUrl) URL.revokeObjectURL(prev.previewUrl);
      return { file: webp, previewUrl, existingPath: prev.existingPath, existingUrl: prev.existingUrl };
    });
  }

  const onDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) await handleFile(file);
  }, []);

  async function uploadImage(): Promise<{ path: string; url: string } | null> {
    if (!upload.file) return null;
    const fd = new FormData();
    fd.append('file', upload.file);
    const res = await fetch('/api/admin/product-images', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: fd,
    });
    if (!res.ok) throw new Error('Upload image échoué');
    return res.json();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setStatus(null);
    setIsError(false);

    try {
      let imagePath = upload.existingPath;
      let imageUrl = upload.existingUrl;

      if (upload.file) {
        const img = await uploadImage();
        if (img) {
          imagePath = img.path;
          imageUrl = img.url;
        }
      }

      const payload = {
        name: form.name,
        brand: form.brand || null,
        category: form.category,
        description: form.description || null,
        price: parseFloat(form.price),
        original_price: form.original_price ? parseFloat(form.original_price) : null,
        stock: parseInt(form.stock, 10),
        badge: form.badge || null,
        image_path: imagePath,
        image_url: imageUrl,
        image_alt: form.image_alt || null,
        is_active: form.is_active,
      };

      const url = editing ? `/api/admin/products/${editing.id}` : '/api/admin/products';
      const method = editing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Sauvegarde échouée');

      setStatus(editing ? 'Produit mis à jour !' : 'Produit créé !');
      setIsError(false);
      await loadProducts();
      closeForm();
    } catch {
      setStatus('Erreur lors de la sauvegarde.');
      setIsError(true);
    } finally {
      setSaving(false);
    }
  }

  async function deleteProduct(p: Product) {
    if (!confirm(`Supprimer "${p.name}" ?`)) return;
    try {
      await fetch(`/api/admin/products/${p.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      await loadProducts();
    } catch {
      setStatus('Suppression échouée');
      setIsError(true);
    }
  }

  const stockTone = (s: number) =>
    s <= 3 ? 'text-red-600 dark:text-red-400' : s <= 10 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400';

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-extrabold text-foreground">Produits boutique</h2>
          <p className="text-muted-foreground text-sm mt-1">{products.length} produit{products.length !== 1 ? 's' : ''} dans la base</p>
        </div>
        <button
          onClick={openNew}
          className="inline-flex items-center gap-2 rounded-2xl bg-brand-green-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-green-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nouveau produit
        </button>
      </div>

      {status && (
        <div className={`mb-4 rounded-2xl px-4 py-3 text-sm font-medium ${isError ? 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300' : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300'}`}>
          {status}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 overflow-y-auto">
          <div className="bg-card rounded-3xl border border-border w-full max-w-2xl my-8 shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h3 className="text-lg font-bold text-foreground">{editing ? 'Modifier le produit' : 'Nouveau produit'}</h3>
              <button onClick={closeForm} className="rounded-xl p-2 hover:bg-muted transition-colors">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Image upload */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Photo du produit (WebP auto)</label>
                <div
                  ref={dropRef}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={onDrop}
                  onClick={() => fileRef.current?.click()}
                  className={`relative rounded-2xl border-2 border-dashed cursor-pointer transition-colors ${dragOver ? 'border-brand-green-500 bg-brand-green-50 dark:bg-brand-green-900/10' : 'border-border hover:border-brand-green-400'}`}
                >
                  {upload.previewUrl || upload.existingUrl ? (
                    <div className="relative h-48 overflow-hidden rounded-2xl">
                      <img
                        src={upload.previewUrl ?? upload.existingUrl ?? ''}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <span className="text-white text-sm font-semibold">Changer l image</span>
                      </div>
                    </div>
                  ) : (
                    <div className="h-36 flex flex-col items-center justify-center gap-2">
                      <ImagePlus className="w-8 h-8 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Glissez une image ou cliquez</p>
                      <p className="text-xs text-muted-foreground">JPG, PNG, WebP → converti en WebP automatiquement</p>
                    </div>
                  )}
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) void handleFile(f); }}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Nom du produit *" required>
                  <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required className="input-field" placeholder="ex: Coque iPhone 15 Pro" />
                </Field>
                <Field label="Marque">
                  <select value={form.brand} onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value }))} className="input-field">
                    <option value="">— Sélectionner —</option>
                    {BRANDS.map((b) => <option key={b} value={b}>{b}</option>)}
                  </select>
                </Field>
                <Field label="Catégorie *">
                  <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} required className="input-field">
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </Field>
                <Field label="Badge (ex: Promo, Nouveau)">
                  <input value={form.badge} onChange={(e) => setForm((f) => ({ ...f, badge: e.target.value }))} className="input-field" placeholder="Bestseller" />
                </Field>
                <Field label="Prix (€) *">
                  <input type="number" min="0" step="0.01" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} required className="input-field" placeholder="29.99" />
                </Field>
                <Field label="Prix barré (€)">
                  <input type="number" min="0" step="0.01" value={form.original_price} onChange={(e) => setForm((f) => ({ ...f, original_price: e.target.value }))} className="input-field" placeholder="39.99" />
                </Field>
                <Field label="Stock">
                  <input type="number" min="0" value={form.stock} onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))} className="input-field" />
                </Field>
                <Field label="Alt image (SEO)">
                  <input value={form.image_alt} onChange={(e) => setForm((f) => ({ ...f, image_alt: e.target.value }))} className="input-field" placeholder="Description de l image" />
                </Field>
              </div>

              <Field label="Description">
                <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={3} className="input-field resize-none" placeholder="Décrivez le produit..." />
              </Field>

              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={form.is_active} onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))} className="w-4 h-4 rounded accent-brand-green-500" />
                <span className="text-sm text-foreground">Produit visible sur la boutique</span>
              </label>

              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-2xl bg-brand-green-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-green-600 disabled:opacity-60 transition-colors">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {saving ? 'Enregistrement...' : 'Enregistrer'}
                </button>
                <button type="button" onClick={closeForm} className="rounded-2xl border border-border px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-muted transition-colors">
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Products List */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-brand-green-500" />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Package className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p>Aucun produit. Ajoutez votre premier produit.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {products.map((p) => (
            <div key={p.id} className="rounded-2xl border border-border bg-card p-4 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                {p.image_url ? (
                  <img src={p.image_url} alt={p.image_alt ?? p.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-6 h-6 text-muted-foreground opacity-40" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-sm font-bold text-foreground truncate">{p.name}</span>
                  {p.badge && (
                    <span className="inline-flex items-center rounded-full bg-brand-green-50 dark:bg-brand-green-900/30 px-2 py-0.5 text-xs font-semibold text-brand-green-700 dark:text-brand-green-300">{p.badge}</span>
                  )}
                  {!p.is_active && (
                    <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">Masqué</span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{p.category}{p.brand ? ` · ${p.brand}` : ''}</p>
              </div>
              <div className="flex items-center gap-6 flex-shrink-0">
                <div className="text-center">
                  <div className="text-xs text-muted-foreground uppercase tracking-wide">Prix</div>
                  <div className="text-sm font-bold text-foreground">{Number(p.price).toFixed(2)} €</div>
                  {p.original_price && <div className="text-xs text-muted-foreground line-through">{Number(p.original_price).toFixed(2)} €</div>}
                </div>
                <div className="text-center">
                  <div className="text-xs text-muted-foreground uppercase tracking-wide">Stock</div>
                  <div className={`text-sm font-bold ${stockTone(p.stock)}`}>{p.stock}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => openEdit(p)} className="rounded-xl p-2 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => deleteProduct(p)} className="rounded-xl p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-muted-foreground hover:text-red-600 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .input-field {
          width: 100%;
          border-radius: 1rem;
          border: 1px solid hsl(var(--border));
          background: hsl(var(--background));
          padding: 0.625rem 1rem;
          font-size: 0.875rem;
          color: hsl(var(--foreground));
          outline: none;
        }
        .input-field:focus {
          ring: 2px solid hsl(var(--brand-green-500));
        }
      `}</style>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="text-sm font-semibold text-foreground mb-1.5">{label}{required ? '' : ''}</div>
      {children}
    </label>
  );
}
