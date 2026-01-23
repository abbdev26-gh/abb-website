<template>
  <!-- Hero -->
<div class="relative overflow-hidden min-h-[600px]  xl:min-h-[700px] overflow-hidden relative flex flex-col justify-center items-center md:py-20 px-4">
   <div class="relative inset-0 md:top-0 md:left-0 w-full aspect-[16/9] overflow-hidden md:absolute">
      <iframe 
      class="min-h-[600px]  xl:min-h-[700px] shrink-0"
            loading="lazy" title="Gumlet video player"
            :src="heroData?.videoURL || 'https://play.gumlet.io/embed/6909c55e9940b0c5ad2e420e?background=true&autoplay=true&loop=true&disableControls=true'"
            style="border:none; position: absolute; top: 0; left: 0; width: 100vw; height: 100vh; pointer-events: none;"
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen;"> 
          </iframe>
    </div>
  <div class="max-w-7xl relative flex flex-col items-center gap-x-10 mx-auto px-4 sm:px-6 lg:px-32 pt-16 py-10 md:py-20 bg-white/80 backdrop-blur-sm rounded-2xl">
  <div class="">
      <!-- Announcement Banner -->
    <div class="flex justify-center mb-5">
      <a class="inline-flex items-center gap-x-2 bg-white border border-[#E60000] text-xs text-[#E60000] p-2 px-3 rounded-full transition hover:border-gray-300 focus:outline-hidden focus:border-gray-300" href="#">
        AFRICA BUSINESS BUREAU
        <!-- <span class="flex items-center gap-x-1">
          <span class="border-s border-gray-200 text-red-500 ps-2">Explore</span>
          <svg class="shrink-0 size-4 text-red-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        </span> -->
      </a>
    </div>
    <!-- End Announcement Banner -->

    <!-- Title -->
    <div class="max-w-3xl text-center animate-on-scroll">
      <h1 class="block font-bold text-gray-800 text-4xl md:text-6xl lg:text-7xl">
        {{ heroData?.title || 'hero title' }}
      </h1>
    </div>
    <!-- End Title -->
  </div>

    <div class="flex flex-col justify-end">
      <div class="max-w-3xl text-center animate-on-scroll  delay-100">
      <p class="text-lg text-gray-600">{{ heroData?.description || 'hero description' }}</p>
    </div>
    <!-- Buttons -->
    <div class="mt-5 md:mt-10 gap-3 flex justify-center animate-on-scroll delay-200">
      <a class="inline-flex justify-center items-center gap-x-3 text-center bg-linear-to-tl from-red-500 to-red-600 hover:from-red-600 hover:to-red-500 focus:outline-hidden focus:from-red-600 focus:to-red-500 border border-transparent text-white text-base font-bold rounded-full py-3 px-4" :href="heroData?.heroUrl || '#services'">
        
        {{ heroData?.heroCTA || 'hero cta text' }}
        <PhArrowRight class="shrink-0 size-7 rotate-45" />
      </a>
    </div>
    <!-- End Buttons -->
    </div>
  </div>
</div>
<!-- End Hero -->
</template>

<script setup>
import {PhArrowRight} from '@phosphor-icons/vue';
import { useScrollObserver } from '~/composables/useScrollObserver';
const config = useRuntimeConfig();

const { data: heroData } = await useAsyncData('hero', () => 
  queryCollection('hero').first()
)

console.log('heroData', JSON.stringify(heroData.value, null, 2));

useScrollObserver();

</script>