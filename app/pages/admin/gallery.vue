<script setup lang="ts">
import { PhImages, PhPlus, PhTrash, PhNavigationArrow } from '@phosphor-icons/vue';

// Fetch existing gallery items
const { data: galleryItems, refresh: refreshGallery } = await useAsyncData('admin-gallery-list', () => 
  queryCollection('gallery').all()
);

// Fetch available images for selection
const { data: availableImages } = await useAsyncData('admin-available-images', () => 
  $fetch('/api/admin/images')
);

const form = ref({
  title: '',
  description: '',
  order: (galleryItems.value?.length || 0) + 1,
  images: [] as { url: string }[]
});

const isSubmitting = ref(false);
const statusMessage = ref('');

const addImage = (url: string) => {
  if (!form.value.images.some(img => img.url === url)) {
    form.value.images.push({ url });
  }
};

const removeImage = (index: number) => {
  form.value.images.splice(index, 1);
};

const submitForm = async () => {
  isSubmitting.value = true;
  statusMessage.value = 'Saving...';
  
  try {
    await $fetch('/api/admin/gallery', {
      method: 'POST',
      body: form.value
    });
    
    statusMessage.value = 'Successfully saved!';
    form.value = {
      title: '',
      description: '',
      order: (galleryItems.value?.length || 0) + 2,
      images: []
    };
    await refreshGallery();
  } catch (error: any) {
    statusMessage.value = `Error: ${error.statusMessage || 'Failed to save'}`;
  } finally {
    isSubmitting.value = false;
  }
};

const sortedGallery = computed(() => {
  return [...(galleryItems.value || [])].sort((a, b) => a.order - b.order);
});
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="container mx-auto px-4 max-w-6xl">
      <header class="mb-12 flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 font-display">Gallery Admin</h1>
          <p class="text-gray-600 mt-2">Add or manage gallery events effortlessly.</p>
        </div>
        <NuxtLink to="/gallery" class="text-[#E60000] font-medium flex items-center gap-2 hover:underline">
          View Live Gallery <PhNavigationArrow />
        </NuxtLink>
      </header>

      <div class="grid lg:grid-cols-2 gap-12">
        <!-- New Section Form -->
        <section class="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h2 class="text-xl font-bold mb-6 flex items-center gap-2">
            <PhPlus class="text-[#E60000]" /> Add New Event
          </h2>
          
          <form @submit.prevent="submitForm" class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
              <input 
                v-model="form.title" 
                type="text" 
                required
                class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                placeholder="e.g. Annual Tech Summit 2026"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea 
                v-model="form.description" 
                rows="3"
                class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                placeholder="Briefly describe the event..."
              ></textarea>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                <input 
                  v-model.number="form.order" 
                  type="number" 
                  required
                  class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            <!-- Image Selection -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Select Images</label>
              <div class="flex flex-wrap gap-2 mb-4 p-4 border-2 border-dashed border-gray-100 rounded-xl bg-gray-50 min-h-[100px]">
                <div v-for="(img, idx) in form.images" :key="idx" class="relative group">
                  <img :src="img.url" class="w-16 h-16 object-cover rounded-lg shadow-sm" />
                  <button 
                    type="button"
                    @click="removeImage(idx)"
                    class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <PhTrash :size="12" />
                  </button>
                </div>
                <div v-if="form.images.length === 0" class="text-gray-400 text-sm flex items-center justify-center w-full">
                   No images selected yet.
                </div>
              </div>

              <!-- Available Images Browser -->
              <div class="max-h-60 overflow-y-auto grid grid-cols-4 sm:grid-cols-6 gap-2 p-2 bg-white border border-gray-100 rounded-lg">
                <button 
                  v-for="url in availableImages" 
                  :key="url"
                  type="button"
                  @click="addImage(url)"
                  class="aspect-square relative hover:opacity-75 transition-opacity"
                  :class="{ 'ring-2 ring-red-500': form.images.some(i => i.url === url) }"
                >
                  <img :src="url" class="w-full h-full object-cover rounded shadow-xs" loading="lazy" />
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              :disabled="isSubmitting"
              class="w-full bg-[#E60000] text-white py-3 rounded-lg font-bold hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {{ isSubmitting ? 'Saving...' : 'Save Gallery Section' }}
            </button>

            <p v-if="statusMessage" class="text-center text-sm font-medium" :class="statusMessage.includes('Error') ? 'text-red-500' : 'text-green-500'">
              {{ statusMessage }}
            </p>
          </form>
        </section>

        <!-- Existing Sections List -->
        <section>
          <h2 class="text-xl font-bold mb-6 flex items-center gap-2">
            <PhImages class="text-[#E60000]" /> Existing Events
          </h2>
          
          <div class="space-y-4">
            <div v-for="item in (sortedGallery as any[])" :key="item.id" class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex gap-4 animate-in fade-in duration-500">
               <div class="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-xl overflow-hidden">
                 <img v-if="item.images?.[0]?.url" :src="item.images[0].url" class="w-full h-full object-cover" />
                 <div v-else class="w-full h-full flex items-center justify-center text-gray-300">
                   <PhImages :size="32" />
                 </div>
               </div>
               <div class="flex-1">
                 <div class="flex justify-between items-start">
                   <h3 class="font-bold text-gray-900">{{ item.title }}</h3>
                   <span class="text-xs font-bold bg-gray-100 text-gray-500 px-2 py-1 rounded">Order: {{ item.order }}</span>
                 </div>
                 <p class="text-sm text-gray-500 mt-1 line-clamp-2">{{ item.description }}</p>
                 <div class="mt-3 flex gap-2">
                   <span class="text-xs text-gray-400">{{ item.images?.length || 0 }} images</span>
                 </div>
               </div>
            </div>
            
            <div v-if="!galleryItems?.length" class="text-center py-12 bg-gray-100/50 rounded-2xl border-2 border-dashed border-gray-200 text-gray-400">
              No gallery events found.
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped>
.font-display {
  font-family: inherit; /* Update if the project uses a specific display font */
}
</style>
