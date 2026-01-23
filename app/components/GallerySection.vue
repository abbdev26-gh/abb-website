<script setup lang="ts">
import { PhArrowLeft, PhArrowRight } from '@phosphor-icons/vue';
import { useScrollObserver } from '~/composables/useScrollObserver';

useScrollObserver();

const { data: galleryData } = await useAsyncData('gallery-page', () => 
  queryCollection('gallery').all(),
  { lazy: true }
)

const gallerySections = computed(() => {
    // Now returns an array of section objects directly
    const sections = galleryData.value || [];
    
    // Sort by order to maintain layout consistency
    const sortedSections = [...sections].sort((a: any, b: any) => (Number(a.order) || 0) - (Number(b.order) || 0));

    return sortedSections.map((section: any) => ({
      id: section.order, // Fallback to order since id is gone or different
      title: section.title,
      description: section.description,
      images: section.images?.map((img: any) => 
        img.url || section.images[0]?.url // Fallback to avoid empty
      ).filter(Boolean) || [
         // Fallback placeholders if no images uploaded yet
         'https://images.unsplash.com/photo-1542744173-8e7e5341c447?auto=format&fit=crop&q=80&w=800',
         'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=800',
         'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=800',
         'https://images.unsplash.com/photo-1591115765373-5207764f72e7?auto=format&fit=crop&q=80&w=800',
         'https://images.unsplash.com/photo-1504384308090-c54be3855833?auto=format&fit=crop&q=80&w=800'
      ]
    }))
})

// Scroll handling
const scrollContainers = ref<(HTMLElement | null)[]>([])

const scroll = (index: number, direction: 'left' | 'right') => {
  const container = scrollContainers.value[index]
  if (!container) return
  
  const scrollAmount = 350 // Adjusted to match new card size + gap
  const targetScroll = container.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount)
  
  container.scrollTo({
    left: targetScroll,
    behavior: 'smooth'
  })
}

useSeoMeta({
    title: 'Gallery',
    description: 'Explore our gallery of premium workspaces designed for productivity and collaboration.',
})
</script>

<template>
  <div v-if="gallerySections.length > 0">
    <section v-for="(section, index) in gallerySections" :key="section.id" class="pt-20 bg-white border-b border-gray-100 last:border-0">
        <div class="container mx-auto px-4 md:px-6">
            <!-- Header Row -->
            <div class="flex flex-col md:flex-row justify-between items-end mb-6 gap-6">
                <div class="max-w-2xl">
                    <h2 class="font-display text-2xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                        {{ section.title }}<span class="text-[#E60000]">.</span>
                    </h2>
                    <p class="text-gray-600 text-sm md:text-base leading-relaxed max-w-xl">
                        {{ section.description }}
                    </p>
                </div>
                
                <!-- Navigation Buttons -->
                <div class="flex gap-4 shrink-0">
                    <button 
                        @click="scroll(index, 'left')"
                        class="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-[#E60000] hover:text-white transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-red-200"
                        aria-label="Previous images"
                    >
                        <PhArrowLeft weight="bold" class="w-5 h-5 md:w-6 md:h-6" />
                    </button>
                    <button 
                        @click="scroll(index, 'right')"
                        class="w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#E60000] flex items-center justify-center text-white hover:bg-[#cc0000] transition-all duration-300 shadow-lg shadow-red-200"
                        aria-label="Next images"
                    >
                        <PhArrowRight weight="bold" class="w-5 h-5 md:w-6 md:h-6" />
                    </button>
                </div>
            </div>

            <!-- Scrollable Image Carousel -->
            <div 
                :ref="(el) => { if (el) scrollContainers[index] = el as HTMLElement }"
                class="flex gap-6 overflow-x-auto pb-8 -mx-4 px-4 md:mx-0 md:px-0 snap-x scrollbar-hide"
                style="scrollbar-width: none; -ms-overflow-style: none;"
            >
                <div 
                    v-for="(img, imgIndex) in section.images" 
                    :key="imgIndex" 
                    class="w-[280px] md:w-[340px] lg:w-[380px] aspect-[4/3] rounded-2xl overflow-hidden snap-start shrink-0 relative group"
                >
                    <NuxtImg 
                        :src="img" 
                        :alt="`${section.title} ${Number(imgIndex) + 1}`" 
                        class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        format="webp"
                        loading="lazy"
                    />
                    <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
            </div>
        </div>
    </section>
  </div>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}
</style>
