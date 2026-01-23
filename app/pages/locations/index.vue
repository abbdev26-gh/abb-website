<script setup lang="ts">
import LocationCard from '~/components/LocationCard.vue'

const locations = ref([
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
])
</script>

<template>
  <div class="py-20 md:py-32">
    <div class="container mx-auto px-4 md:px-6">
      <div class="mb-16 text-center">
        <h1 class="mb-4 font-display text-4xl font-bold tracking-tight sm:text-5xl">Our Locations</h1>
        <p class="mx-auto max-w-2xl text-lg text-muted-foreground">
          Discover our network of premium coworking spaces designed to inspire.
        </p>
      </div>
      
          <!-- Locations Preview -->
    <section class="bg-white pt-20 md:pt-32">
      <div class="container mx-auto px-4 md:px-6">
        <div class="mb-16 max-w-2xl animate-on-scroll">
          <h2 class="mb-4 font-display text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Our <span class="text-[#E60000]">Locations</span>
          </h2>
          <p class="text-xl text-gray-500 leading-relaxed">
            Strategically located workspaces designed to enhance productivity and collaboration. Choose the location that suits your business needs.
          </p>
        </div>
        
        <div class="flex flex-col gap-12 delay-100">
          <LocationListItem 
            v-for="location in locations" 
            :key="location.slug" 
            v-bind="location"
          />
        </div>
      </div>
    </section>
    </div>
  </div>
</template>
