'use client';

import { useEffect, useMemo, useState } from 'react';
import { products } from '@/lib/data/products';
import { AlertTriangle, Boxes, CheckCircle2, LockKeyhole, Mail, Package, Phone, Search } from 'lucide-react';
import BlogManager from '@/components/admin/BlogManager';

type ContactStatus = 'Nouveau' | 'En cours' | 'Traite';

type ContactRequest = {
  id: string;
  name: string;
  channel: 'WhatsApp' | 'Telephone' | 'Formulaire';
  phone: string;
  subject: string;
  message: string;
  receivedAt: string;
  status: ContactStatus;
};

const initialContacts: ContactRequest[] = [
  {
    id: 'c1',
    name: 'Julie Martin',
    channel: 'WhatsApp',
    phone: '06 81 24 77 30',
    subject: 'Demande de devis',
    message: "Ecran iPhone 13 casse, j'aimerais connaitre le prix et le delai.",
    receivedAt: 'Aujourd hui, 10h12',
    status: 'Nouveau',
  },
  {
    id: 'c2',
    name: 'Thomas Perez',
    channel: 'Telephone',
    phone: '06 22 41 18 06',
    subject: 'Suivi de reparation',
    message: 'Je souhaite savoir si mon Samsung A54 est pret au retrait.',
    receivedAt: 'Aujourd hui, 09h25',
    status: 'En cours',
  },
  {
    id: 'c3',
    name: 'Camille Dumas',
    channel: 'Formulaire',
    phone: '07 66 09 11 42',
    subject: 'Question boutique',
    message: 'Avez-vous un iPhone 13 reconditionne disponible en 128 Go ?',
    receivedAt: 'Hier, 17h40',
    status: 'Traite',
  },
];

const statusClasses: Record<ContactStatus, string> = {
  Nouveau: 'bg-brand-green-50 text-brand-green-700 dark:bg-brand-green-900/30 dark:text-brand-green-300',
  'En cours': 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  Traite: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
};

function getStockTone(stock: number) {
  if (stock <= 3) return 'text-red-600 dark:text-red-400';
  if (stock <= 10) return 'text-amber-600 dark:text-amber-400';
  return 'text-brand-green-600 dark:text-brand-green-400';
}

function WhatsAppLogo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M20.52 3.48A11.86 11.86 0 0 0 12.06 0C5.5 0 .16 5.34.16 11.9c0 2.1.55 4.14 1.6 5.95L0 24l6.33-1.66a11.8 11.8 0 0 0 5.73 1.47h.01c6.56 0 11.9-5.34 11.9-11.9 0-3.18-1.24-6.17-3.45-8.43Zm-8.46 18.32h-.01a9.8 9.8 0 0 1-5-1.37l-.36-.21-3.76.99 1-3.67-.24-.38a9.82 9.82 0 0 1-1.51-5.24c0-5.42 4.41-9.83 9.84-9.83 2.63 0 5.1 1.02 6.95 2.88a9.77 9.77 0 0 1 2.88 6.95c0 5.42-4.41 9.83-9.83 9.83Zm5.39-7.35c-.29-.14-1.72-.85-1.99-.95-.27-.1-.46-.14-.66.14-.19.29-.75.95-.92 1.15-.17.19-.34.22-.63.07-.29-.14-1.22-.45-2.33-1.43-.86-.77-1.44-1.71-1.61-2-.17-.29-.02-.44.12-.59.12-.12.29-.31.43-.46.14-.14.19-.24.29-.41.1-.17.05-.31-.02-.46-.07-.14-.66-1.59-.9-2.18-.24-.57-.48-.5-.66-.51h-.56c-.19 0-.5.07-.76.36-.26.29-1 1-.99 2.43 0 1.43 1.03 2.8 1.17 2.99.14.19 2.03 3.1 4.91 4.35.69.29 1.22.46 1.63.59.69.22 1.31.19 1.8.12.55-.08 1.72-.7 1.96-1.38.24-.67.24-1.25.17-1.38-.07-.12-.27-.19-.56-.33Z" />
    </svg>
  );
}

