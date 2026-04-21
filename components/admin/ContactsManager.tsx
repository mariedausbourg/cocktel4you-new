'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, Loader2, Mail, MessageSquare, Phone, Trash2 } from 'lucide-react';

type Contact = {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  channel: string;
  subject: string | null;
  message: string;
  status: 'Nouveau' | 'En cours' | 'Traite';
  notes: string | null;
  created_at: string;
};

const STATUS_STYLES: Record<string, string> = {
  Nouveau: 'bg-brand-green-50 text-brand-green-700 dark:bg-brand-green-900/30 dark:text-brand-green-300',
  'En cours': 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  Traite: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
};

function ChannelIcon({ channel }: { channel: string }) {
  if (channel === 'WhatsApp') return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-brand-green-500">
      <path d="M20.52 3.48A11.86 11.86 0 0 0 12.06 0C5.5 0 .16 5.34.16 11.9c0 2.1.55 4.14 1.6 5.95L0 24l6.33-1.66a11.8 11.8 0 0 0 5.73 1.47h.01c6.56 0 11.9-5.34 11.9-11.9 0-3.18-1.24-6.17-3.45-8.43Z" />
    </svg>
  );
  if (channel === 'Telephone') return <Phone className="w-4 h-4 text-brand-green-500" />;
  return <Mail className="w-4 h-4 text-brand-green-500" />;
}

export default function ContactsManager({ token }: { token: string }) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => { void loadContacts(); }, []);

  async function loadContacts() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/contacts', { headers: { Authorization: `Bearer ${token}` } });
      const json = await res.json();
      setContacts(json.contacts ?? []);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: string, status: string) {
    setContacts((prev) => prev.map((c) => c.id === id ? { ...c, status: status as Contact['status'] } : c));
    await fetch(`/api/admin/contacts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status }),
    });
  }

  async function deleteContact(id: string) {
    if (!confirm('Supprimer ce contact ?')) return;
    await fetch(`/api/admin/contacts/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    setContacts((prev) => prev.filter((c) => c.id !== id));
  }

  const filtered = filterStatus ? contacts.filter((c) => c.status === filterStatus) : contacts;
  const newCount = contacts.filter((c) => c.status === 'Nouveau').length;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-extrabold text-foreground">Contacts clients</h2>
          <p className="text-muted-foreground text-sm mt-1">
            {contacts.length} message{contacts.length !== 1 ? 's' : ''}
            {newCount > 0 && <span className="ml-2 inline-flex items-center rounded-full bg-brand-green-500 px-2 py-0.5 text-xs font-bold text-white">{newCount} nouveau{newCount > 1 ? 'x' : ''}</span>}
          </p>
        </div>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground self-start sm:self-auto">
          <option value="">Tous les statuts</option>
          <option value="Nouveau">Nouveau</option>
          <option value="En cours">En cours</option>
          <option value="Traite">Traité</option>
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-brand-green-500" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p>Aucun message{filterStatus ? ` avec le statut "${filterStatus}"` : ''}.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((c) => (
            <article key={c.id} className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-foreground">{c.name}</span>
                    <span className={`inline-flex items-center rounded-full px-3 py-0.5 text-xs font-semibold ${STATUS_STYLES[c.status] ?? ''}`}>{c.status}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {new Date(c.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <select
                    value={c.status}
                    onChange={(e) => updateStatus(c.id, e.target.value)}
                    className="rounded-xl border border-border bg-background px-3 py-1.5 text-sm text-foreground"
                  >
                    <option value="Nouveau">Nouveau</option>
                    <option value="En cours">En cours</option>
                    <option value="Traite">Traité</option>
                  </select>
                  <button onClick={() => deleteContact(c.id)} className="rounded-xl p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-muted-foreground hover:text-red-600 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="grid sm:grid-cols-3 gap-3">
                <div className="rounded-xl bg-muted/50 p-3">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground mb-1">
                    <ChannelIcon channel={c.channel} />
                    {c.channel}
                  </div>
                  {c.phone && <div className="text-sm text-muted-foreground">{c.phone}</div>}
                  {c.email && <div className="text-sm text-muted-foreground">{c.email}</div>}
                </div>
                {c.subject && (
                  <div className="rounded-xl bg-muted/50 p-3">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground mb-1">
                      <CheckCircle2 className="w-4 h-4 text-brand-green-500" />
                      Sujet
                    </div>
                    <div className="text-sm text-muted-foreground">{c.subject}</div>
                  </div>
                )}
                <div className={`rounded-xl bg-background border border-border p-3 ${c.subject ? '' : 'sm:col-span-2'}`}>
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Message</div>
                  <p className="text-sm text-foreground leading-relaxed">{c.message}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
