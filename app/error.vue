<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps({
  error: Object as () => NuxtError
})

const handleError = () => clearError({ redirect: '/' })
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-white px-4">
    <div class="max-w-md w-full text-center">
      <div class="mb-8 relative inline-flex justify-center items-center">
        <!-- Abstract Decoration -->
        <div class="absolute inset-0 bg-red-50 rounded-full blur-xl opacity-70"></div>
        <div class="relative w-24 h-24 bg-white rounded-2xl shadow-lg border border-gray-100 flex items-center justify-center">
             <div class="text-[#E60000] text-4xl">
                ⚠️
             </div>
        </div>
      </div>
      
      <h1 class="text-4xl font-bold font-display text-gray-900 mb-3 tracking-tight">
      Oopss.. An Error Occurred
      </h1>
      
      <p class="text-gray-500 mb-10 text-lg leading-relaxed">
        {{ error?.statusCode === 404 ? "We couldn't find the page you're looking for." : "We're currently updating this section to serve you better." }}
        <span class="block mt-2 text-sm text-gray-400">Error Code: {{ error?.statusCode }}</span>
      </p>

      <button 
        @click="handleError"
        class="inline-flex items-center justify-center px-8 py-3.5 text-base font-bold text-white bg-black rounded-full hover:bg-[#E60000] transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
      >
        Go back home
      </button>
    </div>
  </div>
</template>
