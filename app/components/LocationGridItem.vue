<script setup lang="ts">
import { PhCheckCircle } from '@phosphor-icons/vue';

defineProps<{
  name: string
  address: string
  image: string
  slug: string
  selected?: boolean
  logo?: string
}>()
</script>

<template>
  <NuxtLink 
    :to="`/locations/${slug}`"
    class="group relative block w-full overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-2xl"
    :class="selected ? 'ring-4 ring-[#E60000] ring-offset-2' : ''"
  >
    <!-- Background Image -->
    <div class="aspect-[16/10] w-full overflow-hidden bg-gray-900">
      <img 
        :src="image" 
        :alt="name" 
        class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-60"
      />
      
      <!-- Gradient Overlay -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
    </div>

    <!-- Content -->
    <div class="absolute inset-0 p-6 md:p-8 flex flex-col justify-between">
      <!-- Top Row -->
      <div class="flex items-start justify-between">
        <!-- Logo/Badge Area -->
        <div class="flex items-center gap-3">
          <div v-if="logo" class="h-10 w-10 rounded-full bg-white p-2 flex items-center justify-center shadow-md">
            <!-- Placeholder for logo if image url provided, or just text -->
             <span class="text-[10px] font-bold text-black">ABB</span>
          </div>
          <div class="flex flex-col">
            <span class="text-sm font-bold text-white leading-tight">{{ address.split(',')[0] }}</span>
            <span class="text-xs text-gray-300">{{ address.split(',').slice(1).join(',').trim() }}</span>
          </div>
        </div>

        <!-- Selected Indicator -->
        <div v-if="selected" class="text-white">
          <PhCheckCircle weight="fill" class="h-6 w-6" />
        </div>
        <div v-else class="h-6 w-6 rounded-full border-2 border-white/30 group-hover:border-white transition-colors"></div>
      </div>

      <!-- Bottom Row -->
      <div class="flex items-end justify-between">
        <h3 class="text-2xl md:text-3xl font-bold text-white">{{ name }}</h3>
        
        <span v-if="selected" class="rounded-md bg-white/20 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
          Selected
        </span>
      </div>
    </div>
  </NuxtLink>
</template>
