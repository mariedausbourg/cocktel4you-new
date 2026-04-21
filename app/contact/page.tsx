'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Phone, Mail, Send, Check } from 'lucide-react';

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

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
                    <a href="https://www.google.com/maps/dir/?api=1&destination=35+Rue+Gambetta,+64500+Saint-Jean-de-Luz" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-brand-violet-500 transition-colors">35 rue Gambetta<br />Saint-Jean-de-Luz</a>
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
                href="https://wa.me/33620622477?text=Bonjour%2C%20je%20souhaite%20un%20devis%20gratuit."
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-3 rounded-2xl bg-brand-green-500 py-4 font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-brand-green-600 hover:shadow-lg hover:shadow-brand-green-500/30"
              >
                <WhatsAppIcon className="w-5 h-5" />
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
