<script setup lang="ts">
import { useRoute } from 'vue-router';
import { computed } from 'vue';
import { PhMapPin, PhClock, PhEnvelopeSimple } from '@phosphor-icons/vue';
import PricingCard from '~/components/PricingCard.vue';
import CTASection from '~/components/CTASection.vue';

const route = useRoute();
const currentSlug = computed(() => route.params.slug as string);

const locations = [
  {
    name: 'ABB Airport West Office',
    address: '2 Allotey road, East Legon, Accra, Ghana',
    fullAddress: 'ABB Airport City Office\n2 Allotey Road, East Legon\nAccra, Ghana',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2000',
    slug: 'airport-west-office',
    email: 'airport@abb.com',
    phone: '+233 (0) 302 123 456',
    hours: 'Monday – Friday: 6:00 AM - 10:00 PM\nSaturday – Sunday: 8:00 AM - 8:00 PM\n24/7 access available for members',
    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3970.970267230493!2d-0.1738746852339893!3d5.571583995960456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdf9a5769298d7b%3A0x4b7260533833210!2sEast%20Legon%2C%20Accra!5e0!3m2!1sen!2sgh!4v1625678901234!5m2!1sen!2sgh'
  },
  {
    name: 'ABB Tema Office',
    address: 'Tema Community 16, Tema, Ghana',
    fullAddress: 'ABB Tema Office\nIndustrial Area\nTema, Ghana',
    image: 'https://images.unsplash.com/photo-1604328698692-f76ea9498e76?auto=format&fit=crop&q=80&w=2000',
    slug: 'tema-office',
    email: 'tema@abb.com',
    phone: '+233 (0) 303 202 039',
    hours: 'Monday – Friday: 6:00 AM - 10:00 PM\nSaturday – Sunday: 8:00 AM - 8:00 PM\n24/7 access available for members',
    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3970.456789012345!2d0.012345678901!3d5.678901234567!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1020789012345678%3A0x9012345678901234!2sTema%2C%20Ghana!5e0!3m2!1sen!2sgh!4v1625678901234!5m2!1sen!2sgh'
  }
];

const currentLocation = computed(() => locations.find(l => l.slug === currentSlug.value) || locations[0]!);

// Pricing Data
const virtualPackages = [
  {
    name: 'UNIQUE PLAN',
    price: 'GHS 200',
    period: 'month (Annual billing)',
    description: 'Perfect for startups',
    features: [
      'Premium virtual business address',
      'Personalized mailbox & reception',
      'Access to exclusive events',
      '10% discount on all ABB services',
      'Logo display (+GHS 700/year)'
    ]
  },
  {
    name: 'OSCAR PLAN',
    price: 'GHS 500',
    period: 'month (Annual billing)',
    description: 'For growing businesses',
    popular: true,
    features: [
      'Everything in UNIQUE Plan',
      'Logo display included',
      '8 hours co-working space monthly',
      'Free Wi-Fi & power',
      'Administrative support'
    ]
  },
  {
    name: 'PROFESSIONAL PLAN',
    price: 'GHS 1,000',
    period: 'month (Annual billing)',
    description: 'For established companies',
    features: [
      'Everything in UNIQUE Plan',
      'Logo display included',
      'Private company locker space',
      '12 hours co-working space monthly',
      '4 hours conference room monthly'
    ]
  }
];

const spaceRentalPackages = [
  {
    name: 'Co-Working Space',
    price: 'GHS 300',
    period: 'Daily',
    description: 'Flexible desk access',
    features: [
      'High-speed Wi-Fi',
      'Uninterrupted power',
      'Administrative support',
      'Business event access',
      'Dedicated locker (Monthly)'
    ],
    extraPrices: [
      { label: 'Hourly', price: 'GHS 70' },
      { label: 'Monthly', price: 'GHS 3,000' }
    ]
  },
  {
    name: 'Premium Private Office',
    price: 'GHS 1,000',
    period: 'Daily',
    description: 'Private furnished office',
    popular: true,
    features: [
      'Private furnished office (1-2 guests)',
      'Reception services',
      'Mail handling',
      'Storage space',
      'Coffee bar access',
      'Complimentary refreshments (Daily)'
    ],
    extraPrices: [
      { label: 'Hourly', price: 'GHS 200' }
    ]
  },
  {
    name: 'Conference Space',
    price: 'GHS 1,500',
    period: 'Daily',
    description: 'Professional meeting room',
    features: [
      '6-8 seater room',
      'Digital presentation screen',
      'Whiteboard',
      'Reception services',
      'Refreshments (water & coffee)'
    ],
    extraPrices: [
      { label: 'Hourly', price: 'GHS 300' }
    ]
  }
];

