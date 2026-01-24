import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['./app/assets/css/main.css'],
  modules: ['@nuxt/image', '@nuxt/eslint', '@nuxt/hints', '@nuxtjs/strapi', '@nuxt/content', 'nuxt-studio'],
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: 'Africa Business Bureau - Your 360° Launchpad for Growth in Ghana and Africa',
      meta: [
        {
          name: 'description',
          content: 'Africa Business Bureau (ABB): Your 360° Launchpad for Growth in Ghana and Africa.'

        }
      ]
    }
  },
  colorMode: {
    preference: 'light',
    fallback: 'light',
    classSuffix: ''
  },
  strapi: {
    url: process.env.STRAPI_URL || 'http://localhost:1337',
    token: '1d783e096b05e2d74b6afa8ecbe3bc8d87b9d5f424dc6771958541f1a3dcd3882f7376962b4d128bd9c4d56911c07253d92e931442cab22dc0ab422581c78c543b0457f4d005017cb18f1a983be672abcb4b5bbf4b412c3514547855a523af3e9f4b623187a7c7db433e9ac0c79ab4c728d7b5cf7a44925d0cc445d9c9fcc8ec',
    admin: '/admin',
    prefix: '/api',
    cookie: {},
    cookieName: 'strapi_jwt',
    version: 'v5',

  },
  studio: {
    repository: {
      provider: 'github',
      owner: 'abbdev26-gh',
      repo: 'abb-website',
      branch: 'main'
    }
  },
  image: {
    domains: ['tidy-friend-384c97c42d.media.strapiapp.com', 'images.unsplash.com']
  },
  vite: { plugins: [tailwindcss(),], },
  runtimeConfig: {
    strapiUpstreamUrl: process.env.STRAPI_URL || 'http://localhost:1337',
    public: {
      strapiUrl: '/api/strapi', // Point to local proxy
      // strapiToken: process.env.STRAPI_TOKEN || '...', // Commented out to test public permissions
      strapiToken: '',
    },
    forminitApiKey: process.env.FORMINIT_API_KEY,
  },
  nitro: {
    prerender: {
      // Pre-render the homepage
      routes: ['/'],
      // Disable crawlLinks to prevent OOM on Vercel
      crawlLinks: false
    }
  },
  routeRules: {
    '/': { isr: 3600 },
    '/about': { isr: 3600 },
    '/contact': { isr: 3600 },
    '/gallery': { isr: 3600 },
    '/pricing': { isr: 3600 },
    '/locations/**': { isr: 3600 },
    '/services/**': { isr: 3600 },
  }
})
