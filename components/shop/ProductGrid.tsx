'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Star, Plus, Minus, X, Check, Heart } from 'lucide-react';
import type { ProductRow } from '@/app/boutique/page';

interface CartItem {
  product: ProductRow;
  qty: number;
}

export default function ProductGrid({ products }: { products: ProductRow[] }) {
  const [activeCategory, setActiveCategory] = useState<string>('Tous');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [addedId, setAddedId] = useState<string | null>(null);

  const categories = useMemo(
    () => ['Tous', ...Array.from(new Set(products.map((p) => p.category))).sort()],
    [products]
  );

  const filtered = activeCategory === 'Tous'
    ? products
    : products.filter((p) => p.category === activeCategory);

  const addToCart = (product: ProductRow) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.product.id === product.id);
      if (existing) {
        return prev.map((c) => c.product.id === product.id ? { ...c, qty: c.qty + 1 } : c);
      }
      return [...prev, { product, qty: 1 }];
    });
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  const updateQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev.map((c) => {
        if (c.product.id !== id) return c;
        return { ...c, qty: Math.max(0, c.qty + delta) };
      }).filter((c) => c.qty > 0)
    );
  };

  const totalItems = cart.reduce((s, c) => s + c.qty, 0);
  const totalPrice = cart.reduce((s, c) => s + c.product.price * c.qty, 0);

  const toggleWishlist = (id: string) => {
    setWishlist((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  const imageUrl = (p: ProductRow) => p.image_url ?? p.image_path ?? '';

  if (products.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <ShoppingCart className="w-10 h-10 mx-auto mb-3 opacity-40" />
        <p>Aucun produit disponible pour le moment.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all duration-200 ${
              activeCategory === cat
                ? 'bg-brand-violet-500 border-brand-violet-500 text-white shadow-lg shadow-brand-violet-500/25'
                : 'bg-card border-border text-muted-foreground hover:border-brand-violet-300 hover:text-brand-violet-500'
            }`}
          >
            {cat}
          </button>
        ))}

        <button
          onClick={() => setCartOpen(true)}
          className="ml-auto relative flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-green-500 hover:bg-brand-green-600 text-white text-sm font-semibold transition-all hover:shadow-lg hover:shadow-brand-green-500/30"
        >
          <ShoppingCart className="w-4 h-4" />
          Panier
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-brand-violet-500 text-white text-xs flex items-center justify-center font-bold">
              {totalItems}
            </span>
          )}
        </button>
      </div>

      <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <AnimatePresence mode="popLayout">
          {filtered.map((product) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.25 }}
              className="bg-card rounded-2xl border border-border overflow-hidden hover:border-brand-violet-200 dark:hover:border-brand-violet-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col"
            >
              <div className="relative overflow-hidden bg-muted aspect-square">
                {imageUrl(product) ? (
                  <img
                    src={imageUrl(product)}
                    alt={product.image_alt ?? product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                    {product.category}
                  </div>
                )}
                {product.badge && (
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-brand-violet-500 text-white text-xs font-bold">
                    {product.badge}
                  </span>
                )}
                {product.stock <= 3 && product.stock > 0 && (
                  <span className="absolute top-3 right-12 px-2.5 py-1 rounded-full bg-amber-500 text-white text-xs font-bold">
                    Stock limité
                  </span>
                )}
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 dark:bg-card flex items-center justify-center text-muted-foreground hover:text-rose-500 transition-colors shadow"
                >
                  <Heart className={`w-4 h-4 ${wishlist.includes(product.id) ? 'fill-rose-500 text-rose-500' : ''}`} />
                </button>
              </div>

              <div className="p-4 flex flex-col flex-1">
                <p className="text-xs font-semibold text-brand-violet-500 uppercase tracking-wide mb-1">{product.category}</p>
                <h3 className="text-sm font-bold text-foreground leading-tight mb-3 flex-1">{product.name}</h3>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-lg font-extrabold text-foreground">{Number(product.price).toFixed(2)}€</span>
                    {product.original_price && (
                      <span className="text-xs text-muted-foreground line-through ml-1.5">{Number(product.original_price).toFixed(2)}€</span>
                    )}
                  </div>
                  <button
                    onClick={() => addToCart(product)}
                    disabled={product.stock === 0}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-white transition-all duration-200 ${
                      product.stock === 0
                        ? 'bg-muted text-muted-foreground cursor-not-allowed'
                        : addedId === product.id
                        ? 'bg-brand-green-500 scale-110'
                        : 'bg-brand-violet-500 hover:bg-brand-violet-600 hover:scale-105'
                    }`}
                  >
                    {addedId === product.id ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </button>
                </div>
                {product.stock === 0 && (
                  <p className="text-xs text-red-500 font-semibold mt-1">Rupture de stock</p>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCartOpen(false)}
              className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-card border-l border-border z-50 flex flex-col shadow-2xl"
            >
              <div className="flex items-center justify-between p-6 border-b border-border">
                <div>
                  <h2 className="font-bold text-lg text-foreground">Mon panier</h2>
                  <p className="text-sm text-muted-foreground">{totalItems} article{totalItems > 1 ? 's' : ''}</p>
                </div>
                <button
                  onClick={() => setCartOpen(false)}
                  className="w-8 h-8 rounded-lg bg-muted hover:bg-border flex items-center justify-center text-muted-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {cart.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingCart className="w-12 h-12 text-muted mx-auto mb-3" />
                    <p className="text-muted-foreground">Votre panier est vide</p>
                  </div>
                ) : (
                  cart.map(({ product, qty }) => (
                    <div key={product.id} className="flex gap-3 p-3 rounded-xl bg-muted/40">
                      {imageUrl(product) ? (
                        <img src={imageUrl(product)} alt={product.image_alt ?? product.name} className="w-16 h-16 rounded-lg object-cover" />
                      ) : (
                        <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center text-muted-foreground text-xs">{product.category}</div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">{product.name}</p>
                        <p className="text-sm font-bold text-brand-violet-500 mt-0.5">{Number(product.price).toFixed(2)}€</p>
                        <div className="flex items-center gap-2 mt-2">
                          <button onClick={() => updateQty(product.id, -1)} className="w-6 h-6 rounded-md bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground">
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-sm font-bold text-foreground w-4 text-center">{qty}</span>
                          <button onClick={() => updateQty(product.id, 1)} className="w-6 h-6 rounded-md bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground">
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-6 border-t border-border">
                  <div className="flex justify-between mb-4">
                    <span className="font-semibold text-foreground">Total</span>
                    <span className="font-extrabold text-xl text-brand-violet-500">{totalPrice.toFixed(2)}€</span>
                  </div>
                  <button className="w-full py-3.5 rounded-xl gradient-violet text-white font-bold text-sm hover:opacity-90 hover:shadow-lg hover:shadow-brand-violet-500/30 transition-all">
                    Procéder au paiement
                  </button>
                  <p className="text-xs text-center text-muted-foreground mt-3">Paiement sécurisé — CB, PayPal, Virement</p>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
