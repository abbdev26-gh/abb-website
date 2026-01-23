<script setup lang="ts">
import { PhStudent, PhBuildings, PhRocket, PhBriefcase, PhInfo } from '@phosphor-icons/vue';
import { useScrollObserver } from '~/composables/useScrollObserver';
import { useHighlightText } from '~/composables/useHighlightText';

const { transform } = useHighlightText();

useScrollObserver();

const config = useRuntimeConfig();

// Fetch About Section Data (Lazy)
const { data: aboutSection } = await useAsyncData('about-section', () => 
  queryCollection('home_about').first(), 
  { lazy: true }
)

// Fetch About Page Data (Lazy)
const { data: aboutPage } = await useAsyncData('about-page-data', () => 
  queryCollection('about').first(),
  { lazy: true }
);

const iconMap: Record<string, any> = {
  'People Trained': PhStudent,
  'Businesses Supported': PhBuildings,
  'Startups Incubated': PhRocket,
  'Jobs Created': PhBriefcase
}

const displayedStats = computed(() => {
  // Use stats from About Page (single source of truth)
  const stats = aboutSection.value?.stats || [];
  
  return stats.map((stat: any) => ({
    ...stat,
    icon: iconMap[stat.label] || PhInfo
  }))
})

const sectionImageUrl = computed(() => {
  const url = aboutSection.value?.sectionImage?.url
  return url || 'https://africabusinessbureau.com/wp-content/uploads/2024/10/Progress-Report-Ghana-Economic-Transformation-Project-13-2-scaled.jpg'
})
</script>

<template>
  <section class="py-20 md:py-60 overflow-hidden">
    <div class="container mx-auto px-4 md:px-6">
      <div class="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <!-- Left Column: Image & Card -->
        <div class="relative animate-on-scroll">
          <!-- Main Image -->
          <div class="relative z-10 rounded-lg overflow-hidden">
            <NuxtImg 
              :src="sectionImageUrl" 
              :alt="aboutSection?.sectionImage?.alternativeText || 'Modern coworking space'" 
              class="w-full h-full object-cover min-h-[400px] lg:min-h-[600px]"
              format="webp"
              loading="lazy"
            />
          </div>
          
          <!-- Floating Card -->
          <div class="absolute -top-10 -left-4 md:-left-10 z-20 w-64 md:w-72 bg-[#E60000] p-8 rounded-2xl shadow-xl text-white hidden md:block animate-on-scroll delay-200">
            <h3 class="text-2xl font-bold mb-4">{{ aboutSection?.preHeader || 'preHeader' }}</h3>
            <p class="text-base leading-relaxed opacity-90">
              {{ aboutSection?.preDescription || 'preDescription' }}
            </p>
          </div>
          <!-- Mobile version of card (static, not absolute)-->
          <div class="md:hidden mt-6 bg-[#E60000] p-6 rounded shadow-xl text-white animate-on-scroll delay-200">
            <h3 class="text-xl font-bold mb-3">{{ aboutSection?.preHeader || 'preHeader' }}</h3>
            <p class="text-sm leading-relaxed opacity-90">
              {{ aboutSection?.preDescription || 'preDescription' }}
            </p>
          </div>
        </div>

        <!-- Right Column: Content -->
        <div class="lg:pl-10">
          <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold font-display text-gray-900 mb-6 leading-tight animate-on-scroll" v-html="transform(aboutSection?.title || 'title')">
          </h2>
          <p class="text-gray-600 mb-12 text-lg leading-relaxed animate-on-scroll delay-100 whitespace-pre-line">
           

{{ aboutSection?.body || 'body' }}

          </p>

          <!-- Stats Grid -->
          <div class="grid grid-cols-2 gap-x-8 gap-y-12 animate-on-scroll delay-200">
            <div v-for="stat in displayedStats" :key="stat.id" class="flex flex-col">
              <div class="flex items-center gap-3 mb-2">
                <!-- Icons -->
                <span class="text-gray-900">
                  <component :is="stat.icon" :size="28" weight="light" />
                </span>
                <span class="text-4xl font-bold text-gray-900">
                  <CountUp :to="stat.value" />
                </span>
              </div>
              <span class="text-gray-600 font-medium">{{ stat.label }}</span>
            </div>
          </div>

          <a id="about" :href="aboutSection?.sectionCTA?.url || '#about'" class="inline-flex justify-center mt-5 md:mt-10 items-center gap-x-3 text-center bg-linear-to-tl from-red-500 to-red-600 hover:from-red-600 hover:to-red-500 focus:outline-hidden focus:from-red-600 focus:to-red-500 border border-transparent text-white text-base font-bold rounded-full py-3 px-4 animate-on-scroll delay-300">
        <PhInfo class="shrink-0 size-6" />
        {{ aboutSection?.sectionCTA?.ctaText || 'Learn More' }}
      </a>
        </div>
      </div>
    </div>
  </section>
</template>
