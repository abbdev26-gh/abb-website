import { defineComponent, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderClass, ssrInterpolate, ssrRenderList, ssrRenderComponent } from 'vue/server-renderer';
import { PhCheck } from '@phosphor-icons/vue';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "PricingCard",
  __ssrInlineRender: true,
  props: {
    name: {},
    price: {},
    period: {},
    description: {},
    features: {},
    popular: { type: Boolean },
    extraPrices: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["relative overflow-hidden rounded-3xl border transition-all", [
          __props.popular ? "bg-gray-900 border-gray-800 text-white" : "bg-white border-gray-200 text-gray-900"
        ]]
      }, _attrs))}><div class="flex flex-col lg:flex-row"><div class="${ssrRenderClass([__props.popular ? "border-gray-800" : "border-gray-100", "flex-1 p-8 lg:p-10 lg:border-r"])}"><div class="mb-8"><h3 class="mb-4 font-display text-3xl font-bold">${ssrInterpolate(__props.name)}</h3><p class="${ssrRenderClass([__props.popular ? "text-gray-400" : "text-gray-600", "text-lg leading-relaxed"])}">${ssrInterpolate(__props.description)}</p></div><div><h4 class="${ssrRenderClass([__props.popular ? "text-red-500" : "text-[#E60000]", "mb-6 text-sm font-bold uppercase tracking-wider"])}"> What&#39;s included </h4><ul class="grid sm:grid-cols-2 gap-x-8 gap-y-4"><!--[-->`);
      ssrRenderList(__props.features, (feature) => {
        _push(`<li class="${ssrRenderClass([__props.popular ? "text-gray-300" : "text-gray-600", "flex items-start gap-3 text-sm"])}">`);
        _push(ssrRenderComponent(unref(PhCheck), {
          class: ["h-5 w-5 shrink-0", __props.popular ? "text-red-500" : "text-[#E60000]"],
          weight: "bold"
        }, null, _parent));
        _push(` ${ssrInterpolate(feature)}</li>`);
      });
      _push(`<!--]--></ul></div></div><div class="${ssrRenderClass([__props.popular ? "bg-white/10" : "bg-gray-50", "flex flex-col justify-center p-8 lg:p-10 lg:w-[350px] shrink-0 bg-opacity-50"])}"><div class="text-center"><p class="${ssrRenderClass([__props.popular ? "text-gray-400" : "text-gray-500", "mb-2 text-sm font-medium"])}"> Best value for you </p><div class="mb-8 flex flex-wrap items-baseline justify-center gap-1"><span class="text-5xl font-bold tracking-tight whitespace-nowrap">${ssrInterpolate(__props.price)}</span>`);
      if (__props.period) {
        _push(`<span class="${ssrRenderClass([__props.popular ? "text-gray-400" : "text-gray-500", "text-lg whitespace-nowrap"])}">/${ssrInterpolate(__props.period)}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (__props.extraPrices && __props.extraPrices.length > 0) {
        _push(`<div class="mb-8 space-y-3"><!--[-->`);
        ssrRenderList(__props.extraPrices, (extra) => {
          _push(`<div class="flex justify-between text-sm"><span class="${ssrRenderClass(__props.popular ? "text-gray-400" : "text-gray-600")}">${ssrInterpolate(extra.label)}</span><span class="font-bold whitespace-nowrap">${ssrInterpolate(extra.price)}</span></div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<button class="${ssrRenderClass([[
        __props.popular ? "bg-[#E60000] text-white hover:bg-[#E60000] shadow-[#E60000]/20" : "bg-gray-900 text-white hover:bg-gray-800 shadow-gray-900/10"
      ], "w-full rounded-full px-6 py-4 text-base font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"])}"> Get access </button><p class="${ssrRenderClass([__props.popular ? "text-gray-500" : "text-gray-400", "mt-4 text-xs text-center"])}"> Invoices and receipts available for easy company reimbursement </p></div></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/PricingCard.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const PricingCard = Object.assign(_sfc_main, { __name: "PricingCard" });

export { PricingCard as P };
//# sourceMappingURL=PricingCard-Bvvrr42n.mjs.map
