<script setup lang="ts">
import { PhCheckCircle } from '@phosphor-icons/vue';

const benefits = [
  {
    title: 'Creative Freedom',
    description: 'Customize your workspace to reflect your brand identity. We provide the canvas; you create the masterpiece.',
    color: 'bg-purple-100 text-purple-600'
  },
  {
    title: 'On-time Performance',
    description: 'We respect your time. Our services and support are delivered promptly, ensuring your business never misses a beat.',
    color: 'bg-pink-100 text-pink-600'
  },
  {
    title: 'Eco-conscious Architecture',
    description: 'Our spaces are designed with sustainability in mind, utilizing energy-efficient systems and eco-friendly materials.',
    color: 'bg-yellow-100 text-yellow-600'
  }
]
</script>

<template>
  <section class="bg-white overflow-hidden mt-20">
    <div class="container mx-auto px-4 md:px-6">
      <div class="grid lg:grid-cols-2 gap-16 items-center">
        <!-- Image Side -->
        <div class="relative order-1 lg:order-2">
          <div class="aspect-square rounded-3xl overflow-hidden bg-gray-100">
            <img 
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1000" 
              alt="Why choose us" 
              class="h-full w-full object-cover"
            />
          </div>
          <!-- Decorative Elements -->
          <div class="absolute -bottom-10 -left-10 w-40 h-40 bg-[#E60000]/10 rounded-full blur-3xl -z-10"></div>
          <div class="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl -z-10"></div>
        </div>

        <!-- Content Side -->
        <div class="order-2 lg:order-1">
          <!-- <div class="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-sm font-medium text-gray-800 mb-6">
            <span class="flex h-2 w-2 rounded-full bg-yellow-400 mr-2"></span>
            Why Choose Us
          </div> -->
          <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold font-display text-gray-900 mb-6 leading-tight">
            Why leading brands choose to work with us <span class="text-[#E60000]">confidently and consistently</span>
          </h2>

          <div class="space-y-8">
            <div v-for="(benefit, index) in benefits" :key="benefit.title" class="flex gap-6 group">
              <div :class="`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg bg-red-100 text-[#E60000]`">
                {{ index + 1 }}
              </div>
              <div>
                <h3 class="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#E60000] transition-colors">{{ benefit.title }}</h3>
                <p class="text-gray-500 leading-relaxed">{{ benefit.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