useSeoMeta({
  title: () => `${currentLocation.value?.name} - Coworking & Office Space`,
  description: () => `Rent premium office space at ${currentLocation.value?.name} in ${currentLocation.value?.address}. Available packages include virtual offices, coworking desks, and private suites.`,
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    
    <!-- Hero Section -->
    <section class="relative h-[20vh] md:h-[50vh] min-h-[400px] w-full overflow-hidden">
      <transition name="fade" appear>
        <img 
          :key="currentLocation.image"
          :src="currentLocation.image" 
          :alt="currentLocation.name" 
          class="absolute inset-0 w-full h-full object-cover"
        />
      </transition>
      <div class="absolute inset-0 bg-black/40"></div>
      <div class="absolute inset-0 flex items-center justify-center">
        <transition name="slide-up" appear>
          <h1 :key="currentLocation.name" class="text-5xl md:text-7xl font-bold text-white text-center font-display drop-shadow-lg">
            {{ currentLocation.name }}
          </h1>
        </transition>
      </div>
    </section>

    <!-- Info Bar -->
    <transition name="slide-up-delayed" appear>
      <section class="bg-[#E60000] text-white max-w-6xl mx-auto py-12 relative z-10 -mt-10 rounded-2xl shadow-xl transform transition-transform duration-300 hover:scale-[1.01]">
        <div class="container mx-auto px-4">
          <div class="grid md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-white/20">
            
            <!-- Visit Us -->
            <div class="px-4 group cursor-default">
              <div class="flex justify-center mb-4 transform transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1">
                <PhMapPin :size="32" weight="regular" />
              </div>
              <h3 class="text-xl font-bold mb-2">Visit Us</h3>
              <p class="text-white/90 whitespace-pre-line">{{ currentLocation.fullAddress }}</p>
            </div>

            <!-- Operating Hours -->
            <div class="px-4 pt-8 md:pt-0 group cursor-default">
              <div class="flex justify-center mb-4 transform transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1">
                <PhClock :size="32" weight="regular" />
              </div>
              <h3 class="text-xl font-bold mb-2">Operating Hours</h3>
              <p class="text-white/90 whitespace-pre-line text-sm">{{ currentLocation.hours }}</p>
            </div>

            <!-- Get in Touch -->
            <div class="px-4 pt-8 md:pt-0 group cursor-default">
              <div class="flex justify-center mb-4 transform transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1">
                <PhEnvelopeSimple :size="32" weight="regular" />
              </div>
              <h3 class="text-xl font-bold mb-2">Get in Touch</h3>
              <p class="text-white/90 mb-1">{{ currentLocation.email }}</p>
              <p class="text-white/90 mb-1">{{ currentLocation.phone }}</p>
              <p class="text-white/80 text-sm">WhatsApp available</p>
            </div>

          </div>
        </div>
      </section>
    </transition>

    <!-- Virtual Packages Section -->
    <section class="py-16 md:py-24">
      <div class="container max-w-7xl mx-auto px-4 md:px-6">
        <div class="mb-12">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Virtual Office Packages
          </h2>
          <p class="text-gray-500 text-lg max-w-2xl">
            Establish a professional business presence without the overhead of a physical office.
          </p>
        </div>

        <div class="grid gap-8">
          <PricingCard 
            v-for="pkg in virtualPackages" 
            :key="pkg.name"
            v-bind="pkg"
          />
        </div>
      </div>
    </section>

    <!-- Space Rental Packages Section -->
    <section class="py-16 md:py-24 bg-white border-t border-gray-100">
      <div class="container max-w-7xl mx-auto px-4 md:px-6">
        <div class="mb-12">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Space Rental Packages
          </h2>
          <p class="text-gray-500 text-lg max-w-2xl">
            Flexible workspaces and meeting rooms designed for productivity and collaboration.
          </p>
        </div>

        <div class="grid gap-8">
          <PricingCard 
            v-for="pkg in spaceRentalPackages" 
            :key="pkg.name"
            v-bind="pkg"
          />
        </div>
      </div>
    </section>

    <AdditionalServices />

     <!-- Membership Benefits Section -->
    <MembershipBenefits />

    <!-- Map Section -->
    <section class="h-[400px] w-full bg-gray-200 mt-16 md:mt-24">
      <iframe 
        :src="currentLocation.mapUrl" 
        width="100%" 
        height="100%" 
        style="border:0;" 
        allowfullscreen="true" 
        loading="lazy" 
        referrerpolicy="no-referrer-when-downgrade"
      ></iframe>
    </section>

    <!-- CTA Section -->
    <CTASection />
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active {
  transition: all 0.8s ease-out;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.slide-up-delayed-enter-active {
  transition: all 0.8s ease-out;
  transition-delay: 0.2s;
}

.slide-up-delayed-enter-from {
  opacity: 0;
  transform: translateY(30px);
}
</style>
