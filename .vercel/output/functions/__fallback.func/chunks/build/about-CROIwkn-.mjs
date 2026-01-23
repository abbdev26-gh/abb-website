import { defineComponent, mergeProps, withAsyncContext, computed, unref, ref, createVNode, resolveDynamicComponent, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrInterpolate, ssrRenderList, ssrRenderStyle, ssrRenderClass, ssrRenderVNode } from 'vue/server-renderer';
import { u as useAsyncData } from './asyncData-wAjEz6As.mjs';
import { q as queryCollection } from './client-DqbjtPWP.mjs';
import __nuxt_component_1 from './TeamSection-B2KdciyH.mjs';
import { a as useSeoMeta, u as useRuntimeConfig } from './server.mjs';
import { u as useHighlightText } from './useHighlightText-BbVqnJqf.mjs';
import { PhEye, PhUsersThree, PhBuildings, PhLightbulb, PhTarget } from '@phosphor-icons/vue';
import PartnersSection from './PartnersSection-CcwuDcSw.mjs';
import TestimonialSection from './TestimonialSection-CH78RF-v.mjs';
import CTASection from './CTASection-BJAsNOtr.mjs';
import 'perfect-debounce';
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
import './NuxtImg-DKyZQHcs.mjs';
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
import './_plugin-vue_export-helper-1tPrXgE0.mjs';
import './nuxt-link-DU2Yg8bd.mjs';

