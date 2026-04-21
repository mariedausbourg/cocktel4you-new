'use client';

import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Filter, Search, X } from 'lucide-react';

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.610-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.710.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.104-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.102 1.03 6.988 2.898a9.825 9.825 0 010.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0010.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}
import type { RepairRow } from '@/app/services/page';

// ─── Brand logos ──────────────────────────────────────────────────────────────

const brandLogos: Record<string, ReactNode> = {
  Apple: (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
      <path d="M16.68 10.55c.03 3.24 2.84 4.32 2.87 4.33-.02.08-.44 1.5-1.44 2.96-.86 1.26-1.76 2.52-3.17 2.55-1.39.03-1.84-.82-3.43-.82-1.6 0-2.09.79-3.4.85-1.36.05-2.39-1.36-3.26-2.62C3.07 17.93 2 15.10 2.03 10.46c.02-2.47 1.27-3.8 2.5-4.65 1.35-.93 3.05-1.49 4.66-1.53 1.36-.03 2.64.92 3.43.92.78 0 2.25-1.14 3.79-.97.64.03 2.43.26 3.58 1.94-.09.06-2.14 1.24-2.11 3.68ZM14.7 4.55c.72-.87 1.2-2.08 1.07-3.28-1.04.04-2.29.69-3.04 1.56-.67.77-1.25 2-1.1 3.17 1.15.09 2.33-.58 3.07-1.45Z" />
    </svg>
  ),
  Samsung: (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
      <rect width="24" height="24" rx="4" fill="#1428A0" />
      <text x="10" y="16.5" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold" fontFamily="sans-serif">SAMSUNG</text>
    </svg>
  ),
  Xiaomi: (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
      <rect x="4" y="4" width="16" height="16" rx="3.2" fill="#FF6900" />
      <path d="M9.2 8.2v7.6h1.9v-3.5l1.4 1.9h.9l1.4-1.9v3.5h1.9V8.2h-1.8L13 10.8l-1.9-2.6H9.2Zm8 0v7.6h1.9V8.2h-1.9Z" fill="white" />
    </svg>
  ),
  Huawei: <img src="/brand-logos/huawei.png" alt="Huawei" className="h-4 w-4 object-contain" />,
  OnePlus: <img src="/brand-logos/LogoOne+.png" alt="OnePlus" className="h-4 w-4 object-contain" />,
  Google: (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
      <path fill="#EA4335" d="M10 10.2v3.9h5.5c-.2 1.2-.8 2.2-1.7 2.9l3 2.3c1.8-1.7 2.8-4.2 2.8-7.1 0-.7-.1-1.4-.2-2H10Z" />
      <path fill="#34A853" d="M10 21.5c2.7 0 5-.9 6.7-2.4l-3-2.3c-.8.6-2 .9-3.7.9-2.8 0-5.2-1.9-6-4.4l-3.1 2.4c1.7 3.4 5.2 5.8 9.1 5.8Z" />
      <path fill="#4A90E2" d="M6 13.3c-.2-.6-.3-1.2-.3-1.8s.1-1.2.3-1.8l-3.1-2.4C2.3 8.6 2 10 2 11.5s.3 2.9.9 4.2Z" />
      <path fill="#FBBC05" d="M10 5.3c1.5 0 2.9.5 4 1.6l2.9-2.9C17 2.3 14.7 1.5 10 1.5c-3.9 0-7.4 2.4-9.1 5.8L6 9.7c.8-2.5 3.2-4.4 6-4.4Z" />
    </svg>
  ),
  Honor: (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
      <rect width="24" height="24" rx="4" fill="#E10000" />
      <text x="10" y="16" textAnchor="middle" fill="white" fontSize="7.5" fontWeight="bold" fontFamily="sans-serif">HONOR</text>
    </svg>
  ),
  Motorola: (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
      <circle cx="10" cy="10" r="10" fill="#E1001A" />
      <path d="M10 5.5c-3.6 0-6.5 2.9-6.5 6.5s2.9 6.5 6.5 6.5 6.5-2.9 6.5-6.5S15.6 5.5 10 5.5zm0 10.5c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4z" fill="white" />
      <path d="M10 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" fill="white" />
    </svg>
  ),
  OPPO: (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
      <rect width="24" height="24" rx="4" fill="#1F3764" />
      <text x="10" y="16" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold" fontFamily="sans-serif">OPPO</text>
    </svg>
  ),
  Realme: (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
      <rect width="24" height="24" rx="4" fill="#F5A623" />
      <text x="10" y="16" textAnchor="middle" fill="white" fontSize="8" fontWeight="900" fontFamily="sans-serif" fontStyle="italic">real</text>
    </svg>
  ),
  Sony: (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
      <rect width="24" height="24" rx="4" fill="#000" />
      <text x="10" y="16" textAnchor="middle" fill="white" fontSize="7.5" fontWeight="bold" fontFamily="sans-serif">SONY</text>
    </svg>
  ),
  TCL: (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
      <rect width="24" height="24" rx="4" fill="#D0021B" />
      <text x="10" y="16.5" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold" fontFamily="sans-serif">TCL</text>
    </svg>
  ),
  Vivo: (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
      <rect width="24" height="24" rx="4" fill="#415FFF" />
      <text x="10" y="16" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold" fontFamily="sans-serif">vivo</text>
    </svg>
  ),
  Wiko: (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
      <rect width="24" height="24" rx="4" fill="#00AEEF" />
      <text x="10" y="16" textAnchor="middle" fill="white" fontSize="7.5" fontWeight="bold" fontFamily="sans-serif">Wiko</text>
    </svg>
  ),
};

