<script setup lang="ts">
import { PhArrowRight } from '@phosphor-icons/vue';
import { useScrollObserver } from '~/composables/useScrollObserver';

const config = useRuntimeConfig();

useScrollObserver();

const { data: ctaData } = await useAsyncData('cta', () => 
  queryCollection('cta').first()
)

console.log('cta data:', ctaData.value)
</script>

<template>
  <section class="relative py-24 lg:py-32 overflow-hidden">
    <!-- Background Image -->
    <div class="absolute inset-0 w-full h-full z-0">
      <img 
        src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2000" 
        alt="Office background" 
        class="w-full h-full object-cover"
      />
      <!-- Subtle overlay to ensure text readability if image is too bright, though banner handles most of it -->
      <div class="absolute inset-0 bg-black/5"></div>
    </div>

    <!-- Floating Banner -->
    <div class="relative z-10 container mx-auto px-4 md:px-6">
      <div class="max-w-5xl mx-auto bg-[#E60000] p-8 md:p-12 lg:px-16 shadow-2xl rounded-none md:rounded-xl animate-on-scroll">
        <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div class="max-w-2xl">
            <h2 class="text-3xl md:text-4xl font-bold text-white mb-3 leading-tight">
              {{ ctaData?.heading || 'cta heading' }}
            </h2>
            <p class="text-white/90 text-lg font-medium">
              {{ ctaData?.description || 'cta description' }}
            </p>
          </div>
          
          <div class="shrink-0">
            <NuxtLink 
              :to="ctaData?.cta?.url || '#contact'" 
              class="group inline-flex items-center justify-center gap-2 px-8 py-3 text-base font-bold text-red-600 bg-white border-2 rounded-full border-transparent hover:bg-gray-50 transition-all duration-300 shadow-lg"
            >
              {{ ctaData?.cta?.ctaText || 'cta cta text' }}
              <!-- Simple arrow or no icon as per reference image, but keeping consistent with design system -->
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
