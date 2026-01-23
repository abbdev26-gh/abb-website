<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'

const containerRef = ref<HTMLElement | null>(null)
const progress = ref(0)
const config = useRuntimeConfig();
const { transform } = useHighlightText();

// Fetch About Page Data for this section
const { data: aboutPage } = await useAsyncData('about-page-scroll', () => {
    return $fetch('/api/about-page', {
        baseURL: config.public.strapiUrl,
        headers: {
            Authorization: `Bearer ${config.public.strapiToken}`
        },
        params: {
            'populate[scrollSectionImage]': 'true'
        }
    })
});

const topText = computed(() => aboutPage.value?.data?.scrollSectionTopText || 'If you want to go fast, go alone.');
const bottomText = computed(() => aboutPage.value?.data?.scrollSectionBottomText || 'If you want to go far, go together.');
const attribution = computed(() => aboutPage.value?.data?.scrollSectionAttribution || '– African Proverb');
const bgImage = computed(() => {
    const url = aboutPage.value?.data?.scrollSectionImage?.url;
    if (!url) return 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=2000';
    return `${config.public.strapiUrl}${url}`;
});

const handleScroll = () => {
  if (!containerRef.value) return
  
  const rect = containerRef.value.getBoundingClientRect()
  const windowHeight = window.innerHeight
  
  const totalScrollDistance = rect.height - windowHeight
  
  if (totalScrollDistance <= 0) return

  const currentScroll = -rect.top
  
  let p = currentScroll / totalScrollDistance
  p = Math.max(0, Math.min(1, p))
  
  progress.value = p
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <section ref="containerRef" class="relative h-[300vh] bg-white">
    <div class="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
      
      <!-- Background Media (Revealed) -->
      <div class="absolute inset-0 w-full h-full">
        <img 
          :src="bgImage" 
          alt="Inspirational Background" 
          class="w-full h-full object-cover"
        />
        <div class="absolute inset-0 bg-black/30"></div>
      </div>

      <!-- Split Text Container -->
      <div class="relative z-10 flex flex-col items-center justify-center w-full h-full">
        
        <!-- Top Half Curtain -->
        <div 
          class="absolute top-0 left-0 right-0 h-[50vh] bg-white flex items-end justify-center pb-2 transition-transform duration-100 ease-linear will-change-transform origin-top"
          :style="{ transform: `translateY(-${progress * 100}%)` }"
        >
          <h2 class="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 text-center px-4 max-w-5xl leading-tight" v-html="transform(topText)">
          </h2>
        </div>

        <!-- Bottom Half Curtain -->
        <div 
          class="absolute bottom-0 left-0 right-0 h-[50vh] bg-white flex items-start justify-center pt-2 transition-transform duration-100 ease-linear will-change-transform origin-bottom"
          :style="{ transform: `translateY(${progress * 100}%)` }"
        >
          <div class="flex flex-col items-center">
            <h2 class="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 text-center px-4 max-w-5xl leading-tight" v-html="transform(bottomText)">
            </h2>
            <p v-if="attribution" class="mt-6 text-xl md:text-2xl font-medium text-gray-500 italic font-display" v-html="transform(attribution)"></p>
          </div>
        </div>
        
      </div>
    </div>
  </section>
</template>
