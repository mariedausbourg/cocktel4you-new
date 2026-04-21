'use client';

import { useEffect, useState } from 'react';
import {
  AlertTriangle,
  FileText,
  LayoutDashboard,
  LockKeyhole,
  LogOut,
  Mail,
  Menu,
  MessageSquare,
  PenLine,
  ShoppingBag,
  Wrench,
  X,
} from 'lucide-react';
import BlogManager from '@/components/admin/BlogManager';
import ProductManager from '@/components/admin/ProductManager';
import RepairManager from '@/components/admin/RepairManager';
import ContactsManager from '@/components/admin/ContactsManager';
import InvoiceManager from '@/components/admin/InvoiceManager';

// ─── Types ────────────────────────────────────────────────────────────────────

type AdminSection = 'dashboard' | 'blog' | 'products' | 'repairs' | 'contacts' | 'invoices';

const NAV_ITEMS: { id: AdminSection; label: string; icon: React.ElementType }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'blog', label: 'Blog', icon: PenLine },
  { id: 'products', label: 'Produits', icon: ShoppingBag },
  { id: 'repairs', label: 'Réparations', icon: Wrench },
  { id: 'contacts', label: 'Contacts', icon: MessageSquare },
  { id: 'invoices', label: 'Facturation', icon: FileText },
];

// ─── Lock Screen ──────────────────────────────────────────────────────────────

function LockScreen({ onUnlock }: { onUnlock: () => void }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  function tryUnlock() {
    const expected = process.env.NEXT_PUBLIC_ADMIN_ACCESS_CODE;
    if (!expected || code.trim() !== expected.trim()) {
      setError('Code incorrect.');
      setCode('');
      return;
    }
    window.sessionStorage.setItem('cocktel4you-admin-unlocked', 'true');
    onUnlock();
  }

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-brand-green-50 to-background dark:from-brand-green-900/20 dark:to-background">
      <div className="max-w-md mx-auto px-4 py-20">
        <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-brand-green-50 dark:bg-brand-green-900/30 flex items-center justify-center mb-6">
            <LockKeyhole className="w-6 h-6 text-brand-green-600" />
          </div>
          <h1 className="text-2xl font-extrabold text-foreground">Espace admin</h1>
          <p className="text-muted-foreground text-sm mt-2 mb-6">Entrez le code d accès pour continuer.</p>
          <div className="space-y-3">
            <input
              type="password"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && tryUnlock()}
              placeholder="Code d accès"
              className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-green-500"
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              onClick={tryUnlock}
              className="w-full rounded-2xl bg-brand-green-500 py-3 text-sm font-bold text-white hover:bg-brand-green-600 transition-colors"
            >
              Accéder au tableau de bord
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Dashboard Home ───────────────────────────────────────────────────────────

