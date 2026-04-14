'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Smartphone, Battery, Plug, Camera } from 'lucide-react';

const services = [
  {
    icon: Smartphone,
    title: 'Remplacement écran',
    description: 'Écran fissuré ou cassé ? Remplacement en 30 minutes avec pièces de qualité.',
    price: 'À partir de 49€',
    color: 'from-brand-violet-500 to-brand-violet-700',
    lightColor: 'bg-brand-violet-50 dark:bg-brand-violet-900/30',
    iconColor: 'text-brand-violet-500',
    tag: 'réparation iPhone express',
  },
  {
    icon: Battery,
    title: 'Remplacement batterie',
    description: 'Autonomie réduite ? Retrouvez une batterie neuve et performante.',
    price: 'À partir de 45€',
    color: 'from-brand-green-500 to-brand-green-700',
    lightColor: 'bg-brand-green-50 dark:bg-brand-green-900/30',
    iconColor: 'text-brand-green-500',
    tag: 'écran cassé 30 min',
  },
  {
    icon: Plug,
    title: 'Connecteur de charge',
    description: 'Votre téléphone ne charge plus ? On diagnostique et répare rapidement.',
    price: 'À partir de 49€',
    color: 'from-amber-500 to-amber-700',
    lightColor: 'bg-amber-50 dark:bg-amber-900/30',
    iconColor: 'text-amber-500',
    tag: 'réparation téléphone centre-ville',
  },
  {
    icon: Camera,
    title: 'Réparation caméra',
    description: 'Photos floues ou caméra défectueuse ? Diagnostic gratuit en boutique.',
    price: 'À partir de 79€',
    color: 'from-rose-500 to-rose-700',
    lightColor: 'bg-rose-50 dark:bg-rose-900/30',
    iconColor: 'text-rose-500',
    tag: 'ouvert dimanche',
  },
];

export default function ServicesPreview() {
  return (
    <section className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto section-padding">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12"
        >
          <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                Solutions rapides pour
                <br />
              <span className="text-brand-violet-500">tous vos problèmes</span>
              </h2>
          </div>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand-violet-500 hover:text-brand-violet-600 transition-colors shrink-0"
          >
            Voir tous les tarifs
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] as any }}
              className="group relative bg-card rounded-2xl p-6 border border-border hover:border-transparent hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-5 dark:group-hover:opacity-10 transition-opacity duration-300`} />

              <div className={`w-12 h-12 rounded-xl ${service.lightColor} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-200`}>
                <service.icon className={`w-6 h-6 ${service.iconColor}`} />
              </div>

              <h3 className="font-bold text-foreground mb-2">{service.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">{service.description}</p>

              <div className="flex items-center justify-between">
                <span className={`text-sm font-bold ${service.iconColor}`}>{service.price}</span>
                <Link
                  href="/services"
                  className={`w-8 h-8 rounded-lg ${service.lightColor} flex items-center justify-center ${service.iconColor} hover:scale-110 transition-transform`}
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
