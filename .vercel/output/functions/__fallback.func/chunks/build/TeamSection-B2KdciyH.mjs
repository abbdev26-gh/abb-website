import { I as ImageComponent } from './NuxtImg-DKyZQHcs.mjs';
import { defineComponent, withAsyncContext, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderComponent, ssrInterpolate, ssrRenderAttr } from 'vue/server-renderer';
import { PhLinkedinLogo, PhXLogo, PhEnvelopeSimple } from '@phosphor-icons/vue';
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
  __name: "TeamSection",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const { data: teamRes } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      "team-section",
      () => queryCollection("team").all(),
      { lazy: true }
    )), __temp = await __temp, __restore(), __temp);
    const team = computed(() => {
      const members = teamRes.value || [];
      return members.map((m) => ({
        name: m.name,
        role: m.role,
        image: m.image?.url || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=800",
        linkedin: m.linkedin,
        twitter: m.twitter,
        email: m.email
      }));
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtImg = ImageComponent;
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "py-20 md:py-32 mt-20 bg-black" }, _attrs))}><div class="container mx-auto px-4 md:px-6"><div class="mb-16 max-w-3xl animate-on-scroll"><h2 class="text-3xl md:text-4xl lg:text-5xl font-bold font-display text-white mb-6 leading-tight"> Meet our<span class="text-[#E60000]"> passionate team</span></h2><p class="text-lg text-white animate-on-scroll delay-100"> ABB has a dynamic team of young business professionals with vast experience in advisory, startup financing, business innovation, and creativity. </p></div><div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-on-scroll delay-100"><!--[-->`);
      ssrRenderList(unref(team), (member) => {
        _push(`<div class="group relative aspect-[3/4] overflow-hidden rounded-3xl bg-gray-100">`);
        _push(ssrRenderComponent(_component_NuxtImg, {
          src: member.image,
          alt: member.name,
          class: "h-full w-full object-cover transition-transform duration-700 group-hover:scale-105",
          format: "webp",
          loading: "lazy"
        }, null, _parent));
        _push(`<div class="absolute bottom-4 left-4 right-4 bg-white rounded-xl p-4 shadow-lg transition-all duration-300 group-hover:-translate-y-1"><h3 class="font-bold text-gray-900 text-lg">${ssrInterpolate(member.name)}</h3><p class="text-sm text-gray-500 group-hover:text-[#E60000] transition-colors">${ssrInterpolate(member.role)}</p><div class="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-all duration-300 ease-in-out"><div class="overflow-hidden"><div class="flex gap-4 pt-4 border-t border-gray-100 mt-3">`);
        if (member.linkedin) {
          _push(`<a${ssrRenderAttr("href", member.linkedin)} target="_blank" class="text-gray-400 hover:text-[#0077b5] transition-colors">`);
          _push(ssrRenderComponent(unref(PhLinkedinLogo), {
            weight: "fill",
            class: "w-5 h-5"
          }, null, _parent));
          _push(`</a>`);
        } else {
          _push(`<!---->`);
        }
        if (member.twitter) {
          _push(`<a${ssrRenderAttr("href", member.twitter)} target="_blank" class="text-gray-400 hover:text-black transition-colors">`);
          _push(ssrRenderComponent(unref(PhXLogo), {
            weight: "bold",
            class: "w-5 h-5"
          }, null, _parent));
          _push(`</a>`);
        } else {
          _push(`<!---->`);
        }
        if (member.email) {
          _push(`<a${ssrRenderAttr("href", `mailto:${member.email}`)} class="text-gray-400 hover:text-[#E60000] transition-colors">`);
          _push(ssrRenderComponent(unref(PhEnvelopeSimple), {
            weight: "bold",
            class: "w-5 h-5"
          }, null, _parent));
          _push(`</a>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div></div></div></div>`);
      });
      _push(`<!--]--></div></div></section>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/TeamSection.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_1 = Object.assign(_sfc_main, { __name: "TeamSection" });

export { __nuxt_component_1 as default };
//# sourceMappingURL=TeamSection-B2KdciyH.mjs.map
