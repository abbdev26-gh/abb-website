<script setup lang="ts">
defineProps<{
  title: string
  description: string
  icon: string
}>()
</script>

<template>
  <div class="group rounded-2xl border border-muted bg-background p-8 transition-all hover:shadow-lg hover:border-primary/20">
    <div class="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/5 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
      <slot name="icon">
        <!-- Default icon placeholder if slot is not used, though prop is expected -->
        <span class="text-xl font-bold">{{ icon }}</span>
      </slot>
    </div>
    <h3 class="mb-3 font-display text-xl font-bold tracking-tight">{{ title }}</h3>
    <p class="text-muted-foreground">{{ description }}</p>
  </div>
</template>
