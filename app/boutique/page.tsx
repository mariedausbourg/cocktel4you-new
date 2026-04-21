import type { Metadata } from 'next';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import BoutiquePageContent from '@/components/shop/BoutiquePageContent';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Boutique | Cocktel4you — Accessoires & Reconditionnés',
  description: 'Coques, verres trempés, chargeurs et smartphones reconditionnés. Qualité garantie. Boutique en ligne Cocktel4you.',
};

export type ProductRow = {
  id: string;
  name: string;
  brand: string | null;
  category: string;
  description: string | null;
  price: number;
  original_price: number | null;
  stock: number;
  badge: string | null;
  image_path: string | null;
  image_url: string | null;
  image_alt: string | null;
  is_active: boolean;
};

export default async function BoutiquePage() {
  const supabase = createServerSupabaseClient();
  let products: ProductRow[] = [];

  if (supabase) {
    const { data } = await supabase
      .from('products')
      .select('id, name, brand, category, description, price, original_price, stock, badge, image_path, image_url, image_alt, is_active')
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    products = (data ?? []) as ProductRow[];
  }

  return <BoutiquePageContent products={products} />;
}
