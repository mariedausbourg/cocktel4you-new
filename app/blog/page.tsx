'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Clock, ArrowRight, BookOpen, Tag } from 'lucide-react';

const articles = [
  {
    id: 1,
    title: "Comment prolonger la durée de vie de votre batterie iPhone ?",
    excerpt: "Découvrez nos conseils d'experts pour maximiser l'autonomie de votre iPhone et éviter une usure prématurée de la batterie. Des gestes simples pour un résultat durable.",
    category: 'Conseils',
    readTime: '4 min',
    date: '10 mars 2025',
    image: 'https://images.pexels.com/photos/4526414/pexels-photo-4526414.jpeg?auto=compress&cs=tinysrgb&w=600',
    tags: ['iPhone', 'Batterie', 'Conseils'],
  },
  {
    id: 2,
    title: "Remplacement d'écran iPhone : ce qu'il faut savoir avant de venir",
    excerpt: "Tout ce que vous devez savoir sur la réparation d'écran : délais, prix, garantie, et différence entre écran OEM et aftermarket. Guide complet.",
    category: 'Guide',
    readTime: '6 min',
    date: '5 mars 2025',
    image: 'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=600',
    tags: ['Écran', 'iPhone', 'Prix'],
  },
  {
    id: 3,
    title: 'Smartphone reconditionné vs neuf : le comparatif complet 2025',
    excerpt: "Économies, environnement, qualité : nous décortiquons tous les avantages et inconvénients pour vous aider à faire le meilleur choix en 2025.",
    category: 'Comparatif',
    readTime: '8 min',
    date: '28 fév. 2025',
    image: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=600',
    tags: ['Reconditionné', 'Achat', 'Écologie'],
  },
  {
    id: 4,
    title: 'Samsung Galaxy S24 vs S24 Ultra : lequel réparer en cas de casse ?',
    excerpt: 'Analyse des coûts de réparation, disponibilité des pièces et complexité technique pour vous aider à décider entre réparation et remplacement.',
    category: 'Analyse',
    readTime: '5 min',
    date: '20 fév. 2025',
    image: 'https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=600',
    tags: ['Samsung', 'Tarifs', 'Analyse'],
  },
  {
    id: 5,
    title: '5 signes que votre connecteur de charge doit être remplacé',
    excerpt: 'Charge lente, branchement instable, surchauffe... Ces symptômes indiquent un problème de connecteur. Comment le diagnostiquer et y remédier.',
    category: 'Dépannage',
    readTime: '3 min',
    date: '12 fév. 2025',
    image: 'https://images.pexels.com/photos/3573351/pexels-photo-3573351.jpeg?auto=compress&cs=tinysrgb&w=600',
    tags: ['Connecteur', 'Charge', 'Diagnostic'],
  },
  {
    id: 6,
    title: 'Protection écran : verre trempé ou film plastique ?',
    excerpt: "Comparatif détaillé entre les différentes protections d'écran. Durabilité, sensibilité tactile, installation : tout ce que vous devez savoir.",
    category: 'Accessoires',
    readTime: '4 min',
    date: '5 fév. 2025',
    image: 'https://images.pexels.com/photos/5750001/pexels-photo-5750001.jpeg?auto=compress&cs=tinysrgb&w=600',
    tags: ['Protection', 'Verre trempé', 'Accessoires'],
  },
];

const categoryColors: Record<string, string> = {
  Conseils: 'bg-brand-green-50 dark:bg-brand-green-900/30 text-brand-green-600 dark:text-brand-green-300',
  Guide: 'bg-brand-green-50 dark:bg-brand-green-900/30 text-brand-green-600 dark:text-brand-green-300',
  Comparatif: 'bg-amber-50 dark:bg-amber-900/30 text-amber-600',
  Analyse: 'bg-blue-50 dark:bg-blue-900/30 text-blue-600',
  Dépannage: 'bg-rose-50 dark:bg-rose-900/30 text-rose-600',
  Accessoires: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600',
};

export default function BlogPage() {
  const featured = articles[0];
  const rest = articles.slice(1);

  return (
    <div className="min-h-screen pt-20">
      <div className="bg-gradient-to-br from-brand-green-50 to-background dark:from-brand-green-900/20 dark:to-background py-16">
        <div className="max-w-7xl mx-auto section-padding text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground mb-4">
            Conseils & actualités
            <br />
            <span className="text-brand-green-500">de nos experts</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Guides pratiques, comparatifs et conseils de nos techniciens pour prendre soin de votre smartphone.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto section-padding py-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid lg:grid-cols-2 gap-8 mb-12 bg-card rounded-3xl border border-border overflow-hidden hover:shadow-xl transition-shadow duration-300"
        >
          <div className="aspect-[4/3] lg:aspect-auto overflow-hidden">
            <img src={featured.image} alt={featured.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
          </div>
          <div className="p-8 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${categoryColors[featured.category]}`}>{featured.category}</span>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="w-3.5 h-3.5" />
                {featured.readTime} de lecture
              </div>
            </div>
            <h2 className="text-2xl font-extrabold text-foreground mb-4 leading-tight">{featured.title}</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">{featured.excerpt}</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
              <BookOpen className="w-3.5 h-3.5" />
              {featured.date}
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
              {featured.tags.map((t) => (
                <span key={t} className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-muted text-xs text-muted-foreground">
                  <Tag className="w-3 h-3" />
                  {t}
                </span>
              ))}
            </div>
            <Link href="#" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-green-500 hover:text-brand-green-600 transition-colors">
              Lire l'article
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rest.map((article, i) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="bg-card rounded-2xl border border-border overflow-hidden hover:border-brand-green-200 dark:hover:border-brand-green-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col group"
            >
              <div className="aspect-video overflow-hidden">
                <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${categoryColors[article.category]}`}>{article.category}</span>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {article.readTime}
                  </div>
                </div>
                <h3 className="font-bold text-foreground text-sm leading-tight mb-2 flex-1">{article.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4 line-clamp-2">{article.excerpt}</p>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
                  <span className="text-xs text-muted-foreground">{article.date}</span>
                  <Link href="#" className="flex items-center gap-1 text-xs font-semibold text-brand-green-500 hover:text-brand-green-600 transition-colors">
                    Lire <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
