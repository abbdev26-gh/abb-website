<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { PhList, PhX, PhCaretDown } from '@phosphor-icons/vue'

const links = [
  { label: 'Home', to: '/#' },
  { label: 'Services', to: '/#services' },
  { label: 'About', to: '/about' },
  { label: 'Events & Gallery', to: '/gallery' }
]

const isOpen = ref(false)
const activeDropdown = ref<string | null>(null)
const isScrolled = ref(false)

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20
}

const toggleDropdown = (label: string) => {
  if (activeDropdown.value === label) {
    activeDropdown.value = null
  } else {
    activeDropdown.value = label
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <header 
    class="sticky top-0 left-0 right-0 z-50 flex justify-center transition-all duration-300 px-4 lg:px-0"
    :class="isScrolled ? 'pt-4' : 'pt-6'"
  >
    <div 
      class="relative w-full max-w-screen-2xl rounded-xl bg-white/80 backdrop-blur-xl transition-all duration-300"
      :class="isScrolled ? 'py-3 px-6' : 'py-4 px-8'"
    >
      <div class="flex items-center justify-between">
        <!-- Logo -->
        <NuxtLink to="/" external class="flex items-center gap-2 font-display text-xl font-bold tracking-tighter text-gray-900 shrink-0">
          <img src="/images/logo.png" alt="Abb Logo" class="h-12 md:h-20 w-auto">
        </NuxtLink>

        <!-- Desktop Nav -->
        <nav class="hidden md:flex items-center gap-1">
          <template v-for="link in links" :key="link.label">
            <!-- Dropdown Link -->
            <div v-if="link.children" class="relative group">
              <button 
                class="flex items-center gap-1 px-8 py-2 text-base font-semibold uppercase text-gray-600 transition-colors hover:text-red-600 rounded-full hover:bg-gray-200 group-hover:text-red-600 group-hover:bg-gray-200"
              >
                {{ link.label }}
                <PhCaretDown weight="bold" class="w-4 h-4" />
              </button>
              
              <!-- Dropdown Menu -->
              <div class="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl uppercase shadow-xl border border-gray-400 overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                <NuxtLink 
                  v-for="child in link.children" 
                  :key="child.to"
                  :to="child.to"
                  external
                  class="block px-4 py-3 text-sm font-semibold text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
                >
                  {{ child.label }}
                </NuxtLink>
              </div>
            </div>

            <!-- Regular Link -->
            <NuxtLink 
              v-else
              :to="link.to"
              external
              class="relative px-8 py-2 text-base font-semibold uppercase text-gray-600 transition-colors hover:text-red-600 rounded-full hover:bg-gray-200"
            >
              {{ link.label }}
            </NuxtLink>
          </template>
        </nav>

        <!-- CTA Button -->
        <div class="hidden md:block shrink-0">
          <NuxtLink 
            to="/contact" 
            external
            class="w-full rounded-full px-6 md:px-12 py-4 text-base font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 bg-[#E60000] text-white"
          >
            Contact Us
          </NuxtLink>
        </div>

        <!-- Mobile Menu Button -->
        <button 
          @click="isOpen = !isOpen" 
          class="md:hidden p-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors"
        >
          <span class="sr-only">Toggle menu</span>
          <PhList v-if="!isOpen" weight="bold" class="w-6 h-6" />
          <PhX v-else weight="bold" class="w-6 h-6" />
        </button>
      </div>

      <!-- Mobile Nav Dropdown -->
      <div 
        v-show="isOpen"
        class="absolute top-full left-0 right-0 mt-4 p-4 rounded-3xl border border-gray-200 bg-white/95 backdrop-blur-xl shadow-xl md:hidden overflow-hidden"
      >
        <nav class="flex flex-col gap-2">
          <template v-for="link in links" :key="link.label">
            <div v-if="link.children">
              <button 
                @click="toggleDropdown(link.label)"
                class="flex items-center justify-between w-full px-4 py-3 text-base font-medium text-gray-600 rounded-xl hover:bg-gray-100 hover:text-gray-900 transition-all"
              >
                {{ link.label }}
                <PhCaretDown 
                  weight="bold" 
                  class="w-4 h-4 transition-transform"
                  :class="{ 'rotate-180': activeDropdown === link.label }"
                />
              </button>
              <div v-show="activeDropdown === link.label" class="pl-4 space-y-1 mt-1">
                <NuxtLink 
                  v-for="child in link.children" 
                  :key="child.to"
                  :to="child.to"
                  class="block px-4 py-2 text-base font-medium text-gray-500 rounded-lg hover:text-red-600"
                  @click="isOpen = false"
                >
                  {{ child.label }}
                </NuxtLink>
              </div>
            </div>

            <NuxtLink 
              v-else
              :to="link.to"
              external
              class="px-4 py-3 text-base font-medium text-gray-600 rounded-xl hover:bg-gray-100 hover:text-gray-900 transition-all"
              active-class="bg-gray-100 text-gray-900"
              @click="isOpen = false"
            >
              {{ link.label }}
            </NuxtLink>
          </template>
          <div class="h-px bg-gray-100 my-2"></div>
          <NuxtLink 
            to="/contact" 
            external
            class="w-full rounded-xl bg-[#E60000] px-4 py-3 text-center text-base font-bold text-white hover:bg-red-600 transition-colors" 
            @click="isOpen = false"
          >
           Contact us
          </NuxtLink>
        </nav>
      </div>
    </div>
  </header>
</template>
