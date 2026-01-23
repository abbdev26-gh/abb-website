import { I as ImageComponent } from './NuxtImg-DKyZQHcs.mjs';
import { defineComponent, withAsyncContext, computed, ref, watch, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { u as useAsyncData } from './asyncData-wAjEz6As.mjs';
import { q as queryCollection } from './client-DqbjtPWP.mjs';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';
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
  __name: "PartnersSection",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const { data: partnersData } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      "home-page-partners",
      () => queryCollection("partners").all(),
      { lazy: true }
    )), __temp = await __temp, __restore(), __temp);
    const allPartners = computed(() => {
      const partners = partnersData.value || [];
      return partners.map((p) => ({
        id: p.id,
        name: p.name,
        icon: null,
        logoUrl: p.logo?.url || null
        // URLs already processed
      }));
    });
    const visiblePartners = ref([]);
    watch(allPartners, (newPartners) => {
      if (newPartners && newPartners.length > 0) {
        visiblePartners.value = [...newPartners.slice(0, 5)];
      }
    }, { immediate: true });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtImg = ImageComponent;
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "pt-20 md:pt-32 border-y border-gray-100 bg-white overflow-hidden" }, _attrs))} data-v-27cae0ee><div class="container mx-auto px-4 md:px-6" data-v-27cae0ee><div class="text-center mb-8 animate-on-scroll" data-v-27cae0ee><h2 class="text-3xl md:text-4xl lg:text-5xl font-bold font-display text-gray-900 mb-6 leading-tight" data-v-27cae0ee> Trusted by <span class="text-[#E60000]" data-v-27cae0ee>innovative teams</span> at </h2></div><div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 items-center justify-items-center w-full animate-on-scroll delay-100" data-v-27cae0ee><!--[-->`);
      ssrRenderList(visiblePartners.value, (partner, index) => {
        _push(`<div class="w-full h-20 flex items-center justify-center relative" data-v-27cae0ee><div class="absolute inset-0 flex items-center justify-center transition-all duration-300 cursor-pointer" data-v-27cae0ee><div class="flex items-center gap-2" data-v-27cae0ee>`);
        if (partner.logoUrl) {
          _push(ssrRenderComponent(_component_NuxtImg, {
            src: partner.logoUrl,
            alt: partner.name,
            class: "h-14 md:h-20 object-contain transition-all",
            format: "webp",
            loading: "lazy"
          }, null, _parent));
        } else {
          _push(`<span class="text-lg md:text-xl font-bold text-gray-800" data-v-27cae0ee>${ssrInterpolate(partner.name)}</span>`);
        }
        _push(`</div></div></div>`);
      });
      _push(`<!--]--></div></div></section>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/PartnersSection.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const PartnersSection = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main, [["__scopeId", "data-v-27cae0ee"]]), { __name: "PartnersSection" });

export { PartnersSection as default };
//# sourceMappingURL=PartnersSection-CcwuDcSw.mjs.map
