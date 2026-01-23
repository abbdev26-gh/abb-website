import { I as ImageComponent } from './NuxtImg-DKyZQHcs.mjs';
import { defineComponent, withAsyncContext, computed, ref, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderStyle, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import { PhArrowLeft, PhArrowRight, PhQuotes } from '@phosphor-icons/vue';
import { u as useAsyncData } from './asyncData-wAjEz6As.mjs';
import { q as queryCollection } from './client-DqbjtPWP.mjs';
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
import './server.mjs';
import 'vue-router';
import 'qs';
import 'tailwindcss/colors';
import '@iconify/vue';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';
import 'perfect-debounce';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "TestimonialSection",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const { data: testimonialsData } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      "testimonials",
      () => queryCollection("testimonials").all(),
      { lazy: true }
    )), __temp = await __temp, __restore(), __temp);
    const testimonials = computed(() => {
      const list = testimonialsData.value || [];
      return list.map((t) => ({
        id: t.id,
        name: t.name,
        role: t.role,
        quote: t.quote,
        image: t.image?.url || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=800"
      }));
    });
    const currentIndex = ref(0);
    const itemsPerView = ref(1);
    ref(0);
    ref(0);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtImg = ImageComponent;
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "py-20 md:py-32 bg-white hidden overflow-hidden" }, _attrs))}><div class="container mx-auto px-4 md:px-6"><div class="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 animate-on-scroll"><div class="max-w-2xl"><h2 class="text-3xl md:text-4xl lg:text-5xl font-bold font-display text-gray-900 mb-6 leading-tight"> What <span class="text-[#E60000]">Our Customers</span> Say <br class="hidden md:block"> About Co-Work Space </h2><p class="text-gray-600 text-lg"> We can provide you with some examples of feedback that customers often express about our co-work space. </p></div><div class="flex gap-4"><button class="w-12 h-12 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors" aria-label="Previous testimonial">`);
      _push(ssrRenderComponent(unref(PhArrowLeft), { class: "w-6 h-6" }, null, _parent));
      _push(`</button><button class="w-12 h-12 flex items-center justify-center rounded-full bg-[#E60000] text-white hover:bg-[#cc0000] transition-colors shadow-lg shadow-red-200" aria-label="Next testimonial">`);
      _push(ssrRenderComponent(unref(PhArrowRight), { class: "w-6 h-6" }, null, _parent));
      _push(`</button></div></div><div class="overflow-hidden animate-on-scroll delay-200"><div class="flex transition-transform duration-500 ease-in-out" style="${ssrRenderStyle({ transform: `translateX(-${currentIndex.value * (100 / itemsPerView.value)}%)` })}"><!--[-->`);
      ssrRenderList(testimonials.value, (testimonial) => {
        _push(`<div class="w-full md:w-1/2 flex-shrink-0 px-4"><div class="group h-full"><div class="relative flex flex-col sm:flex-row items-stretch h-full"><div class="w-full sm:w-1/2 h-64 sm:h-auto rounded-xl overflow-hidden relative z-0"><div class="absolute inset-0 bg-gray-200">`);
        _push(ssrRenderComponent(_component_NuxtImg, {
          src: testimonial.image,
          alt: testimonial.name,
          class: "w-full h-full object-cover",
          format: "webp",
          loading: "lazy"
        }, null, _parent));
        _push(`</div></div><div class="w-full sm:w-2/3 sm:-ml-12 relative z-10 flex items-center mt-[-2rem] sm:mt-8 sm:mb-8 pr-4"><div class="bg-white p-6 md:p-8 rounded-2xl w-full h-full flex flex-col justify-center">`);
        _push(ssrRenderComponent(unref(PhQuotes), {
          weight: "fill",
          class: "text-[#E60000] w-10 h-10 mb-4"
        }, null, _parent));
        _push(`<p class="text-gray-600 mb-6 leading-relaxed">${ssrInterpolate(testimonial.quote)}</p><div><h4 class="text-lg font-bold text-gray-900">${ssrInterpolate(testimonial.name)}</h4><p class="text-sm text-gray-500">${ssrInterpolate(testimonial.role)}</p></div></div></div></div></div></div>`);
      });
      _push(`<!--]--></div></div></div></section>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/TestimonialSection.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const TestimonialSection = Object.assign(_sfc_main, { __name: "TestimonialSection" });

export { TestimonialSection as default };
//# sourceMappingURL=TestimonialSection-CH78RF-v.mjs.map
