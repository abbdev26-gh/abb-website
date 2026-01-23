<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { 
  PhGoogleLogo, PhSlackLogo, PhFigmaLogo, PhSpotifyLogo, 
  PhTwitchLogo, PhAmazonLogo, PhAppleLogo, 
  PhMetaLogo, PhTiktokLogo, PhTwitterLogo, PhYoutubeLogo 
} from '@phosphor-icons/vue';
import { useScrollObserver } from '~/composables/useScrollObserver';

useScrollObserver();

// Pool of partners
const { data: partnersData } = await useAsyncData('home-page-partners', () => 
  queryCollection('partners').all(),
  { lazy: true }
)

const allPartners = computed(() => {
  const partners = partnersData.value || []
  return partners.map((p: any) => ({
    id: p.id,
    name: p.name,
    icon: null, 
    logoUrl: p.logo?.url || null // URLs already processed
  }))
})

// Initialize with the first 5 partners
const visiblePartners = ref<any[]>([]);

// Watch for data to initialize
watch(allPartners, (newPartners) => {
  if (newPartners && newPartners.length > 0) {
    visiblePartners.value = [...newPartners.slice(0, 5)]
  }
}, { immediate: true })

let intervalId: any = null;

const switchRandomPartner = () => {
  if (allPartners.value.length <= 5) return;

  // 1. Pick a random slot to change (0 to 4)
  const slotToChange = Math.floor(Math.random() * 5);

  // 2. Find partners that are NOT currently visible
  const currentIds = new Set(visiblePartners.value.map(p => p.id));
  const availablePartners = allPartners.value.filter(p => !currentIds.has(p.id));

  // 3. Pick a random new partner
  if (availablePartners.length > 0) {
    const newPartner = availablePartners[Math.floor(Math.random() * availablePartners.length)];
    
    if (newPartner) {
      // 4. Replace using array index assignment to trigger reactivity
      const newVisible = [...visiblePartners.value];
      newVisible[slotToChange] = newPartner;
      visiblePartners.value = newVisible;
    }
  }
};

onMounted(() => {
  // Switch a partner every 2.5 seconds
  intervalId = setInterval(switchRandomPartner, 2500);
});

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId);
});
</script>

<template>
  <section class="pt-20 md:pt-32 border-y border-gray-100 bg-white overflow-hidden">
    <div class="container mx-auto px-4 md:px-6">
      <div class="text-center mb-8 animate-on-scroll">
         <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold font-display text-gray-900 mb-6 leading-tight">
            Trusted by <span class="text-[#E60000]">innovative teams</span> at
          </h2>
      </div>
      
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 items-center justify-items-center w-full animate-on-scroll delay-100">
        <div 
          v-for="(partner, index) in visiblePartners" 
          :key="index" 
          class="w-full h-20 flex items-center justify-center relative"
        >
          <transition name="fade" mode="out-in">
            <div 
              :key="partner.id"
              class="absolute inset-0 flex items-center justify-center transition-all duration-300 cursor-pointer"
            >
              <div class="flex items-center gap-2">
                <NuxtImg v-if="partner.logoUrl" :src="partner.logoUrl" :alt="partner.name" class="h-14 md:h-20 object-contain transition-all" format="webp" loading="lazy" />
                <span v-else class="text-lg md:text-xl font-bold text-gray-800">{{ partner.name }}</span>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
