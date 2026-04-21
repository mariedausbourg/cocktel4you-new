'use client';

import { motion } from 'framer-motion';
import ServiceCatalog from '@/components/services/ServiceCatalog';
import { Smartphone, Clock, ShieldCheck, MessageCircle } from 'lucide-react';
import type { RepairRow } from '@/app/services/page';

const highlights = [
  { icon: Clock, label: 'Reparation en 30 min', sub: 'Pour la plupart des pannes' },
  { icon: ShieldCheck, label: 'Garantie 3 mois', sub: "Pieces et main d'oeuvre" },
  { icon: MessageCircle, label: 'Devis gratuit', sub: 'Par WhatsApp ou en boutique' },
  { icon: Smartphone, label: 'Toutes marques', sub: 'iPhone, Samsung, Xiaomi...' },
];

export default function ServicesPageContent({ repairs }: { repairs: RepairRow[] }) {
  return (
    <div className="min-h-screen pt-20">
      <div className="bg-gradient-to-br from-brand-violet-50 to-background dark:from-brand-violet-900/20 dark:to-background py-16">
        <div className="max-w-7xl mx-auto section-padding text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl font-extrabold text-foreground mb-4"
          >
            Tarifs de reparation
            <br />
            <span className="text-gradient-violet">transparents et competitifs</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-muted-foreground text-lg max-w-xl mx-auto mb-10"
          >
            Filtrez par marque, modele et type de panne pour trouver votre reparation. Tous nos prix sont affiches TTC, sans mauvaises surprises.
          </motion.p>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {highlights.map((h, index) => (
              <motion.div
                key={h.label}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.15 + index * 0.08 }}
                className="bg-card rounded-2xl p-4 border border-border text-center"
              >
                <div className="w-10 h-10 rounded-xl bg-brand-violet-50 dark:bg-brand-violet-900/30 flex items-center justify-center mx-auto mb-2">
                  <h.icon className="w-5 h-5 text-brand-violet-500" />
                </div>
                <div className="text-sm font-bold text-foreground">{h.label}</div>
                <div className="text-xs text-muted-foreground">{h.sub}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto section-padding py-12">
        <ServiceCatalog repairs={repairs} />
      </div>
    </div>
  );
}
