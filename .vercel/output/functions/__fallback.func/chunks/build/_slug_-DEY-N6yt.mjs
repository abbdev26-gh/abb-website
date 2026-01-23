import __nuxt_component_0 from './AdditionalServices-BGHZLjjQ.mjs';
import __nuxt_component_1 from './MembershipBenefits-Dc5B54c-.mjs';
import { defineComponent, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate, ssrRenderComponent, ssrRenderList, ssrRenderStyle } from 'vue/server-renderer';
import { useRoute } from 'vue-router';
import { PhMapPin, PhClock, PhEnvelopeSimple } from '@phosphor-icons/vue';
import { P as PricingCard } from './PricingCard-Bvvrr42n.mjs';
import CTASection from './CTASection-BJAsNOtr.mjs';
import { a as useSeoMeta } from './server.mjs';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';
import './NuxtImg-DKyZQHcs.mjs';
import '../nitro/nitro.mjs';
import 'node:crypto';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import '@iconify/utils';
import 'consola';
import 'minimatch';
import 'better-sqlite3';
import 'node:url';
import 'ipx';
import './nuxt-link-DU2Yg8bd.mjs';
import './asyncData-wAjEz6As.mjs';
import 'perfect-debounce';
import './client-DqbjtPWP.mjs';
import 'qs';
import 'tailwindcss/colors';
import '@iconify/vue';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[slug]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const currentSlug = computed(() => route.params.slug);
    const locations = [
      {
        name: "ABB Airport West Office",
        address: "2 Allotey road, East Legon, Accra, Ghana",
        fullAddress: "ABB Airport City Office\n2 Allotey Road, East Legon\nAccra, Ghana",
        image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2000",
        slug: "airport-west-office",
        email: "airport@abb.com",
        phone: "+233 (0) 302 123 456",
        hours: "Monday – Friday: 6:00 AM - 10:00 PM\nSaturday – Sunday: 8:00 AM - 8:00 PM\n24/7 access available for members",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3970.970267230493!2d-0.1738746852339893!3d5.571583995960456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdf9a5769298d7b%3A0x4b7260533833210!2sEast%20Legon%2C%20Accra!5e0!3m2!1sen!2sgh!4v1625678901234!5m2!1sen!2sgh"
      },
      {
        name: "ABB Tema Office",
        address: "Tema Community 16, Tema, Ghana",
        fullAddress: "ABB Tema Office\nIndustrial Area\nTema, Ghana",
        image: "https://images.unsplash.com/photo-1604328698692-f76ea9498e76?auto=format&fit=crop&q=80&w=2000",
        slug: "tema-office",
        email: "tema@abb.com",
        phone: "+233 (0) 303 202 039",
        hours: "Monday – Friday: 6:00 AM - 10:00 PM\nSaturday – Sunday: 8:00 AM - 8:00 PM\n24/7 access available for members",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3970.456789012345!2d0.012345678901!3d5.678901234567!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1020789012345678%3A0x9012345678901234!2sTema%2C%20Ghana!5e0!3m2!1sen!2sgh!4v1625678901234!5m2!1sen!2sgh"
      }
    ];
    const currentLocation = computed(() => locations.find((l) => l.slug === currentSlug.value) || locations[0]);
    const virtualPackages = [
      {
        name: "UNIQUE PLAN",
        price: "GHS 200",
        period: "month (Annual billing)",
        description: "Perfect for startups",
        features: [
          "Premium virtual business address",
          "Personalized mailbox & reception",
          "Access to exclusive events",
          "10% discount on all ABB services",
          "Logo display (+GHS 700/year)"
        ]
      },
      {
        name: "OSCAR PLAN",
        price: "GHS 500",
        period: "month (Annual billing)",
        description: "For growing businesses",
        popular: true,
        features: [
          "Everything in UNIQUE Plan",
          "Logo display included",
          "8 hours co-working space monthly",
          "Free Wi-Fi & power",
          "Administrative support"
        ]
      },
      {
        name: "PROFESSIONAL PLAN",
        price: "GHS 1,000",
        period: "month (Annual billing)",
        description: "For established companies",
        features: [
          "Everything in UNIQUE Plan",
          "Logo display included",
          "Private company locker space",
          "12 hours co-working space monthly",
          "4 hours conference room monthly"
        ]
      }
    ];
    const spaceRentalPackages = [
      {
        name: "Co-Working Space",
        price: "GHS 300",
        period: "Daily",
        description: "Flexible desk access",
        features: [
          "High-speed Wi-Fi",
          "Uninterrupted power",
          "Administrative support",
          "Business event access",
          "Dedicated locker (Monthly)"
        ],
        extraPrices: [
          { label: "Hourly", price: "GHS 70" },
          { label: "Monthly", price: "GHS 3,000" }
        ]
      },
      {
        name: "Premium Private Office",
        price: "GHS 1,000",
        period: "Daily",
        description: "Private furnished office",
        popular: true,
        features: [
          "Private furnished office (1-2 guests)",
          "Reception services",
          "Mail handling",
          "Storage space",
          "Coffee bar access",
          "Complimentary refreshments (Daily)"
        ],
        extraPrices: [
          { label: "Hourly", price: "GHS 200" }
        ]
      },
      {
        name: "Conference Space",
        price: "GHS 1,500",
        period: "Daily",
        description: "Professional meeting room",
        features: [
          "6-8 seater room",
          "Digital presentation screen",
          "Whiteboard",
          "Reception services",
          "Refreshments (water & coffee)"
        ],
        extraPrices: [
          { label: "Hourly", price: "GHS 300" }
        ]
      }
    ];
    useSeoMeta({
      title: () => `${currentLocation.value?.name} - Coworking & Office Space`,
      description: () => `Rent premium office space at ${currentLocation.value?.name} in ${currentLocation.value?.address}. Available packages include virtual offices, coworking desks, and private suites.`
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_AdditionalServices = __nuxt_component_0;
      const _component_MembershipBenefits = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gray-50" }, _attrs))} data-v-e56b455b><section class="relative h-[20vh] md:h-[50vh] min-h-[400px] w-full overflow-hidden" data-v-e56b455b><template><img${ssrRenderAttr("src", currentLocation.value.image)}${ssrRenderAttr("alt", currentLocation.value.name)} class="absolute inset-0 w-full h-full object-cover" data-v-e56b455b></template><div class="absolute inset-0 bg-black/40" data-v-e56b455b></div><div class="absolute inset-0 flex items-center justify-center" data-v-e56b455b><template><h1 class="text-5xl md:text-7xl font-bold text-white text-center font-display drop-shadow-lg" data-v-e56b455b>${ssrInterpolate(currentLocation.value.name)}</h1></template></div></section><template><section class="bg-[#E60000] text-white max-w-6xl mx-auto py-12 relative z-10 -mt-10 rounded-2xl shadow-xl transform transition-transform duration-300 hover:scale-[1.01]" data-v-e56b455b><div class="container mx-auto px-4" data-v-e56b455b><div class="grid md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-white/20" data-v-e56b455b><div class="px-4 group cursor-default" data-v-e56b455b><div class="flex justify-center mb-4 transform transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1" data-v-e56b455b>`);
      _push(ssrRenderComponent(unref(PhMapPin), {
        size: 32,
        weight: "regular"
      }, null, _parent));
      _push(`</div><h3 class="text-xl font-bold mb-2" data-v-e56b455b>Visit Us</h3><p class="text-white/90 whitespace-pre-line" data-v-e56b455b>${ssrInterpolate(currentLocation.value.fullAddress)}</p></div><div class="px-4 pt-8 md:pt-0 group cursor-default" data-v-e56b455b><div class="flex justify-center mb-4 transform transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1" data-v-e56b455b>`);
      _push(ssrRenderComponent(unref(PhClock), {
        size: 32,
        weight: "regular"
      }, null, _parent));
      _push(`</div><h3 class="text-xl font-bold mb-2" data-v-e56b455b>Operating Hours</h3><p class="text-white/90 whitespace-pre-line text-sm" data-v-e56b455b>${ssrInterpolate(currentLocation.value.hours)}</p></div><div class="px-4 pt-8 md:pt-0 group cursor-default" data-v-e56b455b><div class="flex justify-center mb-4 transform transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1" data-v-e56b455b>`);
      _push(ssrRenderComponent(unref(PhEnvelopeSimple), {
        size: 32,
        weight: "regular"
      }, null, _parent));
      _push(`</div><h3 class="text-xl font-bold mb-2" data-v-e56b455b>Get in Touch</h3><p class="text-white/90 mb-1" data-v-e56b455b>${ssrInterpolate(currentLocation.value.email)}</p><p class="text-white/90 mb-1" data-v-e56b455b>${ssrInterpolate(currentLocation.value.phone)}</p><p class="text-white/80 text-sm" data-v-e56b455b>WhatsApp available</p></div></div></div></section></template><section class="py-16 md:py-24" data-v-e56b455b><div class="container max-w-7xl mx-auto px-4 md:px-6" data-v-e56b455b><div class="mb-12" data-v-e56b455b><h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4" data-v-e56b455b> Virtual Office Packages </h2><p class="text-gray-500 text-lg max-w-2xl" data-v-e56b455b> Establish a professional business presence without the overhead of a physical office. </p></div><div class="grid gap-8" data-v-e56b455b><!--[-->`);
      ssrRenderList(virtualPackages, (pkg) => {
        _push(ssrRenderComponent(PricingCard, mergeProps({
          key: pkg.name
        }, { ref_for: true }, pkg), null, _parent));
      });
      _push(`<!--]--></div></div></section><section class="py-16 md:py-24 bg-white border-t border-gray-100" data-v-e56b455b><div class="container max-w-7xl mx-auto px-4 md:px-6" data-v-e56b455b><div class="mb-12" data-v-e56b455b><h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4" data-v-e56b455b> Space Rental Packages </h2><p class="text-gray-500 text-lg max-w-2xl" data-v-e56b455b> Flexible workspaces and meeting rooms designed for productivity and collaboration. </p></div><div class="grid gap-8" data-v-e56b455b><!--[-->`);
      ssrRenderList(spaceRentalPackages, (pkg) => {
        _push(ssrRenderComponent(PricingCard, mergeProps({
          key: pkg.name
        }, { ref_for: true }, pkg), null, _parent));
      });
      _push(`<!--]--></div></div></section>`);
      _push(ssrRenderComponent(_component_AdditionalServices, null, null, _parent));
      _push(ssrRenderComponent(_component_MembershipBenefits, null, null, _parent));
      _push(`<section class="h-[400px] w-full bg-gray-200 mt-16 md:mt-24" data-v-e56b455b><iframe${ssrRenderAttr("src", currentLocation.value.mapUrl)} width="100%" height="100%" style="${ssrRenderStyle({ "border": "0" })}" allowfullscreen="true" loading="lazy" referrerpolicy="no-referrer-when-downgrade" data-v-e56b455b></iframe></section>`);
      _push(ssrRenderComponent(CTASection, null, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/locations/[slug].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _slug_ = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-e56b455b"]]);

export { _slug_ as default };
//# sourceMappingURL=_slug_-DEY-N6yt.mjs.map
