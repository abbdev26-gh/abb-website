import { defineComponent, mergeProps, createVNode, resolveDynamicComponent, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderClass, ssrRenderVNode, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';
import { PhFileText, PhPaintBrush, PhHeadset, PhScales, PhTrendUp, PhCalculator, PhVideo, PhDownload } from '@phosphor-icons/vue';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "AdditionalServices",
  __ssrInlineRender: true,
  setup(__props) {
    const additionalServices = [
      {
        id: 1,
        icon: "business-registration",
        iconComponent: PhFileText,
        title: "Business Registration",
        description: "Complete business registration and legal setup support"
      },
      {
        id: 2,
        icon: "branding-design",
        iconComponent: PhPaintBrush,
        title: "Branding & Design",
        description: "Professional branding, logo design, and marketing materials"
      },
      {
        id: 3,
        icon: "virtual-administration",
        iconComponent: PhHeadset,
        title: "Virtual Administration",
        description: "Remote administrative support and virtual assistant services"
      },
      {
        id: 4,
        icon: "legal-compliance",
        iconComponent: PhScales,
        title: "Legal & Compliance",
        description: "Legal advisory services and regulatory compliance support"
      },
      {
        id: 5,
        icon: "marketing-growth",
        iconComponent: PhTrendUp,
        title: "Marketing & Growth",
        description: "Business development, marketing strategies, and growth consulting"
      },
      {
        id: 6,
        icon: "accounting-tax",
        iconComponent: PhCalculator,
        title: "Accounting & Tax",
        description: "Comprehensive accounting, bookkeeping, and taxation services"
      },
      {
        id: 7,
        icon: "creative-media",
        iconComponent: PhVideo,
        title: "Creative & Media",
        description: "Creative content production and media services"
      }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "bg-black py-20" }, _attrs))}><div class="container mx-auto px-4 md:px-6"><div class="mb-16 max-w-3xl mx-auto text-center animate-on-scroll"><h2 class="mb-4 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl"> Extra Services you need <br> to <span class="text-red-500">grow your business</span></h2><p class="text-xl text-gray-400 leading-relaxed"> Comprehensive support services designed to help you focus on what matters most - building your business. </p></div><div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3"><!--[-->`);
      ssrRenderList(additionalServices, (service, index) => {
        _push(`<div class="${ssrRenderClass([`delay-${index % 3 * 100}`, "group relative overflow-hidden rounded-2xl bg-white/10 p-8 transition-all hover:bg-white/5 cursor-pointer animate-on-scroll"])}"><div class="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-red-600/10 text-red-500 group-hover:bg-red-600 group-hover:text-white transition-colors">`);
        ssrRenderVNode(_push, createVNode(resolveDynamicComponent(service.iconComponent), {
          class: "h-6 w-6 group-hover:scale-110 transition-all group-hover:-rotate-12",
          weight: "duotone"
        }, null), _parent);
        _push(`</div><h3 class="mb-3 text-xl font-bold text-white">${ssrInterpolate(service.title)}</h3><p class="text-gray-400 leading-relaxed">${ssrInterpolate(service.description)}</p></div>`);
      });
      _push(`<!--]--></div><div class="flex justify-center animate-on-scroll delay-300"><a class="inline-flex justify-center items-center mx-auto mt-10 gap-x-3 text-center bg-linear-to-tl from-red-500 to-red-600 hover:from-red-600 hover:to-red-500 focus:outline-hidden focus:from-red-600 focus:to-red-500 border border-transparent text-white text-base font-bold rounded-full py-3 px-4" href="https://drive.google.com/uc?export=download&amp;id=1eFKE1pOR3-Yb4aaUj7zfGCHp3gcuzQTH" target="_blank">`);
      _push(ssrRenderComponent(unref(PhDownload), { class: "shrink-0 size-8" }, null, _parent));
      _push(` Download Our Full brochure </a></div></div></section>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AdditionalServices.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_0 = Object.assign(_sfc_main, { __name: "AdditionalServices" });

export { __nuxt_component_0 as default };
//# sourceMappingURL=AdditionalServices-BGHZLjjQ.mjs.map
