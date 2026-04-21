'use client';

import { motion } from 'framer-motion';
import ProductGrid from '@/components/shop/ProductGrid';
import { ShoppingBag, Truck, RotateCcw, ShieldCheck } from 'lucide-react';
import type { ProductRow } from '@/app/boutique/page';

const shopPerks = [
  { icon: Truck, label: 'Livraison rapide', sub: 'ou retrait en boutique' },
  { icon: RotateCcw, label: 'Retour 14 jours', sub: 'Satisfaction garantie' },
  { icon: ShieldCheck, label: 'Qualite certifiee', sub: 'Pieces verifiees' },
  { icon: ShoppingBag, label: 'Paiement securise', sub: 'CB, PayPal, Virement' },
];

export default function BoutiquePageContent({ products }: { products: ProductRow[] }) {
  return (
    <div className="min-h-screen pt-20">
      <div className="bg-gradient-to-br from-brand-green-50 to-background dark:from-brand-green-900/20 dark:to-background py-16">
        <div className="max-w-7xl mx-auto section-padding text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl font-extrabold text-foreground mb-4"
          >
            Accessoires & appareils
            <br />
            <span className="text-brand-green-500">reconditionnes</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-muted-foreground text-lg max-w-xl mx-auto mb-10"
          >
            Protections, chargeurs, et smartphones reconditionnes de qualite. Achetez eco-responsable avec notre garantie incluse.
          </motion.p>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {shopPerks.map((p, index) => (
              <motion.div
                key={p.label}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.15 + index * 0.08 }}
                className="bg-card rounded-2xl p-4 border border-border text-center"
              >
                <div className="w-10 h-10 rounded-xl bg-brand-green-50 dark:bg-brand-green-900/30 flex items-center justify-center mx-auto mb-2">
                  <p.icon className="w-5 h-5 text-brand-green-500" />
                </div>
                <div className="text-sm font-bold text-foreground">{p.label}</div>
                <div className="text-xs text-muted-foreground">{p.sub}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto section-padding py-12">
        <ProductGrid products={products} />
      </div>
    </div>
  );
}
