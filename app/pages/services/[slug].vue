<script setup lang="ts">
import { useRoute } from 'vue-router';
import { computed } from 'vue';
import CTASection from '~/components/CTASection.vue';
import { PhCheckCircle, PhArrowRight } from '@phosphor-icons/vue';

const route = useRoute();
const config = useRuntimeConfig();

const slug = computed(() => {
  const s = route.params.slug;
  return Array.isArray(s) ? s[0] : s;
});

// Fetch service data from Nuxt Content v3 (split by slug)
const { data: serviceRes } = await useAsyncData(`service-${slug.value}`, () => 
  queryCollection('services').where('slug', '=', slug.value).first()
);

const service = computed(() => {
  const s = serviceRes.value;
  if (!s) return null;
  console.log('Service Data Debug:', s);
  
  // Image already full URL from migration script or relative if edited.
  const imageObj = Array.isArray(s.serviceImage) ? s.serviceImage[0] : s.serviceImage;
  const imageUrl = imageObj?.url || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200';

  return {
    ...s,
    image: imageUrl,
    features: s.featuresList || [], 
    content: s.longDescription ? `<p>${s.longDescription}</p>` : '' 
  };
});

useSeoMeta({
  title: () => `${service.value?.title || 'Service'} - Africa Business Bureau`,
  description: () => service.value?.description || 'Service details',
})
</script>

