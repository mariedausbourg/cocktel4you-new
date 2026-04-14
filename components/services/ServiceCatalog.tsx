'use client';

import { useState } from 'react';
import type { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Clock, Filter, X } from 'lucide-react';
import {
  brands,
  repairTypes,
  getServicesFiltered,
  type Brand,
  type RepairType,
} from '@/lib/data/services';

const brandLogos: Record<Brand, ReactNode> = {
  iPhone: (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
      <path d="M16.68 12.55c.03 3.24 2.84 4.32 2.87 4.33-.02.08-.44 1.5-1.44 2.96-.86 1.26-1.76 2.52-3.17 2.55-1.39.03-1.84-.82-3.43-.82-1.6 0-2.09.79-3.4.85-1.36.05-2.39-1.36-3.26-2.62C3.07 17.93 2 15.12 2.03 12.46c.02-2.47 1.27-3.8 2.5-4.65 1.35-.93 3.05-1.49 4.66-1.53 1.36-.03 2.64.92 3.43.92.78 0 2.25-1.14 3.79-.97.64.03 2.43.26 3.58 1.94-.09.06-2.14 1.24-2.11 3.68ZM14.7 4.55c.72-.87 1.2-2.08 1.07-3.28-1.04.04-2.29.69-3.04 1.56-.67.77-1.25 2-1.1 3.17 1.15.09 2.33-.58 3.07-1.45Z" />
    </svg>
  ),
  Samsung: (
    null
  ),
  Xiaomi: (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
      <rect x="4" y="4" width="16" height="16" rx="3.2" fill="#FF6900" />
      <path
        d="M9.2 8.2v7.6h1.9v-3.5l1.4 1.9h.9l1.4-1.9v3.5h1.9V8.2h-1.8L13 10.8l-1.9-2.6H9.2Zm8 0v7.6h1.9V8.2h-1.9Z"
        fill="white"
      />
    </svg>
  ),
  Huawei: (
    <img src="/brand-logos/huawei.png" alt="Huawei" className="h-4 w-4 object-contain" />
  ),
  OnePlus: (
    <img src="/brand-logos/LogoOne+.png" alt="OnePlus" className="h-4 w-4 object-contain" />
  ),
  Google: (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
      <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.2-.8 2.2-1.7 2.9l3 2.3c1.8-1.7 2.8-4.2 2.8-7.1 0-.7-.1-1.4-.2-2H12Z" />
      <path fill="#34A853" d="M12 21.5c2.7 0 5-.9 6.7-2.4l-3-2.3c-.8.6-2 .9-3.7.9-2.8 0-5.2-1.9-6-4.4l-3.1 2.4c1.7 3.4 5.2 5.8 9.1 5.8Z" />
      <path fill="#4A90E2" d="M6 13.3c-.2-.6-.3-1.2-.3-1.8s.1-1.2.3-1.8l-3.1-2.4C2.3 8.6 2 10 2 11.5s.3 2.9.9 4.2Z" />
      <path fill="#FBBC05" d="M12 5.3c1.5 0 2.9.5 4 1.6l2.9-2.9C17 2.3 14.7 1.5 12 1.5c-3.9 0-7.4 2.4-9.1 5.8L6 9.7c.8-2.5 3.2-4.4 6-4.4Z" />
    </svg>
  ),
};

const filterButtonClass = (active: boolean) =>
  active
    ? 'bg-brand-violet-500 border-brand-violet-500 text-white shadow-md shadow-brand-violet-500/20'
    : 'bg-background border-border text-muted-foreground hover:border-brand-violet-300 hover:text-brand-violet-500';

