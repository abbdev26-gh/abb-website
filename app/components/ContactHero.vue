<script setup lang="ts">
import { PhChatCircleText, PhHeadset, PhMapPin, PhPhone } from '@phosphor-icons/vue';

const config = useRuntimeConfig();

const { data: contactData } = await useAsyncData('contact', () => 
  queryCollection('contact').first()
)

const iconMap: Record<string, any> = {
  'Chat to sales': PhChatCircleText,
  'Chat to support': PhHeadset,
  'Visit us': PhMapPin,
  'Call us': PhPhone,
}

console.log('contact data:', contactData.value)

</script>

<template>
  <section class="bg-[#0A0A0A] text-white py-20 md:py-32 relative overflow-hidden">
    <!-- Background Pattern (Optional subtle grid or gradient) -->
    <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
    
    <div class="container mx-auto px-4 md:px-6 relative z-10">
      <div class="max-w-4xl mb-16">
        <p class="text-[#E60000] font-medium mb-4 uppercase tracking-wider">Contact us</p>
        <h1 class="font-display text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
         {{ contactData?.title || 'contact title' }}
        </h1>
        <p class="text-gray-400 text-lg md:text-xl max-w-2xl">
          {{ contactData?.description || 'contact description' }}
        </p>
      </div>

      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div 
          v-for="card in contactData?.contactOptions" 
          :key="card.id"
          class="bg-[#111] p-8 rounded-2xl border border-white/5 bg-white/5 hover:border-[#E60000]/30 transition-colors group"
        >
          <div class="w-12 h-12 rounded-xl bg-[#E60000]/10 flex items-center justify-center text-[#E60000] mb-6 group-hover:bg-[#E60000] group-hover:text-white transition-colors">
            <component :is="iconMap[card.title] || PhChatCircleText" :size="24" weight="fill" />
          </div>
          <h3 class="text-xl font-bold mb-2">{{ card.title }}</h3>
          <p class="text-gray-400 text-sm mb-6">{{ card.description }}</p>
          <div 
            class="text-[#E60000] font-medium"
            :class="{ 'hover:underline': card.title.toLowerCase().includes('chat') || card.title.toLowerCase().includes('call') }"
          >
            <!-- Check if it looks like an email to wrap in mailto, otherwise render generic html -->
             <span v-html="card.contactDetail"></span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
