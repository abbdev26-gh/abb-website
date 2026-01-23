<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { PhArrowLeft, PhArrowRight, PhQuotes } from '@phosphor-icons/vue'
import { useScrollObserver } from '~/composables/useScrollObserver';

useScrollObserver();
const config = useRuntimeConfig();

const { data: testimonialsData } = await useAsyncData('testimonials', () => 
    queryCollection('testimonials').all(),
    { lazy: true }
);

const testimonials = computed(() => {
    const list = testimonialsData.value || [];
    
    return list.map((t: any) => ({
        id: t.id,
        name: t.name,
        role: t.role,
        quote: t.quote,
        image: t.image?.url || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=800'
    }));
});

const currentIndex = ref(0)
const itemsPerView = ref(1)

const updateItemsPerView = () => {
  itemsPerView.value = window.innerWidth >= 768 ? 2 : 1
}

onMounted(() => {
  updateItemsPerView()
  window.addEventListener('resize', updateItemsPerView)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateItemsPerView)
})

const nextSlide = () => {
  if (currentIndex.value < testimonials.value.length - itemsPerView.value) {
    currentIndex.value++
  } else {
    currentIndex.value = 0 // Loop back to start
  }
}

const prevSlide = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
  } else {
    currentIndex.value = testimonials.value.length - itemsPerView.value // Loop to end
  }
}

// Touch support
const touchStartX = ref(0)
const touchEndX = ref(0)

const handleTouchStart = (e: TouchEvent) => {
  touchStartX.value = e.changedTouches[0].screenX
}

const handleTouchEnd = (e: TouchEvent) => {
  touchEndX.value = e.changedTouches[0].screenX
  handleSwipe()
}

const handleSwipe = () => {
  if (touchEndX.value < touchStartX.value - 50) {
    nextSlide()
  }
  if (touchEndX.value > touchStartX.value + 50) {
    prevSlide()
  }
}
</script>

<template>
  <section class="py-20 md:py-32 bg-white hidden overflow-hidden">
    <div class="container mx-auto px-4 md:px-6">
      <!-- Header -->
      <div class="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 animate-on-scroll">
        <div class="max-w-2xl">
          <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold font-display text-gray-900 mb-6 leading-tight">
            What <span class="text-[#E60000]">Our Customers</span> Say <br class="hidden md:block" />
            About Co-Work Space
          </h2>
          <p class="text-gray-600 text-lg">
            We can provide you with some examples of feedback that customers often express about our co-work space.
          </p>
        </div>
        
        <!-- Navigation Buttons -->
        <div class="flex gap-4">
          <button 
            @click="prevSlide"
            class="w-12 h-12 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
            aria-label="Previous testimonial"
          >
            <PhArrowLeft class="w-6 h-6" />
          </button>
          <button 
            @click="nextSlide"
            class="w-12 h-12 flex items-center justify-center rounded-full bg-[#E60000] text-white hover:bg-[#cc0000] transition-colors shadow-lg shadow-red-200"
            aria-label="Next testimonial"
          >
            <PhArrowRight class="w-6 h-6" />
          </button>
        </div>
      </div>

      <!-- Testimonials Carousel -->
      <div class="overflow-hidden animate-on-scroll delay-200">
        <div 
          class="flex transition-transform duration-500 ease-in-out"
          :style="{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }"
          @touchstart="handleTouchStart"
          @touchend="handleTouchEnd"
        >
          <div 
            v-for="testimonial in testimonials" 
            :key="testimonial.id" 
            class="w-full md:w-1/2 flex-shrink-0 px-4"
          >
            <div class="group h-full">
              <div class="relative flex flex-col sm:flex-row items-stretch h-full">
                <!-- Image -->
                <div class="w-full sm:w-1/2 h-64 sm:h-auto rounded-xl overflow-hidden relative z-0">
                  <div class="absolute inset-0 bg-gray-200">
                    <NuxtImg 
                      :src="testimonial.image" 
                      :alt="testimonial.name" 
                      class="w-full h-full object-cover"
                      format="webp"
                      loading="lazy"
                    />
                  </div>
                </div>
                
                <!-- Content Card -->
                <div class="w-full sm:w-2/3 sm:-ml-12 relative z-10 flex items-center mt-[-2rem] sm:mt-8 sm:mb-8 pr-4">
                  <div class="bg-white p-6 md:p-8  rounded-2xl w-full h-full flex flex-col justify-center">
                    <PhQuotes weight="fill" class="text-[#E60000] w-10 h-10 mb-4" />
                    
                    <p class="text-gray-600 mb-6 leading-relaxed">
                      {{ testimonial.quote }}
                    </p>
                    
                    <div>
                      <h4 class="text-lg font-bold text-gray-900">{{ testimonial.name }}</h4>
                      <p class="text-sm text-gray-500">{{ testimonial.role }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
