'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import type { ProductRow } from '@/app/boutique/page';

const featuredAccessories: Array<{ imagePath: string; title: string }> = [
  {
    imagePath: 'accessories/2237-auriculares-vention-echo-lite-e11-plus-inalambricos-bluetooth-autonomia-30h-negros-comprar.webp',
    title: '\u00c9couteurs Bluetooth Vention Echo Lite E11 Plus',
  },
  {
    imagePath: 'accessories/belkin-boostChange-PowerBank-10k.webp',
    title: 'Batterie externe Belkin BoostCharge 10K',
  },
  {
    imagePath: 'accessories/c9e1c3df-ed46-405c-bfbe-04d77a9c2ca3_i-usams-zb352-czarny.webp',
    title: 'Mini ventilateur pliable USAMS ZB352',
  },
  {
    imagePath: 'accessories/cable-de-charge-rapide-usb-type-c-vers-usb-type-c-pd-60w-devia-100cm.webp',
    title: 'C\u00e2ble USB-C vers USB-C Devia PD 60W 1 m',
  },
  {
    imagePath: 'accessories/CLEAR-tempered-glass.webp',
    title: 'Verre tremp\u00e9 Clear',
  },
  {
    imagePath: 'accessories/connect-batterie-externe-magsafe-power-bank-10-000-mah.webp',
    title: 'Batterie externe MagSafe Connect 10 000 mAh',
  },
  {
    imagePath: 'accessories/cables-lightning-fairplay-usb-cable.webp',
    title: 'C\u00e2ble Lightning Fairplay USB',
  },
  {
    imagePath: 'accessories/ecouteurs-filaire-usb-type-c-blanc-fairplay.webp',
    title: '\u00c9couteurs filaires USB-C Fairplay',
  },
  {
    imagePath: 'accessories/fairplay-cable-senecio-usb-a-vers-micro-usb.webp',
    title: 'C\u00e2ble USB-A vers Micro-USB Fairplay',
  },
  {
    imagePath: 'accessories/fairplay-chargeur-12w-usb-a.webp',
    title: 'Chargeur secteur Fairplay 12W USB-A',
  },
  {
    imagePath: 'accessories/fairplay-chargeur-usb-c-20w.webp',
    title: 'Chargeur secteur Fairplay 20W USB-C',
  },
  {
    imagePath: 'accessories/fairplay-ecouteurs-jack-35mm.webp',
    title: '\u00c9couteurs jack 3,5 mm Fairplay',
  },
  {
    imagePath: 'accessories/FAIRPLAY-MAGNETCAR.webp',
    title: 'Support voiture magn\u00e9tique Fairplay',
  },
  {
    imagePath: 'accessories/FAIRPLAY-PACK-CHARGEUR-VOITURE-60W-CABLE-LIGHTNING-boite.webp',
    title: 'Pack chargeur voiture Fairplay 60W + c\u00e2ble Lightning',
  },
  {
    imagePath: 'accessories/lightning-earphones-Fairplay.webp',
    title: '\u00c9couteurs Lightning Fairplay',
  },
  {
    imagePath: 'accessories/mcdodo-single-light-wireless-selfie-stick.webp',
    title: 'Perche selfie sans fil MCDODO avec \u00e9clairage',
  },
  {
    imagePath: 'accessories/Pmma-watch.webp',
    title: 'Protection \u00e9cran Apple Watch PMMA',
  },
  {
    imagePath: 'accessories/pny-carte-memoire-microsd-32go-performance-plus-c1.webp',
    title: 'Carte m\u00e9moire microSD PNY 32 Go Performance Plus',
  },
  {
    imagePath: 'accessories/popsockets.webp',
    title: 'PopSockets',
  },
  {
    imagePath: 'accessories/rurihai-3d-tvrzene-sklo-pro-apple-watch-44mm.webp',
    title: 'Verre tremp\u00e9 3D Apple Watch 44 mm',
  },
  {
    imagePath: 'accessories/USAMS-US-YD011-IPX8-jpg.webp',
    title: 'Pochette \u00e9tanche smartphone USAMS IPX8',
  },
  {
    imagePath: 'accessories/USB-C-TO-USB-C-CABLE.webp',
    title: 'C\u00e2ble USB-C vers USB-C',
  },
  {
    imagePath: 'accessories/usbc-carset.webp',
    title: 'Chargeur voiture USB-C Fairplay',
  },
];

