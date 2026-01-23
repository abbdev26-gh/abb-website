<script setup lang="ts">
const awards = [
  { year: '2024', title: 'Best Coworking Space', organization: 'Real Estate Awards' },
  { year: '2023', title: 'Excellence in Design', organization: 'Architecture Daily' },
  { year: '2023', title: 'Top 10 Startups', organization: 'Business Weekly' },
  { year: '2022', title: 'Community Builder', organization: 'Tech Hub Africa' },
  { year: '2021', title: 'Innovation Award', organization: 'Future Workspace' }
]
</script>

<template>
  <section class="pt-20 bg-gray-50">
    <div class="container mx-auto px-4 md:px-6">
      <div class="grid lg:grid-cols-2 gap-12 items-start">
        <div>
          <div class="inline-flex items-center rounded-full border border-gray-200 bg-white px-3 py-1 text-sm font-medium text-gray-800 mb-6">
            <span class="flex h-2 w-2 rounded-full bg-[#E60000] mr-2"></span>
            Recognition
          </div>
          <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold font-display text-gray-900 mb-6 leading-tight">
            Our work has been recognized by industry leaders for <span class="text-[#E60000]">its creativity, impact, and strategic excellence.</span>
          </h2>
        </div>

        <div class="bg-white rounded-3xl p-8 md:p-10 shadow-sm">
          <div class="space-y-6">
            <div v-for="award in awards" :key="award.title" class="flex items-center justify-between border-b border-gray-100 pb-6 last:border-0 last:pb-0 group">
              <div>
                <h3 class="font-bold text-gray-900 group-hover:text-[#E60000] transition-colors">{{ award.title }}</h3>
                <p class="text-sm text-gray-500">{{ award.organization }}</p>
              </div>
              <span class="text-sm font-medium text-gray-400 bg-gray-50 px-3 py-1 rounded-full">{{ award.year }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
