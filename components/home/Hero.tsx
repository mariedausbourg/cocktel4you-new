'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, MapPin, Star, Clock, CalendarDays, MessageCircle, ShieldCheck } from 'lucide-react';

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
            <motion.div
              variants={item}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-violet-50 dark:bg-brand-violet-900/40 border border-brand-violet-200 dark:border-brand-violet-700 text-brand-violet-600 dark:text-brand-violet-300 text-sm font-semibold mb-6"
            >
              <MapPin className="w-3.5 h-3.5" />
              35 rue Gambetta, St Jean de Luz
            </motion.div>

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
                href="https://wa.me/33XXXXXXXXX?text=Bonjour%2C%20je%20souhaite%20un%20devis%20gratuit."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#1fbc5a] text-white font-semibold text-sm hover:shadow-lg hover:shadow-green-500/30 hover:-translate-y-0.5 transition-all duration-200"
              >
                <MessageCircle className="w-4 h-4" />
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
