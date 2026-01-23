<script setup lang="ts">
import { PhCheckSquare } from '@phosphor-icons/vue'
import { useScrollObserver } from '~/composables/useScrollObserver';

useScrollObserver();

const { data: benefitsData } = await useAsyncData('benefit-section', () => 
  queryCollection('membership').first(),
  { lazy: true }
)

console.log('benefitsData', benefitsData.value)

const title = computed(() => benefitsData.value?.title || '')
const description = computed(() => benefitsData.value?.description || '')
const benefits = computed(() => benefitsData.value?.listItems || [])
const cta = computed(() => benefitsData.value?.cta)
const image = computed(() => {
  const img = benefitsData.value?.sectionImage?.[0] || benefitsData.value?.sectionImage 
  return img?.url || 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=1000'
})
</script>

<template>
  <section v-if="benefitsData" class="pt-20 md:pt-32 bg-white overflow-hidden">
    <div class="container mx-auto px-4 md:px-6">
      <div class="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <!-- Left Column: Image with Decorative Backdrop -->
        <div class="relative pl-4 pb-4 md:pl-10 md:pb-10 animate-on-scroll">
          <!-- Decorative Red Box -->
          <div class="absolute bottom-0 left-0 w-2/3 h-2/3 bg-[#E60000] -z-10 rounded-bl-[1rem]"></div>
          
          <!-- Main Image -->
          <div class="relative z-10 rounded-lg overflow-hidden shadow-xl">
            <NuxtImg 
              :src="image" 
              alt="Coworking space interior" 
              class="w-full h-full object-cover min-h-[420px]"
              format="webp"
              loading="lazy"
            />
          </div>
        </div>

        <!-- Right Column: Content -->
        <div>
          <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold font-display text-gray-900 mb-6 leading-tight animate-on-scroll">
            {{ title }}
          </h2>
          
          <p class="text-gray-600 mb-10 text-lg leading-relaxed animate-on-scroll delay-100">
            {{ description }}
          </p>

          <!-- Benefits List -->
          <div class="grid sm:grid-cols-2 gap-x-4 gap-y-8 mb-10 animate-on-scroll delay-200">
            <div v-for="(benefit, index) in benefits" :key="index" class="flex gap-4">
              <PhCheckSquare class="w-6 h-6 text-[#E60000] flex-shrink-0 mt-1" weight="bold" />
              <div>
                <h3 class="text-gray-900 font-bold text-lg mb-1">{{ benefit.title }}</h3>
                <p class="text-gray-600 text-sm leading-relaxed">{{ benefit.description }}</p>
              </div>
            </div>
          </div>

          <!-- CTA Button -->
          <NuxtLink 
            v-if="cta"
            :to="cta.url" 
            class="inline-flex items-center justify-center px-8 py-4 bg-[#E60000] text-white font-bold rounded-full hover:bg-[#cc0000] transition-colors shadow-lg shadow-red-200 animate-on-scroll delay-300"
          >
            {{ cta.ctaText }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>
