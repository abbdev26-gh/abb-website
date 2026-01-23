import { defineComponent, mergeProps, ref, withCtx, createVNode, unref, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderSlot, ssrRenderClass, ssrRenderAttr, ssrRenderList, ssrInterpolate, ssrRenderStyle } from 'vue/server-renderer';
import { _ as __nuxt_component_0 } from './nuxt-link-DU2Yg8bd.mjs';
import { p as publicAssetsURL } from '../nitro/nitro.mjs';
import { PhCaretDown, PhList, PhX, PhTwitterLogo, PhInstagramLogo, PhLinkedinLogo, PhFacebookLogo } from '@phosphor-icons/vue';
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

const _imports_0 = publicAssetsURL("/images/logo.png");
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "AppHeader",
  __ssrInlineRender: true,
  setup(__props) {
    const links = [
      { label: "Home", to: "/#" },
      { label: "Services", to: "/#services" },
      { label: "About", to: "/about" },
      { label: "Events & Gallery", to: "/gallery" }
    ];
    const isOpen = ref(false);
    const activeDropdown = ref(null);
    const isScrolled = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<header${ssrRenderAttrs(mergeProps({
        class: ["sticky top-0 left-0 right-0 z-50 flex justify-center transition-all duration-300 px-4 lg:px-0", isScrolled.value ? "pt-4" : "pt-6"]
      }, _attrs))}><div class="${ssrRenderClass([isScrolled.value ? "py-3 px-6" : "py-4 px-8", "relative w-full max-w-screen-2xl rounded-xl bg-white/80 backdrop-blur-xl transition-all duration-300"])}"><div class="flex items-center justify-between">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        external: "",
        class: "flex items-center gap-2 font-display text-xl font-bold tracking-tighter text-gray-900 shrink-0"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<img${ssrRenderAttr("src", _imports_0)} alt="Abb Logo" class="h-12 md:h-20 w-auto"${_scopeId}>`);
          } else {
            return [
              createVNode("img", {
                src: _imports_0,
                alt: "Abb Logo",
                class: "h-12 md:h-20 w-auto"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<nav class="hidden md:flex items-center gap-1"><!--[-->`);
      ssrRenderList(links, (link) => {
        _push(`<!--[-->`);
        if (link.children) {
          _push(`<div class="relative group"><button class="flex items-center gap-1 px-8 py-2 text-base font-semibold uppercase text-gray-600 transition-colors hover:text-red-600 rounded-full hover:bg-gray-200 group-hover:text-red-600 group-hover:bg-gray-200">${ssrInterpolate(link.label)} `);
          _push(ssrRenderComponent(unref(PhCaretDown), {
            weight: "bold",
            class: "w-4 h-4"
          }, null, _parent));
          _push(`</button><div class="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl uppercase shadow-xl border border-gray-400 overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0"><!--[-->`);
          ssrRenderList(link.children, (child) => {
            _push(ssrRenderComponent(_component_NuxtLink, {
              key: child.to,
              to: child.to,
              external: "",
              class: "block px-4 py-3 text-sm font-semibold text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`${ssrInterpolate(child.label)}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(child.label), 1)
                  ];
                }
              }),
              _: 2
            }, _parent));
          });
          _push(`<!--]--></div></div>`);
        } else {
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: link.to,
            external: "",
            class: "relative px-8 py-2 text-base font-semibold uppercase text-gray-600 transition-colors hover:text-red-600 rounded-full hover:bg-gray-200"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(link.label)}`);
              } else {
                return [
                  createTextVNode(toDisplayString(link.label), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
        }
        _push(`<!--]-->`);
      });
      _push(`<!--]--></nav><div class="hidden md:block shrink-0">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/contact",
        external: "",
        class: "w-full rounded-full px-6 md:px-12 py-4 text-base font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 bg-[#E60000] text-white"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Contact Us `);
          } else {
            return [
              createTextVNode(" Contact Us ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><button class="md:hidden p-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors"><span class="sr-only">Toggle menu</span>`);
      if (!isOpen.value) {
        _push(ssrRenderComponent(unref(PhList), {
          weight: "bold",
          class: "w-6 h-6"
        }, null, _parent));
      } else {
        _push(ssrRenderComponent(unref(PhX), {
          weight: "bold",
          class: "w-6 h-6"
        }, null, _parent));
      }
      _push(`</button></div><div class="absolute top-full left-0 right-0 mt-4 p-4 rounded-3xl border border-gray-200 bg-white/95 backdrop-blur-xl shadow-xl md:hidden overflow-hidden" style="${ssrRenderStyle(isOpen.value ? null : { display: "none" })}"><nav class="flex flex-col gap-2"><!--[-->`);
      ssrRenderList(links, (link) => {
        _push(`<!--[-->`);
        if (link.children) {
          _push(`<div><button class="flex items-center justify-between w-full px-4 py-3 text-base font-medium text-gray-600 rounded-xl hover:bg-gray-100 hover:text-gray-900 transition-all">${ssrInterpolate(link.label)} `);
          _push(ssrRenderComponent(unref(PhCaretDown), {
            weight: "bold",
            class: ["w-4 h-4 transition-transform", { "rotate-180": activeDropdown.value === link.label }]
          }, null, _parent));
          _push(`</button><div class="pl-4 space-y-1 mt-1" style="${ssrRenderStyle(activeDropdown.value === link.label ? null : { display: "none" })}"><!--[-->`);
          ssrRenderList(link.children, (child) => {
            _push(ssrRenderComponent(_component_NuxtLink, {
              key: child.to,
              to: child.to,
              class: "block px-4 py-2 text-base font-medium text-gray-500 rounded-lg hover:text-red-600",
              onClick: ($event) => isOpen.value = false
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`${ssrInterpolate(child.label)}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(child.label), 1)
                  ];
                }
              }),
              _: 2
            }, _parent));
          });
          _push(`<!--]--></div></div>`);
        } else {
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: link.to,
            external: "",
            class: "px-4 py-3 text-base font-medium text-gray-600 rounded-xl hover:bg-gray-100 hover:text-gray-900 transition-all",
            "active-class": "bg-gray-100 text-gray-900",
            onClick: ($event) => isOpen.value = false
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(link.label)}`);
              } else {
                return [
                  createTextVNode(toDisplayString(link.label), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
        }
        _push(`<!--]-->`);
      });
      _push(`<!--]--><div class="h-px bg-gray-100 my-2"></div>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/contact",
        external: "",
        class: "w-full rounded-xl bg-[#E60000] px-4 py-3 text-center text-base font-bold text-white hover:bg-red-600 transition-colors",
        onClick: ($event) => isOpen.value = false
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Book a Tour `);
          } else {
            return [
              createTextVNode(" Book a Tour ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</nav></div></div></header>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AppHeader.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const AppHeader = Object.assign(_sfc_main$2, { __name: "AppHeader" });
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "AppFooter",
  __ssrInlineRender: true,
  setup(__props) {
    const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<footer${ssrRenderAttrs(mergeProps({ class: "border-t border-white/10 bg-black text-white" }, _attrs))}><div class="container mx-auto px-4 py-12 md:px-6 md:py-16"><div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3"><div class="space-y-4">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "flex items-center gap-2 font-display text-xl font-bold tracking-tighter"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<img${ssrRenderAttr("src", _imports_0)} alt="abb-logo" class="w-16 md:w-32 shrink-0 brightness-0 invert"${_scopeId}>`);
          } else {
            return [
              createVNode("img", {
                src: _imports_0,
                alt: "abb-logo",
                class: "w-16 md:w-32 shrink-0 brightness-0 invert"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<p class="text-sm text-gray-400 max-w-xs"> Africa Business Bureau (ABB): Your 360° Launchpad for Growth in Ghana and Africa. Providing businesses with training, talent management and business support services to incubate their business ideas and accelerate growth. </p></div><div><h3 class="font-semibold mb-4 text-white">Company</h3><ul class="space-y-2 text-sm text-gray-400"><li>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/about",
        class: "hover:text-white transition-colors"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`About Us`);
          } else {
            return [
              createTextVNode("About Us")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/#services",
        class: "hover:text-white transition-colors"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Services`);
          } else {
            return [
              createTextVNode("Services")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/gallery",
        class: "hover:text-white transition-colors"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Events &amp; Gallery`);
          } else {
            return [
              createTextVNode("Events & Gallery")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/contact",
        class: "hover:text-white transition-colors"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Contact Us`);
          } else {
            return [
              createTextVNode("Contact Us")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li></ul></div><div class="hidden"><h3 class="font-semibold mb-4 text-white">Resources</h3><ul class="space-y-2 text-sm text-gray-400"><li>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/blog",
        class: "hover:text-white transition-colors"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Blog`);
          } else {
            return [
              createTextVNode("Blog")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/events",
        class: "hover:text-white transition-colors"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Events`);
          } else {
            return [
              createTextVNode("Events")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/faq",
        class: "hover:text-white transition-colors"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`FAQ`);
          } else {
            return [
              createTextVNode("FAQ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/support",
        class: "hover:text-white transition-colors"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Support`);
          } else {
            return [
              createTextVNode("Support")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li></ul></div><div><h3 class="font-semibold mb-4 text-white">Stay Updated</h3><p class="text-sm text-gray-400 mb-4">Subscribe to our newsletter for the latest updates and offers.</p><form class="flex gap-2"><input type="email" placeholder="Enter your email" class="flex-1 rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#E60000]"><button type="submit" class="rounded-md bg-[#E60000] px-3 py-2 text-sm font-medium text-white hover:bg-red-600 transition-colors"> Subscribe </button></form></div></div><div class="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 md:flex-row"><p class="text-sm text-gray-500"> © ${ssrInterpolate(unref(currentYear))} Africa Business Bureau Inc. All rights reserved. </p><div class="flex gap-4"><a href="https://twitter.com/abb_africa" target="_blank" class="text-gray-400 hover:text-white transition-colors"><span class="sr-only">Twitter</span>`);
      _push(ssrRenderComponent(unref(PhTwitterLogo), {
        weight: "fill",
        class: "w-5 h-5"
      }, null, _parent));
      _push(`</a><a href="https://www.instagram.com/abb_africa/" target="_blank" class="text-gray-400 hover:text-white transition-colors"><span class="sr-only">Instagram</span>`);
      _push(ssrRenderComponent(unref(PhInstagramLogo), {
        weight: "fill",
        class: "w-5 h-5"
      }, null, _parent));
      _push(`</a><a href="https://www.linkedin.com/company/africa-business-bureau/" target="_blank" class="text-gray-400 hover:text-white transition-colors"><span class="sr-only">LinkedIn</span>`);
      _push(ssrRenderComponent(unref(PhLinkedinLogo), {
        weight: "fill",
        class: "w-5 h-5"
      }, null, _parent));
      _push(`</a><a href="https://web.facebook.com/AfricanBusinessBureau/" target="_blank" class="text-gray-400 hover:text-white transition-colors"><span class="sr-only">Facebook</span>`);
      _push(ssrRenderComponent(unref(PhFacebookLogo), {
        weight: "fill",
        class: "w-5 h-5"
      }, null, _parent));
      _push(`</a></div></div></div></footer>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AppFooter.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const AppFooter = Object.assign(_sfc_main$1, { __name: "AppFooter" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "default",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex min-h-screen flex-col" }, _attrs))}>`);
      _push(ssrRenderComponent(AppHeader, null, null, _parent));
      _push(`<main class="flex-1">`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</main>`);
      _push(ssrRenderComponent(AppFooter, null, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=default-B1GhrPud.mjs.map
