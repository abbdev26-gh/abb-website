<script setup lang="ts">
defineProps<{
  name: string
  address: string
  image: string
  features: string[]
  slug: string
}>()
</script>

<template>
  <div class="overflow-hidden rounded-2xl border border-muted bg-background transition-all hover:shadow-xl">
    <div class="aspect-video w-full overflow-hidden bg-muted">
      <!-- Using a placeholder div for now, but ready for NuxtImg -->
      <div class="h-full w-full bg-cover bg-center transition-transform duration-500 hover:scale-105" :style="{ backgroundImage: `url(${image})` }"></div>
    </div>
    <div class="p-6">
      <h3 class="mb-2 font-display text-2xl font-bold tracking-tight">{{ name }}</h3>
      <p class="mb-4 text-muted-foreground flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
        {{ address }}
      </p>
      <div class="mb-6 flex flex-wrap gap-2">
        <span 
          v-for="feature in features" 
          :key="feature"
          class="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
        >
          {{ feature }}
        </span>
      </div>
      <NuxtLink 
        :to="`/locations/${slug}`" 
        class="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        View Details
      </NuxtLink>
    </div>
  </div>
</template>