export default function ServiceCatalog() {
  const [selectedBrand, setSelectedBrand] = useState<Brand | undefined>();
  const [selectedRepair, setSelectedRepair] = useState<RepairType | undefined>();

  const filtered = getServicesFiltered(selectedBrand, undefined, selectedRepair);
  const hasFilters = Boolean(selectedBrand || selectedRepair);

  const clearFilters = () => {
    setSelectedBrand(undefined);
    setSelectedRepair(undefined);
  };

  const whatsappUrl = (service: { model: string; repairType: string; priceFrom: number }) =>
    `https://wa.me/33XXXXXXXXX?text=Bonjour%2C%20je%20souhaite%20un%20devis%20pour%20la%20reparation%20suivante%20%3A%20${encodeURIComponent(`${service.repairType} ${service.model} (a partir de ${service.priceFrom}EUR)`)}`;

  return (
    <div>
      <div className="bg-card rounded-3xl border border-border p-5 sm:p-6 mb-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Filter className="w-4 h-4 text-brand-violet-500" />
              <h3 className="font-semibold text-foreground">Filtrer les reparations</h3>
            </div>
          </div>

          {hasFilters && (
            <div className="flex flex-wrap items-center gap-2">
              {selectedBrand && (
                <button
                  onClick={() => setSelectedBrand(undefined)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-violet-50 dark:bg-brand-violet-900/30 text-brand-violet-600 dark:text-brand-violet-300 text-xs font-semibold"
                >
                  {brandLogos[selectedBrand]}
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
          <div>
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              Marque
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedBrand(undefined)}
                className={`px-4 py-2 rounded-xl border text-sm font-semibold transition-all ${filterButtonClass(!selectedBrand)}`}
              >
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

          <div>
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              Type de panne
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedRepair(undefined)}
                className={`px-4 py-2 rounded-xl border text-sm font-semibold transition-all ${filterButtonClass(!selectedRepair)}`}
              >
                Tous les types
              </button>
              {repairTypes.map((repair) => (
                <button
                  key={repair}
                  onClick={() => setSelectedRepair(selectedRepair === repair ? undefined : repair)}
                  className={`px-4 py-2 rounded-xl border text-sm font-semibold transition-all ${filterButtonClass(selectedRepair === repair)}`}
                >
                  {repair}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{filtered.length}</span> prestation{filtered.length > 1 ? 's' : ''} trouvee{filtered.length > 1 ? 's' : ''}
        </p>
      </div>

      <AnimatePresence mode="popLayout">
        {filtered.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
            <p className="text-muted-foreground mb-3">Aucune prestation trouvee avec ces criteres.</p>
            <button onClick={clearFilters} className="text-brand-violet-500 text-sm font-semibold hover:underline">
              Voir toutes les reparations
            </button>
          </motion.div>
        ) : (
          <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((service, i) => (
              <motion.div
                key={service.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25, delay: i * 0.03 }}
                className="bg-card rounded-2xl border border-border p-5 hover:border-brand-violet-200 dark:hover:border-brand-violet-700 hover:shadow-lg hover:shadow-brand-violet-500/5 transition-all duration-300 group flex flex-col"
              >
                {service.popular && (
                  <span className="inline-flex self-start px-2.5 py-1 rounded-full bg-brand-violet-50 dark:bg-brand-violet-900/30 text-brand-violet-600 dark:text-brand-violet-300 text-xs font-bold mb-3">
                    Populaire
                  </span>
                )}

                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      {brandLogos[service.brand] && <span className="text-sm">{brandLogos[service.brand]}</span>}
                      <span
                        className={
                          service.brand === 'Samsung'
                            ? 'text-[0.62rem] font-extrabold text-muted-foreground uppercase tracking-[0.22em]'
                            : 'text-xs font-semibold text-muted-foreground uppercase tracking-wide'
                        }
                      >
                        {service.brand}
                      </span>
                    </div>
                    <h3 className="font-bold text-foreground text-sm leading-tight">{service.model}</h3>
                    <p className="text-xs text-brand-violet-500 font-semibold mt-0.5">{service.repairType}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-lg font-extrabold text-foreground">A partir de</div>
                    <div className="text-2xl font-extrabold text-brand-violet-500">{service.priceFrom}EUR</div>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground mb-4 flex-1">{service.description}</p>

                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-1.5 text-xs text-brand-green-600 dark:text-brand-green-400 font-semibold">
                    <Clock className="w-3.5 h-3.5" />
                    {service.duration}
                  </div>
                  <a
                    href={whatsappUrl(service)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-violet-50 dark:bg-brand-violet-900/30 text-brand-violet-600 dark:text-brand-violet-300 text-xs font-semibold hover:bg-brand-violet-500 hover:text-white transition-all duration-200"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    Devis precis
                  </a>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
