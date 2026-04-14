import type { Metadata } from 'next';
import BoutiquePageContent from '@/components/shop/BoutiquePageContent';

export const metadata: Metadata = {
  title: 'Boutique | Cocktel4you — Accessoires & Reconditionnés',
  description: 'Coques, verres trempés, chargeurs et smartphones reconditionnés. Qualité garantie. Boutique en ligne Cocktel4you.',
};

export default function BoutiquePage() {
  return <BoutiquePageContent />;
}
