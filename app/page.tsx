import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import ServicesPreview from '@/components/home/ServicesPreview';
import ReviewsSlider from '@/components/home/ReviewsSlider';
import CallToAction from '@/components/home/CallToAction';

export default function HomePage() {
  return (
    <>
      <Hero />
      <Features />
      <ServicesPreview />
      <ReviewsSlider />
      <CallToAction />
    </>
  );
}
