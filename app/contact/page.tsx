'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Phone, Mail, MessageCircle, Send, Check } from 'lucide-react';

const hours = [
  { day: 'Du lundi au dimanche', time: '10h30 - 19h00' },
];

function getIsOpenNow() {
  const formatter = new Intl.DateTimeFormat('fr-FR', {
    timeZone: 'Europe/Paris',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  const parts = formatter.formatToParts(new Date());
  const hour = Number(parts.find((part) => part.type === 'hour')?.value ?? '0');
  const minute = Number(parts.find((part) => part.type === 'minute')?.value ?? '0');
  const currentMinutes = hour * 60 + minute;

  return currentMinutes >= 10 * 60 + 30 && currentMinutes < 19 * 60;
}

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isOpenNow, setIsOpenNow] = useState(getIsOpenNow);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsOpenNow(getIsOpenNow());
    }, 60000);

    setIsOpenNow(getIsOpenNow());

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (window.location.hash !== '#plan') return;

    const scrollToPlan = () => {
      const plan = document.getElementById('plan');
      if (!plan) return;
      plan.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    const timeout = window.setTimeout(scrollToPlan, 50);
    return () => window.clearTimeout(timeout);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSent(true);
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="min-h-screen pt-20">
      <div className="bg-gradient-to-br from-brand-violet-50 to-background dark:from-brand-violet-900/20 dark:to-background py-16">
        <div className="max-w-7xl mx-auto section-padding text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground mb-4">
            On est là pour vous
            <br />
            <span className="text-gradient-violet">7 jours sur 7</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Devis, questions ou informations : contactez-nous par WhatsApp, téléphone ou ce formulaire.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto section-padding py-12">
        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 space-y-5">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-card rounded-2xl border border-border p-6"
            >
              <h3 className="font-bold text-foreground mb-4">Informations</h3>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-brand-violet-50 dark:bg-brand-violet-900/30 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-brand-violet-500" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">Adresse</div>
                    <div className="text-sm text-muted-foreground">35 rue Gambetta<br />St Jean de Luz</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-brand-green-50 dark:bg-brand-green-900/30 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 text-brand-green-500" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">Téléphone</div>
                    <a href="tel:0620622477" className="text-sm text-muted-foreground hover:text-brand-violet-500 transition-colors">06 20 62 24 77</a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-amber-500" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">Email</div>
                    <a href="mailto:contact@cocktel4you.fr" className="text-sm text-muted-foreground hover:text-brand-violet-500 transition-colors">contact@cocktel4you.fr</a>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-card rounded-2xl border border-border p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-4 h-4 text-brand-violet-500" />
                <h3 className="font-bold text-foreground">Horaires d'ouverture</h3>
              </div>
              <div className="space-y-3">
                {hours.map((h) => (
                  <div key={h.day} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                    <span className="text-sm text-muted-foreground">{h.day}</span>
                    <span className="text-sm font-semibold text-brand-green-600 dark:text-brand-green-400">{h.time}</span>
                  </div>
                ))}
              </div>
              <div
                className={`mt-4 flex items-center gap-2 text-xs font-semibold ${
                  isOpenNow
                    ? 'text-brand-green-600 dark:text-brand-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full animate-pulse ${
                    isOpenNow ? 'bg-brand-green-500' : 'bg-red-500'
                  }`}
                />
                {isOpenNow ? 'Ouvert maintenant' : 'Fermé maintenant'}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <a
                href="https://wa.me/33XXXXXXXXX?text=Bonjour%2C%20je%20souhaite%20un%20devis%20gratuit."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl bg-[#25D366] hover:bg-[#1fbc5a] text-white font-bold transition-all hover:shadow-lg hover:shadow-green-500/30 hover:-translate-y-0.5"
              >
                <MessageCircle className="w-5 h-5" />
                Devis express sur WhatsApp
              </a>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:col-span-3"
          >
            <div className="bg-card rounded-2xl border border-border p-8">
              <h3 className="font-bold text-xl text-foreground mb-6">Envoyez-nous un message</h3>

              {sent ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-12 text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-brand-green-50 dark:bg-brand-green-900/30 flex items-center justify-center mb-4">
                    <Check className="w-8 h-8 text-brand-green-500" />
                  </div>
                  <h4 className="text-lg font-bold text-foreground mb-2">Message envoyé !</h4>
                  <p className="text-muted-foreground">Nous vous répondrons dans les plus brefs délais, généralement en moins d'une heure.</p>
                  <button onClick={() => { setSent(false); setForm({ name: '', email: '', phone: '', subject: '', message: '' }); }} className="mt-6 text-sm font-semibold text-brand-violet-500 hover:underline">
                    Envoyer un autre message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Nom complet *</label>
                      <input
                        required
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Jean Dupont"
                        className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-brand-violet-500 focus:border-transparent text-sm text-foreground placeholder:text-muted-foreground transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Téléphone</label>
                      <input
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="Votre numéro de téléphone"
                        className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-brand-violet-500 focus:border-transparent text-sm text-foreground placeholder:text-muted-foreground transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Email *</label>
                    <input
                      required
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="jean@email.com"
                      className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-brand-violet-500 focus:border-transparent text-sm text-foreground placeholder:text-muted-foreground transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Sujet *</label>
                    <select
                      required
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-brand-violet-500 focus:border-transparent text-sm text-foreground transition-all"
                    >
                      <option value="">Sélectionnez un sujet</option>
                      <option value="devis">Demande de devis</option>
                      <option value="reparation">Suivi de réparation</option>
                      <option value="boutique">Question boutique</option>
                      <option value="reconditionne">Appareil reconditionné</option>
                      <option value="autre">Autre question</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Message *</label>
                    <textarea
                      required
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      rows={5}
                      placeholder="Décrivez votre demande, le modèle de votre téléphone et la panne constatée..."
                      className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-brand-violet-500 focus:border-transparent text-sm text-foreground placeholder:text-muted-foreground resize-none transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl gradient-violet text-white font-bold text-sm hover:opacity-90 hover:shadow-lg hover:shadow-brand-violet-500/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    {loading ? 'Envoi en cours...' : 'Envoyer le message'}
                  </button>
                </form>
              )}
            </div>

            <div id="plan" className="mt-6 rounded-2xl overflow-hidden border border-border h-64 bg-muted">
              <iframe
                src="https://www.google.com/maps?q=35%20rue%20Gambetta%2C%20St%20Jean%20de%20Luz&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Localisation Cocktel4you — 35 rue Gambetta à St Jean de Luz"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
