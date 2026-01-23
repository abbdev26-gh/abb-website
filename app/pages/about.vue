<script setup lang="ts">
import AboutHero from '~/components/AboutHero.vue'
import AboutStoryScroll from '~/components/AboutStoryScroll.vue'
import AboutStats from '~/components/AboutStats.vue'
import AboutValues from '~/components/AboutValues.vue'
import AboutWhyUs from '~/components/AboutWhyUs.vue'
import AboutAwards from '~/components/AboutAwards.vue'
import PartnersSection from '~/components/PartnersSection.vue'
import TestimonialSection from '~/components/TestimonialSection.vue'
import CTASection from '~/components/CTASection.vue'

useSeoMeta({
  title: 'About Us - Africa Business Bureau',
  description: 'Learn about our mission to redefine workspaces in Africa. We provide premium coworking spaces, virtual offices, and a community for innovation.',
})
</script>

<template>
  <div>
    <AboutHero />
    <AboutStory />
    <!-- <AboutWhyUs /> -->
    <AboutStats />
    <PartnersSection />
    <TeamSection />
    <AboutStoryScroll />
    <AboutValues />
    <TestimonialSection />
    <CTASection />
  </div>
</template>