export default function AdminDashboard() {
  const [accessCode, setAccessCode] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [accessError, setAccessError] = useState('');
  const [query, setQuery] = useState('');
  const [stockItems, setStockItems] = useState(
    products.map((product) => ({
      ...product,
      stock: product.stock,
    }))
  );
  const [contacts, setContacts] = useState(initialContacts);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const unlocked = window.sessionStorage.getItem('cocktel4you-admin-unlocked');
    setIsUnlocked(unlocked === 'true');
  }, []);

  const filteredStock = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return stockItems.filter((item) => {
      if (!normalizedQuery) return true;
      return (
        item.name.toLowerCase().includes(normalizedQuery) ||
        item.category.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [query, stockItems]);

  const totalProducts = stockItems.length;
  const totalUnits = stockItems.reduce((sum, item) => sum + item.stock, 0);
  const lowStockCount = stockItems.filter((item) => item.stock <= 5).length;
  const newContactsCount = contacts.filter((contact) => contact.status === 'Nouveau').length;

  const updateStock = (id: string, nextStock: number) => {
    setStockItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              stock: Math.max(0, nextStock),
            }
          : item
      )
    );
  };

  const updateContactStatus = (id: string, nextStatus: ContactStatus) => {
    setContacts((prev) =>
      prev.map((contact) =>
        contact.id === id
          ? {
              ...contact,
              status: nextStatus,
            }
          : contact
      )
    );
  };

  const unlockAdmin = () => {
    if (accessCode.trim().toLowerCase() !== 'jordan') {
      setAccessError('Code incorrect.');
      return;
    }

    window.sessionStorage.setItem('cocktel4you-admin-unlocked', 'true');
    setIsUnlocked(true);
    setAccessError('');
    setAccessCode('');
  };

  if (!isUnlocked) {
    return (
      <div className="min-h-screen pt-20">
        <div className="bg-gradient-to-br from-brand-green-50 to-background py-20">
          <div className="max-w-2xl mx-auto section-padding">
            <div className="rounded-3xl border border-border bg-card p-8 md:p-10 shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-brand-green-50 flex items-center justify-center mb-6">
                <LockKeyhole className="w-6 h-6 text-brand-green-600" />
              </div>
              <h1 className="text-3xl font-extrabold text-foreground">Acces admin</h1>
              <p className="text-muted-foreground mt-3">
                Entre le code d acces pour ouvrir le tableau de bord admin et la gestion du blog.
              </p>

              <div className="mt-8 space-y-4">
                <label className="block">
                  <div className="text-sm font-semibold text-foreground mb-2">Code d acces</div>
                  <input
                    type="password"
                    value={accessCode}
                    onChange={(event) => setAccessCode(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        unlockAdmin();
                      }
                    }}
                    placeholder="Entrer le code"
                    className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-green-500"
                  />
                </label>

                <button
                  type="button"
                  onClick={unlockAdmin}
                  className="inline-flex items-center justify-center rounded-2xl bg-brand-green-500 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-green-600"
                >
                  Ouvrir l espace admin
                </button>

                {accessError ? <p className="text-sm text-red-600">{accessError}</p> : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="bg-gradient-to-br from-brand-green-50 to-background dark:from-brand-green-900/20 dark:to-background py-16">
        <div className="max-w-7xl mx-auto section-padding">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground mb-4">
              Espace admin
              <br />
              <span className="text-brand-green-500">stocks & contacts</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Suivez les disponibilites produit, reperez les ruptures rapidement et centralisez les demandes client depuis une seule interface.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 mt-10">
            <div className="bg-card rounded-2xl border border-border p-5">
              <div className="w-11 h-11 rounded-2xl bg-brand-green-50 dark:bg-brand-green-900/30 flex items-center justify-center mb-4">
                <Boxes className="w-5 h-5 text-brand-green-500" />
              </div>
              <div className="text-sm text-muted-foreground">References produit</div>
              <div className="text-3xl font-extrabold text-foreground mt-1">{totalProducts}</div>
            </div>

            <div className="bg-card rounded-2xl border border-border p-5">
              <div className="w-11 h-11 rounded-2xl bg-brand-green-50 dark:bg-brand-green-900/30 flex items-center justify-center mb-4">
                <Package className="w-5 h-5 text-brand-green-500" />
              </div>
              <div className="text-sm text-muted-foreground">Unites en stock</div>
              <div className="text-3xl font-extrabold text-foreground mt-1">{totalUnits}</div>
            </div>

            <div className="bg-card rounded-2xl border border-border p-5">
              <div className="w-11 h-11 rounded-2xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center mb-4">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
              </div>
              <div className="text-sm text-muted-foreground">Stock faible</div>
              <div className="text-3xl font-extrabold text-foreground mt-1">{lowStockCount}</div>
            </div>

            <div className="bg-card rounded-2xl border border-border p-5">
              <div className="w-11 h-11 rounded-2xl bg-brand-violet-50 dark:bg-brand-violet-900/30 flex items-center justify-center mb-4">
                <Mail className="w-5 h-5 text-brand-violet-500" />
              </div>
              <div className="text-sm text-muted-foreground">Messages a traiter</div>
              <div className="text-3xl font-extrabold text-foreground mt-1">{newContactsCount}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto section-padding py-12">
        <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
          <section className="bg-card rounded-3xl border border-border p-6 md:p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-8">
              <div>
                <h2 className="text-2xl font-extrabold text-foreground">Gestion des stocks</h2>
                <p className="text-muted-foreground mt-2">
                  Ajustez rapidement les quantites disponibles pour la boutique.
                </p>
              </div>

              <label className="relative block w-full md:w-80">
                <Search className="w-4 h-4 text-muted-foreground absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Rechercher un produit ou une categorie"
                  className="w-full rounded-2xl border border-border bg-background py-3 pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-green-500"
                />
              </label>
            </div>

            <div className="space-y-4">
              {filteredStock.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-border p-4 md:p-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="inline-flex items-center rounded-full bg-brand-green-50 dark:bg-brand-green-900/30 px-3 py-1 text-xs font-semibold text-brand-green-700 dark:text-brand-green-300">
                        {item.category}
                      </span>
                      {item.badge ? (
                        <span className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
                          {item.badge}
                        </span>
                      ) : null}
                    </div>
                    <h3 className="text-base font-bold text-foreground">{item.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 lg:justify-end">
                    <div>
                      <div className="text-xs uppercase tracking-wide text-muted-foreground">Prix</div>
                      <div className="text-base font-bold text-foreground">{item.price.toFixed(2)} EUR</div>
                    </div>

                    <div>
                      <div className="text-xs uppercase tracking-wide text-muted-foreground">Stock</div>
                      <div className={`text-sm font-semibold ${getStockTone(item.stock)}`}>
                        {item.stock} unite{item.stock > 1 ? 's' : ''}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => updateStock(item.id, item.stock - 1)}
                        className="w-10 h-10 rounded-xl border border-border bg-background text-foreground font-bold hover:border-brand-green-500 transition-colors"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min={0}
                        value={item.stock}
                        onChange={(event) => updateStock(item.id, Number(event.target.value) || 0)}
                        className="w-20 rounded-xl border border-border bg-background px-3 py-2 text-center text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-brand-green-500"
                      />
                      <button
                        type="button"
                        onClick={() => updateStock(item.id, item.stock + 1)}
                        className="w-10 h-10 rounded-xl border border-border bg-background text-foreground font-bold hover:border-brand-green-500 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-card rounded-3xl border border-border p-6 md:p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-extrabold text-foreground">Suivi des contacts</h2>
              <p className="text-muted-foreground mt-2">
                Visualisez les demandes entrantes et mettez a jour leur statut en un clic.
              </p>
            </div>

            <div className="space-y-4">
              {contacts.map((contact) => (
                <article key={contact.id} className="rounded-2xl border border-border p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base font-bold text-foreground">{contact.name}</h3>
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusClasses[contact.status]}`}>
                          {contact.status}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-2">{contact.receivedAt}</div>
                    </div>

                    <select
                      value={contact.status}
                      onChange={(event) => updateContactStatus(contact.id, event.target.value as ContactStatus)}
                      className="rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-green-500"
                    >
                      <option value="Nouveau">Nouveau</option>
                      <option value="En cours">En cours</option>
                      <option value="Traite">Traite</option>
                    </select>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 mt-5">
                    <div className="rounded-2xl bg-muted/50 p-4">
                      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                        {contact.channel === 'Telephone' ? (
                          <Phone className="w-4 h-4 text-brand-green-500" />
                        ) : contact.channel === 'WhatsApp' ? (
                          <WhatsAppLogo className="w-4 h-4 text-brand-green-500" />
                        ) : (
                          <Mail className="w-4 h-4 text-brand-green-500" />
                        )}
                        {contact.channel}
                      </div>
                      <div className="text-sm text-muted-foreground mt-2">{contact.phone}</div>
                    </div>

                    <div className="rounded-2xl bg-muted/50 p-4">
                      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                        <CheckCircle2 className="w-4 h-4 text-brand-green-500" />
                        Sujet
                      </div>
                      <div className="text-sm text-muted-foreground mt-2">{contact.subject}</div>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-background border border-border p-4 mt-4">
                    <div className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Message</div>
                    <p className="text-sm text-foreground leading-relaxed">{contact.message}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>

        <div className="mt-8">
          <BlogManager />
        </div>
      </div>
    </div>
  );
}
