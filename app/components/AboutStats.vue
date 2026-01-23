<script setup lang="ts">
const config = useRuntimeConfig();

const { data: aboutPage } = await useAsyncData('about-page-stats', () => 
  queryCollection('about').first(), 
  { lazy: true }
);

const stats = computed(() => aboutPage.value?.stats || []);
</script>

<template>
  <section class="py-16 bg-gray-50">
    <div class="container mx-auto px-4 md:px-6">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div v-for="stat in stats" :key="stat.label" class="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div class="flex items-center gap-2 mb-2">
             <div class="h-2 w-2 rounded-full bg-[#E60000]"></div>
             <span class="text-sm font-medium text-gray-500 uppercase tracking-wider">{{ stat.label }}</span>
          </div>
          <h3 class="text-4xl md:text-5xl font-bold text-gray-900 mb-3">{{ stat.value }}</h3>
          <p class="text-gray-500 text-sm leading-relaxed">{{ stat.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
