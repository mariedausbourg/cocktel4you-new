import type { Metadata } from 'next';
import ServicesPageContent from '@/components/services/ServicesPageContent';

export const metadata: Metadata = {
  title: 'Reparations | Cocktel4you - Tarifs & Catalogue',
  description: 'Consultez tous nos tarifs de reparation iPhone, Samsung, Xiaomi. Ecran casse repare en 30 min. Devis gratuit par WhatsApp.',
};

export default function ServicesPage() {
  return <ServicesPageContent />;
}
