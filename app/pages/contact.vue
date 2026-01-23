<script setup lang="ts">
import ContactHero from '~/components/ContactHero.vue'
import ContactLocations from '~/components/ContactLocations.vue'
import ContactForm from '~/components/ContactForm.vue'
import CTASection from '~/components/CTASection.vue'

useSeoMeta({
  title: 'Contact Us - Africa Business Bureau',
  description: 'Get in touch with our team for sales, support, or general inquiries. Visit our offices or send us a message.',
})
</script>

<template>
  <div>
    <ContactHero />
    <ContactLocations />
    <ContactForm />
    <CTASection />
  </div>
</template>
