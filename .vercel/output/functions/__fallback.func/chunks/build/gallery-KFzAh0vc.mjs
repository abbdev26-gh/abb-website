import { defineComponent, useSSRContext, ref, mergeProps, unref, withAsyncContext, computed } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderList, ssrInterpolate, ssrRenderComponent, ssrRenderStyle } from 'vue/server-renderer';
import { I as ImageComponent } from './NuxtImg-DKyZQHcs.mjs';
import { PhArrowLeft, PhArrowRight } from '@phosphor-icons/vue';
import { u as useAsyncData } from './asyncData-wAjEz6As.mjs';
import { q as queryCollection } from './client-DqbjtPWP.mjs';
import { a as useSeoMeta } from './server.mjs';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';
import CTASection from './CTASection-BJAsNOtr.mjs';
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
import 'perfect-debounce';
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
import './nuxt-link-DU2Yg8bd.mjs';

const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "GalleryHero",
  __ssrInlineRender: true,
  setup(__props) {
    const images = ref([
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=800"
    ]);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "pb-20 pt-10 md:pb-32 overflow-hidden bg-black" }, _attrs))}><div class="container mx-auto px-4 md:px-6"><div class="max-w-4xl mx-auto text-center my-16"><div class="inline-flex items-center rounded-full border border-gray-200/0 uppercase bg-gray-50/10 px-3 py-1 text-sm font-medium text-[#E60000] mb-6"><span class="flex h-2 w-2 rounded-full bg-[#E60000] mr-2"></span> Events &amp; Gallery </div><h1 class="font-display text-4xl md:text-6xl font-bold text-white leading-tight tracking-tight"> Explore some of our <span class="text-[#E60000]">Past Events</span></h1><p class="mt-6 text-xl text-gray-200 max-w-2xl mx-auto hidden"> Take a visual tour through our state-of-the-art facilities designed for productivity and collaboration. </p></div><div class="relative hidden max-w-7xl mx-auto"><div class="grid grid-cols-1 md:grid-cols-3 gap-8"><div class="md:mt-12"><div class="aspect-[4/5] rounded-3xl overflow-hidden shadow-lg transform md:rotate-2 hover:rotate-0 transition-transform duration-500"><img${ssrRenderAttr("src", unref(images)[0])} alt="Gallery 1" class="w-full h-full object-cover"></div></div><div class=""><div class="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl z-10 relative bg-gray-100"><img${ssrRenderAttr("src", unref(images)[1])} alt="Gallery 2" class="w-full h-full object-cover"></div></div><div class="md:mt-24"><div class="aspect-[4/5] rounded-3xl overflow-hidden shadow-lg transform md:-rotate-2 hover:rotate-0 transition-transform duration-500"><img${ssrRenderAttr("src", unref(images)[2])} alt="Gallery 3" class="w-full h-full object-cover"></div></div></div></div></div></section>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/GalleryHero.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_0 = Object.assign(_sfc_main$2, { __name: "GalleryHero" });
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "GallerySection",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const { data: galleryData } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      "gallery-page",
      () => queryCollection("gallery").first(),
      { lazy: true }
    )), __temp = await __temp, __restore(), __temp);
    const gallerySections = computed(() => {
      const sections = galleryData.value?.sections || [];
      return sections.map((section) => ({
        id: section.id,
        title: section.title,
        description: section.description,
        images: section.images?.map(
          (img) => img.url || section.images[0]?.url
          // Fallback to avoid empty
        ).filter(Boolean) || [
          // Fallback placeholders if no images uploaded yet
          "https://images.unsplash.com/photo-1542744173-8e7e5341c447?auto=format&fit=crop&q=80&w=800",
          "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=800",
          "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=800",
          "https://images.unsplash.com/photo-1591115765373-5207764f72e7?auto=format&fit=crop&q=80&w=800",
          "https://images.unsplash.com/photo-1504384308090-c54be3855833?auto=format&fit=crop&q=80&w=800"
        ]
      }));
    });
    ref([]);
    useSeoMeta({
      title: "Gallery",
      description: "Explore our gallery of premium workspaces designed for productivity and collaboration."
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtImg = ImageComponent;
      if (unref(gallerySections).length > 0) {
        _push(`<div${ssrRenderAttrs(_attrs)} data-v-c05d15fb><!--[-->`);
        ssrRenderList(unref(gallerySections), (section, index) => {
          _push(`<section class="pt-20 bg-white border-b border-gray-100 last:border-0" data-v-c05d15fb><div class="container mx-auto px-4 md:px-6" data-v-c05d15fb><div class="flex flex-col md:flex-row justify-between items-end mb-6 gap-6" data-v-c05d15fb><div class="max-w-2xl" data-v-c05d15fb><h2 class="font-display text-2xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight" data-v-c05d15fb>${ssrInterpolate(section.title)}<span class="text-[#E60000]" data-v-c05d15fb>.</span></h2><p class="text-gray-600 text-sm md:text-base leading-relaxed max-w-xl" data-v-c05d15fb>${ssrInterpolate(section.description)}</p></div><div class="flex gap-4 shrink-0" data-v-c05d15fb><button class="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-[#E60000] hover:text-white transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-red-200" aria-label="Previous images" data-v-c05d15fb>`);
          _push(ssrRenderComponent(unref(PhArrowLeft), {
            weight: "bold",
            class: "w-5 h-5 md:w-6 md:h-6"
          }, null, _parent));
          _push(`</button><button class="w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#E60000] flex items-center justify-center text-white hover:bg-[#cc0000] transition-all duration-300 shadow-lg shadow-red-200" aria-label="Next images" data-v-c05d15fb>`);
          _push(ssrRenderComponent(unref(PhArrowRight), {
            weight: "bold",
            class: "w-5 h-5 md:w-6 md:h-6"
          }, null, _parent));
          _push(`</button></div></div><div class="flex gap-6 overflow-x-auto pb-8 -mx-4 px-4 md:mx-0 md:px-0 snap-x scrollbar-hide" style="${ssrRenderStyle({ "scrollbar-width": "none", "-ms-overflow-style": "none" })}" data-v-c05d15fb><!--[-->`);
          ssrRenderList(section.images, (img, imgIndex) => {
            _push(`<div class="w-[280px] md:w-[340px] lg:w-[380px] aspect-[4/3] rounded-2xl overflow-hidden snap-start shrink-0 relative group" data-v-c05d15fb>`);
            _push(ssrRenderComponent(_component_NuxtImg, {
              src: img,
              alt: `${section.title} ${imgIndex + 1}`,
              class: "w-full h-full object-cover transition-transform duration-700 group-hover:scale-105",
              format: "webp",
              loading: "lazy"
            }, null, _parent));
            _push(`<div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" data-v-c05d15fb></div></div>`);
          });
          _push(`<!--]--></div></div></section>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/GallerySection.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_1 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$1, [["__scopeId", "data-v-c05d15fb"]]), { __name: "GallerySection" });
const _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  const _component_GalleryHero = __nuxt_component_0;
  const _component_GallerySection = __nuxt_component_1;
  const _component_CTASection = CTASection;
  _push(`<!--[-->`);
  _push(ssrRenderComponent(_component_GalleryHero, null, null, _parent));
  _push(ssrRenderComponent(_component_GallerySection, null, null, _parent));
  _push(ssrRenderComponent(_component_CTASection, { class: "!mt-20 md:!mt-32" }, null, _parent));
  _push(`<!--]-->`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/gallery.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const gallery = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { gallery as default };
//# sourceMappingURL=gallery-KFzAh0vc.mjs.map
