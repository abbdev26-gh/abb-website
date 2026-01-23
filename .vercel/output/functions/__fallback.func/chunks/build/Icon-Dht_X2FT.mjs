import { computed, mergeProps, useSSRContext } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';
import { t as tv } from './tv-Du9pqXfS.mjs';
import { _ as _sfc_main$1 } from './Icon-Bf3ko3a9.mjs';
import { b as useAppConfig } from './server.mjs';
import 'tailwind-variants';
import './index-CxURNttY.mjs';
import '@iconify/vue';
import '@iconify/utils/lib/css/icon';
import './asyncData-wAjEz6As.mjs';
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
import 'vue-router';
import 'qs';
import 'tailwindcss/colors';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';
import 'reka-ui';
import '@vueuse/core';

const theme = {
  "base": "size-4 shrink-0 align-sub"
};
const _sfc_main = {
  __name: "ProseIcon",
  __ssrInlineRender: true,
  props: {
    name: { type: String, required: true },
    class: { type: null, required: false }
  },
  setup(__props) {
    const props = __props;
    const appConfig = useAppConfig();
    const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.prose?.icon || {} }));
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$1, mergeProps({
        name: __props.name,
        class: ui.value({ class: props.class })
      }, _attrs), null, _parent));
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/@nuxt/ui/dist/runtime/components/prose/Icon.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=Icon-Dht_X2FT.mjs.map
