import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import BestSellers from '@/components/home/BestSellers';
import ServicesPreview from '@/components/home/ServicesPreview';
import ReviewsSlider from '@/components/home/ReviewsSlider';
import CallToAction from '@/components/home/CallToAction';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { ProductRow } from '@/app/boutique/page';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
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

  return (
    <>
      <Hero />
      <Features />
      <BestSellers products={products} />
      <ServicesPreview />
      <ReviewsSlider />
      <CallToAction />
    </>
  );
}
