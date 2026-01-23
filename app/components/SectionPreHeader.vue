<template>
    <span class="flex items-center">
  <span class="h-px flex-1 bg-linear-to-r from-transparent to-gray-300"></span>

  <span class="shrink-0 px-4 text-gray-900">{{ title }}</span>

  <span class="h-px flex-1 bg-linear-to-l from-transparent to-gray-300"></span>
</span>
</template>

<script setup lang="ts">
defineProps({
    title: {
        type: String,
        required: true
    }
})
</script>
