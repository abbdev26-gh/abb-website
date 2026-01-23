<script setup lang="ts">
const config = useRuntimeConfig();

// Fetch About Page content (for title/description)
const { data: aboutContent } = await useAsyncData('about-story-content', () => 
  queryCollection('about').first()
);

// Fetch Home About content (for timeline) by default, or check if 'about' has it.
// Based on current JSON files, timeline is in home_about.json
const { data: homeAboutContent } = await useAsyncData('about-story-timeline', () => 
  queryCollection('home_about').first()
);

const storyData = computed(() => {
  return aboutContent.value || {};
});

const timelineEvents = computed(() => {
    return homeAboutContent.value?.storyTimeline || [];
})
</script>

<template>
  <section class="py-20 bg-white overflow-hidden">
    <div class="container mx-auto px-4 md:px-6">
      <div class="grid lg:grid-cols-12 gap-12 lg:gap-20">
        
        <!-- Left Column: Headline & Intro -->
        <div class="lg:col-span-5">
            <div class="sticky top-24">
                <span class="text-[#E60000] font-bold tracking-wider text-sm uppercase mb-4 block">Our Story</span>
                <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold font-display text-gray-900 mb-8 leading-tight">
                    {{ storyData.storyTitle || "We're Transforming the Future of Business" }}
                </h2>
                <div class="flex items-center gap-4 mb-8">
                  
                </div>
                <p class="text-gray-600 text-lg leading-relaxed">
                     {{ storyData.storyDescription }}
                </p>
            </div>
        </div>

        <!-- Right Column: Timeline -->
        <div class="lg:col-span-7">
            <div class="space-y-16">
                <div v-for="(event, index) in timelineEvents" :key="event.id" class="group">
                    <div class="flex items-start gap-6">
                        <div class="shrink-0 text-xl font-bold text-gray-300 group-hover:text-[#E60000] transition-colors duration-300">
                            {{ String(index + 1).padStart(2, '0') }}.
                        </div>
                        <div>
                            <span class="block text-sm font-semibold text-[#E60000] mb-2">{{ event.year }}</span>
                            <h3 class="text-2xl font-bold text-gray-900 mb-4">{{ event.title }}</h3>
                            <div class="text-gray-600 leading-relaxed text-lg" v-html="event.description"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

      </div>
    </div>
  </section>
</template>
