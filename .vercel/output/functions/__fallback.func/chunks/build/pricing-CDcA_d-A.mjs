import { _ as __nuxt_component_0 } from './nuxt-link-DU2Yg8bd.mjs';
import { defineComponent, mergeProps, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderComponent } from 'vue/server-renderer';
import { P as PricingCard } from './PricingCard-Bvvrr42n.mjs';
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
import '@phosphor-icons/vue';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "pricing",
  __ssrInlineRender: true,
  setup(__props) {
    const plans = [
      {
        name: "Day Pass",
        price: "$29",
        period: "day",
        description: "Perfect for the occasional drop-in.",
        features: [
          "Access from 9am - 6pm",
          "High-speed internet",
          "Coffee & Tea",
          "Open desk seating"
        ]
      },
      {
        name: "Dedicated Desk",
        price: "$349",
        period: "month",
        description: "Your own personal desk in a shared space.",
        features: [
          "24/7 Access",
          "Personal locker",
          "5h Meeting room credits",
          "Mailing address",
          "All Day Pass perks"
        ],
        popular: true
      },
      {
        name: "Private Office",
        price: "$899",
        period: "month",
        description: "A fully furnished private office for your team.",
        features: [
          "24/7 Access",
          "Lockable office",
          "10h Meeting room credits",
          "Logo on door",
          "Guest reception",
          "All Dedicated Desk perks"
        ]
      }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "py-20 md:py-32" }, _attrs))}><div class="container mx-auto px-4 md:px-6"><div class="mb-16 text-center"><h1 class="mb-4 font-display text-4xl font-bold tracking-tight sm:text-5xl">Membership Plans</h1><p class="mx-auto max-w-2xl text-lg text-muted-foreground"> Flexible options to suit your working style. No hidden fees. </p></div><div class="grid gap-8 max-w-5xl mx-auto"><!--[-->`);
      ssrRenderList(plans, (plan) => {
        _push(ssrRenderComponent(PricingCard, mergeProps({
          key: plan.name
        }, { ref_for: true }, plan), null, _parent));
      });
      _push(`<!--]--></div><div class="mt-20 text-center"><h2 class="mb-4 font-display text-2xl font-bold">Need a custom solution for your team?</h2><p class="mb-8 text-muted-foreground">We offer enterprise solutions for teams of 20+.</p>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/contact",
        class: "text-primary font-medium hover:underline"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Contact our sales team →`);
          } else {
            return [
              createTextVNode("Contact our sales team →")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/pricing.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=pricing-CDcA_d-A.mjs.map
