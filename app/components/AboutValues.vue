<script setup lang="ts">
import { PhBuildings, PhUsersThree, PhEye, PhTarget, PhLightbulb } from '@phosphor-icons/vue';

const config = useRuntimeConfig();

const { data: aboutPage } = await useAsyncData('about-page-values', () => 
    queryCollection('about').first()
);

const sectionTitle = computed(() => aboutPage.value?.valuesSectionTitle || 'Mission and Vision');
const sectionDescription = computed(() => aboutPage.value?.valuesSectionDescription || 'Built on a foundation of trust and innovation.');

const iconMap: Record<string, any> = {
    'Mission': PhTarget,
    'Vision': PhLightbulb,
    'Vision 2035': PhLightbulb,
    'Industry Expertise': PhBuildings,
    'Collaboration': PhUsersThree,
    'Transparency': PhEye
}

const colorMap: Record<string, string> = {
     'Mission': 'bg-blue-100 text-blue-600',
     'Vision': 'bg-green-100 text-green-600',
     'Vision 2035': 'bg-green-100 text-green-600',
     'Industry Expertise': 'bg-purple-100 text-purple-600'
}

const values = computed(() => {
    const list = aboutPage.value?.values || [];
    return list.map((item: any, index: number) => ({
        ...item,
        icon: iconMap[item.title] || PhBuildings, // Fallback icon
        color: colorMap[item.title] || (index % 2 === 0 ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600')
    }));
});
</script>

<template>
  <section class="py-20 md:py-32 bg-black">
    <div class="container mx-auto px-4 md:px-6">
      <div class="text-center mb-16">
        <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold font-display text-white mb-6 leading-tight">{{ sectionTitle }}</h2>
        <p class="mt-4 text-gray-200 max-w-2xl mx-auto">
          {{ sectionDescription }}
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
        <div v-for="value in values" :key="value.title" class="p-8 rounded-3xl bg-white/10 hover:bg-white/5 hover:shadow-xl transition-all duration-300 border border-transparent hover:border-gray-100 group">
          <div :class="`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-[#E60000]/10 text-[#E60000] group-hover:scale-110 transition-transform duration-300`">
             <!-- Using dynamic component for icon -->
            <component :is="value.icon" weight="fill" class="w-7 h-7" />
          </div>
          <h3 class="text-xl font-bold text-white mb-3">{{ value.title }}</h3>
          <p class="text-white leading-relaxed">{{ value.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
