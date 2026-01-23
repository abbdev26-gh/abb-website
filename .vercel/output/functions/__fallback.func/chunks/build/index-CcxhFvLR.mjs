import { _ as __nuxt_component_0$1 } from './nuxt-link-DU2Yg8bd.mjs';
import { defineComponent, ref, mergeProps, unref, withCtx, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderComponent, ssrRenderAttr, ssrInterpolate } from 'vue/server-renderer';
import { PhArrowRight } from '@phosphor-icons/vue';
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

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "LocationListItem",
  __ssrInlineRender: true,
  props: {
    name: {},
    description: {},
    image: {},
    slug: {},
    features: {},
    stats: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "group relative overflow-hidden rounded-3xl bg-gray-50 transition-all" }, _attrs))}><div class="flex flex-col lg:flex-row"><div class="relative h-64 w-full lg:h-auto lg:w-2/5 overflow-hidden"><img${ssrRenderAttr("src", __props.image)}${ssrRenderAttr("alt", __props.name)} class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"></div><div class="flex flex-1 flex-col justify-between p-8 lg:p-10"><div><h3 class="font-display text-3xl font-bold text-gray-900 mb-4">${ssrInterpolate(__props.name)}</h3><p class="text-gray-500 leading-relaxed mb-6">${ssrInterpolate(__props.description)}</p><div class="flex flex-wrap gap-3 mb-8"><!--[-->`);
      ssrRenderList(__props.features, (feature) => {
        _push(`<span class="inline-flex items-center rounded-full bg-white px-4 py-2 text-sm font-medium text-gray-700 border border-gray-200"><div class="mr-2 h-1.5 w-1.5 rounded-full bg-[#E60000]"></div> ${ssrInterpolate(feature)}</span>`);
      });
      _push(`<!--]--></div></div><div class="md:grid grid-cols-3 gap-4 border-t border-gray-200 pt-8 mt-auto"><!--[-->`);
      ssrRenderList(__props.stats, (stat) => {
        _push(`<div><p class="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">${ssrInterpolate(stat.label)}</p><p class="text-lg font-semibold text-gray-900">${ssrInterpolate(stat.value)}</p></div>`);
      });
      _push(`<!--]--><div class="col-span-3 lg:col-span-1 lg:col-start-3 flex md:justify-end items-center">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: `/locations/${__props.slug}`,
        class: "inline-flex items-center justify-center mt-5 md:mt-0 w-full md:w-fit gap-2 rounded-full bg-[#E60000] font-bold p-3 text-white transition-transform group-hover:translate-x-1"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="md:max-w-0 whitespace-nowrap md:opacity-0 overflow-hidden group-hover:max-w-[100px] group-hover:opacity-100 transition-all duration-300 ease-in-out"${_scopeId}>View Details</span>`);
            _push2(ssrRenderComponent(unref(PhArrowRight), {
              weight: "bold",
              class: "h-5 w-5 transition-transform -translate-x-1 group-hover:translate-x-1"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode("span", { class: "md:max-w-0 whitespace-nowrap md:opacity-0 overflow-hidden group-hover:max-w-[100px] group-hover:opacity-100 transition-all duration-300 ease-in-out" }, "View Details"),
              createVNode(unref(PhArrowRight), {
                weight: "bold",
                class: "h-5 w-5 transition-transform -translate-x-1 group-hover:translate-x-1"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div></div></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/LocationListItem.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_0 = Object.assign(_sfc_main$1, { __name: "LocationListItem" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const locations = ref([
      {
        name: "Airport City Branch",
        description: "A premium corporate workspace located in the heart of Accra’s business district. Featuring state-of-the-art facilities, panoramic city views, and direct access to major transport links. Ideal for multinational corporations and established enterprises.",
        address: "2 Allotey road, East Legon, Accra, Ghana",
        image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000",
        slug: "airport-branch",
        features: ["Private Offices", "Executive Suites", "Conf. Center"],
        stats: [
          { label: "Capacity", value: "200+ Seats" },
          { label: "Meeting Rooms", value: "5 Rooms" },
          { label: "Availability", value: "Immediate" }
        ]
      },
      {
        name: "Tema Community 16 Branch",
        description: "A vibrant and flexible coworking environment designed for startups and freelancers. Offers open-plan desks, creative studios, and a collaborative community atmosphere. Located in the industrial hub with easy access to the port.",
        address: "Tema Community 16, Tema, Ghana",
        image: "https://images.unsplash.com/photo-1604328698692-f76ea9498e76?auto=format&fit=crop&q=80&w=1000",
        slug: "tema-branch",
        features: ["Coworking Desks", "Creative Studio", "Event Space"],
        stats: [
          { label: "Capacity", value: "150+ Seats" },
          { label: "Meeting Rooms", value: "3 Rooms" },
          { label: "Availability", value: "Limited" }
        ]
      }
    ]);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_LocationListItem = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "py-20 md:py-32" }, _attrs))}><div class="container mx-auto px-4 md:px-6"><div class="mb-16 text-center"><h1 class="mb-4 font-display text-4xl font-bold tracking-tight sm:text-5xl">Our Locations</h1><p class="mx-auto max-w-2xl text-lg text-muted-foreground"> Discover our network of premium coworking spaces designed to inspire. </p></div><section class="bg-white pt-20 md:pt-32"><div class="container mx-auto px-4 md:px-6"><div class="mb-16 max-w-2xl animate-on-scroll"><h2 class="mb-4 font-display text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl"> Our <span class="text-[#E60000]">Locations</span></h2><p class="text-xl text-gray-500 leading-relaxed"> Strategically located workspaces designed to enhance productivity and collaboration. Choose the location that suits your business needs. </p></div><div class="flex flex-col gap-12 delay-100"><!--[-->`);
      ssrRenderList(unref(locations), (location) => {
        _push(ssrRenderComponent(_component_LocationListItem, mergeProps({
          key: location.slug
        }, { ref_for: true }, location), null, _parent));
      });
      _push(`<!--]--></div></div></section></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/locations/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-CcxhFvLR.mjs.map
