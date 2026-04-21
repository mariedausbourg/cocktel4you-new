'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, MapPin, Star, Clock, CalendarDays, ShieldCheck } from 'lucide-react';

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

const stats = [
  { value: '312+', label: 'Avis clients', icon: Star },
  { value: '30 min', label: 'Réparation express', icon: Clock },
  { value: '7j/7', label: 'Ouvert tous les jours', icon: CalendarDays },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as any } },
};

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-background via-background to-brand-violet-50 dark:to-brand-violet-900/20">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-brand-violet-500/10 dark:bg-brand-violet-500/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-brand-green-500/10 dark:bg-brand-green-500/5 blur-3xl" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[300px] h-[300px] rounded-full bg-brand-violet-400/5 blur-2xl" />
      </div>

      <div className="relative max-w-7xl mx-auto section-padding pt-24 lg:pt-32 pb-16 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div variants={container} initial="hidden" animate="show" className="text-center lg:text-left">
            <motion.a
              variants={item}
              href="https://www.google.com/maps/dir/?api=1&destination=35+Rue+Gambetta,+64500+Saint-Jean-de-Luz"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-violet-50 dark:bg-brand-violet-900/40 border border-brand-violet-200 dark:border-brand-violet-700 text-brand-violet-600 dark:text-brand-violet-300 text-sm font-semibold mb-6 hover:bg-brand-violet-100 dark:hover:bg-brand-violet-900/60 transition-colors"
            >
              <MapPin className="w-3.5 h-3.5" />
              35 rue Gambetta, St Jean de Luz
            </motion.a>

            <motion.h1 variants={item} className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight mb-6">
              <span className="text-foreground">Votre téléphone</span>
              <br />
              <span className="text-gradient-violet">réparé en 30 min</span>
              <br />
              <span className="text-foreground">Garantie offerte</span>
            </motion.h1>

            <motion.p variants={item} className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0">
              Expert en réparation express de smartphones — écran cassé, batterie, connecteur. Devis gratuit, pièces de qualité, résultat garanti.{' '}
              <strong className="text-brand-green-500">Ouvert dimanche inclus.</strong>
            </motion.p>

            <motion.div variants={item} className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-10">
              <Link
                href="/services"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl gradient-violet text-white font-semibold text-sm hover:opacity-90 hover:shadow-lg hover:shadow-brand-violet-500/30 hover:-translate-y-0.5 transition-all duration-200"
              >
                Voir les tarifs
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="https://wa.me/33620622477?text=Bonjour%2C%20je%20souhaite%20un%20devis%20gratuit."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-green-500 px-6 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-green-600 hover:shadow-lg hover:shadow-brand-green-500/30"
              >
                <WhatsAppIcon className="w-4 h-4" />
                Devis WhatsApp gratuit
              </a>
            </motion.div>

            <motion.div variants={item} className="flex items-center justify-center lg:justify-start gap-6">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="flex items-center gap-1.5 justify-center">
                    <stat.icon className="w-4 h-4 text-brand-violet-500" />
                    <span className="text-xl font-bold text-foreground">{stat.value}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{stat.label}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 40 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] as any }}
            className="relative hidden lg:block"
          >
            <div className="relative">
              <div className="absolute inset-0 gradient-brand rounded-[2.5rem] blur-2xl opacity-30 scale-95" />
              <div className="relative rounded-[2.5rem] overflow-hidden border border-white/20 shadow-2xl shadow-brand-violet-500/20">
                <img
                  src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80"
                  alt="Technicien en train de réparer un smartphone"
                  className="w-full h-[520px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-violet-900/40 to-transparent" />
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="absolute -bottom-6 -left-6 bg-card rounded-2xl p-4 shadow-xl border border-border"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-green-100 dark:bg-brand-green-900/40 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-brand-green-500" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-foreground">Garantie incluse</div>
                    <div className="text-xs text-muted-foreground">3 mois sur toutes nos réparations</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="absolute -top-6 -right-6 bg-card rounded-2xl p-4 shadow-xl border border-border"
              >
                <div className="flex items-center gap-1.5 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <div className="font-bold text-sm text-foreground">4,6 / 5</div>
                <div className="text-xs text-muted-foreground">312 avis vérifiés</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