function DashboardHome({ token, onNavigate }: { token: string; onNavigate: (s: AdminSection) => void }) {
  const [stats, setStats] = useState({
    products: 0,
    repairs: 0,
    contacts: 0,
    lowStock: 0,
    newContacts: 0,
    revenue: 0,
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const [pRes, rRes, cRes, invRes] = await Promise.all([
          fetch('/api/admin/products', { headers }),
          fetch('/api/admin/repairs', { headers }),
          fetch('/api/admin/contacts', { headers }),
          fetch('/api/admin/invoices', { headers }),
        ]);
        const [pJson, rJson, cJson, invJson] = await Promise.all([
          pRes.json(), rRes.json(), cRes.json(), invRes.json(),
        ]);
        const products = pJson.products ?? [];
        const contacts = cJson.contacts ?? [];
        const invoices = invJson.invoices ?? [];
        setStats({
          products: products.length,
          repairs: rJson.repairs?.length ?? 0,
          contacts: contacts.length,
          lowStock: products.filter((p: { stock: number }) => p.stock <= 5).length,
          newContacts: contacts.filter((c: { status: string }) => c.status === 'Nouveau').length,
          revenue: invoices
            .filter((i: { status: string }) => i.status === 'Payée')
            .reduce((sum: number, i: { total: number }) => sum + Number(i.total), 0),
        });
      } catch { /* silently ignore */ }
    }
    void fetchStats();
  }, [token]);

  const tiles = [
    { label: 'Produits actifs', value: stats.products, icon: ShoppingBag, color: 'text-brand-green-500', bg: 'bg-brand-green-50 dark:bg-brand-green-900/30', action: 'products' as AdminSection },
    { label: 'Services réparation', value: stats.repairs, icon: Wrench, color: 'text-brand-violet-500', bg: 'bg-brand-violet-50 dark:bg-brand-violet-900/30', action: 'repairs' as AdminSection },
    { label: 'Stock faible (≤5)', value: stats.lowStock, icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/30', action: 'products' as AdminSection },
    { label: 'Nouveaux contacts', value: stats.newContacts, icon: MessageSquare, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/30', action: 'contacts' as AdminSection },
    { label: 'CA encaissé', value: `${stats.revenue.toFixed(2)} €`, icon: FileText, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/30', action: 'invoices' as AdminSection },
    { label: 'Messages reçus', value: stats.contacts, icon: Mail, color: 'text-pink-500', bg: 'bg-pink-50 dark:bg-pink-900/30', action: 'contacts' as AdminSection },
  ];

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-extrabold text-foreground">Bonjour 👋</h2>
        <p className="text-muted-foreground text-sm mt-1">Voici un aperçu de votre activité Cocktel4you.</p>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
        {tiles.map((tile) => (
          <button
            key={tile.label}
            onClick={() => onNavigate(tile.action)}
            className="rounded-2xl border border-border bg-card p-5 text-left hover:border-brand-green-300 hover:shadow-sm transition-all"
          >
            <div className={`w-10 h-10 rounded-xl ${tile.bg} flex items-center justify-center mb-3`}>
              <tile.icon className={`w-5 h-5 ${tile.color}`} />
            </div>
            <div className="text-xs text-muted-foreground">{tile.label}</div>
            <div className="text-2xl font-extrabold text-foreground mt-1">{tile.value}</div>
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-brand-green-200 dark:border-brand-green-800 bg-brand-green-50 dark:bg-brand-green-900/20 p-5">
          <h3 className="text-sm font-bold text-brand-green-800 dark:text-brand-green-200 mb-3">Actions rapides</h3>
          <div className="space-y-2">
            {[
              { label: 'Écrire un article de blog', section: 'blog' as AdminSection },
              { label: 'Ajouter un produit', section: 'products' as AdminSection },
              { label: 'Créer une facture', section: 'invoices' as AdminSection },
            ].map((a) => (
              <button key={a.label} onClick={() => onNavigate(a.section)} className="block w-full text-left text-sm text-brand-green-700 dark:text-brand-green-300 hover:font-semibold transition-all">
                → {a.label}
              </button>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="text-sm font-bold text-foreground mb-3">Rappels</h3>
          <ul className="space-y-1.5 text-sm text-muted-foreground">
            <li>• Vérifiez régulièrement le stock faible</li>
            <li>• Répondez aux nouveaux contacts sous 24h</li>
            <li>• Mettez à jour vos tarifs réparation chaque saison</li>
            <li>• Publiez un article de blog chaque semaine</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

function Sidebar({
  section,
  onSection,
  onLogout,
  onClose,
}: {
  section: AdminSection;
  onSection: (s: AdminSection) => void;
  onLogout: () => void;
  onClose?: () => void;
}) {
  return (
    <aside className="flex flex-col h-full bg-card border-r border-border">
      <div className="flex items-center justify-between px-5 py-5 border-b border-border">
        <div>
          <div className="text-base font-extrabold text-foreground leading-none">Cocktel4you</div>
          <div className="text-xs text-muted-foreground mt-0.5">Admin</div>
        </div>
        {onClose && (
          <button onClick={onClose} className="rounded-xl p-1.5 hover:bg-muted transition-colors lg:hidden">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => { onSection(item.id); onClose?.(); }}
            className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
              section === item.id
                ? 'bg-brand-green-50 dark:bg-brand-green-900/30 text-brand-green-700 dark:text-brand-green-300'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <item.icon className="w-4 h-4 flex-shrink-0" />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="border-t border-border p-4">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-muted-foreground hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [activeSection, setActiveSection] = useState<AdminSection>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const token = process.env.NEXT_PUBLIC_ADMIN_ACCESS_CODE ?? '';

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setIsUnlocked(window.sessionStorage.getItem('cocktel4you-admin-unlocked') === 'true');
  }, []);

  function logout() {
    window.sessionStorage.removeItem('cocktel4you-admin-unlocked');
    setIsUnlocked(false);
    setActiveSection('dashboard');
  }

  if (!isUnlocked) {
    return <LockScreen onUnlock={() => setIsUnlocked(true)} />;
  }

  const sectionLabel = NAV_ITEMS.find((n) => n.id === activeSection)?.label ?? '';

  return (
    <div className="min-h-screen flex pt-16 lg:pt-0 bg-background">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 flex-shrink-0 transform transition-transform duration-200 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:pt-16`}
      >
        <div className="h-full">
          <Sidebar
            section={activeSection}
            onSection={setActiveSection}
            onLogout={logout}
            onClose={() => setSidebarOpen(false)}
          />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 lg:pt-16">
        {/* Mobile top bar */}
        <div className="lg:hidden sticky top-16 z-30 flex items-center gap-3 px-4 py-3 bg-card border-b border-border">
          <button onClick={() => setSidebarOpen(true)} className="rounded-xl p-2 hover:bg-muted transition-colors">
            <Menu className="w-5 h-5 text-foreground" />
          </button>
          <span className="text-sm font-bold text-foreground">{sectionLabel}</span>
        </div>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {activeSection === 'dashboard' && <DashboardHome token={token} onNavigate={setActiveSection} />}
          {activeSection === 'blog'      && <BlogManager token={token} />}
          {activeSection === 'products'  && <ProductManager token={token} />}
          {activeSection === 'repairs'   && <RepairManager token={token} />}
          {activeSection === 'contacts'  && <ContactsManager token={token} />}
          {activeSection === 'invoices'  && <InvoiceManager token={token} />}
        </main>
      </div>
    </div>
  );
}
