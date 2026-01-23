<script setup lang="ts">
import HeroSection from '~/components/HeroSection.vue'
import AboutSection from '~/components/AboutSection.vue' // Adding this as it was missing or implied (actually it wasn't in list but used in template) - wait, looking at file content again.
// Original file had:
// import HeroSection from '~/components/HeroSection.vue'
// import PartnersSection from '~/components/PartnersSection.vue'
// ...
// It did NOT have AboutSection imported in the snippet I saw! (lines 1-8). Wait, line 53 used `<AboutSection />`. If it works, it must be auto-imported or I missed the import in the 800 lines?
// View of index.vue showed lines 1-76.
// Line 2: import HeroSection...
// Line 7: import LocationListItem...
// Line 8: import TeamSection...
// AboutSection wasn't imported explicitly. So Nuxt auto-imports are active.
// Therefore, I should remove the explicit imports for the components I made Lazy so Nuxt can lazy-load them correctly.
import ServicesSection from '~/components/ServicesSection.vue'
import { useScrollObserver } from '~/composables/useScrollObserver';

useScrollObserver();


const locations = [
  {
    name: 'Airport City Branch',
    description: 'A premium corporate workspace located in the heart of Accra’s business district. Featuring state-of-the-art facilities, panoramic city views, and direct access to major transport links. Ideal for multinational corporations and established enterprises.',
    address: '2 Allotey road, East Legon, Accra, Ghana',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000',
    slug: 'airport-branch',
    features: ['Private Offices', 'Executive Suites', 'Conf. Center'],
    stats: [
      { label: 'Capacity', value: '200+ Seats' },
      { label: 'Meeting Rooms', value: '5 Rooms' },
      { label: 'Availability', value: 'Immediate' }
    ]
  },
  {
    name: 'Tema Community 16 Branch',
    description: 'A vibrant and flexible coworking environment designed for startups and freelancers. Offers open-plan desks, creative studios, and a collaborative community atmosphere. Located in the industrial hub with easy access to the port.',
    address: 'Tema Community 16, Tema, Ghana',
    image: 'https://images.unsplash.com/photo-1604328698692-f76ea9498e76?auto=format&fit=crop&q=80&w=1000',
    slug: 'tema-branch',
    features: ['Coworking Desks', 'Creative Studio', 'Event Space'],
    stats: [
      { label: 'Capacity', value: '150+ Seats' },
      { label: 'Meeting Rooms', value: '3 Rooms' },
      { label: 'Availability', value: 'Limited' }
    ]
  }
]

useSeoMeta({
  title: 'Providing businesses with training, talent management and business support services in Ghana and Africa',
  description: 'Africa Business Bureau offers you a 360° Launchpad for Growth in Ghana and Africa. We provide businesses with training, talent management, and business support services to incubate their business ideas and accelerate growth.',
})
</script>

<template>
  <div>
    <HeroSection />
    
    <AboutSection />

    <ServicesSection />


    <LazyAdditionalServices />
   


    <!-- Membership Benefits Section -->
    <LazyMembershipBenefits />
    
    <LazyPartnersSection />

     <!-- Team Section -->
    <LazyTeamSection />

    <LazyTestimonialSection />

    <!-- CTA Section -->
    <LazyCTASection />
  </div>
</template>
