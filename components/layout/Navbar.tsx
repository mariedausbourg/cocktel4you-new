'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Phone, Menu, X, Smartphone, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { href: '/', label: 'Accueil' },
  { href: '/services', label: 'Réparations' },
  { href: '/boutique', label: 'Boutique' },
  { href: '/a-propos', label: 'À propos' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    if (next) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <>
      <motion.header
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'glass-light dark:glass shadow-lg shadow-brand-violet-500/10'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl gradient-violet flex items-center justify-center shadow-md group-hover:shadow-brand-violet-500/40 transition-shadow">
                <Smartphone className="w-5 h-5 text-white" />
              </div>
              <div className="relative leading-none whitespace-nowrap">
                <motion.span
                  className="block text-lg font-bold tracking-tight text-brand-violet-500 dark:text-brand-violet-400"
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6 }}
                  whileHover={{ scale: 1.02 }}
                >
                  Cocktel<span className="text-brand-green-500">4</span>you
                </motion.span>
                <motion.svg
                  width="100%"
                  height="20"
                  viewBox="0 0 300 20"
                  className="absolute left-0 -bottom-2 w-full text-brand-green-500"
                >
                  <motion.path
                    d="M 5,10 Q 75,4 150,10 Q 225,16 295,10"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1.1, ease: 'easeInOut' }}
                    whileHover={{
                      d: 'M 5,10 Q 75,15 150,10 Q 225,5 295,10',
                      transition: { duration: 0.8 },
                    }}
                  />
                </motion.svg>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    pathname === link.href
                      ? 'text-brand-violet-500 dark:text-brand-violet-400'
                      : 'text-foreground/70 hover:text-foreground hover:bg-muted'
                  }`}
                >
                  {pathname === link.href && (
                    <motion.span
                      layoutId="nav-indicator"
                      className="absolute inset-0 bg-brand-violet-50 dark:bg-brand-violet-900/30 rounded-lg"
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-foreground/60 hover:text-foreground hover:bg-muted transition-colors"
                aria-label="Changer le thème"
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              <a
                href="tel:0620622477"
                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-green-500 hover:bg-brand-green-600 text-white text-sm font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-brand-green-500/30 hover:-translate-y-0.5"
              >
                <Phone className="w-4 h-4" />
                <span>Appeler</span>
              </a>

              <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className="lg:hidden p-2 rounded-lg text-foreground/70 hover:text-foreground hover:bg-muted transition-colors"
                aria-label="Menu"
              >
                {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 left-0 right-0 z-40 glass-light dark:glass border-b border-border shadow-xl lg:hidden"
          >
            <nav className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsMobileOpen(false)}
                    className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      pathname === link.href
                        ? 'bg-brand-violet-50 dark:bg-brand-violet-900/30 text-brand-violet-500'
                        : 'text-foreground/70 hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <div className="pt-2 border-t border-border mt-2">
                <a
                  href="tel:0620622477"
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-brand-green-500 text-white text-sm font-semibold"
                >
                  <Phone className="w-4 h-4" />
                  Appeler maintenant
                </a>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
