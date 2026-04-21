import type { Metadata } from 'next';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import ServicesPageContent from '@/components/services/ServicesPageContent';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Reparations | Cocktel4you - Tarifs & Catalogue',
  description: 'Consultez tous nos tarifs de reparation iPhone, Samsung, Xiaomi. Ecran casse repare en 30 min. Devis gratuit par WhatsApp.',
};

export type RepairRow = {
  id: string;
  brand: string;
  model: string;
  repair_type: string;
  price_from: number;
  duration: string;
  description: string | null;
  is_popular: boolean;
  is_active: boolean;
  image_url: string | null;
};

export default async function ServicesPage() {
  const supabase = createServerSupabaseClient();
  let repairs: RepairRow[] = [];

  if (supabase) {
    const { data, error } = await supabase
      .from('repairs')
      .select('id, brand, model, repair_type, price_from, duration, description, is_popular, is_active, image_url')
      .eq('is_active', true)
      .order('brand')
      .order('model')
      .order('repair_type');
    if (error) console.error('[ServicesPage] Supabase error:', error);
    repairs = (data ?? []) as RepairRow[];
  }

  return <ServicesPageContent repairs={repairs} />;
}