const filterButtonClass = (active: boolean) =>
  active
    ? 'bg-brand-violet-500 border-brand-violet-500 text-white shadow-md shadow-brand-violet-500/20'
    : 'bg-background border-border text-muted-foreground hover:border-brand-violet-300 hover:text-brand-violet-500';

const textCollator = new Intl.Collator('fr', { numeric: true, sensitivity: 'base' });

const normalizeText = (value: string) =>
  value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

const isBrokenScreenRepair = (repairType: string) => {
  const normalizedType = normalizeText(repairType);
  return normalizedType.includes('ecran') || normalizedType.includes('vitre');
};

const isBatteryRepair = (repairType: string) => {
  const normalizedType = normalizeText(repairType);
  return normalizedType.includes('batterie') || normalizedType.includes('battery');
};

const compareRepairs = (a: RepairRow, b: RepairRow) => {
  const brandComparison = textCollator.compare(a.brand, b.brand);
  if (brandComparison !== 0) return brandComparison;

  const modelComparison = textCollator.compare(b.model, a.model);
  if (modelComparison !== 0) return modelComparison;

  return textCollator.compare(a.repair_type, b.repair_type);
};

export default function ServiceCatalog({ repairs }: { repairs: RepairRow[] }) {
  const [selectedBrand, setSelectedBrand] = useState<string | undefined>();
  const [selectedRepair, setSelectedRepair] = useState<string | undefined>();
  const [search, setSearch] = useState('');
  const [visible, setVisible] = useState(10);

  const sortedRepairs = useMemo(
    () => [...repairs].sort(compareRepairs),
    [repairs]
  );

  const brands = useMemo(
    () => Array.from(new Set(sortedRepairs.map((r) => r.brand))).sort(textCollator.compare),
    [sortedRepairs]
  );
  const repairTypes = useMemo(
    () => Array.from(new Set(sortedRepairs.map((r) => r.repair_type))).sort(textCollator.compare),
    [sortedRepairs]
  );

  const filtered = useMemo(() => {
    const words = search.toLowerCase().trim().split(/\s+/).filter(Boolean);
    return sortedRepairs.filter((r) => {
      if (selectedBrand && r.brand !== selectedBrand) return false;
      if (selectedRepair && r.repair_type !== selectedRepair) return false;
      if (words.length > 0) {
        const haystack = `${r.brand} ${r.model} ${r.repair_type}`.toLowerCase();
        if (!words.every((w) => haystack.includes(w))) return false;
      }
      return true;
    });
  }, [sortedRepairs, selectedBrand, selectedRepair, search]);

  const displayed = filtered.slice(0, visible);
  const hasMore = visible < filtered.length;

  const hasFilters = Boolean(selectedBrand || selectedRepair || search);
  const clearFilters = () => {
    setSelectedBrand(undefined);
    setSelectedRepair(undefined);
    setSearch('');
    setVisible(10);
  };

  const whatsappUrl = (r: RepairRow) =>
    `https://wa.me/33620622477?text=Bonjour%2C%20je%20souhaite%20un%20devis%20pour%20%3A%20${encodeURIComponent(`${r.repair_type} ${r.model}`)}`;


  return (
    <div>
      {/* Search bar */}
      <div className="relative mb-4">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setVisible(10); }}
          placeholder="Rechercher un modèle, une marque..."
          className="w-full rounded-2xl border border-border bg-card pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-brand-violet-400 focus:ring-2 focus:ring-brand-violet-500/10 transition-all"
        />
        {search && (
          <button onClick={() => { setSearch(''); setVisible(10); }} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-card rounded-3xl border border-border p-5 sm:p-6 mb-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-brand-violet-500" />
            <h3 className="font-semibold text-foreground">Filtrer les reparations</h3>
          </div>

          {hasFilters && (
            <div className="flex flex-wrap items-center gap-2">
              {selectedBrand && (
                <button
                  onClick={() => setSelectedBrand(undefined)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-violet-50 dark:bg-brand-violet-900/30 text-brand-violet-600 dark:text-brand-violet-300 text-xs font-semibold"
                >
                  {brandLogos[selectedBrand] && <span>{brandLogos[selectedBrand]}</span>}
                  {selectedBrand}
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              {selectedRepair && (
                <button
                  onClick={() => setSelectedRepair(undefined)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-green-50 dark:bg-brand-green-900/20 text-brand-green-700 dark:text-brand-green-300 text-xs font-semibold"
                >
                  {selectedRepair}
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border text-xs font-semibold text-muted-foreground hover:text-brand-violet-500 hover:border-brand-violet-300 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                Reinitialiser
              </button>
            </div>
          )}
        </div>

        <div className="mt-6 space-y-5">
          {/* Brand filter */}
          <div>
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Marque</div>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setSelectedBrand(undefined)} className={`px-4 py-2 rounded-xl border text-sm font-semibold transition-all ${filterButtonClass(!selectedBrand)}`}>
                Toutes
              </button>
              {brands.map((brand) => (
                <button
                  key={brand}
                  onClick={() => setSelectedBrand(selectedBrand === brand ? undefined : brand)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-semibold transition-all ${filterButtonClass(selectedBrand === brand)}`}
                >
                  {brandLogos[brand] && <span>{brandLogos[brand]}</span>}
                  <span className={brand === 'Samsung' ? 'text-[0.72rem] font-extrabold tracking-[0.26em] uppercase' : undefined}>
                    {brand}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Repair type filter */}
          <div>
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Type de panne</div>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setSelectedRepair(undefined)} className={`px-4 py-2 rounded-xl border text-sm font-semibold transition-all ${filterButtonClass(!selectedRepair)}`}>
                Tous les types
              </button>
              {repairTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedRepair(selectedRepair === type ? undefined : type)}
                  className={`px-4 py-2 rounded-xl border text-sm font-semibold transition-all ${filterButtonClass(selectedRepair === type)}`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{displayed.length}</span>
          {' '}sur{' '}
          <span className="font-semibold text-foreground">{filtered.length}</span> prestation{filtered.length > 1 ? 's' : ''}
        </p>
      </div>

      {/* Cards */}
      <AnimatePresence mode="popLayout">
        {filtered.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
            <p className="text-muted-foreground mb-3">Aucune prestation trouvee avec ces criteres.</p>
            <button onClick={clearFilters} className="text-brand-violet-500 text-sm font-semibold hover:underline">
              Voir toutes les reparations
            </button>
          </motion.div>
        ) : (
          <motion.div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {displayed.map((r, i) => (
              <motion.div
                key={r.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25, delay: i * 0.03 }}
                className="relative bg-card rounded-2xl border border-border overflow-hidden hover:border-brand-violet-200 dark:hover:border-brand-violet-700 hover:shadow-lg hover:shadow-brand-violet-500/5 transition-all duration-300 flex flex-col"
              >
                {/* Header : marque + modèle */}
                <div className="relative z-10 px-4 pt-4 pb-2 flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5 mb-0.5">
                      {brandLogos[r.brand] && <span>{brandLogos[r.brand]}</span>}
                      <span className={r.brand === 'Samsung' ? 'text-[0.6rem] font-extrabold text-muted-foreground uppercase tracking-[0.22em]' : 'text-xs font-semibold text-muted-foreground uppercase tracking-wide'}>
                        {r.brand}
                      </span>
                    </div>
                    <h3 className="font-bold text-foreground text-sm leading-tight">{r.model}</h3>
                  </div>
                  {r.is_popular && (
                    <span className="shrink-0 px-2 py-0.5 rounded-full bg-brand-violet-50 dark:bg-brand-violet-900/30 text-brand-violet-600 dark:text-brand-violet-300 text-xs font-bold">
                      Populaire
                    </span>
                  )}
                </div>

                {/* Phone image */}
                {r.image_url && (
                  <div className="relative z-10 bg-gradient-to-b from-muted/60 to-muted/20 h-32 overflow-hidden">
                    <div className="relative flex h-full items-end justify-center px-4 pb-3">
                      <img
                        src={r.image_url}
                        alt={r.model}
                        className="relative z-10 h-28 w-auto object-contain drop-shadow-md"
                      />
                    </div>
                  </div>
                )}

                <div className="relative z-10 p-4 flex flex-col flex-1">
                  {isBrokenScreenRepair(r.repair_type) && (
                    <div className="pointer-events-none absolute -top-8 right-5 z-20 h-16 w-16 rotate-[8deg] overflow-hidden rounded-2xl border border-white/60 bg-orange-100/75 shadow-[0_12px_28px_rgba(249,115,22,0.22)]">
                      <img
                        src="/brand-logos/pexels-ecran.webp"
                        alt=""
                        aria-hidden="true"
                        className="h-full w-full object-cover opacity-85"
                      />
                    </div>
                  )}
                  {isBatteryRepair(r.repair_type) && (
                    <div className="pointer-events-none absolute -top-8 right-5 z-20 h-16 w-16 rotate-[8deg] overflow-hidden rounded-2xl border border-white/60 bg-emerald-100/75 shadow-[0_12px_28px_rgba(16,185,129,0.2)]">
                      <img
                        src="/brand-logos/battery.webp"
                        alt=""
                        aria-hidden="true"
                        className="h-full w-full scale-110 object-cover opacity-90"
                      />
                    </div>
                  )}

                  <div className="mb-3">
                    <p className="text-xs text-brand-violet-500 font-semibold">{r.repair_type}</p>
                  </div>

                  <div className="flex items-center justify-between mt-auto pt-3 border-t border-border/50">
                    <div className="flex items-center gap-1.5 text-xs text-brand-green-600 dark:text-brand-green-400 font-semibold">
                      <Clock className="w-3.5 h-3.5" />
                      {r.duration}
                    </div>
                    <a
                      href={whatsappUrl(r)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg bg-brand-green-50 px-3 py-1.5 text-xs font-semibold text-brand-green-700 transition-all duration-200 hover:bg-brand-green-500 hover:text-white dark:bg-brand-green-900/30 dark:text-brand-green-300"
                    >
                      <WhatsAppIcon className="w-3.5 h-3.5" />
                      Devis precis
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {hasMore && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setVisible((v) => v + 10)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl border border-border bg-card text-sm font-semibold text-foreground hover:border-brand-violet-400 hover:text-brand-violet-500 transition-all duration-200"
          >
            Voir plus
            <span className="text-xs text-muted-foreground font-normal">({filtered.length - visible} restantes)</span>
          </button>
        </div>
      )}

    </div>
  );
}
