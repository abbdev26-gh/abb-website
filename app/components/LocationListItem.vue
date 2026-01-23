<script setup lang="ts">
import { PhArrowRight } from '@phosphor-icons/vue';

defineProps<{
  name: string
  description: string
  image: string
  slug: string
  features: string[]
  stats: { label: string; value: string }[]
}>()
</script>

<template>
  <div class="group relative overflow-hidden rounded-3xl bg-gray-50 transition-all ">
    <div class="flex flex-col lg:flex-row">
      <!-- Image Section -->
      <div class="relative h-64 w-full lg:h-auto lg:w-2/5 overflow-hidden">
        <img 
          :src="image" 
          :alt="name" 
          class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>

      <!-- Content Section -->
      <div class="flex flex-1 flex-col justify-between p-8 lg:p-10">
        <div>
          <h3 class="font-display text-3xl font-bold text-gray-900 mb-4">
            {{ name }}
          </h3>
          <p class="text-gray-500 leading-relaxed mb-6">
            {{ description }}
          </p>

          <!-- Features/Tags -->
          <div class="flex flex-wrap gap-3 mb-8">
            <span 
              v-for="feature in features" 
              :key="feature"
              class="inline-flex items-center rounded-full bg-white px-4 py-2 text-sm font-medium text-gray-700 border border-gray-200"
            >
              <div class="mr-2 h-1.5 w-1.5 rounded-full bg-[#E60000]"></div>
              {{ feature }}
            </span>
          </div>
        </div>

        <!-- Footer Stats -->
        <div class="md:grid grid-cols-3 gap-4 border-t border-gray-200 pt-8 mt-auto">
          <div v-for="stat in stats" :key="stat.label">
            <p class="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">{{ stat.label }}</p>
            <p class="text-lg font-semibold text-gray-900">{{ stat.value }}</p>
          </div>
          
          <!-- View Details Button (Hidden on mobile, visible on desktop hover or always) -->
          <div class="col-span-3 lg:col-span-1 lg:col-start-3 flex md:justify-end items-center">
             <NuxtLink 
              :to="`/locations/${slug}`"
              class="inline-flex items-center justify-center mt-5 md:mt-0 w-full md:w-fit  gap-2 rounded-full bg-[#E60000] font-bold p-3 text-white transition-transform group-hover:translate-x-1"
            >
            <span class="md:max-w-0 whitespace-nowrap md:opacity-0 overflow-hidden group-hover:max-w-[100px] group-hover:opacity-100 transition-all duration-300 ease-in-out">View Details</span>
              <PhArrowRight weight="bold" class="h-5 w-5 transition-transform -translate-x-1 group-hover:translate-x-1" /> 
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
