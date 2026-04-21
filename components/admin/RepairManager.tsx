'use client';

import { useEffect, useState } from 'react';
import { Edit2, Loader2, Plus, Save, Star, Trash2, Wrench, X } from 'lucide-react';

export type Repair = {
  id: string;
  brand: string;
  model: string;
  repair_type: string;
  price_from: number;
  duration: string;
  description: string | null;
  is_popular: boolean;
  is_active: boolean;
  image_url: string | null;
  created_at: string;
};

const BRANDS = ['Apple', 'Samsung', 'Xiaomi', 'Huawei', 'OnePlus', 'Google', 'Honor', 'Motorola', 'OPPO', 'Realme', 'Sony', 'TCL', 'Vivo', 'Wiko', 'Autre'];
const REPAIR_TYPES = ['Vitre écran', 'Batterie', 'Écran', 'Connecteur', 'Caméra', 'Coque', 'Autre'];

const emptyForm = {
  brand: 'Apple',
  model: '',
  repair_type: 'Vitre écran',
  price_from: '',
  duration: '30 min',
  description: '',
  image_url: '',
  is_popular: false,
  is_active: true,
};

export default function RepairManager({ token }: { token: string }) {
  const [repairs, setRepairs] = useState<Repair[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<Repair | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [status, setStatus] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [filterBrand, setFilterBrand] = useState('');

  useEffect(() => { void loadRepairs(); }, []);

  async function loadRepairs() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/repairs', { headers: { Authorization: `Bearer ${token}` } });
      const json = await res.json();
      setRepairs(json.repairs ?? []);
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
    setStatus(null);
    setShowForm(true);
  }

  function openEdit(r: Repair) {
    setEditing(r);
    setForm({
      brand: r.brand,
      model: r.model,
      repair_type: r.repair_type,
      price_from: String(r.price_from),
      duration: r.duration,
      description: r.description ?? '',
      image_url: r.image_url ?? '',
      is_popular: r.is_popular,
      is_active: r.is_active,
    });
    setStatus(null);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditing(null);
    setStatus(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setStatus(null);
    setIsError(false);
    try {
      const payload = {
        brand: form.brand,
        model: form.model,
        repair_type: form.repair_type,
        price_from: parseFloat(form.price_from),
        duration: form.duration,
        description: form.description || null,
        image_url: form.image_url || null,
        is_popular: form.is_popular,
        is_active: form.is_active,
      };
      const url = editing ? `/api/admin/repairs/${editing.id}` : '/api/admin/repairs';
      const res = await fetch(url, {
        method: editing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      setStatus(editing ? 'Réparation mise à jour !' : 'Réparation créée !');
      setIsError(false);
      await loadRepairs();
      closeForm();
    } catch {
      setStatus('Erreur lors de la sauvegarde.');
      setIsError(true);
    } finally {
      setSaving(false);
    }
  }

  async function deleteRepair(r: Repair) {
    if (!confirm(`Supprimer "${r.brand} ${r.model} – ${r.repair_type}" ?`)) return;
    try {
      await fetch(`/api/admin/repairs/${r.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      await loadRepairs();
    } catch {
      setStatus('Suppression échouée');
      setIsError(true);
    }
  }

  const filtered = filterBrand ? repairs.filter((r) => r.brand === filterBrand) : repairs;

  const grouped = filtered.reduce<Record<string, Repair[]>>((acc, r) => {
    (acc[r.brand] ??= []).push(r);
    return acc;
  }, {});

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-extrabold text-foreground">Réparations</h2>
          <p className="text-muted-foreground text-sm mt-1">{repairs.length} service{repairs.length !== 1 ? 's' : ''} configuré{repairs.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex items-center gap-3">
          <select value={filterBrand} onChange={(e) => setFilterBrand(e.target.value)} className="rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground">
            <option value="">Toutes les marques</option>
            {BRANDS.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
          <button onClick={openNew} className="inline-flex items-center gap-2 rounded-2xl bg-brand-green-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-green-600 transition-colors">
            <Plus className="w-4 h-4" />
            Nouvelle réparation
          </button>
        </div>
      </div>

      {status && (
        <div className={`mb-4 rounded-2xl px-4 py-3 text-sm font-medium ${isError ? 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300' : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300'}`}>
          {status}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 overflow-y-auto">
          <div className="bg-card rounded-3xl border border-border w-full max-w-lg my-8 shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h3 className="text-lg font-bold text-foreground">{editing ? 'Modifier' : 'Nouvelle réparation'}</h3>
              <button onClick={closeForm} className="rounded-xl p-2 hover:bg-muted transition-colors">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-sm font-semibold text-foreground mb-1.5 block">Marque *</span>
                  <select value={form.brand} onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value }))} required className="input-field">
                    {BRANDS.map((b) => <option key={b} value={b}>{b}</option>)}
                  </select>
                </label>
                <label className="block">
                  <span className="text-sm font-semibold text-foreground mb-1.5 block">Type de réparation *</span>
                  <select value={form.repair_type} onChange={(e) => setForm((f) => ({ ...f, repair_type: e.target.value }))} required className="input-field">
                    {REPAIR_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </label>
              </div>
              <label className="block">
                <span className="text-sm font-semibold text-foreground mb-1.5 block">Modèle *</span>
                <input value={form.model} onChange={(e) => setForm((f) => ({ ...f, model: e.target.value }))} required className="input-field" placeholder="ex: iPhone 15 Pro Max" />
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-sm font-semibold text-foreground mb-1.5 block">Prix à partir de (€) *</span>
                  <input type="number" min="0" step="0.01" value={form.price_from} onChange={(e) => setForm((f) => ({ ...f, price_from: e.target.value }))} required className="input-field" placeholder="99" />
                </label>
                <label className="block">
                  <span className="text-sm font-semibold text-foreground mb-1.5 block">Durée *</span>
                  <input value={form.duration} onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))} required className="input-field" placeholder="30 min" />
                </label>
              </div>
              <label className="block">
                <span className="text-sm font-semibold text-foreground mb-1.5 block">Description</span>
                <input value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className="input-field" placeholder="ex: Remplacement écran OLED original" />
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-foreground mb-1.5 block">URL image téléphone</span>
                <input value={form.image_url} onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value }))} className="input-field" placeholder="https://..." />
              </label>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.is_popular} onChange={(e) => setForm((f) => ({ ...f, is_popular: e.target.checked }))} className="w-4 h-4 accent-brand-green-500" />
                  <span className="text-sm text-foreground">Populaire</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.is_active} onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))} className="w-4 h-4 accent-brand-green-500" />
                  <span className="text-sm text-foreground">Visible sur le site</span>
                </label>
              </div>
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

      {/* Repairs list grouped by brand */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-brand-green-500" />
        </div>
      ) : Object.keys(grouped).length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Wrench className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p>Aucune réparation. Ajoutez votre premier service.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([brand, items]) => (
            <div key={brand}>
              <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">{brand}</h3>
              <div className="space-y-2">
                {items.map((r) => (
                  <div key={r.id} className="rounded-2xl border border-border bg-card p-4 flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-semibold text-foreground">{r.model}</span>
                        <span className="inline-flex items-center rounded-full bg-brand-violet-50 dark:bg-brand-violet-900/30 px-2 py-0.5 text-xs font-medium text-brand-violet-700 dark:text-brand-violet-300">{r.repair_type}</span>
                        {r.is_popular && <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 dark:bg-amber-900/30 px-2 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-300"><Star className="w-3 h-3" />Populaire</span>}
                        {!r.is_active && <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">Masqué</span>}
                      </div>
                      {r.description && <p className="text-xs text-muted-foreground mt-1">{r.description}</p>}
                    </div>
                    <div className="flex items-center gap-6 flex-shrink-0">
                      <div className="text-center">
                        <div className="text-xs text-muted-foreground">Prix</div>
                        <div className="text-sm font-bold text-brand-green-600">
                          {Number(r.price_from) === 0 ? 'Sur devis' : `${Number(r.price_from).toFixed(0)} €`}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-muted-foreground">Durée</div>
                        <div className="text-sm font-medium text-foreground">{r.duration}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(r)} className="rounded-xl p-2 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => deleteRepair(r)} className="rounded-xl p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-muted-foreground hover:text-red-600 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .input-field {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid hsl(var(--border));
          background: hsl(var(--background));
          padding: 0.625rem 0.875rem;
          font-size: 0.875rem;
          color: hsl(var(--foreground));
          outline: none;
        }
      `}</style>
    </div>
  );
}
