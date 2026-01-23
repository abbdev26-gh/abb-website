<script setup lang="ts">
import { ref } from 'vue';
import PricingCard from './PricingCard.vue';

const props = defineProps<{
  virtualPackages: any[]
  spaceRentalPackages: any[]
}>()

const activeTab = ref('virtual');

const tabs = [
  { id: 'virtual', label: 'Virtual Office Packages' },
  { id: 'space', label: 'Space Rental' }
];
</script>

<template>
  <div class="w-full max-w-5xl mx-auto">
    <!-- Tabs Header -->
    <div class="flex border-b border-gray-200 mb-10">
      <button 
        v-for="tab in tabs" 
        :key="tab.id"
        @click="activeTab = tab.id"
        class="pb-4 px-1 mr-8 text-sm font-medium transition-all relative"
        :class="activeTab === tab.id ? 'text-[#E60000]' : 'text-gray-500 hover:text-gray-700'"
      >
        {{ tab.label }}
        <div 
          class="absolute bottom-0 left-0 w-full h-0.5 bg-[#E60000] transition-transform duration-300"
          :class="activeTab === tab.id ? 'scale-x-100' : 'scale-x-0'"
        ></div>
      </button>
    </div>

    <!-- Content -->
    <div class="flex flex-col gap-6">
      <template v-if="activeTab === 'virtual'">
        <PricingCard 
          v-for="pkg in virtualPackages" 
          :key="pkg.name"
          v-bind="pkg"
        />
      </template>
      <template v-else>
        <PricingCard 
          v-for="pkg in spaceRentalPackages" 
          :key="pkg.name"
          v-bind="pkg"
        />
      </template>
    </div>
  </div>
</template>