const featuredAccessoryRank = new Map<string, number>(
  featuredAccessories.map(({ imagePath }, index) => [imagePath, index])
);

const featuredAccessoryTitles = new Map<string, string>(
  featuredAccessories.map(({ imagePath, title }) => [imagePath, title])
);

const imageUrl = (product: ProductRow) => product.image_url ?? product.image_path ?? '';
const displayTitle = (product: ProductRow) =>
  featuredAccessoryTitles.get(product.image_path ?? '') ?? product.name;

export default function BestSellers({ products }: { products: ProductRow[] }) {
  const bestSellers = products
    .filter((product) => product.image_path && featuredAccessoryRank.has(product.image_path))
    .sort(
      (a, b) =>
        (featuredAccessoryRank.get(a.image_path ?? '') ?? 999) -
        (featuredAccessoryRank.get(b.image_path ?? '') ?? 999)
    )
    .slice(0, 4);

  if (bestSellers.length === 0) {
    return null;
  }

  return (
    <section className="py-20 lg:py-24">
      <div className="max-w-7xl mx-auto section-padding">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <div className="relative">
            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
                  Les best sellers
                  <br />
                  <span className="text-brand-green-500">de la boutique</span>
                </h2>
                <p className="mt-4 max-w-xl text-muted-foreground">
                  Une selection directe des produits que tu as ajoutes dans la boutique pour mettre en avant les vraies references disponibles.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/boutique"
                  className="inline-flex items-center gap-2 shrink-0 text-sm font-semibold text-brand-violet-500 transition-colors hover:text-brand-violet-600"
                >
                  Voir toute la boutique
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:mx-auto lg:max-w-[90%] xl:grid-cols-4">
          {bestSellers.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] as any }}
              className="group overflow-hidden rounded-3xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-brand-green-200 hover:shadow-xl hover:shadow-brand-green-500/10 dark:hover:border-brand-green-800"
            >
              <div className="relative aspect-[5/3] overflow-hidden bg-muted">
                {imageUrl(product) ? (
                  <img
                    src={imageUrl(product)}
                    alt={displayTitle(product)}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                    {product.category}
                  </div>
                )}
                <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
                  {product.badge && (
                    <span className="rounded-full bg-brand-violet-500 px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-white">
                      {product.badge}
                    </span>
                  )}
                </div>
              </div>

              <div className="p-4">
                <div className="mb-2 flex items-center gap-3 text-sm">
                  <div
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-semibold ${
                      product.stock > 0
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300'
                        : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300'
                    }`}
                  >
                    {product.stock > 0 ? `${product.stock} en stock` : 'Rupture'}
                  </div>
                </div>

                <h3 className="min-h-[2.5rem] text-sm font-bold leading-tight text-foreground">
                  {displayTitle(product)}
                </h3>
                <p className="mt-2 min-h-[3rem] text-sm leading-relaxed text-muted-foreground">
                  {product.description ?? 'Disponible en boutique.'}
                </p>

                <div className="mt-4 flex items-end justify-between gap-4">
                  <div>
                    <div className="text-xl font-extrabold text-foreground">
                      {Number(product.price).toFixed(2)} {'\u20ac'}
                    </div>
                    {product.original_price && (
                      <div className="text-xs text-muted-foreground line-through">
                        {Number(product.original_price).toFixed(2)} {'\u20ac'}
                      </div>
                    )}
                  </div>

                  <Link
                    href="/boutique"
                    className="inline-flex items-center gap-2 rounded-xl bg-brand-green-500 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-green-600 hover:shadow-lg hover:shadow-brand-green-500/25"
                  >
                    Voir
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
