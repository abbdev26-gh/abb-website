import { defineComponent, withAsyncContext, mergeProps, unref, createVNode, resolveDynamicComponent, computed, reactive, ref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderVNode, ssrRenderClass, ssrRenderAttr, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { PhPhone, PhMapPin, PhHeadset, PhChatCircleText } from '@phosphor-icons/vue';
import { u as useAsyncData } from './asyncData-wAjEz6As.mjs';
import { q as queryCollection } from './client-DqbjtPWP.mjs';
import CTASection from './CTASection-BJAsNOtr.mjs';
import { a as useSeoMeta } from './server.mjs';
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
import './nuxt-link-DU2Yg8bd.mjs';
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

const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "ContactHero",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const { data: contactData } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      "contact",
      () => queryCollection("contact").first()
    )), __temp = await __temp, __restore(), __temp);
    const iconMap = {
      "Chat to sales": PhChatCircleText,
      "Chat to support": PhHeadset,
      "Visit us": PhMapPin,
      "Call us": PhPhone
    };
    console.log("contact data:", contactData.value);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "bg-[#0A0A0A] text-white py-20 md:py-32 relative overflow-hidden" }, _attrs))}><div class="absolute inset-0 bg-[url(&#39;https://grainy-gradients.vercel.app/noise.svg&#39;)] opacity-20"></div><div class="container mx-auto px-4 md:px-6 relative z-10"><div class="max-w-4xl mb-16"><p class="text-[#E60000] font-medium mb-4 uppercase tracking-wider">Contact us</p><h1 class="font-display text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">${ssrInterpolate(unref(contactData)?.title || "contact title")}</h1><p class="text-gray-400 text-lg md:text-xl max-w-2xl">${ssrInterpolate(unref(contactData)?.description || "contact description")}</p></div><div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6"><!--[-->`);
      ssrRenderList(unref(contactData)?.contactOptions, (card) => {
        _push(`<div class="bg-[#111] p-8 rounded-2xl border border-white/5 bg-white/5 hover:border-[#E60000]/30 transition-colors group"><div class="w-12 h-12 rounded-xl bg-[#E60000]/10 flex items-center justify-center text-[#E60000] mb-6 group-hover:bg-[#E60000] group-hover:text-white transition-colors">`);
        ssrRenderVNode(_push, createVNode(resolveDynamicComponent(iconMap[card.title] || unref(PhChatCircleText)), {
          size: 24,
          weight: "fill"
        }, null), _parent);
        _push(`</div><h3 class="text-xl font-bold mb-2">${ssrInterpolate(card.title)}</h3><p class="text-gray-400 text-sm mb-6">${ssrInterpolate(card.description)}</p><div class="${ssrRenderClass([{ "hover:underline": card.title.toLowerCase().includes("chat") || card.title.toLowerCase().includes("call") }, "text-[#E60000] font-medium"])}"><span>${card.contactDetail ?? ""}</span></div></div>`);
      });
      _push(`<!--]--></div></div></section>`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ContactHero.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const ContactHero = Object.assign(_sfc_main$3, { __name: "ContactHero" });
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "ContactLocations",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const { data: locationsData } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      "locations",
      () => queryCollection("locations").all(),
      { lazy: true }
    )), __temp = await __temp, __restore(), __temp);
    const locations = computed(() => {
      return locationsData.value || [];
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "py-20 bg-white" }, _attrs))}><div class="container max-w-5xl mx-auto px-4 md:px-6"><div class="mb-12"><h2 class="font-display text-3xl md:text-4xl font-bold text-center text-gray-900">Our locations</h2><p class="text-gray-500 mt-4 text-center">Come visit our friendly team at any of our offices.</p></div><div class="grid md:grid-cols-2 lg:grid-cols-2 gap-8"><!--[-->`);
      ssrRenderList(unref(locations), (location) => {
        _push(`<div class="flex items-start gap-4 p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"><div class="w-10 h-10 rounded-full bg-[#E60000]/10 flex items-center justify-center text-[#E60000] shrink-0">`);
        _push(ssrRenderComponent(unref(PhMapPin), {
          size: 20,
          weight: "fill"
        }, null, _parent));
        _push(`</div><div><h3 class="font-bold text-gray-900 text-lg mb-1">${ssrInterpolate(location.city)}</h3><p class="text-gray-500 text-sm">${ssrInterpolate(location.address)}</p></div></div>`);
      });
      _push(`<!--]--></div></div></section>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ContactLocations.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const ContactLocations = Object.assign(_sfc_main$2, { __name: "ContactLocations" });
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "ContactForm",
  __ssrInlineRender: true,
  setup(__props) {
    const form = reactive({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      message: ""
    });
    const isSubmitting = ref(false);
    const showSuccess = ref(false);
    const showError = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "py-20 bg-gray-50" }, _attrs))}><div class="container mx-auto px-4 md:px-6"><div class="max-w-2xl mx-auto text-center mb-12"><h2 class="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">Get in touch</h2><p class="text-gray-500">We&#39;d love to hear from you. Please fill out this form.</p></div><div class="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative">`);
      if (showSuccess.value) {
        _push(`<div class="mb-6 p-4 rounded-lg bg-green-50 text-green-700 border border-green-200"><p class="font-bold">Message sent!</p><p class="text-sm">We&#39;ll get back to you as soon as possible.</p></div>`);
      } else {
        _push(`<!---->`);
      }
      if (showError.value) {
        _push(`<div class="mb-6 p-4 rounded-lg bg-red-50 text-red-700 border border-red-200"><p class="font-bold">Something went wrong.</p><p class="text-sm">Please try again later or contact us directly.</p></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<form class="space-y-6"><div class="grid md:grid-cols-2 gap-6"><div class="space-y-2"><label for="firstName" class="text-sm font-medium text-gray-700">First name</label><input${ssrRenderAttr("value", form.firstName)} type="text" id="firstName" placeholder="First name" required class="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-[#E60000] focus:ring-[#E60000] focus:outline-none"></div><div class="space-y-2"><label for="lastName" class="text-sm font-medium text-gray-700">Last name</label><input${ssrRenderAttr("value", form.lastName)} type="text" id="lastName" placeholder="Last name" required class="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-[#E60000] focus:ring-[#E60000] focus:outline-none"></div></div><div class="space-y-2"><label for="email" class="text-sm font-medium text-gray-700">Email</label><input${ssrRenderAttr("value", form.email)} type="email" id="email" placeholder="you@company.com" required class="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-[#E60000] focus:ring-[#E60000] focus:outline-none"></div><div class="space-y-2"><label for="phone" class="text-sm font-medium text-gray-700">Phone number</label><input${ssrRenderAttr("value", form.phone)} type="tel" id="phone" placeholder="+233 (55) 000-0000" class="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-[#E60000] focus:ring-[#E60000] focus:outline-none"></div><div class="space-y-2"><label for="message" class="text-sm font-medium text-gray-700">Message</label><textarea id="message" rows="4" placeholder="Leave us a message..." required class="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-[#E60000] focus:ring-[#E60000] focus:outline-none resize-none">${ssrInterpolate(form.message)}</textarea></div><button type="submit"${ssrIncludeBooleanAttr(isSubmitting.value) ? " disabled" : ""} class="w-full bg-[#E60000] text-white font-bold py-3 px-6 rounded-full hover:bg-red-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed">`);
      if (isSubmitting.value) {
        _push(`<span>Sending...</span>`);
      } else {
        _push(`<span>Send message</span>`);
      }
      _push(`</button></form></div></div></section>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ContactForm.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const ContactForm = Object.assign(_sfc_main$1, { __name: "ContactForm" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "contact",
  __ssrInlineRender: true,
  setup(__props) {
    useSeoMeta({
      title: "Contact Us - Africa Business Bureau",
      description: "Get in touch with our team for sales, support, or general inquiries. Visit our offices or send us a message."
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(ContactHero, null, null, _parent));
      _push(ssrRenderComponent(ContactLocations, null, null, _parent));
      _push(ssrRenderComponent(ContactForm, null, null, _parent));
      _push(ssrRenderComponent(CTASection, null, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/contact.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=contact-D47htl3j.mjs.map
