<script setup lang="ts">
// Images for the collage
const images = [
  '/images/about/img-1.jpg',
  '/images/about/img-2.jpg',
  '/images/about/img-3.jpg'
]
</script>

<template>
  <section class="pb-20 pt-10 md:pb-32 bg-white overflow-hidden">
    <div class="container mx-auto px-4 md:px-6">
      <!-- Headline -->
      <div class="max-w-4xl mx-auto text-center mb-16 md:mb-24">
        <div class="inline-flex items-center uppercase text-[#E60000] rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-sm font-medium mb-6">
          <span class="flex h-2 w-2 rounded-full uppercase bg-[#E60000] mr-2"></span>
          About Us
        </div>
        <h1 class="font-display text-4xl md:text-6xl font-bold text-gray-900 leading-tight tracking-tight">
          Driving <span class="text-[#E60000]">Entrepreneurship</span>. Fostering <span class="text-[#E60000]">Digital Transformation</span>. Creating <span class="text-[#E60000]">Jobs</span>
        </h1>
      </div>

      <!-- Image Collage -->
      <div class="relative max-w-6xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-center">
          <!-- Left Image -->
          <div class="md:col-span-4 relative group">
            <div class="aspect-[3/4] overflow-hidden rounded-3xl bg-gray-100">
              <img 
                :src="images[0]" 
                alt="Office collaboration" 
                class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <!-- Floating Badge -->
            <div class="absolute -top-6 -left-6 bg-white p-4 rounded-full shadow-xl hidden md:block">
              <div class="bg-gray-50 rounded-full p-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-[#E60000]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Center Image (Larger) -->
          <div class="md:col-span-4 md:-mt-16 relative group z-10">
            <div class="aspect-[3/4] overflow-hidden rounded-3xl bg-gray-100 shadow-2xl">
              <img 
                :src="images[1]" 
                alt="Modern workspace" 
                class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
             <!-- Floating Badge -->
             <div class="absolute -top-8 left-1/2 -translate-x-1/2 bg-white p-4 rounded-full shadow-xl hidden md:block">
              <div class="bg-[#E60000] rounded-full p-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Right Image -->
          <div class="md:col-span-4 relative group">
            <div class="aspect-[3/4] overflow-hidden rounded-3xl bg-gray-100">
              <img 
                :src="images[2]" 
                alt="Team meeting" 
                class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
             <!-- Floating Badge -->
             <div class="absolute -bottom-6 -right-6 bg-white p-4 rounded-full shadow-xl hidden md:block">
              <div class="bg-gray-50 rounded-full p-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-[#E60000]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
