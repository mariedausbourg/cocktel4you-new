import Link from 'next/link';
import { Smartphone, MapPin, Clock, Phone, Mail, Facebook, Instagram, Twitter } from 'lucide-react';

const footerLinks = {
  services: [
    { href: '/services', label: 'Réparation iPhone' },
    { href: '/services', label: 'Réparation Samsung' },
    { href: '/services', label: 'Réparation Xiaomi' },
    { href: '/services', label: 'Remplacement batterie' },
    { href: '/services', label: 'Remplacement écran' },
  ],
  boutique: [
    { href: '/boutique', label: 'Coques & Protections' },
    { href: '/boutique', label: 'Verres trempés' },
    { href: '/boutique', label: 'Chargeurs' },
    { href: '/boutique', label: 'Téléphones reconditionnés' },
    { href: '/boutique', label: 'Accessoires' },
  ],
  infos: [
    { href: '/a-propos', label: 'Notre histoire' },
    { href: '/blog', label: 'Blog & Conseils' },
    { href: '/contact', label: 'Nous contacter' },
    { href: '/contact', label: 'Mentions légales' },
    { href: '/contact', label: 'CGV' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 group mb-6">
              <div className="w-10 h-10 rounded-xl gradient-violet flex items-center justify-center shadow-md">
                <Smartphone className="w-5 h-5 text-white" />
              </div>
              <div className="leading-none whitespace-nowrap">
                <span className="font-bold text-xl tracking-tight text-brand-violet-500 dark:text-brand-violet-400">
                  Cocktel<span className="text-brand-green-500">4</span>you
                </span>
              </div>
            </Link>

            <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-xs">
              Votre expert en réparation express de smartphones à St Jean de Luz. Écran cassé réparé en 30 minutes, 7j/7.
            </p>

            <div className="space-y-3">
              <div className="flex items-start gap-3 text-sm">
                <MapPin className="w-4 h-4 text-brand-violet-500 mt-0.5 shrink-0" />
                <a href="https://www.google.com/maps/dir/?api=1&destination=35+Rue+Gambetta,+64500+Saint-Jean-de-Luz" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-brand-violet-500 transition-colors">
                  35 rue Gambetta, St Jean de Luz
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Clock className="w-4 h-4 text-brand-violet-500 shrink-0" />
                <span className="text-muted-foreground">7j/7 — 10h30 à 19h00</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-brand-violet-500 shrink-0" />
                <a href="tel:0620622477" className="text-muted-foreground hover:text-brand-violet-500 transition-colors">
                  06 20 62 24 77
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-brand-violet-500 shrink-0" />
                <a href="mailto:contact@cocktel4you.fr" className="text-muted-foreground hover:text-brand-violet-500 transition-colors">
                  contact@cocktel4you.fr
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-6">
              <a href="#" aria-label="Facebook" className="w-9 h-9 rounded-lg bg-muted hover:bg-brand-violet-500 hover:text-white text-muted-foreground flex items-center justify-center transition-all duration-200">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" aria-label="Instagram" className="w-9 h-9 rounded-lg bg-muted hover:bg-brand-violet-500 hover:text-white text-muted-foreground flex items-center justify-center transition-all duration-200">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" aria-label="Twitter" className="w-9 h-9 rounded-lg bg-muted hover:bg-brand-violet-500 hover:text-white text-muted-foreground flex items-center justify-center transition-all duration-200">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-sm text-foreground mb-4">Nos réparations</h3>
            <ul className="space-y-2.5">
              {footerLinks.services.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-brand-violet-500 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-sm text-foreground mb-4">Boutique</h3>
            <ul className="space-y-2.5">
              {footerLinks.boutique.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-brand-violet-500 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-sm text-foreground mb-4">Informations</h3>
            <ul className="space-y-2.5">
              {footerLinks.infos.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-brand-violet-500 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Cocktel4you. Tous droits réservés.
          </p>
          <p className="text-xs text-muted-foreground">
            <span className="text-brand-green-500 font-semibold">Ouvert 7j/7</span> — Réparation express en 30 minutes
          </p>
        </div>
      </div>
    </footer>
  );
}
