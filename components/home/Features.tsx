'use client';

import { motion } from 'framer-motion';
import { Clock, ShieldCheck, Leaf, Medal, Tag, Star } from 'lucide-react';

const features = [
  {
    icon: Clock,
    title: 'Réparation en 30 min',
    description: 'La plupart des réparations sont effectuées pendant que vous attendez. Pas de rendez-vous nécessaire.',
    color: 'bg-brand-violet-50 dark:bg-brand-violet-900/30 text-brand-violet-500',
  },
  {
    icon: ShieldCheck,
    title: 'Garantie 3 mois',
    description: 'Toutes nos réparations sont couvertes par une garantie de 3 mois sur les pièces et la main d\'œuvre.',
    color: 'bg-brand-green-50 dark:bg-brand-green-900/30 text-brand-green-500',
  },
  {
    icon: Leaf,
    title: 'Éco-responsable',
    description: 'Nous favorisons la réparation à l\'achat neuf. Prolongez la durée de vie de votre appareil.',
    color: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600',
  },
  {
    icon: Medal,
    title: 'Pièces de qualité',
    description: 'Nous utilisons uniquement des pièces de qualité OEM ou premium pour des réparations durables.',
    color: 'bg-amber-50 dark:bg-amber-900/30 text-amber-600',
  },
  {
    icon: Tag,
    title: 'Devis gratuit',
    description: 'Devis transparent et gratuit par WhatsApp ou en boutique. Aucune surprise sur la facture finale.',
    color: 'bg-blue-50 dark:bg-blue-900/30 text-blue-600',
  },
  {
    icon: Star,
    title: 'Avis clients 4,6/5',
    description: 'Plus de 312 clients satisfaits. Nous mettons un point d\'honneur à soigner chaque réparation.',
    color: 'bg-rose-50 dark:bg-rose-900/30 text-rose-500',
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const cardVariant = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Features() {
  return (
    <section className="py-20 lg:py-28 bg-muted/30 dark:bg-muted/10">
      <div className="max-w-7xl mx-auto section-padding">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Le meilleur service de réparation
            <br />
            <span className="text-gradient-violet">du centre-ville</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Nous combinons expertise technique, pièces de qualité et service client irréprochable pour vous offrir la meilleure expérience de réparation.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={cardVariant}
              className="bg-card rounded-2xl p-6 border border-border hover:border-brand-violet-200 dark:hover:border-brand-violet-700 hover:shadow-lg hover:shadow-brand-violet-500/5 hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${feature.color} transition-transform duration-200 group-hover:scale-110`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
