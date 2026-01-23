import { I as ImageComponent } from './NuxtImg-DKyZQHcs.mjs';
import { _ as __nuxt_component_0 } from './nuxt-link-DU2Yg8bd.mjs';
import { defineComponent, withAsyncContext, computed, unref, mergeProps, withCtx, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { PhCheckSquare } from '@phosphor-icons/vue';
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
  __name: "MembershipBenefits",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const { data: benefitsData } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      "benefit-section",
      () => queryCollection("membership").first(),
      { lazy: true }
    )), __temp = await __temp, __restore(), __temp);
    console.log("benefitsData", benefitsData.value);
    const title = computed(() => benefitsData.value?.title || "");
    const description = computed(() => benefitsData.value?.description || "");
    const benefits = computed(() => benefitsData.value?.listItems || []);
    const cta = computed(() => benefitsData.value?.cta);
    const image = computed(() => {
      const img = benefitsData.value?.sectionImage?.[0] || benefitsData.value?.sectionImage;
      return img?.url || "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=1000";
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtImg = ImageComponent;
      const _component_NuxtLink = __nuxt_component_0;
      if (unref(benefitsData)) {
        _push(`<section${ssrRenderAttrs(mergeProps({ class: "pt-20 md:pt-32 bg-white overflow-hidden" }, _attrs))}><div class="container mx-auto px-4 md:px-6"><div class="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center"><div class="relative pl-4 pb-4 md:pl-10 md:pb-10 animate-on-scroll"><div class="absolute bottom-0 left-0 w-2/3 h-2/3 bg-[#E60000] -z-10 rounded-bl-[1rem]"></div><div class="relative z-10 rounded-lg overflow-hidden shadow-xl">`);
        _push(ssrRenderComponent(_component_NuxtImg, {
          src: unref(image),
          alt: "Coworking space interior",
          class: "w-full h-full object-cover min-h-[420px]",
          format: "webp",
          loading: "lazy"
        }, null, _parent));
        _push(`</div></div><div><h2 class="text-3xl md:text-4xl lg:text-5xl font-bold font-display text-gray-900 mb-6 leading-tight animate-on-scroll">${ssrInterpolate(unref(title))}</h2><p class="text-gray-600 mb-10 text-lg leading-relaxed animate-on-scroll delay-100">${ssrInterpolate(unref(description))}</p><div class="grid sm:grid-cols-2 gap-x-4 gap-y-8 mb-10 animate-on-scroll delay-200"><!--[-->`);
        ssrRenderList(unref(benefits), (benefit, index) => {
          _push(`<div class="flex gap-4">`);
          _push(ssrRenderComponent(unref(PhCheckSquare), {
            class: "w-6 h-6 text-[#E60000] flex-shrink-0 mt-1",
            weight: "bold"
          }, null, _parent));
          _push(`<div><h3 class="text-gray-900 font-bold text-lg mb-1">${ssrInterpolate(benefit.title)}</h3><p class="text-gray-600 text-sm leading-relaxed">${ssrInterpolate(benefit.description)}</p></div></div>`);
        });
        _push(`<!--]--></div>`);
        if (unref(cta)) {
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: unref(cta).url,
            class: "inline-flex items-center justify-center px-8 py-4 bg-[#E60000] text-white font-bold rounded-full hover:bg-[#cc0000] transition-colors shadow-lg shadow-red-200 animate-on-scroll delay-300"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(unref(cta).ctaText)}`);
              } else {
                return [
                  createTextVNode(toDisplayString(unref(cta).ctaText), 1)
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div></div></section>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/MembershipBenefits.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_1 = Object.assign(_sfc_main, { __name: "MembershipBenefits" });

export { __nuxt_component_1 as default };
//# sourceMappingURL=MembershipBenefits-Dc5B54c-.mjs.map
