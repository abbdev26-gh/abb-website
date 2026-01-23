<script setup lang="ts">
import { PhCheck } from '@phosphor-icons/vue'

defineProps<{
  name: string
  price: string
  period: string
  description: string
  features: string[]
  popular?: boolean
  extraPrices?: { label: string; price: string }[]
}>()
</script>

<template>
  <div 
    class="relative overflow-hidden rounded-3xl border transition-all"
    :class="[
      popular 
        ? 'bg-gray-900 border-gray-800 text-white' 
        : 'bg-white border-gray-200 text-gray-900'
    ]"
  >
    <div class="flex flex-col lg:flex-row">
      <!-- Left Section: Details -->
      <div class="flex-1 p-8 lg:p-10 lg:border-r" :class="popular ? 'border-gray-800' : 'border-gray-100'">
        <div class="mb-8">
          <h3 class="mb-4 font-display text-3xl font-bold">{{ name }}</h3>
          <p class="text-lg leading-relaxed" :class="popular ? 'text-gray-400' : 'text-gray-600'">
            {{ description }}
          </p>
        </div>

        <div>
          <h4 class="mb-6 text-sm font-bold uppercase tracking-wider" :class="popular ? 'text-red-500' : 'text-[#E60000]'">
            What's included
          </h4>
          <ul class="grid sm:grid-cols-2 gap-x-8 gap-y-4">
            <li 
              v-for="feature in features" 
              :key="feature" 
              class="flex items-start gap-3 text-sm"
              :class="popular ? 'text-gray-300' : 'text-gray-600'"
            >
              <PhCheck 
                class="h-5 w-5 shrink-0" 
                :class="popular ? 'text-red-500' : 'text-[#E60000]'" 
                weight="bold"
              />
              {{ feature }}
            </li>
          </ul>
        </div>
      </div>

      <!-- Right Section: Price & Action -->
      <div class="flex flex-col justify-center p-8 lg:p-10 lg:w-[350px] shrink-0 bg-opacity-50" :class="popular ? 'bg-white/10' : 'bg-gray-50'">
        <div class="text-center">
          <p class="mb-2 text-sm font-medium" :class="popular ? 'text-gray-400' : 'text-gray-500'">
            Best value for you
          </p>
          <div class="mb-8 flex flex-wrap items-baseline justify-center gap-1">
            <span class="text-5xl font-bold tracking-tight whitespace-nowrap">{{ price }}</span>
            <span v-if="period" class="text-lg whitespace-nowrap" :class="popular ? 'text-gray-400' : 'text-gray-500'">/{{ period }}</span>
          </div>

          <div v-if="extraPrices && extraPrices.length > 0" class="mb-8 space-y-3">
            <div v-for="extra in extraPrices" :key="extra.label" class="flex justify-between text-sm">
              <span :class="popular ? 'text-gray-400' : 'text-gray-600'">{{ extra.label }}</span>
              <span class="font-bold whitespace-nowrap">{{ extra.price }}</span>
            </div>
          </div>

          <button 
            class="w-full rounded-full px-6 py-4 text-base font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            @click="navigateTo('/contact')"
            :class="[
              popular 
                ? 'bg-[#E60000] text-white hover:bg-[#E60000] shadow-[#E60000]/20' 
                : 'bg-gray-900 text-white hover:bg-gray-800 shadow-gray-900/10'
            ]"
          >
            Get access
          </button>
          
          <p class="mt-4 text-xs text-center" :class="popular ? 'text-gray-500' : 'text-gray-400'">
            Invoices and receipts available for easy company reimbursement
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
