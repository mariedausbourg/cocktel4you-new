'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

export default function WhatsAppButton() {
  const [showTooltip, setShowTooltip] = useState(false);

  const whatsappUrl = 'https://wa.me/33XXXXXXXXX?text=Bonjour%2C%20j%27ai%20besoin%20d%27un%20devis%20pour%20une%20r%C3%A9paration.';

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            className="bg-card border border-border rounded-2xl p-4 shadow-xl max-w-[220px]"
          >
            <button
              onClick={() => setShowTooltip(false)}
              className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            <p className="text-sm font-semibold text-foreground mb-1">Devis en 10 min !</p>
            <p className="text-xs text-muted-foreground">Envoyez-nous un message sur WhatsApp pour un devis gratuit et rapide.</p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 block text-center text-xs font-semibold text-white bg-[#25D366] rounded-lg py-2 hover:bg-[#1fbc5a] transition-colors"
            >
              Envoyer un message
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setShowTooltip(!showTooltip)}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: 'spring', stiffness: 300, damping: 20 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="relative w-14 h-14 rounded-full bg-[#25D366] text-white shadow-2xl shadow-green-500/40 flex items-center justify-center"
        aria-label="Contacter sur WhatsApp"
      >
        <motion.div
          className="absolute inset-0 rounded-full bg-[#25D366] opacity-40"
          animate={{ scale: [1, 1.4, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
        <MessageCircle className="w-7 h-7 relative z-10" />
      </motion.button>
    </div>
  );
}
