<script setup lang="ts">
// Images for the collage - using some architectural/interior shots
const images = ref([
  'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=800'
])
</script>

<template>
  <section class="pb-20 pt-10 md:pb-32 overflow-hidden bg-black">
    <div class="container mx-auto px-4 md:px-6">
      <div class="max-w-4xl mx-auto text-center my-16 ">
        <div class="inline-flex items-center rounded-full border border-gray-200/0 uppercase bg-gray-50/10 px-3 py-1 text-sm font-medium text-[#E60000] mb-6">
          <span class="flex h-2 w-2 rounded-full bg-[#E60000] mr-2"></span>
          Events & Gallery
        </div>
        <h1 class="font-display text-4xl md:text-6xl font-bold text-white leading-tight tracking-tight">
          Explore some of our <span class="text-[#E60000]">Past Events</span>
        </h1>
        <p class="mt-6 text-xl text-gray-200 max-w-2xl mx-auto hidden">
          Take a visual tour through our state-of-the-art facilities designed for productivity and collaboration.
        </p>
      </div>

      <!-- Image Grid/Mosaic -->
      <div class="relative hidden max-w-7xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <!-- Image 1 -->
            <div class="md:mt-12">
                <div class="aspect-[4/5] rounded-3xl overflow-hidden shadow-lg transform md:rotate-2 hover:rotate-0 transition-transform duration-500">
                    <img :src="images[0]" alt="Gallery 1" class="w-full h-full object-cover">
                </div>
            </div>
             <!-- Image 2 (Center, Higher) -->
             <div class="">
                <div class="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl z-10 relative bg-gray-100">
                     <img :src="images[1]" alt="Gallery 2" class="w-full h-full object-cover">
                </div>
            </div>
             <!-- Image 3 -->
             <div class="md:mt-24">
                <div class="aspect-[4/5] rounded-3xl overflow-hidden shadow-lg transform md:-rotate-2 hover:rotate-0 transition-transform duration-500">
                     <img :src="images[2]" alt="Gallery 3" class="w-full h-full object-cover">
                </div>
            </div>
        </div>
      </div>
    </div>
  </section>
</template>
