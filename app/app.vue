<script setup lang="ts">
useHead({
  titleTemplate: '%s - Africa Business Bureau',
  meta: [
    { name: 'description', content: 'Africa Business Bureau (ABB): Your 360° Launchpad for Growth in Ghana and Africa.' },
    { property: 'og:image', content: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000' },
    { name: 'twitter:card', content: 'summary_large_image' }
  ],
  link: [{ rel: 'icon', type: 'image/png', href: '/abb-favicon.png' }]
})
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
