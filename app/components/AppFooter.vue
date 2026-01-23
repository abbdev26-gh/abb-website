<script setup lang="ts">
import { PhTwitterLogo, PhInstagramLogo, PhLinkedinLogo, PhFacebookLogo } from '@phosphor-icons/vue'
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="border-t border-white/10 bg-black text-white">
    <div class="container mx-auto px-4 py-12 md:px-6 md:py-16">
      <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <div class="space-y-4">
          <NuxtLink to="/" class="flex items-center gap-2 font-display text-xl font-bold tracking-tighter">
            <img src="/images/logo.png" alt="abb-logo" class="w-16 md:w-32 shrink-0 brightness-0 invert">
          </NuxtLink>
          <p class="text-sm text-gray-400 max-w-xs">
            Africa Business Bureau (ABB): Your 360° Launchpad for Growth in Ghana and Africa. Providing businesses with training, talent management and business support services to incubate their business ideas and accelerate growth.
          </p>
        </div>
        
        <div>
          <h3 class="font-semibold mb-4 text-white">Company</h3>
          <ul class="space-y-2 text-sm text-gray-400">
            <li><NuxtLink to="/about" class="hover:text-white transition-colors">About Us</NuxtLink></li>
            <li><NuxtLink to="/#services" class="hover:text-white transition-colors">Services</NuxtLink></li>
            <!-- <li><a href="https://forms.gle/Zm6AjDSnTdYzm3cp9" target="_blank" class="hover:text-white transition-colors">Become a Member</a></li> -->
            <li><NuxtLink to="/gallery" class="hover:text-white transition-colors">Events & Gallery</NuxtLink></li>
            <li><NuxtLink to="/contact" class="hover:text-white transition-colors">Contact Us</NuxtLink></li>
          </ul>
        </div>

        <div class="hidden">
          <h3 class="font-semibold mb-4 text-white">Resources</h3>
          <ul class="space-y-2 text-sm text-gray-400">
            <li><NuxtLink to="/blog" class="hover:text-white transition-colors">Blog</NuxtLink></li>
            <li><NuxtLink to="/events" class="hover:text-white transition-colors">Events</NuxtLink></li>
            <li><NuxtLink to="/faq" class="hover:text-white transition-colors">FAQ</NuxtLink></li>
            <li><NuxtLink to="/support" class="hover:text-white transition-colors">Support</NuxtLink></li>
          </ul>
        </div>

        <div>
          <h3 class="font-semibold mb-4 text-white">Stay Updated</h3>
          <p class="text-sm text-gray-400 mb-4">Subscribe to our newsletter for the latest updates and offers.</p>
          <form class="flex gap-2" @submit.prevent>
            <input 
              type="email" 
              placeholder="Enter your email" 
              class="flex-1 rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#E60000]"
            />
            <button type="submit" class="rounded-md bg-[#E60000] px-3 py-2 text-sm font-medium text-white hover:bg-red-600 transition-colors">
              Subscribe
            </button>
          </form>
        </div>
      </div>
      
      <div class="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 md:flex-row">
        <p class="text-sm text-gray-500">
          &copy; {{ currentYear }} Africa Business Bureau Inc. All rights reserved.
        </p>
        <div class="flex gap-4">
          <a href="https://twitter.com/abb_africa" target="_blank" class="text-gray-400 hover:text-white transition-colors">
            <span class="sr-only">Twitter</span>
            <PhTwitterLogo weight="fill" class="w-5 h-5" />
          </a>
          <a href="https://www.instagram.com/abb_africa/" target="_blank" class="text-gray-400 hover:text-white transition-colors">
            <span class="sr-only">Instagram</span>
            <PhInstagramLogo weight="fill" class="w-5 h-5" />
          </a>
          <a href="https://www.linkedin.com/company/africa-business-bureau/" target="_blank" class="text-gray-400 hover:text-white transition-colors">
            <span class="sr-only">LinkedIn</span>
            <PhLinkedinLogo weight="fill" class="w-5 h-5" />
          </a>
          <a href="https://web.facebook.com/AfricanBusinessBureau/" target="_blank" class="text-gray-400 hover:text-white transition-colors">
            <span class="sr-only">Facebook</span>
            <PhFacebookLogo weight="fill" class="w-5 h-5" />
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>
