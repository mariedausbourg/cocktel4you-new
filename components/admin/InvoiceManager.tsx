'use client';

import { useEffect, useState } from 'react';
import { FileText, Loader2, Plus, Save, Trash2, X, Printer } from 'lucide-react';

type InvoiceItem = {
  description: string;
  quantity: number;
  unit_price: number;
};

type Invoice = {
  id: string;
  invoice_number: string;
  client_name: string;
  client_phone: string | null;
  client_email: string | null;
  items: InvoiceItem[];
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  total: number;
  status: 'Brouillon' | 'Envoyée' | 'Payée' | 'Annulée';
  notes: string | null;
  created_at: string;
};

const STATUS_STYLES: Record<string, string> = {
  Brouillon: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
  Envoyée: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  Payée: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  Annulée: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300',
};

const emptyItem: InvoiceItem = { description: '', quantity: 1, unit_price: 0 };

const emptyForm = {
  client_name: '',
  client_phone: '',
  client_email: '',
  tax_rate: '20',
  status: 'Brouillon' as Invoice['status'],
  notes: '',
};

export default function InvoiceManager({ token }: { token: string }) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<Invoice | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [items, setItems] = useState<InvoiceItem[]>([{ ...emptyItem }]);
  const [status, setStatus] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => { void loadInvoices(); }, []);

  async function loadInvoices() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/invoices', { headers: { Authorization: `Bearer ${token}` } });
      const json = await res.json();
      setInvoices(json.invoices ?? []);
    } finally {
      setLoading(false);
    }
  }

  function openNew() {
    setEditing(null);
    setForm(emptyForm);
    setItems([{ ...emptyItem }]);
    setStatus(null);
    setShowForm(true);
  }

  function openEdit(inv: Invoice) {
    setEditing(inv);
    setForm({
      client_name: inv.client_name,
      client_phone: inv.client_phone ?? '',
      client_email: inv.client_email ?? '',
      tax_rate: String(inv.tax_rate),
      status: inv.status,
      notes: inv.notes ?? '',
    });
    setItems(inv.items.length > 0 ? inv.items : [{ ...emptyItem }]);
    setStatus(null);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditing(null);
    setStatus(null);
  }

  function addItem() {
    setItems((prev) => [...prev, { ...emptyItem }]);
  }

  function removeItem(idx: number) {
    setItems((prev) => prev.filter((_, i) => i !== idx));
  }

  function updateItem(idx: number, field: keyof InvoiceItem, value: string | number) {
    setItems((prev) => prev.map((item, i) => i === idx ? { ...item, [field]: value } : item));
  }

  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unit_price, 0);
  const taxRate = parseFloat(form.tax_rate) || 20;
  const taxAmount = (subtotal * taxRate) / 100;
  const total = subtotal + taxAmount;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setStatus(null);
    setIsError(false);
    try {
      const payload = {
        client_name: form.client_name,
        client_phone: form.client_phone || null,
        client_email: form.client_email || null,
        items,
        subtotal: Number(subtotal.toFixed(2)),
        tax_rate: taxRate,
        status: form.status,
        notes: form.notes || null,
      };
      const url = editing ? `/api/admin/invoices/${editing.id}` : '/api/admin/invoices';
      const res = await fetch(url, {
        method: editing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      setStatus(editing ? 'Facture mise à jour !' : 'Facture créée !');
      setIsError(false);
      await loadInvoices();
      closeForm();
    } catch {
      setStatus('Erreur lors de la sauvegarde.');
      setIsError(true);
    } finally {
      setSaving(false);
    }
  }

  async function deleteInvoice(id: string) {
    if (!confirm('Supprimer cette facture ?')) return;
    await fetch(`/api/admin/invoices/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    setInvoices((prev) => prev.filter((inv) => inv.id !== id));
  }

  async function updateInvoiceStatus(id: string, newStatus: Invoice['status']) {
    const inv = invoices.find((i) => i.id === id);
    if (!inv) return;
    await fetch(`/api/admin/invoices/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ...inv, status: newStatus }),
    });
    setInvoices((prev) => prev.map((i) => i.id === id ? { ...i, status: newStatus } : i));
  }

  const filtered = filterStatus ? invoices.filter((i) => i.status === filterStatus) : invoices;
  const totalRevenue = invoices.filter((i) => i.status === 'Payée').reduce((sum, i) => sum + Number(i.total), 0);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-extrabold text-foreground">Facturation</h2>
          <p className="text-muted-foreground text-sm mt-1">
            {invoices.length} facture{invoices.length !== 1 ? 's' : ''} · CA encaissé : <strong className="text-foreground">{totalRevenue.toFixed(2)} €</strong>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground">
            <option value="">Tous statuts</option>
            <option value="Brouillon">Brouillon</option>
            <option value="Envoyée">Envoyée</option>
            <option value="Payée">Payée</option>
            <option value="Annulée">Annulée</option>
          </select>
          <button onClick={openNew} className="inline-flex items-center gap-2 rounded-2xl bg-brand-green-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-green-600 transition-colors">
            <Plus className="w-4 h-4" />
            Nouvelle facture
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
          <div className="bg-card rounded-3xl border border-border w-full max-w-2xl my-8 shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h3 className="text-lg font-bold text-foreground">{editing ? `Facture ${editing.invoice_number}` : 'Nouvelle facture'}</h3>
              <button onClick={closeForm} className="rounded-xl p-2 hover:bg-muted transition-colors">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Client */}
              <div>
                <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wide mb-3">Client</h4>
                <div className="grid sm:grid-cols-3 gap-3">
                  <label className="sm:col-span-1 block">
                    <span className="text-xs font-semibold text-foreground mb-1 block">Nom *</span>
                    <input value={form.client_name} onChange={(e) => setForm((f) => ({ ...f, client_name: e.target.value }))} required className="input-field" placeholder="Jean Dupont" />
                  </label>
                  <label className="block">
                    <span className="text-xs font-semibold text-foreground mb-1 block">Téléphone</span>
                    <input value={form.client_phone} onChange={(e) => setForm((f) => ({ ...f, client_phone: e.target.value }))} className="input-field" placeholder="06 12 34 56 78" />
                  </label>
                  <label className="block">
                    <span className="text-xs font-semibold text-foreground mb-1 block">Email</span>
                    <input type="email" value={form.client_email} onChange={(e) => setForm((f) => ({ ...f, client_email: e.target.value }))} className="input-field" placeholder="jean@example.com" />
                  </label>
                </div>
              </div>

              {/* Items */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wide">Prestations / Produits</h4>
                  <button type="button" onClick={addItem} className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-green-600 hover:text-brand-green-700">
                    <Plus className="w-3.5 h-3.5" /> Ajouter une ligne
                  </button>
                </div>
                <div className="space-y-2">
                  {items.map((item, idx) => (
                    <div key={idx} className="grid grid-cols-[1fr_auto_auto_auto] gap-2 items-end">
                      <input
                        value={item.description}
                        onChange={(e) => updateItem(idx, 'description', e.target.value)}
                        className="input-field"
                        placeholder="Description"
                        required
                      />
                      <input
                        type="number" min="1" value={item.quantity}
                        onChange={(e) => updateItem(idx, 'quantity', parseInt(e.target.value) || 1)}
                        className="input-field w-16 text-center"
                        title="Quantité"
                      />
                      <input
                        type="number" min="0" step="0.01" value={item.unit_price}
                        onChange={(e) => updateItem(idx, 'unit_price', parseFloat(e.target.value) || 0)}
                        className="input-field w-24"
                        placeholder="Prix €"
                      />
                      <button type="button" onClick={() => removeItem(idx)} className="rounded-xl p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-muted-foreground hover:text-red-600 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="rounded-2xl bg-muted/50 p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Sous-total HT</span>
                  <span className="font-semibold text-foreground">{subtotal.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">TVA</span>
                    <input
                      type="number" min="0" max="100" value={form.tax_rate}
                      onChange={(e) => setForm((f) => ({ ...f, tax_rate: e.target.value }))}
                      className="w-14 rounded-lg border border-border bg-background px-2 py-1 text-xs text-center"
                    />
                    <span className="text-muted-foreground">%</span>
                  </div>
                  <span className="font-semibold text-foreground">{taxAmount.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-base font-bold border-t border-border pt-2">
                  <span>Total TTC</span>
                  <span className="text-brand-green-600">{total.toFixed(2)} €</span>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-xs font-semibold text-foreground mb-1.5 block">Statut</span>
                  <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as Invoice['status'] }))} className="input-field">
                    <option value="Brouillon">Brouillon</option>
                    <option value="Envoyée">Envoyée</option>
                    <option value="Payée">Payée</option>
                    <option value="Annulée">Annulée</option>
                  </select>
                </label>
                <label className="block">
                  <span className="text-xs font-semibold text-foreground mb-1.5 block">Notes</span>
                  <input value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} className="input-field" placeholder="Remarques..." />
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

      {/* Invoices list */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-brand-green-500" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <FileText className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p>Aucune facture pour le moment.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((inv) => (
            <div key={inv.id} className="rounded-2xl border border-border bg-card p-5 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="font-bold text-foreground">{inv.invoice_number}</span>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLES[inv.status] ?? ''}`}>{inv.status}</span>
                </div>
                <p className="text-sm text-muted-foreground">{inv.client_name}{inv.client_phone ? ` · ${inv.client_phone}` : ''}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{new Date(inv.created_at).toLocaleDateString('fr-FR')}</p>
              </div>
              <div className="flex items-center gap-6 flex-shrink-0">
                <div className="text-right">
                  <div className="text-xs text-muted-foreground">Total TTC</div>
                  <div className="text-base font-bold text-foreground">{Number(inv.total).toFixed(2)} €</div>
                </div>
                <select
                  value={inv.status}
                  onChange={(e) => updateInvoiceStatus(inv.id, e.target.value as Invoice['status'])}
                  className="rounded-xl border border-border bg-background px-3 py-1.5 text-sm text-foreground"
                >
                  <option value="Brouillon">Brouillon</option>
                  <option value="Envoyée">Envoyée</option>
                  <option value="Payée">Payée</option>
                  <option value="Annulée">Annulée</option>
                </select>
                <div className="flex items-center gap-1">
                  <button onClick={() => openEdit(inv)} className="rounded-xl p-2 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors" title="Modifier">
                    <FileText className="w-4 h-4" />
                  </button>
                  <button onClick={() => deleteInvoice(inv.id)} className="rounded-xl p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-muted-foreground hover:text-red-600 transition-colors" title="Supprimer">
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
          border-radius: 0.75rem;
          border: 1px solid hsl(var(--border));
          background: hsl(var(--background));
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          color: hsl(var(--foreground));
          outline: none;
        }
      `}</style>
    </div>
  );
}
