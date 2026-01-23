<script setup lang="ts">
import { ref, computed } from 'vue';
import { servicesData as localServicesWithIcons } from '~/utils/services';

const config = useRuntimeConfig();

// Fetch services from Nuxt Content v3
const { data: servicesContent } = await useAsyncData('home-services', () =>
  queryCollection('services').all(),
  { lazy: true }
);

const services = computed(() => {
  const data = (servicesContent.value as any[]) || [];
  
  // Sort by publishedAt (oldest first)
  const sortedData = [...data].sort((a, b) => {
    return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
  });
  
  return sortedData.map((s, index) => {
    // Find local match for Icon
    const localMatch = localServicesWithIcons.find(l => l.slug === s.slug);
    
    // Image URL - already processed by migration script or fallback
    const imageObj = Array.isArray(s.serviceImage) ? s.serviceImage[0] : s.serviceImage;
    const imageUrl = imageObj?.url || (localMatch?.image || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200');

    return {
      ...s,
      id: index + 1, // Normalize ID for UI (01, 02, etc)
      image: imageUrl,
      // Fallback content if missing
      description: s.shortDescription || s.description || localMatch?.description,
      longDescription: s.longDescription || localMatch?.longDescription,
      stat: s.stat || localMatch?.stat,
      // Icon mapping
      icon: localMatch?.icon
    };
  });
});

const activeServiceId = ref(1);

const setActiveService = (id: number) => {
  activeServiceId.value = id;
};

const leftServices = computed(() => services.value.slice(0, 4));
const rightServices = computed(() => services.value.slice(4, 7));
</script>

<template>
  <div id="services"
  class="scroll-mt-20"
  :style="{backgroundImage: 'url(' + services[activeServiceId - 1]?.image + ')'}">
    <section class="bg-black/60 py-20 backdrop-blur-md text-white overflow-hidden">
    <div class="container mx-auto px-4 md:px-6">
      <h2 class="text-3xl md:text-4xl lg:text-5xl text-center font-bold font-display text-white mb-6 leading-tight">
            Our <span class="text-[#E60000]">Services</span>
          </h2>
      <div class="grid lg:grid-cols-3 gap-8 items-start">
        
        <!-- Left Column: Services 1-4 -->
        <div class="flex flex-col space-y-4 order-2 lg:order-1">
          <div 
            v-for="service in leftServices" 
            :key="service.id"
            @click="setActiveService(service.id)"
            class="cursor-pointer group rounded-xl p-6 transition-all duration-300 border border-transparent"
            :class="activeServiceId === service.id ? 'bg-[#E60000] text-white shadow-lg scale-100' : 'hover:bg-black/20 text-gray-400 hover:text-gray-200'"
          >
            <div class="flex flex-col sm:flex-row items-start gap-4">
              <span class="text-lg font-bold opacity-50 mt-1">0{{ service.id }}.</span>
              <div>
                <h3 class="text-xl font-bold mb-2" :class="activeServiceId === service.id ? 'text-white' : 'text-white group-hover:text-white'">
                  {{ service.name }}
                </h3>
                <p class="text-sm leading-relaxed" :class="activeServiceId === service.id ? 'text-white/90' : 'text-gray-300 group-hover:text-gray-200'">
                  {{ service.description }}
                </p>
                <!-- Mobile Details -->
                <div v-if="activeServiceId === service.id" class="lg:hidden mt-4 pt-4 border-t border-white/20">
                  <p class="text-sm font-medium text-white/90 mb-4 leading-relaxed">
                    {{ service.longDescription }}
                  </p>
                  <div class="flex items-center justify-between gap-4 mb-4">
                    <span class="text-2xl font-black text-white uppercase">{{ service.stat }}</span>
                  </div>
                  <NuxtLink 
                    :to="`/services/${service.slug}`"
                    class="inline-flex items-center justify-center w-full px-6 py-3 text-sm font-bold text-[#E60000] bg-white rounded-full hover:bg-gray-100 transition-colors"
                  >
                    View Details
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Center Column: Interactive Image -->
        <div class="hidden lg:block relative h-[400px] lg:h-[500px] w-full rounded-2xl overflow-hidden shadow-2xl sticky top-24 order-1 lg:order-2 mb-8 lg:mb-0">
          <transition-group name="fade">
            <div 
              v-for="service in services" 
              :key="service.id"
              v-show="activeServiceId === service.id"
              class="absolute inset-0 w-full h-full"
            >
              <NuxtImg 
                :src="service.image" 
                :alt="service.title" 
                class="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                format="webp"
                loading="lazy"
              />
              
              <!-- Glassmorphic Overlay Content -->
              <div class="absolute bottom-4 left-4 right-4 p-6 rounded-xl bg-black/30 backdrop-blur-md border border-white/10 overflow-hidden">
                <transition name="slide-up" appear>
                  <div v-if="activeServiceId === service.id">
                    <p class="text-sm font-medium text-gray-100 mb-4 leading-relaxed line-clamp-3">
                      {{ service.longDescription }}
                    </p>
                    <div class="flex items-center justify-between gap-4">
                      <span class="text-2xl font-black text-[#E60000] uppercase">{{ service.stat }}</span>
                      
                    </div>

                      <NuxtLink 
                        :to="`/services/${service.slug}`"
                        class="inline-flex items-center justify-center mt-4 w-full md:w-fit px-12 py-3 text-base font-bold text-white bg-[#E60000] rounded-full hover:bg-red-700 transition-colors"
                      >
                        View Details
                      </NuxtLink>
                  </div>
                </transition>
              </div>
            </div>
          </transition-group>
        </div>

        <!-- Right Column: Services 5-7 -->
        <div class="flex flex-col space-y-4 order-3 lg:order-3">
          <div 
            v-for="service in rightServices" 
            :key="service.id"
            @click="setActiveService(service.id)"
            class="cursor-pointer group rounded-xl p-6 transition-all duration-300 border border-transparent"
            :class="activeServiceId === service.id ? 'bg-[#E60000] text-white shadow-lg scale-100' : 'hover:bg-black/20 text-gray-400 hover:text-gray-200'"
          >
            <div class="flex flex-col sm:flex-row items-start gap-4">
              <span class="text-lg font-bold opacity-50 mt-1">0{{ service.id }}.</span>
              <div>
                <h3 class="text-xl font-bold mb-2" :class="activeServiceId === service.id ? 'text-white' : 'text-white group-hover:text-white'">
                  {{ service.name }}
                </h3>
                <p class="text-sm leading-relaxed" :class="activeServiceId === service.id ? 'text-white/90' : 'text-gray-300 group-hover:text-gray-200'">
                  {{ service.description }}
                </p>

                <!-- Mobile Details -->
                <div v-if="activeServiceId === service.id" class="lg:hidden mt-4 pt-4 border-t border-white/20">
                  <p class="text-sm font-medium text-white/90 mb-4 leading-relaxed">
                    {{ service.longDescription }}
                  </p>
                  <div class="flex items-center justify-between gap-4 mb-4">
                    <span class="text-2xl font-black text-white uppercase">{{ service.stat }}</span>
                  </div>
                  <NuxtLink 
                    :to="`/services/${service.slug}`"
                    class="inline-flex items-center justify-center w-full px-6 py-3 text-sm font-bold text-[#E60000] bg-white rounded-full hover:bg-gray-100 transition-colors"
                  >
                    View Details
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  </section>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.7s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Slide Up Animation for Text */
.slide-up-enter-active {
  transition: all 0.6s ease-out 0.3s; /* Delay to wait for image fade */
}
.slide-up-leave-active {
  transition: all 0.3s ease-in;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
.slide-up-enter-to,
.slide-up-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
