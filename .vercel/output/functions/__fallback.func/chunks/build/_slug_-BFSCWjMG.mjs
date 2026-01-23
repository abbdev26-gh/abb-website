import { _ as __nuxt_component_0 } from './nuxt-link-DU2Yg8bd.mjs';
import { defineComponent, computed, withAsyncContext, mergeProps, unref, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderAttr, ssrRenderComponent, ssrRenderList } from 'vue/server-renderer';
import { useRoute } from 'vue-router';
import CTASection from './CTASection-BJAsNOtr.mjs';
import { PhArrowRight, PhCheckCircle } from '@phosphor-icons/vue';
import { u as useAsyncData } from './asyncData-wAjEz6As.mjs';
import { q as queryCollection } from './client-DqbjtPWP.mjs';
import { a as useSeoMeta } from './server.mjs';
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
import 'perfect-debounce';
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
  async setup(__props) {
    let __temp, __restore;
    const route = useRoute();
    const slug = computed(() => {
      const s = route.params.slug;
      return Array.isArray(s) ? s[0] : s;
    });
    const { data: serviceRes } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      `service-${slug.value}`,
      () => queryCollection("services").where("slug", "=", slug.value).first()
    )), __temp = await __temp, __restore(), __temp);
    const service = computed(() => {
      const s = serviceRes.value;
      if (!s) return null;
      const imageObj = Array.isArray(s.serviceImage) ? s.serviceImage[0] : s.serviceImage;
      const imageUrl = imageObj?.url || "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200";
      return {
        ...s,
        image: imageUrl,
        features: s.featuresList || [],
        content: s.longDescription ? `<p>${s.longDescription}</p>` : ""
      };
    });
    useSeoMeta({
      title: () => `${service.value?.title || "Service"} - Africa Business Bureau`,
      description: () => service.value?.description || "Service details"
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      if (service.value) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-white pt-10" }, _attrs))}><div class="container mx-auto px-4 md:px-6"><div class="mb-16"><div class="max-w-4xl mb-8"><h1 class="text-4xl md:text-6xl lg:text-7xl font-bold font-display text-gray-900 tracking-tight leading-[0.9]">${ssrInterpolate(service.value.name)}<span class="text-[#E60000]">.</span></h1></div><div class="w-full h-[20vh] md:h-[40vh] rounded-3xl overflow-hidden bg-gray-100"><img${ssrRenderAttr("src", service.value.image)}${ssrRenderAttr("alt", service.value.name)} class="w-full h-full object-cover object-top"></div></div><div class="grid md:grid-cols-12 gap-8 mb-0"><div class="md:col-span-4 lg:col-span-3"><div class="sticky top-32 space-y-8"><div><h3 class="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Category</h3><p class="text-lg font-medium text-gray-900">Service Offering</p></div>`);
        if (service.value.stat) {
          _push(`<div><h3 class="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Key Benefit</h3><p class="text-lg font-medium text-[#E60000]">${ssrInterpolate(service.value.stat)}</p></div>`);
        } else {
          _push(`<!---->`);
        }
        if (service.value?.externalLink) {
          _push(`<a id="service-link"${ssrRenderAttr("href", service.value?.externalLink || "/#")} target="_blank" class="inline-flex justify-center mt-5 md:mt-10 items-center gap-x-3 text-center bg-linear-to-tl from-red-500 to-red-600 hover:from-red-600 hover:to-red-500 focus:outline-hidden focus:from-red-600 focus:to-red-500 border border-transparent text-white text-base font-bold rounded-full py-3 px-4 animate-on-scroll delay-300">${ssrInterpolate(service.value?.linkText || "Learn More")} `);
          _push(ssrRenderComponent(unref(PhArrowRight), { class: "shrink-0 size-6 text-white" }, null, _parent));
          _push(`</a>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div><div class="md:col-span-8 lg:col-span-8 lg:col-start-5">`);
        if (service.value.content) {
          _push(`<div class="prose prose-2xl md:prose-2xl prose-h3:!text-2xl [&amp;&gt;h3]:!text-3xl [&amp;&gt;h3]:mb-5 max-w-none prose-headings:font-display prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-600 prose-li:text-gray-600 prose-strong:text-gray-900 prose-strong:font-bold">${service.value.content ?? ""}</div>`);
        } else {
          _push(`<!---->`);
        }
        if (service.value.workspaceSolutions && service.value.workspaceSolutions.length > 0) {
          _push(`<div class="mt-12 grid gap-6"><h3 class="text-2xl font-bold font-display text-gray-900 mb-2">Available Options</h3><!--[-->`);
          ssrRenderList(service.value.workspaceSolutions, (item, idx) => {
            _push(`<div class="bg-gray-50 rounded-2xl p-8 border border-gray-100 hover:border-[#E60000]/30 transition-colors"><h4 class="text-xl font-bold text-gray-900 mb-2">${ssrInterpolate(item.category)}</h4><p class="text-gray-600 mb-4">${ssrInterpolate(item.description)}</p><div class="text-sm"><span class="font-bold text-gray-900 block mb-1">Ideal For:</span><span class="text-gray-500">${ssrInterpolate(item.useCase)}</span></div></div>`);
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<!---->`);
        }
        if (service.value.virtualOffices && service.value.virtualOffices.length > 0) {
          _push(`<div class="mt-12 grid gap-6 p-4 md:p-6 rounded-2xl bg-black md:grid-cols-2"><h3 class="text-2xl font-bold font-display text-white mb-2 col-span-full">Key Benefits</h3><!--[-->`);
          ssrRenderList(service.value.virtualOffices, (item, idx) => {
            _push(`<div class="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:scale-105 transition-transform"><h4 class="text-lg font-bold text-[#E60000] mb-2">${ssrInterpolate(item.feature)}</h4><p class="text-gray-600 text-sm">${ssrInterpolate(item.benefit)}</p></div>`);
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<!---->`);
        }
        if (service.value.masterclasses && service.value.masterclasses.length > 0) {
          _push(`<div class="mt-12 grid gap-6 p-4 md:p-6 bg-black rounded-2xl"><h3 class="text-2xl font-bold font-display text-white mb-2">Audience Focus</h3><!--[-->`);
          ssrRenderList(service.value.masterclasses, (item, idx) => {
            _push(`<div class="bg-gray-50 rounded-2xl p-8 border border-gray-100 flex flex-col md:flex-row gap-6 items-start"><div class="md:w-1/3"><h4 class="text-xl font-bold text-[#E60000]">${ssrInterpolate(item.audience)}</h4></div><div class="md:w-2/3 border-t md:border-t-0 md:border-l border-gray-200 pt-4 md:pt-0 md:pl-6"><span class="font-bold text-gray-900 block mb-1 text-sm uppercase tracking-wider">Focus Area</span><p class="text-gray-600">${ssrInterpolate(item.focus)}</p></div></div>`);
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<!---->`);
        }
        if (service.value.programComparisons && service.value.programComparisons.length > 0) {
          _push(`<div class="mt-16"><h3 class="text-2xl font-bold font-display text-gray-900 mb-8">Program Comparison</h3><div class="grid md:grid-cols-2 gap-8"><!--[-->`);
          ssrRenderList(service.value.programComparisons, (program, idx) => {
            _push(`<div class="bg-black rounded-2xl p-8 border border-gray-200 hover:border-[#E60000]/30 hover:shadow-lg transition-all duration-300 flex flex-col h-full"><div class="mb-6 pb-6 border-b border-white"><h4 class="text-2xl font-bold text-[#E60000]">${ssrInterpolate(program.programName)}</h4></div><div class="space-y-6 flex-grow"><div><span class="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Target Audience</span><p class="text-white font-medium whitespace-pre-line">${ssrInterpolate(program.targetAudience)}</p></div><div><span class="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Service Focus</span><p class="text-white">${ssrInterpolate(program.serviceFocus)}</p></div><div><span class="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Key Support Provided</span><div class="prose prose-sm text-white prose-p:text-white prose-ul:list-disc prose-ul:pl-4">${program.keySupportProvided ?? ""}</div></div></div></div>`);
          });
          _push(`<!--]--></div></div>`);
        } else {
          _push(`<!---->`);
        }
        if (service.value.virtualPresence && service.value.virtualPresence.length > 0) {
          _push(`<div class="mt-16"><!--[-->`);
          ssrRenderList(service.value.virtualPresence, (vp, idx) => {
            _push(`<div class="mb-16"><h3 class="text-2xl font-bold font-display text-gray-900 mb-4">${ssrInterpolate(vp.title)}</h3><p class="text-gray-600 mb-8 max-w-3xl">${ssrInterpolate(vp.description)}</p>`);
            if (vp.features && vp.features.length > 0) {
              _push(`<div class="mb-12 space-y-6"><!--[-->`);
              ssrRenderList(vp.features, (feature, fIdx) => {
                _push(`<div class="flex gap-4"><div class="mt-1.5 shrink-0 w-2 h-2 rounded-full bg-[#E60000]"></div><div><span class="font-bold text-gray-900">${ssrInterpolate(feature.title)}${ssrInterpolate(feature.title.endsWith(":") ? "" : ":")}</span><span class="text-gray-600 ml-1">${ssrInterpolate(feature.description)}</span></div></div>`);
              });
              _push(`<!--]--></div>`);
            } else {
              _push(`<!---->`);
            }
            if (vp.benefits && vp.benefits.length > 0) {
              _push(`<div><h4 class="text-xl font-bold font-display text-gray-900 mb-6">${ssrInterpolate(vp.benefitsTitle)}</h4><div class="space-y-6"><!--[-->`);
              ssrRenderList(vp.benefits, (benefit, bIdx) => {
                _push(`<div class="flex gap-4"><div class="mt-1.5 shrink-0 w-2 h-2 rounded-full bg-[#E60000]"></div><div><span class="font-bold text-gray-900">${ssrInterpolate(benefit.title)}${ssrInterpolate(benefit.title.endsWith(":") ? "" : ":")}</span><span class="text-gray-600 ml-1">${ssrInterpolate(benefit.description)}</span></div></div>`);
              });
              _push(`<!--]--></div></div>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div>`);
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<!---->`);
        }
        if (service.value.features && service.value.features.length > 0) {
          _push(`<div class="mt-16"><h3 class="text-2xl font-bold font-display text-gray-900 hidden mb-8">Key Highlights</h3><div class="grid md:grid-cols-2 gap-6"><!--[-->`);
          ssrRenderList(service.value.features, (feature, index) => {
            _push(`<div class="bg-[#111111] p-8 rounded-2xl text-white group hover:-translate-y-1 transition-transform duration-300"><div class="text-[#E60000] mb-4">`);
            _push(ssrRenderComponent(unref(PhCheckCircle), {
              size: 32,
              weight: "fill"
            }, null, _parent));
            _push(`</div><h4 class="text-xl font-bold mb-3">${ssrInterpolate(feature.title)}</h4><p class="text-gray-400 leading-relaxed text-sm">${ssrInterpolate(feature.description)}</p></div>`);
          });
          _push(`<!--]--></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div></div>`);
        _push(ssrRenderComponent(CTASection, { class: "mt-120 md:mt-32" }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen flex items-center justify-center pt-32" }, _attrs))}><div class="text-center"><h1 class="text-4xl font-bold text-gray-900 mb-4">Service Not Found</h1>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/",
          class: "text-[#E60000] hover:underline"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Go back home`);
            } else {
              return [
                createTextVNode("Go back home")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div>`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/services/[slug].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_slug_-BFSCWjMG.mjs.map
