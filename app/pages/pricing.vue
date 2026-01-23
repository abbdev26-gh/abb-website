<script setup lang="ts">
import PricingCard from '~/components/PricingCard.vue'

const plans = [
  {
    name: 'Day Pass',
    price: '$29',
    period: 'day',
    description: 'Perfect for the occasional drop-in.',
    features: [
      'Access from 9am - 6pm',
      'High-speed internet',
      'Coffee & Tea',
      'Open desk seating'
    ]
  },
  {
    name: 'Dedicated Desk',
    price: '$349',
    period: 'month',
    description: 'Your own personal desk in a shared space.',
    features: [
      '24/7 Access',
      'Personal locker',
      '5h Meeting room credits',
      'Mailing address',
      'All Day Pass perks'
    ],
    popular: true
  },
  {
    name: 'Private Office',
    price: '$899',
    period: 'month',
    description: 'A fully furnished private office for your team.',
    features: [
      '24/7 Access',
      'Lockable office',
      '10h Meeting room credits',
      'Logo on door',
      'Guest reception',
      'All Dedicated Desk perks'
    ]
  }
]
</script>

<template>
  <div class="py-20 md:py-32">
    <div class="container mx-auto px-4 md:px-6">
      <div class="mb-16 text-center">
        <h1 class="mb-4 font-display text-4xl font-bold tracking-tight sm:text-5xl">Membership Plans</h1>
        <p class="mx-auto max-w-2xl text-lg text-muted-foreground">
          Flexible options to suit your working style. No hidden fees.
        </p>
      </div>
      
      <div class="grid gap-8 max-w-5xl mx-auto">
        <PricingCard 
          v-for="plan in plans" 
          :key="plan.name" 
          v-bind="plan"
        />
      </div>

      <div class="mt-20 text-center">
        <h2 class="mb-4 font-display text-2xl font-bold">Need a custom solution for your team?</h2>
        <p class="mb-8 text-muted-foreground">We offer enterprise solutions for teams of 20+.</p>
        <NuxtLink to="/contact" class="text-primary font-medium hover:underline">Contact our sales team &rarr;</NuxtLink>
      </div>
    </div>
  </div>
</template>
