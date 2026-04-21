'use client';

import { motion } from 'framer-motion';
import { MapPin, Phone, Clock, Navigation } from 'lucide-react';

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

const MAPS_EMBED = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2897.0!2d-1.6622!3d43.3878!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd51157b8b8b8b8b%3A0x0!2s35+Rue+Gambetta%2C+64500+Saint-Jean-de-Luz!5e0!3m2!1sfr!2sfr!4v1700000000000!5m2!1sfr!2sfr";
const DIRECTIONS_URL = "https://www.google.com/maps/dir/?api=1&destination=35+Rue+Gambetta,+64500+Saint-Jean-de-Luz";

export default function CallToAction() {
  return (
    <section className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto section-padding">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as any }}
          className="relative overflow-hidden rounded-3xl gradient-brand"
        >
          {/* Background blobs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-white/10 blur-2xl" />
          </div>

          <div className="relative z-10 grid lg:grid-cols-2 gap-0">
            {/* Left — infos */}
            <div className="p-10 sm:p-14 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 text-white text-sm font-semibold mb-6 w-fit">
                <Clock className="w-3.5 h-3.5" />
                Ouvert aujourd'hui · 10h30 – 19h00
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4 leading-tight">
                Votre téléphone mérite
                <br />
                le meilleur traitement
              </h2>

              <p className="text-white/80 text-lg mb-8 max-w-md">
                Passez nous voir directement ou contactez-nous par WhatsApp pour un devis gratuit. Réponse garantie en moins de 10 minutes.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <a
                  href="https://wa.me/33620622477?text=Bonjour%2C%20je%20souhaite%20un%20devis%20gratuit."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-green-500 px-6 py-3.5 text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-green-600 hover:shadow-lg hover:shadow-brand-green-900/20"
                >
                  <WhatsAppIcon className="w-4 h-4" />
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

              <a
                href="https://www.google.com/maps/dir/?api=1&destination=35+Rue+Gambetta,+64500+Saint-Jean-de-Luz"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-white/70 hover:text-white text-sm transition-colors"
              >
                <MapPin className="w-4 h-4 shrink-0" />
                <span>35 rue Gambetta, Saint-Jean-de-Luz</span>
              </a>
            </div>

            {/* Right — map */}
            <div className="relative lg:rounded-r-3xl overflow-hidden min-h-[320px] lg:min-h-0">
              <iframe
                title="Cocktel4you — 35 rue Gambetta, Saint-Jean-de-Luz"
                src={MAPS_EMBED}
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '320px' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              />
              {/* Itinéraire overlay button */}
              <a
                href={DIRECTIONS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-4 left-1/2 -translate-x-1/2 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-violet-600 hover:bg-brand-violet-700 text-white text-sm font-semibold shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl whitespace-nowrap"
              >
                <Navigation className="w-4 h-4" />
                Obtenir l'itinéraire
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
