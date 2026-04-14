'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { MapPin, Phone, MessageCircle, ArrowRight, Clock } from 'lucide-react';

export default function CallToAction() {
  return (
    <section className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto section-padding">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as any }}
          className="relative overflow-hidden rounded-3xl gradient-brand p-10 sm:p-14 text-center"
        >
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-white/10 blur-2xl" />
          </div>

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 text-white text-sm font-semibold mb-6">
              <Clock className="w-3.5 h-3.5" />
              Ouvert aujourd'hui · 10h30 – 19h00
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4 leading-tight">
              Votre téléphone mérite
              <br />
              le meilleur traitement
            </h2>

            <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
              Passez nous voir directement ou contactez-nous par WhatsApp pour un devis gratuit. Réponse garantie en moins de 10 minutes.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://wa.me/33XXXXXXXXX?text=Bonjour%2C%20je%20souhaite%20un%20devis%20gratuit."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white text-brand-violet-600 font-bold text-sm hover:bg-white/90 hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
              >
                <MessageCircle className="w-4 h-4" />
                Devis WhatsApp gratuit
              </a>
              <a
                href="tel:0620622477"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-semibold text-sm border border-white/30 transition-all duration-200 hover:-translate-y-0.5"
              >
                <Phone className="w-4 h-4" />
                Appeler maintenant
              </a>
            </div>

            <div className="flex items-center justify-center gap-2 mt-8 text-white/70 text-sm">
              <MapPin className="w-4 h-4" />
              <span>35 rue Gambetta, St Jean de Luz — </span>
              <Link href="/contact#plan" className="underline hover:text-white transition-colors">
                Voir le plan <ArrowRight className="inline w-3 h-3" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
