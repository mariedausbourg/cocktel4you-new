import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/layout/WhatsAppButton';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Cocktel4you — Réparation Express Smartphone | St Jean de Luz',
  description: "Expert en réparation iPhone express, écran cassé réparé en 30 min. Samsung, Xiaomi, Huawei. Ouvert 7j/7 dont dimanche. 35 rue Gambetta à St Jean de Luz.",
  keywords: 'réparation iPhone express, écran cassé 30 min, réparation téléphone centre-ville, ouvert dimanche, réparation smartphone',
  openGraph: {
    title: 'Cocktel4you — Réparation Express Smartphone',
    description: 'Votre expert en réparation de smartphones à St Jean de Luz. Écran cassé réparé en 30 minutes, ouvert 7j/7.',
    locale: 'fr_FR',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans`}>
        <Navbar />
        <main>{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
