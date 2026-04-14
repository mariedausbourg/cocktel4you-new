'use client';

import { motion } from 'framer-motion';
import { Leaf, Heart, Users, Award, ShieldCheck, Recycle } from 'lucide-react';

const team = [
  {
    name: 'Karim Benali',
    role: 'Fondateur & Expert iPhone',
    experience: "8 ans d'expérience",
    image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300',
    certifications: 'Certifié Apple • Samsung',
  },
];

const values = [
  { icon: Leaf, title: 'Éco-responsable', description: "Nous croyons en l'économie circulaire. Réparer plutôt que jeter, c'est notre philosophie au quotidien.", color: 'bg-brand-green-50 dark:bg-brand-green-900/30 text-brand-green-500' },
  { icon: Heart, title: 'Proximité', description: "Nous sommes votre voisin du quartier. Notre engagement, c'est un service de qualité à taille humaine.", color: 'bg-rose-50 dark:bg-rose-900/30 text-rose-500' },
  { icon: ShieldCheck, title: 'Transparence', description: "Devis gratuit, prix affichés, pas de mauvaises surprises. Notre honnêteté est notre meilleure publicité.", color: 'bg-brand-violet-50 dark:bg-brand-violet-900/30 text-brand-violet-500' },
  { icon: Award, title: 'Excellence', description: 'Chaque réparation est réalisée avec précision et les meilleures pièces disponibles sur le marché.', color: 'bg-amber-50 dark:bg-amber-900/30 text-amber-500' },
  { icon: Users, title: 'Communauté', description: '312+ clients satisfaits qui nous recommandent. Votre confiance est notre plus belle récompense.', color: 'bg-blue-50 dark:bg-blue-900/30 text-blue-500' },
  { icon: Recycle, title: 'Reconditionnement', description: 'Nous donnons une seconde vie aux smartphones. Achetez reconditionné et réduisez votre empreinte carbone.', color: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-500' },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const cardV = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-20">
      <div className="bg-gradient-to-br from-brand-violet-50 via-background to-brand-green-50 dark:from-brand-violet-900/20 dark:via-background dark:to-brand-green-900/10 py-20">
        <div className="max-w-7xl mx-auto section-padding">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground mb-6 leading-tight">
                Passionnés de tech,
                <br />
                <span className="text-gradient-violet">ancrés dans le quartier</span>
              </h1>
              <p className="text-muted-foreground leading-relaxed text-lg mb-5">
                Cocktel4you est né de la conviction que chaque smartphone mérite une seconde chance. Fondée en 2017 par Karim Benali, notre boutique est devenue la référence de la réparation express au centre-ville.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Avec plus de 8 000 appareils réparés et 312 avis positifs, nous avons construit une réputation solide basée sur la qualité, la rapidité et la transparence. Notre équipe de techniciens certifiés prend en charge votre appareil avec le plus grand soin.
              </p>
              <div className="grid grid-cols-3 gap-4">
                {[{ n: '8 000+', l: 'Réparations' }, { n: '8 ans', l: "D'expérience" }, { n: '4,6/5', l: 'Note clients' }].map((s) => (
                  <div key={s.l} className="text-center p-4 bg-card rounded-2xl border border-border">
                    <div className="text-2xl font-extrabold text-gradient-violet">{s.n}</div>
                    <div className="text-xs text-muted-foreground">{s.l}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
              <div className="relative">
                <div className="absolute inset-0 gradient-brand rounded-[2.5rem] blur-2xl opacity-20 scale-95" />
                <img
                  src="https://images.pexels.com/photos/4219862/pexels-photo-4219862.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Notre boutique Cocktel4you"
                  className="relative rounded-[2.5rem] w-full h-[400px] object-cover border border-white/20 shadow-2xl"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <section className="py-20">
        <div className="max-w-7xl mx-auto section-padding">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Votre expert en réparation</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">Karim Benali met son expérience et son exigence au service de chaque client, avec un accompagnement sérieux, rapide et transparent.</p>
          </motion.div>

          <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-items-center">
            {team.map((member) => (
              <motion.div key={member.name} variants={cardV} className="w-full max-w-sm md:col-start-2 bg-card rounded-2xl border border-border p-6 text-center hover:border-brand-violet-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <img src={member.image} alt={member.name} className="w-20 h-20 rounded-full object-cover mx-auto mb-4 border-2 border-brand-violet-200" />
                <h3 className="font-bold text-foreground mb-1">{member.name}</h3>
                <p className="text-sm text-brand-violet-500 font-semibold mb-1">{member.role}</p>
                <p className="text-xs text-muted-foreground mb-3">{member.experience}</p>
                <div className="flex flex-wrap justify-center gap-1.5">
                  {member.certifications.split(' • ').map((c) => (
                    <span key={c} className="px-2 py-0.5 rounded-full bg-brand-violet-50 dark:bg-brand-violet-900/30 text-brand-violet-600 dark:text-brand-violet-300 text-xs font-semibold">{c}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-muted/30 dark:bg-muted/10">
        <div className="max-w-7xl mx-auto section-padding">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Nos valeurs</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">Ce qui guide chacune de nos actions au quotidien.</p>
          </motion.div>

          <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {values.map((v) => (
              <motion.div key={v.title} variants={cardV} className="bg-card rounded-2xl border border-border p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${v.color}`}>
                  <v.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-foreground mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{v.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