<template>
  <div v-if="service" class="min-h-screen bg-white pt-10">
    <div class="container mx-auto px-4 md:px-6">
      
      <!-- Hero Section -->
      <div class="mb-16">
        <div class="max-w-4xl mb-8">
          <h1 class="text-4xl md:text-6xl lg:text-7xl font-bold font-display text-gray-900 tracking-tight leading-[0.9]">
            {{ service.name }}<span class="text-[#E60000]">.</span>
          </h1>
        </div>

        <div class="w-full h-[20vh] md:h-[40vh] rounded-3xl overflow-hidden bg-gray-100">
          <img 
            :src="service.image" 
            :alt="service.name" 
            class="w-full h-full object-cover object-top"
          />
        </div>
      </div>
      <!-- Content Section -->
      <div class="grid md:grid-cols-12 gap-8 mb-0">
        <!-- Sidebar / Meta -->
        <div class="md:col-span-4 lg:col-span-3">
          <div class="sticky top-32 space-y-8">
            <div>
              <h3 class="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Category</h3>
              <p class="text-lg font-medium text-gray-900">Service Offering</p>
            </div>
            <div v-if="service.stat">
              <h3 class="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Key Benefit</h3>
              <p class="text-lg font-medium text-[#E60000]">{{ service.stat }}</p>
            </div>
             <a v-if="service?.externalLink" id="service-link" :href="service?.externalLink || '/#'" target="_blank" class="inline-flex justify-center mt-5 md:mt-10 items-center gap-x-3 text-center bg-linear-to-tl from-red-500 to-red-600 hover:from-red-600 hover:to-red-500 focus:outline-hidden focus:from-red-600 focus:to-red-500 border border-transparent text-white text-base font-bold rounded-full py-3 px-4 animate-on-scroll delay-300">
        {{ service?.linkText || 'Learn More' }}
        <PhArrowRight class="shrink-0 size-6 text-white" />
      </a>
          </div>
        </div>

        <!-- Main Content -->
        <div class="md:col-span-8 lg:col-span-8 lg:col-start-5">
          <div 
            class="prose prose-2xl md:prose-2xl prose-h3:!text-2xl [&>h3]:!text-3xl [&>h3]:mb-5 max-w-none prose-headings:font-display prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-600 prose-li:text-gray-600 prose-strong:text-gray-900 prose-strong:font-bold"
            v-if="service.content"
            v-html="service.content"
          ></div>

          <!-- New: Workspace Solutions Cards -->
          <div v-if="service.workspaceSolutions && service.workspaceSolutions.length > 0" class="mt-12 grid gap-6">
            <h3 class="text-2xl font-bold font-display text-gray-900 mb-2">Available Options</h3>
            <div v-for="(item, idx) in service.workspaceSolutions" :key="idx" class="bg-gray-50 rounded-2xl p-8 border border-gray-100 hover:border-[#E60000]/30 transition-colors">
              <h4 class="text-xl font-bold text-gray-900 mb-2">{{ item.category }}</h4>
              <p class="text-gray-600 mb-4">{{ item.description }}</p>
              <div class="text-sm">
                <span class="font-bold text-gray-900 block mb-1">Ideal For:</span>
                <span class="text-gray-500">{{ item.useCase }}</span>
              </div>
            </div>
          </div>

          <!-- New: Virtual Office Cards -->
          <div v-if="service.virtualOffices && service.virtualOffices.length > 0" class="mt-12 grid gap-6 p-4 md:p-6 rounded-2xl bg-black md:grid-cols-2">
            <h3 class="text-2xl font-bold font-display text-white mb-2 col-span-full">Key Benefits</h3>
            <div v-for="(item, idx) in service.virtualOffices" :key="idx" class="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:scale-105  transition-transform">
              <h4 class="text-lg font-bold text-[#E60000] mb-2">{{ item.feature }}</h4>
              <p class="text-gray-600 text-sm">{{ item.benefit }}</p>
            </div>
          </div>

           <!-- New: Masterclasses Cards -->
           <div v-if="service.masterclasses && service.masterclasses.length > 0" class="mt-12 grid gap-6 p-4 md:p-6 bg-black rounded-2xl">
            <h3 class="text-2xl font-bold font-display text-white mb-2">Audience Focus</h3>
            <div v-for="(item, idx) in service.masterclasses" :key="idx" class="bg-gray-50 rounded-2xl p-8 border border-gray-100 flex flex-col md:flex-row gap-6 items-start">
              <div class="md:w-1/3">
                <h4 class="text-xl font-bold text-[#E60000]">{{ item.audience }}</h4>
              </div>
              <div class="md:w-2/3 border-t md:border-t-0 md:border-l border-gray-200 pt-4 md:pt-0 md:pl-6">
                <span class="font-bold text-gray-900 block mb-1 text-sm uppercase tracking-wider">Focus Area</span>
                <p class="text-gray-600">{{ item.focus }}</p>
              </div>
            </div>
          </div>

           <!-- New: Program Comparisons (Cards Approach) -->
           <div v-if="service.programComparisons && service.programComparisons.length > 0" class="mt-16">
            <h3 class="text-2xl font-bold font-display text-gray-900 mb-8">Program Comparison</h3>
            
            <div class="grid md:grid-cols-2 gap-8">
              <div 
                v-for="(program, idx) in service.programComparisons" 
                :key="idx" 
                class="bg-black rounded-2xl p-8 border border-gray-200 hover:border-[#E60000]/30 hover:shadow-lg transition-all duration-300 flex flex-col h-full"
              >
                <div class="mb-6 pb-6 border-b border-white">
                  <h4 class="text-2xl font-bold text-[#E60000]">{{ program.programName }}</h4>
                </div>
                
                <div class="space-y-6 flex-grow">
                  <div>
                    <span class="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Target Audience</span>
                    <p class="text-white font-medium whitespace-pre-line">{{ program.targetAudience }}</p>
                  </div>
                  
                  <div>
                    <span class="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Service Focus</span>
                    <p class="text-white">{{ program.serviceFocus }}</p>
                  </div>
                  
                  <div>
                     <span class="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Key Support Provided</span>
                     <!-- Rich text content -->
                     <div class="prose prose-sm text-white prose-p:text-white prose-ul:list-disc prose-ul:pl-4" v-html="program.keySupportProvided"></div>
                  </div>
                </div>
              </div>
            </div>
           </div>

           <!-- New: Virtual Presence Solutions -->
           <div v-if="service.virtualPresence && service.virtualPresence.length > 0" class="mt-16">
             <div v-for="(vp, idx) in service.virtualPresence" :key="idx" class="mb-16">
               <h3 class="text-2xl font-bold font-display text-gray-900 mb-4">{{ vp.title }}</h3>
               <p class="text-gray-600 mb-8 max-w-3xl">{{ vp.description }}</p>

               <!-- Features List -->
               <div v-if="vp.features && vp.features.length > 0" class="mb-12 space-y-6">
                 <div v-for="(feature, fIdx) in vp.features" :key="fIdx" class="flex gap-4">
                   <div class="mt-1.5 shrink-0 w-2 h-2 rounded-full bg-[#E60000]"></div>
                   <div>
                     <span class="font-bold text-gray-900">{{ feature.title }}{{ feature.title.endsWith(':') ? '' : ':' }}</span>
                     <span class="text-gray-600 ml-1">{{ feature.description }}</span>
                   </div>
                 </div>
               </div>

               <!-- Benefits Section -->
               <div v-if="vp.benefits && vp.benefits.length > 0">
                 <h4 class="text-xl font-bold font-display text-gray-900 mb-6">{{ vp.benefitsTitle }}</h4>
                 <div class="space-y-6">
                   <div v-for="(benefit, bIdx) in vp.benefits" :key="bIdx" class="flex gap-4">
                     <div class="mt-1.5 shrink-0 w-2 h-2 rounded-full bg-[#E60000]"></div>
                     <div>
                       <span class="font-bold text-gray-900">{{ benefit.title }}{{ benefit.title.endsWith(':') ? '' : ':' }}</span>
                       <span class="text-gray-600 ml-1">{{ benefit.description }}</span>
                     </div>
                   </div>
                 </div>
               </div>
             </div>
           </div>


          <!-- Features Grid -->
          <div v-if="service.features && service.features.length > 0" class="mt-16">
            <h3 class="text-2xl font-bold font-display text-gray-900 hidden mb-8">Key Highlights</h3>
            <div class="grid md:grid-cols-2 gap-6">
              <div 
                v-for="(feature, index) in service.features" 
                :key="index"
                class="bg-[#111111] p-8 rounded-2xl text-white group hover:-translate-y-1 transition-transform duration-300"
              >
                <div class="text-[#E60000] mb-4">
                  <PhCheckCircle :size="32" weight="fill" />
                </div>
                <h4 class="text-xl font-bold mb-3">{{ feature.title }}</h4>
                <p class="text-gray-400 leading-relaxed text-sm">{{ feature.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- <MembershipBenefits class="mb-20 md:mb-32" /> -->
    
    <CTASection  class="mt-120 md:mt-32"/>
  </div>
  <div v-else class="min-h-screen flex items-center justify-center pt-32">
    <div class="text-center">
      <h1 class="text-4xl font-bold text-gray-900 mb-4">Service Not Found</h1>
      <NuxtLink to="/" class="text-[#E60000] hover:underline">Go back home</NuxtLink>
    </div>
  </div>
</template>

<style>
/* Custom prose styling overrides if needed */
.prose ul {
  list-style-type: none;
  padding-left: 0;
}
.prose li {
  position: relative;
  padding-left: 1.5em;
  margin-bottom: 0.5em;
}
.prose li::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0.6em;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #E60000;
}
</style>
