import { _ as __nuxt_component_0 } from './nuxt-link-DU2Yg8bd.mjs';
import { defineComponent, withAsyncContext, mergeProps, unref, withCtx, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';
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
  __name: "CTASection",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const { data: ctaData } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      "cta",
      () => queryCollection("cta").first()
    )), __temp = await __temp, __restore(), __temp);
    console.log("cta data:", ctaData.value);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "relative py-24 lg:py-32 overflow-hidden" }, _attrs))}><div class="absolute inset-0 w-full h-full z-0"><img src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&amp;fit=crop&amp;q=80&amp;w=2000" alt="Office background" class="w-full h-full object-cover"><div class="absolute inset-0 bg-black/5"></div></div><div class="relative z-10 container mx-auto px-4 md:px-6"><div class="max-w-5xl mx-auto bg-[#E60000] p-8 md:p-12 lg:px-16 shadow-2xl rounded-none md:rounded-xl animate-on-scroll"><div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-8"><div class="max-w-2xl"><h2 class="text-3xl md:text-4xl font-bold text-white mb-3 leading-tight">${ssrInterpolate(unref(ctaData)?.heading || "cta heading")}</h2><p class="text-white/90 text-lg font-medium">${ssrInterpolate(unref(ctaData)?.description || "cta description")}</p></div><div class="shrink-0">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(ctaData)?.cta?.url || "#contact",
        class: "group inline-flex items-center justify-center gap-2 px-8 py-3 text-base font-bold text-red-600 bg-white border-2 rounded-full border-transparent hover:bg-gray-50 transition-all duration-300 shadow-lg"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(ctaData)?.cta?.ctaText || "cta cta text")}`);
          } else {
            return [
              createTextVNode(toDisplayString(unref(ctaData)?.cta?.ctaText || "cta cta text"), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div></div></section>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/CTASection.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const CTASection = Object.assign(_sfc_main, { __name: "CTASection" });

export { CTASection as default };
//# sourceMappingURL=CTASection-BJAsNOtr.mjs.map
