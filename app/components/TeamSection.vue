<script setup lang="ts">
import { PhLinkedinLogo, PhXLogo, PhEnvelopeSimple } from '@phosphor-icons/vue';
import { useScrollObserver } from '~/composables/useScrollObserver';

useScrollObserver();
const config = useRuntimeConfig();

// Fetch team data from Nuxt Content v3
const { data: teamRes } = await useAsyncData('team-section', () => 
  queryCollection('team').all(),
  { lazy: true }
);

const team = computed(() => {
  // queryCollection('team').all() returns an array of team member objects
  const members = teamRes.value || [];
  
  // Sort members by 'order' property
  const sortedMembers = [...members].sort((a: any, b: any) => {
    return (a.order || 99) - (b.order || 99);
  });

  return sortedMembers.map((m: any) => ({
    name: m.name,
    role: m.role,
    image: m.image?.url || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=800',
    linkedin: m.linkedin,
    twitter: m.twitter,
    email: m.email
  }));
});
</script>

<template>
  <section class="py-20 md:py-32 mt-20 bg-black">
    <div class="container mx-auto px-4 md:px-6">
      <!-- Header -->
      <div class="mb-16 max-w-3xl animate-on-scroll">
        <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold font-display text-white mb-6 leading-tight">
          Meet our<span class="text-[#E60000]"> passionate team</span>
        </h2>

        <p class="text-lg text-white animate-on-scroll delay-100">
         ABB has a dynamic team of young business professionals with vast experience in advisory, startup financing, business innovation, and creativity. 
        </p>
      </div>

      <!-- Team Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-on-scroll delay-100">
        <div 
          v-for="member in team" 
          :key="member.name"
          class="group relative aspect-[3/4] overflow-hidden rounded-3xl bg-gray-100"
        >
          <!-- Image -->
          <NuxtImg 
            :src="member.image" 
            :alt="member.name" 
            class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            format="webp"
            loading="lazy"
          />
          
          <!-- Name Card -->
          <div class="absolute bottom-4 left-4 right-4 bg-white rounded-xl p-4 shadow-lg transition-all duration-300 group-hover:-translate-y-1">
            <h3 class="font-bold text-gray-900 text-lg">{{ member.name }}</h3>
            <p class="text-sm text-gray-500 group-hover:text-[#E60000] transition-colors">{{ member.role }}</p>
            
            <!-- Expandable Socials -->
            <div class="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-all duration-300 ease-in-out">
              <div class="overflow-hidden">
                <div class="flex gap-4 pt-4 border-t border-gray-100 mt-3">
                  <a v-if="member.linkedin" :href="member.linkedin" target="_blank" class="text-gray-400 hover:text-[#0077b5] transition-colors">
                    <PhLinkedinLogo weight="fill" class="w-5 h-5" />
                  </a>
                  <a v-if="member.twitter" :href="member.twitter" target="_blank" class="text-gray-400 hover:text-black transition-colors">
                    <PhXLogo weight="bold" class="w-5 h-5" />
                  </a>
                  <a v-if="member.email" :href="`mailto:${member.email}`" class="text-gray-400 hover:text-[#E60000] transition-colors">
                    <PhEnvelopeSimple weight="bold" class="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
