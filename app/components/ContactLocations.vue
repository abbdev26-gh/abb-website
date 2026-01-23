<script setup lang="ts">
import { PhMapPin } from '@phosphor-icons/vue';

const { data: locationsData } = await useAsyncData('locations', () => 
  queryCollection('locations').all(),
  { lazy: true }
);

const locations = computed(() => {
  return locationsData.value || [];
});

</script>

<template>
  <section class="py-20 bg-white">
    <div class="container max-w-5xl mx-auto px-4 md:px-6">
      <div class="mb-12">
        <h2 class="font-display text-3xl md:text-4xl font-bold text-center text-gray-900">Our locations</h2>
        <p class="text-gray-500 mt-4 text-center">Come visit our friendly team at any of our offices.</p>
      </div>
      <div class="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
        <div v-for="location in locations" :key="location.city" class="flex items-start gap-4 p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
          <div class="w-10 h-10 rounded-full bg-[#E60000]/10 flex items-center justify-center text-[#E60000] shrink-0">
            <PhMapPin :size="20" weight="fill" />
          </div>
          <div>
            <h3 class="font-bold text-gray-900 text-lg mb-1">{{ location.city }}</h3>
            <p class="text-gray-500 text-sm">{{ location.address }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
