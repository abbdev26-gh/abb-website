import { mergeProps, unref, withCtx, useSSRContext } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';
import { s as ssrRenderSlot } from './ssrSlot-BqzWQcY8.mjs';
import { r as renderSlot } from './slot-le5S_nVo.mjs';
import _sfc_main$1 from './Callout-DiD78EEi.mjs';
import { b as useAppConfig } from './server.mjs';
import './tv-Du9pqXfS.mjs';
import 'tailwind-variants';
import './Link-ByU-tOfK.mjs';
import './nuxt-link-DU2Yg8bd.mjs';
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
import 'reka-ui';
import '@vueuse/core';
import './index-BmwSzhyF.mjs';
import './Icon-Bf3ko3a9.mjs';
import './index-CxURNttY.mjs';
import '@iconify/vue';
import '@iconify/utils/lib/css/icon';
import './asyncData-wAjEz6As.mjs';
import 'perfect-debounce';
import 'vue-router';
import 'qs';
import 'tailwindcss/colors';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';

const _sfc_main = {
  __name: "ProseNote",
  __ssrInlineRender: true,
  setup(__props) {
    const appConfig = useAppConfig();
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$1, mergeProps({
        color: "info",
        icon: unref(appConfig).ui.icons.info
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "default", { mdcUnwrap: "p" }, null, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "default", { mdcUnwrap: "p" })
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/@nuxt/ui/dist/runtime/components/prose/callout/Note.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=Note-Cva_Ow1H.mjs.map
