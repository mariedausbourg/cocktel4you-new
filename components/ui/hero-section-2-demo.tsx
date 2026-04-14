import React from 'react';
import { HeroSection } from '@/components/ui/hero-section-2';

export default function HeroSectionDemo() {
  return (
    <div className="w-full">
      <HeroSection
        logo={{
          url: 'https://vucvdpamtrjkzmubwlts.supabase.co/storage/v1/object/public/users/user_2zMtrqo9RMaaIn4f8F2z3oeY497/avatar.png',
          alt: 'Company Logo',
          text: 'Your Logo',
        }}
        slogan="ELEVATE YOUR PERSPECTIVE"
        title={
          <>
            Each Peak <br />
            <span className="text-primary">Teaches Something</span>
          </>
        }
        subtitle="Discover breathtaking landscapes and challenge yourself with our guided mountain expeditions. Join a community of adventurers."
        callToAction={{
          text: 'JOIN US TO EXPLORE',
          href: '#explore',
        }}
        backgroundImage="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=60"
        contactInfo={{
          website: 'yourwebsite.com',
          phone: '+1 (555) 123-4567',
          address: '20 Fieldstone Dr, Roswell, GA',
        }}
      />
    </div>
  );
}