const _sfc_main$5 = /* @__PURE__ */ defineComponent({
  __name: "AboutStory",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const { data: aboutContent } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      "about-story-content",
      () => queryCollection("about").first()
    )), __temp = await __temp, __restore(), __temp);
    const { data: homeAboutContent } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      "about-story-timeline",
      () => queryCollection("home_about").first()
    )), __temp = await __temp, __restore(), __temp);
    const storyData = computed(() => {
      return aboutContent.value || {};
    });
    const timelineEvents = computed(() => {
      return homeAboutContent.value?.storyTimeline || [];
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "py-20 bg-white overflow-hidden" }, _attrs))}><div class="container mx-auto px-4 md:px-6"><div class="grid lg:grid-cols-12 gap-12 lg:gap-20"><div class="lg:col-span-5"><div class="sticky top-24"><span class="text-[#E60000] font-bold tracking-wider text-sm uppercase mb-4 block">Our Story</span><h2 class="text-3xl md:text-4xl lg:text-5xl font-bold font-display text-gray-900 mb-8 leading-tight">${ssrInterpolate(unref(storyData).storyTitle || "We're Transforming the Future of Business")}</h2><div class="flex items-center gap-4 mb-8"></div><p class="text-gray-600 text-lg leading-relaxed">${ssrInterpolate(unref(storyData).storyDescription)}</p></div></div><div class="lg:col-span-7"><div class="space-y-16"><!--[-->`);
      ssrRenderList(unref(timelineEvents), (event, index) => {
        _push(`<div class="group"><div class="flex items-start gap-6"><div class="shrink-0 text-xl font-bold text-gray-300 group-hover:text-[#E60000] transition-colors duration-300">${ssrInterpolate(String(index + 1).padStart(2, "0"))}. </div><div><span class="block text-sm font-semibold text-[#E60000] mb-2">${ssrInterpolate(event.year)}</span><h3 class="text-2xl font-bold text-gray-900 mb-4">${ssrInterpolate(event.title)}</h3><div class="text-gray-600 leading-relaxed text-lg">${event.description ?? ""}</div></div></div></div>`);
      });
      _push(`<!--]--></div></div></div></div></section>`);
    };
  }
});
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AboutStory.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const __nuxt_component_0 = Object.assign(_sfc_main$5, { __name: "AboutStory" });
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "AboutHero",
  __ssrInlineRender: true,
  setup(__props) {
    const images = [
      "/images/about/img-1.jpg",
      "/images/about/img-2.jpg",
      "/images/about/img-3.jpg"
    ];
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "pb-20 pt-10 md:pb-32 bg-white overflow-hidden" }, _attrs))}><div class="container mx-auto px-4 md:px-6"><div class="max-w-4xl mx-auto text-center mb-16 md:mb-24"><div class="inline-flex items-center uppercase text-[#E60000] rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-sm font-medium mb-6"><span class="flex h-2 w-2 rounded-full uppercase bg-[#E60000] mr-2"></span> About Us </div><h1 class="font-display text-4xl md:text-6xl font-bold text-gray-900 leading-tight tracking-tight"> Driving <span class="text-[#E60000]">Entrepreneurship</span>. Fostering <span class="text-[#E60000]">Digital Transformation</span>. Creating <span class="text-[#E60000]">Jobs</span></h1></div><div class="relative max-w-6xl mx-auto"><div class="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-center"><div class="md:col-span-4 relative group"><div class="aspect-[3/4] overflow-hidden rounded-3xl bg-gray-100"><img${ssrRenderAttr("src", images[0])} alt="Office collaboration" class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"></div><div class="absolute -top-6 -left-6 bg-white p-4 rounded-full shadow-xl hidden md:block"><div class="bg-gray-50 rounded-full p-3"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-[#E60000]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0z"></path></svg></div></div></div><div class="md:col-span-4 md:-mt-16 relative group z-10"><div class="aspect-[3/4] overflow-hidden rounded-3xl bg-gray-100 shadow-2xl"><img${ssrRenderAttr("src", images[1])} alt="Modern workspace" class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"></div><div class="absolute -top-8 left-1/2 -translate-x-1/2 bg-white p-4 rounded-full shadow-xl hidden md:block"><div class="bg-[#E60000] rounded-full p-3"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg></div></div></div><div class="md:col-span-4 relative group"><div class="aspect-[3/4] overflow-hidden rounded-3xl bg-gray-100"><img${ssrRenderAttr("src", images[2])} alt="Team meeting" class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"></div><div class="absolute -bottom-6 -right-6 bg-white p-4 rounded-full shadow-xl hidden md:block"><div class="bg-gray-50 rounded-full p-3"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-[#E60000]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg></div></div></div></div></div></div></section>`);
    };
  }
});
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AboutHero.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const AboutHero = Object.assign(_sfc_main$4, { __name: "AboutHero" });
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "AboutStoryScroll",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const containerRef = ref(null);
    const progress = ref(0);
    const config = useRuntimeConfig();
    const { transform } = useHighlightText();
    const { data: aboutPage } = ([__temp, __restore] = withAsyncContext(() => useAsyncData("about-page-scroll", () => {
      return $fetch("/api/about-page", {
        baseURL: config.public.strapiUrl,
        headers: {
          Authorization: `Bearer ${config.public.strapiToken}`
        },
        params: {
          "populate[scrollSectionImage]": "true"
        }
      });
    })), __temp = await __temp, __restore(), __temp);
    const topText = computed(() => aboutPage.value?.data?.scrollSectionTopText || "If you want to go fast, go alone.");
    const bottomText = computed(() => aboutPage.value?.data?.scrollSectionBottomText || "If you want to go far, go together.");
    const attribution = computed(() => aboutPage.value?.data?.scrollSectionAttribution || "– African Proverb");
    const bgImage = computed(() => {
      const url = aboutPage.value?.data?.scrollSectionImage?.url;
      if (!url) return "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=2000";
      return `${config.public.strapiUrl}${url}`;
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({
        ref_key: "containerRef",
        ref: containerRef,
        class: "relative h-[300vh] bg-white"
      }, _attrs))}><div class="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center"><div class="absolute inset-0 w-full h-full"><img${ssrRenderAttr("src", bgImage.value)} alt="Inspirational Background" class="w-full h-full object-cover"><div class="absolute inset-0 bg-black/30"></div></div><div class="relative z-10 flex flex-col items-center justify-center w-full h-full"><div class="absolute top-0 left-0 right-0 h-[50vh] bg-white flex items-end justify-center pb-2 transition-transform duration-100 ease-linear will-change-transform origin-top" style="${ssrRenderStyle({ transform: `translateY(-${progress.value * 100}%)` })}"><h2 class="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 text-center px-4 max-w-5xl leading-tight">${unref(transform)(topText.value) ?? ""}</h2></div><div class="absolute bottom-0 left-0 right-0 h-[50vh] bg-white flex items-start justify-center pt-2 transition-transform duration-100 ease-linear will-change-transform origin-bottom" style="${ssrRenderStyle({ transform: `translateY(${progress.value * 100}%)` })}"><div class="flex flex-col items-center"><h2 class="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 text-center px-4 max-w-5xl leading-tight">${unref(transform)(bottomText.value) ?? ""}</h2>`);
      if (attribution.value) {
        _push(`<p class="mt-6 text-xl md:text-2xl font-medium text-gray-500 italic font-display">${unref(transform)(attribution.value) ?? ""}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div></div></section>`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AboutStoryScroll.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const AboutStoryScroll = Object.assign(_sfc_main$3, { __name: "AboutStoryScroll" });
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "AboutStats",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const config = useRuntimeConfig();
    const { data: aboutPage } = ([__temp, __restore] = withAsyncContext(() => useAsyncData("about-page-stats", () => {
      return $fetch("/api/about-page", {
        baseURL: config.public.strapiUrl,
        headers: {
          Authorization: `Bearer ${config.public.strapiToken}`
        },
        params: {
          "populate[stats]": "true"
        }
      });
    })), __temp = await __temp, __restore(), __temp);
    const stats = computed(() => aboutPage.value?.data?.stats || []);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "py-16 bg-gray-50" }, _attrs))}><div class="container mx-auto px-4 md:px-6"><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"><!--[-->`);
      ssrRenderList(unref(stats), (stat) => {
        _push(`<div class="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow"><div class="flex items-center gap-2 mb-2"><div class="h-2 w-2 rounded-full bg-[#E60000]"></div><span class="text-sm font-medium text-gray-500 uppercase tracking-wider">${ssrInterpolate(stat.label)}</span></div><h3 class="text-4xl md:text-5xl font-bold text-gray-900 mb-3">${ssrInterpolate(stat.value)}</h3><p class="text-gray-500 text-sm leading-relaxed">${ssrInterpolate(stat.description)}</p></div>`);
      });
      _push(`<!--]--></div></div></section>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AboutStats.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const AboutStats = Object.assign(_sfc_main$2, { __name: "AboutStats" });
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "AboutValues",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const { data: aboutPage } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      "about-page-values",
      () => queryCollection("about").first()
    )), __temp = await __temp, __restore(), __temp);
    const sectionTitle = computed(() => aboutPage.value?.valuesSectionTitle || "Mission and Vision");
    const sectionDescription = computed(() => aboutPage.value?.valuesSectionDescription || "Built on a foundation of trust and innovation.");
    const iconMap = {
      "Mission": PhTarget,
      "Vision": PhLightbulb,
      "Vision 2035": PhLightbulb,
      "Industry Expertise": PhBuildings,
      "Collaboration": PhUsersThree,
      "Transparency": PhEye
    };
    const colorMap = {
      "Mission": "bg-blue-100 text-blue-600",
      "Vision": "bg-green-100 text-green-600",
      "Vision 2035": "bg-green-100 text-green-600",
      "Industry Expertise": "bg-purple-100 text-purple-600"
    };
    const values = computed(() => {
      const list = aboutPage.value?.values || [];
      return list.map((item, index) => ({
        ...item,
        icon: iconMap[item.title] || PhBuildings,
        // Fallback icon
        color: colorMap[item.title] || (index % 2 === 0 ? "bg-red-100 text-red-600" : "bg-orange-100 text-orange-600")
      }));
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "py-20 md:py-32 bg-black" }, _attrs))}><div class="container mx-auto px-4 md:px-6"><div class="text-center mb-16"><h2 class="text-3xl md:text-4xl lg:text-5xl font-bold font-display text-white mb-6 leading-tight">${ssrInterpolate(unref(sectionTitle))}</h2><p class="mt-4 text-gray-200 max-w-2xl mx-auto">${ssrInterpolate(unref(sectionDescription))}</p></div><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-5xl mx-auto"><!--[-->`);
      ssrRenderList(unref(values), (value) => {
        _push(`<div class="p-8 rounded-3xl bg-white/10 hover:bg-white/5 hover:shadow-xl transition-all duration-300 border border-transparent hover:border-gray-100 group"><div class="${ssrRenderClass(`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-[#E60000]/10 text-[#E60000] group-hover:scale-110 transition-transform duration-300`)}">`);
        ssrRenderVNode(_push, createVNode(resolveDynamicComponent(value.icon), {
          weight: "fill",
          class: "w-7 h-7"
        }, null), _parent);
        _push(`</div><h3 class="text-xl font-bold text-white mb-3">${ssrInterpolate(value.title)}</h3><p class="text-white leading-relaxed">${ssrInterpolate(value.description)}</p></div>`);
      });
      _push(`<!--]--></div></div></section>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AboutValues.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const AboutValues = Object.assign(_sfc_main$1, { __name: "AboutValues" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "about",
  __ssrInlineRender: true,
  setup(__props) {
    useSeoMeta({
      title: "About Us - Africa Business Bureau",
      description: "Learn about our mission to redefine workspaces in Africa. We provide premium coworking spaces, virtual offices, and a community for innovation."
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_AboutStory = __nuxt_component_0;
      const _component_TeamSection = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(AboutHero, null, null, _parent));
      _push(ssrRenderComponent(_component_AboutStory, null, null, _parent));
      _push(ssrRenderComponent(AboutStats, null, null, _parent));
      _push(ssrRenderComponent(PartnersSection, null, null, _parent));
      _push(ssrRenderComponent(_component_TeamSection, null, null, _parent));
      _push(ssrRenderComponent(AboutStoryScroll, null, null, _parent));
      _push(ssrRenderComponent(AboutValues, null, null, _parent));
      _push(ssrRenderComponent(TestimonialSection, null, null, _parent));
      _push(ssrRenderComponent(CTASection, null, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/about.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=about-CROIwkn-.mjs.map
