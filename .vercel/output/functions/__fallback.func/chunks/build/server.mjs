import process from 'node:process';globalThis._importMeta_=globalThis._importMeta_||{url:"file:///_entry.js",env:process.env};import { hasInjectionContext, inject, getCurrentInstance, defineAsyncComponent, defineComponent, createElementBlock, h, computed, unref, shallowRef, provide, shallowReactive, ref, Suspense, Fragment, useSSRContext, createApp, withCtx, createVNode, mergeProps, toRef, onErrorCaptured, onServerPrefetch, resolveDynamicComponent, reactive, effectScope, isReadonly, isRef, isShallow, isReactive, toRaw, nextTick, getCurrentScope } from 'vue';
import { k as defuFn, l as klona, f as createError$1, m as hasProtocol, n as isScriptProtocol, o as joinURL, w as withQuery, s as sanitizeStatusCode, q as getContext, $ as $fetch$1, t as baseURL, v as createHooks, x as executeAsync, y as toRouteMatcher, z as createRouter$1, A as defu, h as destr, B as getRequestHeader, C as isEqual, D as setCookie, E as getCookie, F as deleteCookie } from '../nitro/nitro.mjs';
import { useRoute as useRoute$1, RouterView, createMemoryHistory, createRouter, START_LOCATION } from 'vue-router';
import { stringify } from 'qs';
import colors from 'tailwindcss/colors';
import { _api, addAPIProvider, setCustomIconsLoader } from '@iconify/vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderSuspense, ssrRenderVNode } from 'vue/server-renderer';
import { u as useSeoMeta$1, a as useHead$1, h as headSymbol } from '../routes/renderer.mjs';
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
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';

function parse(str, options) {
  if (typeof str !== "string") {
    throw new TypeError("argument str must be a string");
  }
  const obj = {};
  const opt = options || {};
  const dec = opt.decode || decode;
  let index = 0;
  while (index < str.length) {
    const eqIdx = str.indexOf("=", index);
    if (eqIdx === -1) {
      break;
    }
    let endIdx = str.indexOf(";", index);
    if (endIdx === -1) {
      endIdx = str.length;
    } else if (endIdx < eqIdx) {
      index = str.lastIndexOf(";", eqIdx - 1) + 1;
      continue;
    }
    const key = str.slice(index, eqIdx).trim();
    if (opt?.filter && !opt?.filter(key)) {
      index = endIdx + 1;
      continue;
    }
    if (void 0 === obj[key]) {
      let val = str.slice(eqIdx + 1, endIdx).trim();
      if (val.codePointAt(0) === 34) {
        val = val.slice(1, -1);
      }
      obj[key] = tryDecode(val, dec);
    }
    index = endIdx + 1;
  }
  return obj;
}
function decode(str) {
  return str.includes("%") ? decodeURIComponent(str) : str;
}
function tryDecode(str, decode2) {
  try {
    return decode2(str);
  } catch {
    return str;
  }
}

if (!globalThis.$fetch) {
  globalThis.$fetch = $fetch$1.create({
    baseURL: baseURL()
  });
}
if (!("global" in globalThis)) {
  globalThis.global = globalThis;
}
const appLayoutTransition = false;
const nuxtLinkDefaults = { "componentName": "NuxtLink" };
const asyncDataDefaults = { "deep": false };
const appId = "nuxt-app";
function getNuxtAppCtx(id = appId) {
  return getContext(id, {
    asyncContext: false
  });
}
const NuxtPluginIndicator = "__nuxt_plugin";
function createNuxtApp(options) {
  let hydratingCount = 0;
  const nuxtApp = {
    _id: options.id || appId || "nuxt-app",
    _scope: effectScope(),
    provide: void 0,
    versions: {
      get nuxt() {
        return "4.2.1";
      },
      get vue() {
        return nuxtApp.vueApp.version;
      }
    },
    payload: shallowReactive({
      ...options.ssrContext?.payload || {},
      data: shallowReactive({}),
      state: reactive({}),
      once: /* @__PURE__ */ new Set(),
      _errors: shallowReactive({})
    }),
    static: {
      data: {}
    },
    runWithContext(fn) {
      if (nuxtApp._scope.active && !getCurrentScope()) {
        return nuxtApp._scope.run(() => callWithNuxt(nuxtApp, fn));
      }
      return callWithNuxt(nuxtApp, fn);
    },
    isHydrating: false,
    deferHydration() {
      if (!nuxtApp.isHydrating) {
        return () => {
        };
      }
      hydratingCount++;
      let called = false;
      return () => {
        if (called) {
          return;
        }
        called = true;
        hydratingCount--;
        if (hydratingCount === 0) {
          nuxtApp.isHydrating = false;
          return nuxtApp.callHook("app:suspense:resolve");
        }
      };
    },
    _asyncDataPromises: {},
    _asyncData: shallowReactive({}),
    _payloadRevivers: {},
    ...options
  };
  {
    nuxtApp.payload.serverRendered = true;
  }
  if (nuxtApp.ssrContext) {
    nuxtApp.payload.path = nuxtApp.ssrContext.url;
    nuxtApp.ssrContext.nuxt = nuxtApp;
    nuxtApp.ssrContext.payload = nuxtApp.payload;
    nuxtApp.ssrContext.config = {
      public: nuxtApp.ssrContext.runtimeConfig.public,
      app: nuxtApp.ssrContext.runtimeConfig.app
    };
  }
  nuxtApp.hooks = createHooks();
  nuxtApp.hook = nuxtApp.hooks.hook;
  {
    const contextCaller = async function(hooks, args) {
      for (const hook of hooks) {
        await nuxtApp.runWithContext(() => hook(...args));
      }
    };
    nuxtApp.hooks.callHook = (name, ...args) => nuxtApp.hooks.callHookWith(contextCaller, name, ...args);
  }
  nuxtApp.callHook = nuxtApp.hooks.callHook;
  nuxtApp.provide = (name, value) => {
    const $name = "$" + name;
    defineGetter(nuxtApp, $name, value);
    defineGetter(nuxtApp.vueApp.config.globalProperties, $name, value);
  };
  defineGetter(nuxtApp.vueApp, "$nuxt", nuxtApp);
  defineGetter(nuxtApp.vueApp.config.globalProperties, "$nuxt", nuxtApp);
  const runtimeConfig = options.ssrContext.runtimeConfig;
  nuxtApp.provide("config", runtimeConfig);
  return nuxtApp;
}
function registerPluginHooks(nuxtApp, plugin2) {
  if (plugin2.hooks) {
    nuxtApp.hooks.addHooks(plugin2.hooks);
  }
}
async function applyPlugin(nuxtApp, plugin2) {
  if (typeof plugin2 === "function") {
    const { provide: provide2 } = await nuxtApp.runWithContext(() => plugin2(nuxtApp)) || {};
    if (provide2 && typeof provide2 === "object") {
      for (const key in provide2) {
        nuxtApp.provide(key, provide2[key]);
      }
    }
  }
}
async function applyPlugins(nuxtApp, plugins2) {
  const resolvedPlugins = /* @__PURE__ */ new Set();
  const unresolvedPlugins = [];
  const parallels = [];
  let error = void 0;
  let promiseDepth = 0;
  async function executePlugin(plugin2) {
    const unresolvedPluginsForThisPlugin = plugin2.dependsOn?.filter((name) => plugins2.some((p) => p._name === name) && !resolvedPlugins.has(name)) ?? [];
    if (unresolvedPluginsForThisPlugin.length > 0) {
      unresolvedPlugins.push([new Set(unresolvedPluginsForThisPlugin), plugin2]);
    } else {
      const promise = applyPlugin(nuxtApp, plugin2).then(async () => {
        if (plugin2._name) {
          resolvedPlugins.add(plugin2._name);
          await Promise.all(unresolvedPlugins.map(async ([dependsOn, unexecutedPlugin]) => {
            if (dependsOn.has(plugin2._name)) {
              dependsOn.delete(plugin2._name);
              if (dependsOn.size === 0) {
                promiseDepth++;
                await executePlugin(unexecutedPlugin);
              }
            }
          }));
        }
      }).catch((e) => {
        if (!plugin2.parallel && !nuxtApp.payload.error) {
          throw e;
        }
        error ||= e;
      });
      if (plugin2.parallel) {
        parallels.push(promise);
      } else {
        await promise;
      }
    }
  }
  for (const plugin2 of plugins2) {
    if (nuxtApp.ssrContext?.islandContext && plugin2.env?.islands === false) {
      continue;
    }
    registerPluginHooks(nuxtApp, plugin2);
  }
  for (const plugin2 of plugins2) {
    if (nuxtApp.ssrContext?.islandContext && plugin2.env?.islands === false) {
      continue;
    }
    await executePlugin(plugin2);
  }
  await Promise.all(parallels);
  if (promiseDepth) {
    for (let i = 0; i < promiseDepth; i++) {
      await Promise.all(parallels);
    }
  }
  if (error) {
    throw nuxtApp.payload.error || error;
  }
}
// @__NO_SIDE_EFFECTS__
function defineNuxtPlugin(plugin2) {
  if (typeof plugin2 === "function") {
    return plugin2;
  }
  const _name = plugin2._name || plugin2.name;
  delete plugin2.name;
  return Object.assign(plugin2.setup || (() => {
  }), plugin2, { [NuxtPluginIndicator]: true, _name });
}
function callWithNuxt(nuxt, setup, args) {
  const fn = () => setup();
  const nuxtAppCtx = getNuxtAppCtx(nuxt._id);
  {
    return nuxt.vueApp.runWithContext(() => nuxtAppCtx.callAsync(nuxt, fn));
  }
}
function tryUseNuxtApp(id) {
  let nuxtAppInstance;
  if (hasInjectionContext()) {
    nuxtAppInstance = getCurrentInstance()?.appContext.app.$nuxt;
  }
  nuxtAppInstance ||= getNuxtAppCtx(id).tryUse();
  return nuxtAppInstance || null;
}
function useNuxtApp(id) {
  const nuxtAppInstance = tryUseNuxtApp(id);
  if (!nuxtAppInstance) {
    {
      throw new Error("[nuxt] instance unavailable");
    }
  }
  return nuxtAppInstance;
}
// @__NO_SIDE_EFFECTS__
function useRuntimeConfig(_event) {
  return useNuxtApp().$config;
}
function defineGetter(obj, key, val) {
  Object.defineProperty(obj, key, { get: () => val });
}
const LayoutMetaSymbol = Symbol("layout-meta");
const PageRouteSymbol = Symbol("route");
globalThis._importMeta_.url.replace(/\/app\/.*$/, "/");
const useRouter = () => {
  return useNuxtApp()?.$router;
};
const useRoute = () => {
  if (hasInjectionContext()) {
    return inject(PageRouteSymbol, useNuxtApp()._route);
  }
  return useNuxtApp()._route;
};
// @__NO_SIDE_EFFECTS__
function defineNuxtRouteMiddleware(middleware) {
  return middleware;
}
const isProcessingMiddleware = () => {
  try {
    if (useNuxtApp()._processingMiddleware) {
      return true;
    }
  } catch {
    return false;
  }
  return false;
};
const URL_QUOTE_RE = /"/g;
const navigateTo = (to, options) => {
  to ||= "/";
  const toPath = typeof to === "string" ? to : "path" in to ? resolveRouteObject(to) : useRouter().resolve(to).href;
  const isExternalHost = hasProtocol(toPath, { acceptRelative: true });
  const isExternal = options?.external || isExternalHost;
  if (isExternal) {
    if (!options?.external) {
      throw new Error("Navigating to an external URL is not allowed by default. Use `navigateTo(url, { external: true })`.");
    }
    const { protocol } = new URL(toPath, "http://localhost");
    if (protocol && isScriptProtocol(protocol)) {
      throw new Error(`Cannot navigate to a URL with '${protocol}' protocol.`);
    }
  }
  const inMiddleware = isProcessingMiddleware();
  const router = useRouter();
  const nuxtApp = useNuxtApp();
  {
    if (nuxtApp.ssrContext) {
      const fullPath = typeof to === "string" || isExternal ? toPath : router.resolve(to).fullPath || "/";
      const location2 = isExternal ? toPath : joinURL((/* @__PURE__ */ useRuntimeConfig()).app.baseURL, fullPath);
      const redirect = async function(response) {
        await nuxtApp.callHook("app:redirected");
        const encodedLoc = location2.replace(URL_QUOTE_RE, "%22");
        const encodedHeader = encodeURL(location2, isExternalHost);
        nuxtApp.ssrContext._renderResponse = {
          statusCode: sanitizeStatusCode(options?.redirectCode || 302, 302),
          body: `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=${encodedLoc}"></head></html>`,
          headers: { location: encodedHeader }
        };
        return response;
      };
      if (!isExternal && inMiddleware) {
        router.afterEach((final) => final.fullPath === fullPath ? redirect(false) : void 0);
        return to;
      }
      return redirect(!inMiddleware ? void 0 : (
        /* abort route navigation */
        false
      ));
    }
  }
  if (isExternal) {
    nuxtApp._scope.stop();
    if (options?.replace) {
      (void 0).replace(toPath);
    } else {
      (void 0).href = toPath;
    }
    if (inMiddleware) {
      if (!nuxtApp.isHydrating) {
        return false;
      }
      return new Promise(() => {
      });
    }
    return Promise.resolve();
  }
  return options?.replace ? router.replace(to) : router.push(to);
};
function resolveRouteObject(to) {
  return withQuery(to.path || "", to.query || {}) + (to.hash || "");
}
function encodeURL(location2, isExternalHost = false) {
  const url = new URL(location2, "http://localhost");
  if (!isExternalHost) {
    return url.pathname + url.search + url.hash;
  }
  if (location2.startsWith("//")) {
    return url.toString().replace(url.protocol, "");
  }
  return url.toString();
}
const NUXT_ERROR_SIGNATURE = "__nuxt_error";
const useError = /* @__NO_SIDE_EFFECTS__ */ () => toRef(useNuxtApp().payload, "error");
const showError = (error) => {
  const nuxtError = createError(error);
  try {
    const error2 = /* @__PURE__ */ useError();
    if (false) ;
    error2.value ||= nuxtError;
  } catch {
    throw nuxtError;
  }
  return nuxtError;
};
const isNuxtError = (error) => !!error && typeof error === "object" && NUXT_ERROR_SIGNATURE in error;
const createError = (error) => {
  const nuxtError = createError$1(error);
  Object.defineProperty(nuxtError, NUXT_ERROR_SIGNATURE, {
    value: true,
    configurable: false,
    writable: false
  });
  return nuxtError;
};
const unhead_k2P3m_ZDyjlr2mMYnoDPwavjsDN8hBlk9cFai0bbopU = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:head",
  enforce: "pre",
  setup(nuxtApp) {
    const head = nuxtApp.ssrContext.head;
    nuxtApp.vueApp.use(head);
  }
});
function toArray(value) {
  return Array.isArray(value) ? value : [value];
}
async function getRouteRules(arg) {
  const path = typeof arg === "string" ? arg : arg.path;
  {
    useNuxtApp().ssrContext._preloadManifest = true;
    const _routeRulesMatcher2 = toRouteMatcher(
      createRouter$1({ routes: (/* @__PURE__ */ useRuntimeConfig()).nitro.routeRules })
    );
    return defu({}, ..._routeRulesMatcher2.matchAll(path).reverse());
  }
}
const _routes = [
  {
    name: "about",
    path: "/about",
    component: () => import('./about-CROIwkn-.mjs')
  },
  {
    name: "index",
    path: "/",
    component: () => import('./index-DD4fY19h.mjs')
  },
  {
    name: "contact",
    path: "/contact",
    component: () => import('./contact-D47htl3j.mjs')
  },
  {
    name: "gallery",
    path: "/gallery",
    component: () => import('./gallery-KFzAh0vc.mjs')
  },
  {
    name: "pricing",
    path: "/pricing",
    component: () => import('./pricing-CDcA_d-A.mjs')
  },
  {
    name: "locations",
    path: "/locations",
    component: () => import('./index-CcxhFvLR.mjs')
  },
  {
    name: "services-slug",
    path: "/services/:slug()",
    component: () => import('./_slug_-BFSCWjMG.mjs')
  },
  {
    name: "locations-slug",
    path: "/locations/:slug()",
    component: () => import('./_slug_-DEY-N6yt.mjs')
  }
];
const _wrapInTransition = (props, children) => {
  return { default: () => children.default?.() };
};
const ROUTE_KEY_PARENTHESES_RE = /(:\w+)\([^)]+\)/g;
const ROUTE_KEY_SYMBOLS_RE = /(:\w+)[?+*]/g;
const ROUTE_KEY_NORMAL_RE = /:\w+/g;
function generateRouteKey(route) {
  const source = route?.meta.key ?? route.path.replace(ROUTE_KEY_PARENTHESES_RE, "$1").replace(ROUTE_KEY_SYMBOLS_RE, "$1").replace(ROUTE_KEY_NORMAL_RE, (r) => route.params[r.slice(1)]?.toString() || "");
  return typeof source === "function" ? source(route) : source;
}
function isChangingPage(to, from) {
  if (to === from || from === START_LOCATION) {
    return false;
  }
  if (generateRouteKey(to) !== generateRouteKey(from)) {
    return true;
  }
  const areComponentsSame = to.matched.every(
    (comp, index) => comp.components && comp.components.default === from.matched[index]?.components?.default
  );
  if (areComponentsSame) {
    return false;
  }
  return true;
}
const routerOptions0 = {
  scrollBehavior(to, from, savedPosition) {
    const nuxtApp = useNuxtApp();
    const hashScrollBehaviour = useRouter().options?.scrollBehaviorType ?? "auto";
    if (to.path.replace(/\/$/, "") === from.path.replace(/\/$/, "")) {
      if (from.hash && !to.hash) {
        return { left: 0, top: 0 };
      }
      if (to.hash) {
        return { el: to.hash, top: _getHashElementScrollMarginTop(to.hash), behavior: hashScrollBehaviour };
      }
      return false;
    }
    const routeAllowsScrollToTop = typeof to.meta.scrollToTop === "function" ? to.meta.scrollToTop(to, from) : to.meta.scrollToTop;
    if (routeAllowsScrollToTop === false) {
      return false;
    }
    const hookToWait = nuxtApp._runningTransition ? "page:transition:finish" : "page:loading:end";
    return new Promise((resolve) => {
      if (from === START_LOCATION) {
        resolve(_calculatePosition(to, from, savedPosition, hashScrollBehaviour));
        return;
      }
      nuxtApp.hooks.hookOnce(hookToWait, () => {
        requestAnimationFrame(() => resolve(_calculatePosition(to, from, savedPosition, hashScrollBehaviour)));
      });
    });
  }
};
function _getHashElementScrollMarginTop(selector) {
  try {
    const elem = (void 0).querySelector(selector);
    if (elem) {
      return (Number.parseFloat(getComputedStyle(elem).scrollMarginTop) || 0) + (Number.parseFloat(getComputedStyle((void 0).documentElement).scrollPaddingTop) || 0);
    }
  } catch {
  }
  return 0;
}
function _calculatePosition(to, from, savedPosition, defaultHashScrollBehaviour) {
  if (savedPosition) {
    return savedPosition;
  }
  const isPageNavigation = isChangingPage(to, from);
  if (to.hash) {
    return {
      el: to.hash,
      top: _getHashElementScrollMarginTop(to.hash),
      behavior: isPageNavigation ? defaultHashScrollBehaviour : "instant"
    };
  }
  return {
    left: 0,
    top: 0
  };
}
const configRouterOptions = {
  hashMode: false,
  scrollBehaviorType: "auto"
};
const routerOptions = {
  ...configRouterOptions,
  ...routerOptions0
};
const validate = /* @__PURE__ */ defineNuxtRouteMiddleware(async (to, from) => {
  let __temp, __restore;
  if (!to.meta?.validate) {
    return;
  }
  const result = ([__temp, __restore] = executeAsync(() => Promise.resolve(to.meta.validate(to))), __temp = await __temp, __restore(), __temp);
  if (result === true) {
    return;
  }
  const error = createError({
    fatal: false,
    statusCode: result && result.statusCode || 404,
    statusMessage: result && result.statusMessage || `Page Not Found: ${to.fullPath}`,
    data: {
      path: to.fullPath
    }
  });
  return error;
});
const manifest_45route_45rule = /* @__PURE__ */ defineNuxtRouteMiddleware(async (to) => {
  {
    return;
  }
});
const globalMiddleware = [
  validate,
  manifest_45route_45rule
];
const namedMiddleware = {};
const plugin = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:router",
  enforce: "pre",
  async setup(nuxtApp) {
    let __temp, __restore;
    let routerBase = (/* @__PURE__ */ useRuntimeConfig()).app.baseURL;
    const history = routerOptions.history?.(routerBase) ?? createMemoryHistory(routerBase);
    const routes2 = routerOptions.routes ? ([__temp, __restore] = executeAsync(() => routerOptions.routes(_routes)), __temp = await __temp, __restore(), __temp) ?? _routes : _routes;
    let startPosition;
    const router = createRouter({
      ...routerOptions,
      scrollBehavior: (to, from, savedPosition) => {
        if (from === START_LOCATION) {
          startPosition = savedPosition;
          return;
        }
        if (routerOptions.scrollBehavior) {
          router.options.scrollBehavior = routerOptions.scrollBehavior;
          if ("scrollRestoration" in (void 0).history) {
            const unsub = router.beforeEach(() => {
              unsub();
              (void 0).history.scrollRestoration = "manual";
            });
          }
          return routerOptions.scrollBehavior(to, START_LOCATION, startPosition || savedPosition);
        }
      },
      history,
      routes: routes2
    });
    nuxtApp.vueApp.use(router);
    const previousRoute = shallowRef(router.currentRoute.value);
    router.afterEach((_to, from) => {
      previousRoute.value = from;
    });
    Object.defineProperty(nuxtApp.vueApp.config.globalProperties, "previousRoute", {
      get: () => previousRoute.value
    });
    const initialURL = nuxtApp.ssrContext.url;
    const _route = shallowRef(router.currentRoute.value);
    const syncCurrentRoute = () => {
      _route.value = router.currentRoute.value;
    };
    nuxtApp.hook("page:finish", syncCurrentRoute);
    router.afterEach((to, from) => {
      if (to.matched[to.matched.length - 1]?.components?.default === from.matched[from.matched.length - 1]?.components?.default) {
        syncCurrentRoute();
      }
    });
    const route = {};
    for (const key in _route.value) {
      Object.defineProperty(route, key, {
        get: () => _route.value[key],
        enumerable: true
      });
    }
    nuxtApp._route = shallowReactive(route);
    nuxtApp._middleware ||= {
      global: [],
      named: {}
    };
    if (!nuxtApp.ssrContext?.islandContext) {
      router.afterEach(async (to, _from, failure) => {
        delete nuxtApp._processingMiddleware;
        if (failure) {
          await nuxtApp.callHook("page:loading:end");
        }
        if (failure?.type === 4) {
          return;
        }
        if (to.redirectedFrom && to.fullPath !== initialURL) {
          await nuxtApp.runWithContext(() => navigateTo(to.fullPath || "/"));
        }
      });
    }
    try {
      if (true) {
        ;
        [__temp, __restore] = executeAsync(() => router.push(initialURL)), await __temp, __restore();
        ;
      }
      ;
      [__temp, __restore] = executeAsync(() => router.isReady()), await __temp, __restore();
      ;
    } catch (error2) {
      [__temp, __restore] = executeAsync(() => nuxtApp.runWithContext(() => showError(error2))), await __temp, __restore();
    }
    const resolvedInitialRoute = router.currentRoute.value;
    syncCurrentRoute();
    if (nuxtApp.ssrContext?.islandContext) {
      return { provide: { router } };
    }
    const initialLayout = nuxtApp.payload.state._layout;
    router.beforeEach(async (to, from) => {
      await nuxtApp.callHook("page:loading:start");
      to.meta = reactive(to.meta);
      if (nuxtApp.isHydrating && initialLayout && !isReadonly(to.meta.layout)) {
        to.meta.layout = initialLayout;
      }
      nuxtApp._processingMiddleware = true;
      if (!nuxtApp.ssrContext?.islandContext) {
        const middlewareEntries = /* @__PURE__ */ new Set([...globalMiddleware, ...nuxtApp._middleware.global]);
        for (const component of to.matched) {
          const componentMiddleware = component.meta.middleware;
          if (!componentMiddleware) {
            continue;
          }
          for (const entry2 of toArray(componentMiddleware)) {
            middlewareEntries.add(entry2);
          }
        }
        {
          const routeRules = await nuxtApp.runWithContext(() => getRouteRules({ path: to.path }));
          if (routeRules.appMiddleware) {
            for (const key in routeRules.appMiddleware) {
              if (routeRules.appMiddleware[key]) {
                middlewareEntries.add(key);
              } else {
                middlewareEntries.delete(key);
              }
            }
          }
        }
        for (const entry2 of middlewareEntries) {
          const middleware = typeof entry2 === "string" ? nuxtApp._middleware.named[entry2] || await namedMiddleware[entry2]?.().then((r) => r.default || r) : entry2;
          if (!middleware) {
            throw new Error(`Unknown route middleware: '${entry2}'.`);
          }
          try {
            if (false) ;
            const result = await nuxtApp.runWithContext(() => middleware(to, from));
            if (true) {
              if (result === false || result instanceof Error) {
                const error2 = result || createError({
                  statusCode: 404,
                  statusMessage: `Page Not Found: ${initialURL}`
                });
                await nuxtApp.runWithContext(() => showError(error2));
                return false;
              }
            }
            if (result === true) {
              continue;
            }
            if (result === false) {
              return result;
            }
            if (result) {
              if (isNuxtError(result) && result.fatal) {
                await nuxtApp.runWithContext(() => showError(result));
              }
              return result;
            }
          } catch (err) {
            const error2 = createError(err);
            if (error2.fatal) {
              await nuxtApp.runWithContext(() => showError(error2));
            }
            return error2;
          }
        }
      }
    });
    router.onError(async () => {
      delete nuxtApp._processingMiddleware;
      await nuxtApp.callHook("page:loading:end");
    });
    router.afterEach((to) => {
      if (to.matched.length === 0) {
        return nuxtApp.runWithContext(() => showError(createError({
          statusCode: 404,
          fatal: false,
          statusMessage: `Page not found: ${to.fullPath}`,
          data: {
            path: to.fullPath
          }
        })));
      }
    });
    nuxtApp.hooks.hookOnce("app:created", async () => {
      try {
        if ("name" in resolvedInitialRoute) {
          resolvedInitialRoute.name = void 0;
        }
        await router.replace({
          ...resolvedInitialRoute,
          force: true
        });
        router.options.scrollBehavior = routerOptions.scrollBehavior;
      } catch (error2) {
        await nuxtApp.runWithContext(() => showError(error2));
      }
    });
    return { provide: { router } };
  }
});
function injectHead(nuxtApp) {
  const nuxt = nuxtApp || useNuxtApp();
  return nuxt.ssrContext?.head || nuxt.runWithContext(() => {
    if (hasInjectionContext()) {
      const head = inject(headSymbol);
      if (!head) {
        throw new Error("[nuxt] [unhead] Missing Unhead instance.");
      }
      return head;
    }
  });
}
function useHead(input, options = {}) {
  const head = options.head || injectHead(options.nuxt);
  return useHead$1(input, { head, ...options });
}
function useSeoMeta(input, options = {}) {
  const head = options.head || injectHead(options.nuxt);
  return useSeoMeta$1(input, { head, ...options });
}
function definePayloadReducer(name, reduce) {
  {
    useNuxtApp().ssrContext._payloadReducers[name] = reduce;
  }
}
const reducers = [
  ["NuxtError", (data) => isNuxtError(data) && data.toJSON()],
  ["EmptyShallowRef", (data) => isRef(data) && isShallow(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_")],
  ["EmptyRef", (data) => isRef(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_")],
  ["ShallowRef", (data) => isRef(data) && isShallow(data) && data.value],
  ["ShallowReactive", (data) => isReactive(data) && isShallow(data) && toRaw(data)],
  ["Ref", (data) => isRef(data) && data.value],
  ["Reactive", (data) => isReactive(data) && toRaw(data)]
];
const revive_payload_server_MVtmlZaQpj6ApFmshWfUWl5PehCebzaBf2NuRMiIbms = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:revive-payload:server",
  setup() {
    for (const [reducer, fn] of reducers) {
      definePayloadReducer(reducer, fn);
    }
  }
});
const LazyProseADVue = defineAsyncComponent(() => import('./A.d.vue-BTDBFo2Y.mjs').then((r) => r["default"] || r.default || r));
const LazyProseA = defineAsyncComponent(() => import('./A-Dse4S1jk.mjs').then((r) => r["default"] || r.default || r));
const LazyProseAccordionDVue = defineAsyncComponent(() => import('./Accordion.d.vue-BTDBFo2Y.mjs').then((r) => r["default"] || r.default || r));
const LazyProseAccordion = defineAsyncComponent(() => import('./Accordion-DyugvGaS.mjs').then((r) => r["default"] || r.default || r));
const LazyProseAccordionItemDVue = defineAsyncComponent(() => import('./AccordionItem.d.vue-BTDBFo2Y.mjs').then((r) => r["default"] || r.default || r));
const LazyProseAccordionItem = defineAsyncComponent(() => import('./AccordionItem-B-gUAUYv.mjs').then((r) => r["default"] || r.default || r));
const LazyProseBadgeDVue = defineAsyncComponent(() => import('./Badge.d.vue-BTDBFo2Y.mjs').then((r) => r["default"] || r.default || r));
const LazyProseBadge = defineAsyncComponent(() => import('./Badge-DOIcGb1t.mjs').then((r) => r["default"] || r.default || r));
const LazyProseBlockquoteDVue = defineAsyncComponent(() => import('./Blockquote.d.vue-BTDBFo2Y.mjs').then((r) => r["default"] || r.default || r));
const LazyProseBlockquote = defineAsyncComponent(() => import('./Blockquote-BkSdWCz9.mjs').then((r) => r["default"] || r.default || r));
const LazyProseCalloutDVue = defineAsyncComponent(() => import('./Callout.d.vue-BTDBFo2Y.mjs').then((r) => r["default"] || r.default || r));
const LazyProseCallout = defineAsyncComponent(() => import('./Callout-DiD78EEi.mjs').then((r) => r["default"] || r.default || r));
const LazyProseCardDVue = defineAsyncComponent(() => import('./Card.d.vue-BTDBFo2Y.mjs').then((r) => r["default"] || r.default || r));
const LazyProseCard = defineAsyncComponent(() => import('./Card-CzEXUere.mjs').then((r) => r["default"] || r.default || r));
const LazyProseCardGroupDVue = defineAsyncComponent(() => import('./CardGroup.d.vue-BTDBFo2Y.mjs').then((r) => r["default"] || r.default || r));
const LazyProseCardGroup = defineAsyncComponent(() => import('./CardGroup-Zae-mv2b.mjs').then((r) => r["default"] || r.default || r));
const LazyProseCodeDVue = defineAsyncComponent(() => import('./Code.d.vue-BTDBFo2Y.mjs').then((r) => r["default"] || r.default || r));
const LazyProseCode = defineAsyncComponent(() => import('./Code-C6VX26mM.mjs').then((r) => r["default"] || r.default || r));
const LazyProseCodeCollapseDVue = defineAsyncComponent(() => import('./CodeCollapse.d.vue-BTDBFo2Y.mjs').then((r) => r["default"] || r.default || r));
const LazyProseCodeCollapse = defineAsyncComponent(() => import('./CodeCollapse-Cmj4jg28.mjs').then((r) => r["default"] || r.default || r));
const LazyProseCodeGroupDVue = defineAsyncComponent(() => import('./CodeGroup.d.vue-BTDBFo2Y.mjs').then((r) => r["default"] || r.default || r));
const LazyProseCodeGroup = defineAsyncComponent(() => import('./CodeGroup-Be1C8VL6.mjs').then((r) => r["default"] || r.default || r));
const LazyProseCodeIconDVue = defineAsyncComponent(() => import('./CodeIcon.d.vue-BTDBFo2Y.mjs').then((r) => r["default"] || r.default || r));
const LazyProseCodeIcon = defineAsyncComponent(() => import('./CodeIcon-B6B8OTty.mjs').then((r) => r["default"] || r.default || r));
const LazyProseCodePreviewDVue = defineAsyncComponent(() => import('./CodePreview.d.vue-BTDBFo2Y.mjs').then((r) => r["default"] || r.default || r));
const LazyProseCodePreview = defineAsyncComponent(() => import('./CodePreview-C_QhGtj7.mjs').then((r) => r["default"] || r.default || r));
const LazyProseCodeTreeDVue = defineAsyncComponent(() => import('./CodeTree.d.vue-BTDBFo2Y.mjs').then((r) => r["default"] || r.default || r));
const LazyProseCodeTree = defineAsyncComponent(() => import('./CodeTree-C8eibmaU.mjs').then((r) => r["default"] || r.default || r));
const LazyProseCollapsibleDVue = defineAsyncComponent(() => import('./Collapsible.d.vue-BTDBFo2Y.mjs').then((r) => r["default"] || r.default || r));
const LazyProseCollapsible = defineAsyncComponent(() => import('./Collapsible-BUj_cw2i.mjs').then((r) => r["default"] || r.default || r));
const LazyProseEmDVue = defineAsyncComponent(() => import('./Em.d.vue-BTDBFo2Y.mjs').then((r) => r["default"] || r.default || r));
const LazyProseEm = defineAsyncComponent(() => import('./Em-CNys1uBv.mjs').then((r) => r["default"] || r.default || r));
const LazyProseFieldDVue = defineAsyncComponent(() => import('./Field.d.vue-BTDBFo2Y.mjs').then((r) => r["default"] || r.default || r));
const LazyProseField = defineAsyncComponent(() => import('./Field-D68emE4A.mjs').then((r) => r["default"] || r.default || r));
const LazyProseFieldGroupDVue = defineAsyncComponent(() => import('./FieldGroup.d.vue-BTDBFo2Y.mjs').then((r) => r["default"] || r.default || r));
const LazyProseFieldGroup = defineAsyncComponent(() => import('./FieldGroup-C_F_6tm-.mjs').then((r) => r["default"] || r.default || r));
const LazyProseH1DVue = defineAsyncComponent(() => import('./H1.d.vue-BTDBFo2Y.mjs').then((r) => r["default"] || r.default || r));
const LazyProseH1 = defineAsyncComponent(() => import('./H1-DwLnvtRJ.mjs').then((r) => r["default"] || r.default || r));
const LazyProseH2DVue = defineAsyncComponent(() => import('./H2.d.vue-BTDBFo2Y.mjs').then((r) => r["default"] || r.default || r));
const LazyProseH2 = defineAsyncComponent(() => import('./H2-DaaUS3aB.mjs').then((r) => r["default"] || r.default || r));
const LazyProseH3DVue = defineAsyncComponent(() => import('./H3.d.vue-BTDBFo2Y.mjs').then((r) => r["default"] || r.default || r));
const LazyProseH3 = defineAsyncComponent(() => import('./H3-ZoDOaqDh.mjs').then((r) => r["default"] || r.default || r));
const LazyProseH4DVue = defineAsyncComponent(() => import('./H4.d.vue-BTDBFo2Y.mjs').then((r) => r["default"] || r.default || r));
const LazyProseH4 = defineAsyncComponent(() => import('./H4-1hZZ55-h.mjs').then((r) => r["default"] || r.default || r));
const LazyProseHrDVue = defineAsyncComponent(() => import('./Hr.d.vue-BTDBFo2Y.mjs').then((r) => r["default"] || r.default || r));
const LazyProseHr = defineAsyncComponent(() => import('./Hr-BMolx-AI.mjs').then((r) => r["default"] || r.default || r));
const LazyProseIconDVue = defineAsyncComponent(() => import('./Icon.d.vue-BTDBFo2Y.mjs').then((r) => r["default"] || r.default || r));
const LazyProseIcon = defineAsyncComponent(() => import('./Icon-Dht_X2FT.mjs').then((r) => r["default"] || r.default || r));
const LazyProseImgDVue = defineAsyncComponent(() => import('./Img.d.vue-BTDBFo2Y.mjs').then((r) => r["default"] || r.default || r));
const LazyProseImg = defineAsyncComponent(() => import('./Img-CDkoaWKk.mjs').then((r) => r["default"] || r.default || r));
const LazyProseKbdDVue = defineAsyncComponent(() => import('./Kbd.d.vue-BTDBFo2Y.mjs').then((r) => r["default"] || r.default || r));
const LazyProseKbd = defineAsyncComponent(() => import('./Kbd-C_EFE-DF.mjs').then((r) => r["default"] || r.default || r));
const LazyProseLiDVue = defineAsyncComponent(() => import('./Li.d.vue-BTDBFo2Y.mjs').then((r) => r["default"] || r.default || r));
const LazyProseLi = defineAsyncComponent(() => import('./Li-CTKy5vQW.mjs').then((r) => r["default"] || r.default || r));
const LazyProseOlDVue = defineAsyncComponent(() => import('./Ol.d.vue-BTDBFo2Y.mjs').then((r) => r["default"] || r.default || r));
const LazyProseOl = defineAsyncComponent(() => import('./Ol-BOh0pL1I.mjs').then((r) => r["default"] || r.default || r));
const LazyProsePDVue = defineAsyncComponent(() => import('./P.d.vue-BTDBFo2Y.mjs').then((r) => r["default"] || r.default || r));
const LazyProseP = defineAsyncComponent(() => import('./P-5D3CSvoq.mjs').then((r) => r["default"] || r.default || r));
const LazyProsePreDVue = defineAsyncComponent(() => import('./Pre.d.vue-BTDBFo2Y.mjs').then((r) => r["default"] || r.default || r));
const LazyProsePre = defineAsyncComponent(() => import('./Pre-Clmc78RZ.mjs').then((r) => r["default"] || r.default || r));
const LazyProseScriptDVue = defineAsyncComponent(() => import('./Script.d.vue-BTDBFo2Y.mjs').then((r) => r["default"] || r.default || r));
const LazyProseScript = defineAsyncComponent(() => import('./Script-BOX32BRp.mjs').then((r) => r["default"] || r.default || r));
const LazyProseStepsDVue = defineAsyncComponent(() => import('./Steps.d.vue-BTDBFo2Y.mjs').then((r) => r["default"] || r.default || r));
const LazyProseSteps = defineAsyncComponent(() => import('./Steps-B3mgMXlu.mjs').then((r) => r["default"] || r.default || r));
const LazyProseStrongDVue = defineAsyncComponent(() => import('./Strong.d.vue-BTDBFo2Y.mjs').then((r) => r["default"] || r.default || r));
const LazyProseStrong = defineAsyncComponent(() => import('./Strong-mqoSTGSH.mjs').then((r) => r["default"] || r.default || r));
const LazyProseTableDVue = defineAsyncComponent(() => import('./Table.d.vue-BTDBFo2Y.mjs').then((r) => r["default"] || r.default || r));
const LazyProseTable = defineAsyncComponent(() => import('./Table-CJ1scnyp.mjs').then((r) => r["default"] || r.default || r));
const LazyProseTabsDVue = defineAsyncComponent(() => import('./Tabs.d.vue-BTDBFo2Y.mjs').then((r) => r["default"] || r.default || r));
const LazyProseTabs = defineAsyncComponent(() => import('./Tabs-C6xKzkQJ.mjs').then((r) => r["default"] || r.default || r));
const LazyProseTabsItemDVue = defineAsyncComponent(() => import('./TabsItem.d.vue-BTDBFo2Y.mjs').then((r) => r["default"] || r.default || r));
const LazyProseTabsItem = defineAsyncComponent(() => import('./TabsItem-Symr1cDI.mjs').then((r) => r["default"] || r.default || r));
const LazyProseTbodyDVue = defineAsyncComponent(() => import('./Tbody.d.vue-BTDBFo2Y.mjs').then((r) => r["default"] || r.default || r));
const LazyProseTbody = defineAsyncComponent(() => import('./Tbody-BYeb99q8.mjs').then((r) => r["default"] || r.default || r));
const LazyProseTdDVue = defineAsyncComponent(() => import('./Td.d.vue-BTDBFo2Y.mjs').then((r) => r["default"] || r.default || r));
const LazyProseTd = defineAsyncComponent(() => import('./Td-Cugj16rc.mjs').then((r) => r["default"] || r.default || r));
const LazyProseThDVue = defineAsyncComponent(() => import('./Th.d.vue-BTDBFo2Y.mjs').then((r) => r["default"] || r.default || r));
const LazyProseTh = defineAsyncComponent(() => import('./Th-NmT6wwuT.mjs').then((r) => r["default"] || r.default || r));
const LazyProseTheadDVue = defineAsyncComponent(() => import('./Thead.d.vue-BTDBFo2Y.mjs').then((r) => r["default"] || r.default || r));
const LazyProseThead = defineAsyncComponent(() => import('./Thead-Dur1pHvm.mjs').then((r) => r["default"] || r.default || r));
const LazyProseTrDVue = defineAsyncComponent(() => import('./Tr.d.vue-BTDBFo2Y.mjs').then((r) => r["default"] || r.default || r));
const LazyProseTr = defineAsyncComponent(() => import('./Tr-CpMMW5WH.mjs').then((r) => r["default"] || r.default || r));
const LazyProseUlDVue = defineAsyncComponent(() => import('./Ul.d.vue-BTDBFo2Y.mjs').then((r) => r["default"] || r.default || r));
const LazyProseUl = defineAsyncComponent(() => import('./Ul-B17-_1F0.mjs').then((r) => r["default"] || r.default || r));
const LazyProseCautionDVue = defineAsyncComponent(() => import('./Caution.d.vue-BTDBFo2Y.mjs').then((r) => r["default"] || r.default || r));
const LazyProseCaution = defineAsyncComponent(() => import('./Caution-9CgIeiIx.mjs').then((r) => r["default"] || r.default || r));
const LazyProseNoteDVue = defineAsyncComponent(() => import('./Note.d.vue-BTDBFo2Y.mjs').then((r) => r["default"] || r.default || r));
const LazyProseNote = defineAsyncComponent(() => import('./Note-Cva_Ow1H.mjs').then((r) => r["default"] || r.default || r));
const LazyProseTipDVue = defineAsyncComponent(() => import('./Tip.d.vue-BTDBFo2Y.mjs').then((r) => r["default"] || r.default || r));
const LazyProseTip = defineAsyncComponent(() => import('./Tip-DNOooGHk.mjs').then((r) => r["default"] || r.default || r));
const LazyProseWarningDVue = defineAsyncComponent(() => import('./Warning.d.vue-BTDBFo2Y.mjs').then((r) => r["default"] || r.default || r));
const LazyProseWarning = defineAsyncComponent(() => import('./Warning-Cg-qfdiQ.mjs').then((r) => r["default"] || r.default || r));
const LazyProseH5 = defineAsyncComponent(() => import('./ProseH5-5hDGxLk6.mjs').then((r) => r["default"] || r.default || r));
const LazyProseH6 = defineAsyncComponent(() => import('./ProseH6-B7Rsed3O.mjs').then((r) => r["default"] || r.default || r));
const LazyIcon = defineAsyncComponent(() => import('./index-CxURNttY.mjs').then((r) => r["default"] || r.default || r));
const lazyGlobalComponents = [
  ["ProseADVue", LazyProseADVue],
  ["ProseA", LazyProseA],
  ["ProseAccordionDVue", LazyProseAccordionDVue],
  ["ProseAccordion", LazyProseAccordion],
  ["ProseAccordionItemDVue", LazyProseAccordionItemDVue],
  ["ProseAccordionItem", LazyProseAccordionItem],
  ["ProseBadgeDVue", LazyProseBadgeDVue],
  ["ProseBadge", LazyProseBadge],
  ["ProseBlockquoteDVue", LazyProseBlockquoteDVue],
  ["ProseBlockquote", LazyProseBlockquote],
  ["ProseCalloutDVue", LazyProseCalloutDVue],
  ["ProseCallout", LazyProseCallout],
  ["ProseCardDVue", LazyProseCardDVue],
  ["ProseCard", LazyProseCard],
  ["ProseCardGroupDVue", LazyProseCardGroupDVue],
  ["ProseCardGroup", LazyProseCardGroup],
  ["ProseCodeDVue", LazyProseCodeDVue],
  ["ProseCode", LazyProseCode],
  ["ProseCodeCollapseDVue", LazyProseCodeCollapseDVue],
  ["ProseCodeCollapse", LazyProseCodeCollapse],
  ["ProseCodeGroupDVue", LazyProseCodeGroupDVue],
  ["ProseCodeGroup", LazyProseCodeGroup],
  ["ProseCodeIconDVue", LazyProseCodeIconDVue],
  ["ProseCodeIcon", LazyProseCodeIcon],
  ["ProseCodePreviewDVue", LazyProseCodePreviewDVue],
  ["ProseCodePreview", LazyProseCodePreview],
  ["ProseCodeTreeDVue", LazyProseCodeTreeDVue],
  ["ProseCodeTree", LazyProseCodeTree],
  ["ProseCollapsibleDVue", LazyProseCollapsibleDVue],
  ["ProseCollapsible", LazyProseCollapsible],
  ["ProseEmDVue", LazyProseEmDVue],
  ["ProseEm", LazyProseEm],
  ["ProseFieldDVue", LazyProseFieldDVue],
  ["ProseField", LazyProseField],
  ["ProseFieldGroupDVue", LazyProseFieldGroupDVue],
  ["ProseFieldGroup", LazyProseFieldGroup],
  ["ProseH1DVue", LazyProseH1DVue],
  ["ProseH1", LazyProseH1],
  ["ProseH2DVue", LazyProseH2DVue],
  ["ProseH2", LazyProseH2],
  ["ProseH3DVue", LazyProseH3DVue],
  ["ProseH3", LazyProseH3],
  ["ProseH4DVue", LazyProseH4DVue],
  ["ProseH4", LazyProseH4],
  ["ProseHrDVue", LazyProseHrDVue],
  ["ProseHr", LazyProseHr],
  ["ProseIconDVue", LazyProseIconDVue],
  ["ProseIcon", LazyProseIcon],
  ["ProseImgDVue", LazyProseImgDVue],
  ["ProseImg", LazyProseImg],
  ["ProseKbdDVue", LazyProseKbdDVue],
  ["ProseKbd", LazyProseKbd],
  ["ProseLiDVue", LazyProseLiDVue],
  ["ProseLi", LazyProseLi],
  ["ProseOlDVue", LazyProseOlDVue],
  ["ProseOl", LazyProseOl],
  ["ProsePDVue", LazyProsePDVue],
  ["ProseP", LazyProseP],
  ["ProsePreDVue", LazyProsePreDVue],
  ["ProsePre", LazyProsePre],
  ["ProseScriptDVue", LazyProseScriptDVue],
  ["ProseScript", LazyProseScript],
  ["ProseStepsDVue", LazyProseStepsDVue],
  ["ProseSteps", LazyProseSteps],
  ["ProseStrongDVue", LazyProseStrongDVue],
  ["ProseStrong", LazyProseStrong],
  ["ProseTableDVue", LazyProseTableDVue],
  ["ProseTable", LazyProseTable],
  ["ProseTabsDVue", LazyProseTabsDVue],
  ["ProseTabs", LazyProseTabs],
  ["ProseTabsItemDVue", LazyProseTabsItemDVue],
  ["ProseTabsItem", LazyProseTabsItem],
  ["ProseTbodyDVue", LazyProseTbodyDVue],
  ["ProseTbody", LazyProseTbody],
  ["ProseTdDVue", LazyProseTdDVue],
  ["ProseTd", LazyProseTd],
  ["ProseThDVue", LazyProseThDVue],
  ["ProseTh", LazyProseTh],
  ["ProseTheadDVue", LazyProseTheadDVue],
  ["ProseThead", LazyProseThead],
  ["ProseTrDVue", LazyProseTrDVue],
  ["ProseTr", LazyProseTr],
  ["ProseUlDVue", LazyProseUlDVue],
  ["ProseUl", LazyProseUl],
  ["ProseCautionDVue", LazyProseCautionDVue],
  ["ProseCaution", LazyProseCaution],
  ["ProseNoteDVue", LazyProseNoteDVue],
  ["ProseNote", LazyProseNote],
  ["ProseTipDVue", LazyProseTipDVue],
  ["ProseTip", LazyProseTip],
  ["ProseWarningDVue", LazyProseWarningDVue],
  ["ProseWarning", LazyProseWarning],
  ["ProseH5", LazyProseH5],
  ["ProseH6", LazyProseH6],
  ["Icon", LazyIcon]
];
const components_plugin_4kY4pyzJIYX99vmMAAIorFf3CnAaptHitJgf7JxiED8 = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:global-components",
  setup(nuxtApp) {
    for (const [name, component] of lazyGlobalComponents) {
      nuxtApp.vueApp.component(name, component);
      nuxtApp.vueApp.component("Lazy" + name, component);
    }
  }
});
const dns_server_Ra8_F2GzcZ5EnW5bwpxFMZpu4rhlHsG_fCXvvBlwjzU = /* @__PURE__ */ defineNuxtPlugin({
  parallel: true,
  async setup() {
  }
});
function useRequestEvent(nuxtApp) {
  nuxtApp ||= useNuxtApp();
  return nuxtApp.ssrContext?.event;
}
const CookieDefaults = {
  path: "/",
  watch: true,
  decode: (val) => destr(decodeURIComponent(val)),
  encode: (val) => encodeURIComponent(typeof val === "string" ? val : JSON.stringify(val))
};
function useCookie(name, _opts) {
  const opts = { ...CookieDefaults, ..._opts };
  opts.filter ??= (key) => key === name;
  const cookies = readRawCookies(opts) || {};
  let delay;
  if (opts.maxAge !== void 0) {
    delay = opts.maxAge * 1e3;
  } else if (opts.expires) {
    delay = opts.expires.getTime() - Date.now();
  }
  const hasExpired = delay !== void 0 && delay <= 0;
  const cookieValue = klona(hasExpired ? void 0 : cookies[name] ?? opts.default?.());
  const cookie = ref(cookieValue);
  {
    const nuxtApp = useNuxtApp();
    const writeFinalCookieValue = () => {
      if (opts.readonly || isEqual(cookie.value, cookies[name])) {
        return;
      }
      nuxtApp._cookies ||= {};
      if (name in nuxtApp._cookies) {
        if (isEqual(cookie.value, nuxtApp._cookies[name])) {
          return;
        }
      }
      nuxtApp._cookies[name] = cookie.value;
      writeServerCookie(useRequestEvent(nuxtApp), name, cookie.value, opts);
    };
    const unhook = nuxtApp.hooks.hookOnce("app:rendered", writeFinalCookieValue);
    nuxtApp.hooks.hookOnce("app:error", () => {
      unhook();
      return writeFinalCookieValue();
    });
  }
  return cookie;
}
function readRawCookies(opts = {}) {
  {
    return parse(getRequestHeader(useRequestEvent(), "cookie") || "", opts);
  }
}
function writeServerCookie(event, name, value, opts = {}) {
  if (event) {
    if (value !== null && value !== void 0) {
      return setCookie(event, name, value, opts);
    }
    if (getCookie(event, name) !== void 0) {
      return deleteCookie(event, name, opts);
    }
  }
}
const useStrapiToken = () => {
  const nuxt = useNuxtApp();
  const config = /* @__PURE__ */ useRuntimeConfig();
  nuxt._cookies = nuxt._cookies || {};
  if (nuxt._cookies[config.strapi.cookieName]) {
    return nuxt._cookies[config.strapi.cookieName];
  }
  const cookie = useCookie(config.strapi.cookieName, config.strapi.cookie);
  nuxt._cookies[config.strapi.cookieName] = cookie;
  if (!cookie.value && config.strapi.token) {
    return ref(config.strapi.token);
  }
  return cookie;
};
const useStateKeyPrefix = "$s";
function useState(...args) {
  const autoKey = typeof args[args.length - 1] === "string" ? args.pop() : void 0;
  if (typeof args[0] !== "string") {
    args.unshift(autoKey);
  }
  const [_key, init] = args;
  if (!_key || typeof _key !== "string") {
    throw new TypeError("[nuxt] [useState] key must be a string: " + _key);
  }
  if (init !== void 0 && typeof init !== "function") {
    throw new Error("[nuxt] [useState] init must be a function: " + init);
  }
  const key = useStateKeyPrefix + _key;
  const nuxtApp = useNuxtApp();
  const state = toRef(nuxtApp.payload.state, key);
  if (state.value === void 0 && init) {
    const initialValue = init();
    if (isRef(initialValue)) {
      nuxtApp.payload.state[key] = initialValue;
      return initialValue;
    }
    state.value = initialValue;
  }
  return state;
}
const useStrapiUser = () => useState("strapi_user");
const useStrapiUrl = () => {
  const config = /* @__PURE__ */ useRuntimeConfig();
  const version = config.strapi.version;
  return version === "v3" ? config.strapi.url : `${config.strapi.url}${config.strapi.prefix}`;
};
const useStrapiVersion = () => {
  const config = /* @__PURE__ */ useRuntimeConfig();
  return config.strapi.version;
};
const defaultErrors = (err) => ({
  v4: {
    error: {
      status: 500,
      name: "UnknownError",
      message: err.message,
      details: err
    }
  },
  v3: {
    error: "UnknownError",
    message: err.message,
    statusCode: 500
  }
});
const useStrapiClient = () => {
  const nuxt = useNuxtApp();
  const baseURL2 = useStrapiUrl();
  const version = useStrapiVersion();
  const token = useStrapiToken();
  return async (url, fetchOptions = {}) => {
    const headers = {};
    if (token && token.value) {
      headers.Authorization = `Bearer ${token.value}`;
    }
    if (fetchOptions.params) {
      const params = stringify(fetchOptions.params, { encodeValuesOnly: true });
      if (params) {
        url = `${url}?${params}`;
      }
      delete fetchOptions.params;
    }
    try {
      return await $fetch(url, {
        retry: 0,
        baseURL: baseURL2,
        ...fetchOptions,
        headers: {
          ...headers,
          ...fetchOptions.headers
        }
      });
    } catch (err) {
      const e = err.data || defaultErrors(err)[version];
      nuxt.hooks.callHook("strapi:error", e);
      throw e;
    }
  };
};
const useStrapiAuth = () => {
  const url = useStrapiUrl();
  const token = useStrapiToken();
  const user = useStrapiUser();
  const client = useStrapiClient();
  const config = /* @__PURE__ */ useRuntimeConfig();
  const setToken = (value) => {
    token.value = value;
  };
  const setUser = (value) => {
    user.value = value;
  };
  const fetchUser = async () => {
    if (token.value) {
      try {
        user.value = await client("/users/me", { params: config.strapi.auth });
      } catch {
        setToken(null);
      }
    }
    return user;
  };
  const login = async (data) => {
    setToken(null);
    const { jwt } = await client("/auth/local", { method: "POST", body: data });
    setToken(jwt);
    const user2 = await fetchUser();
    return {
      user: user2,
      jwt
    };
  };
  const logout = () => {
    setToken(null);
    setUser(null);
  };
  const register = async (data) => {
    setToken(null);
    const { jwt } = await client("/auth/local/register", { method: "POST", body: data });
    setToken(jwt);
    const user2 = await fetchUser();
    return {
      user: user2,
      jwt
    };
  };
  const forgotPassword = async (data) => {
    setToken(null);
    await client("/auth/forgot-password", { method: "POST", body: data });
  };
  const resetPassword = async (data) => {
    setToken(null);
    const { jwt } = await client("/auth/reset-password", { method: "POST", body: data });
    setToken(jwt);
    const user2 = await fetchUser();
    return {
      user: user2,
      jwt
    };
  };
  const changePassword = async (data) => {
    await client("/auth/change-password", { method: "POST", body: data });
  };
  const sendEmailConfirmation = async (data) => {
    await client("/auth/send-email-confirmation", { method: "POST", body: data });
  };
  const getProviderAuthenticationUrl = (provider) => {
    return `${url}/connect/${provider}`;
  };
  const authenticateProvider = async (provider, access_token) => {
    setToken(null);
    const { jwt } = await client(`/auth/${provider}/callback`, { method: "GET", params: { access_token } });
    setToken(jwt);
    const user2 = await fetchUser();
    return {
      user: user2,
      jwt
    };
  };
  return {
    setToken,
    setUser,
    fetchUser,
    login,
    logout,
    register,
    forgotPassword,
    resetPassword,
    changePassword,
    sendEmailConfirmation,
    getProviderAuthenticationUrl,
    authenticateProvider
  };
};
const strapi_sKhLINQNdwt_mhHLPJB0LMn9ASgy8vLNsKSmAAgEZsg = /* @__PURE__ */ defineNuxtPlugin(async () => {
  let __temp, __restore;
  const user = useStrapiUser();
  if (!user.value) {
    const { fetchUser } = useStrapiAuth();
    [__temp, __restore] = executeAsync(() => fetchUser()), await __temp, __restore();
  }
});
const inlineConfig = {
  "nuxt": {},
  "ui": {
    "colors": {
      "primary": "green",
      "secondary": "blue",
      "success": "green",
      "info": "blue",
      "warning": "yellow",
      "error": "red",
      "neutral": "slate"
    },
    "icons": {
      "arrowDown": "i-lucide-arrow-down",
      "arrowLeft": "i-lucide-arrow-left",
      "arrowRight": "i-lucide-arrow-right",
      "arrowUp": "i-lucide-arrow-up",
      "caution": "i-lucide-circle-alert",
      "check": "i-lucide-check",
      "chevronDoubleLeft": "i-lucide-chevrons-left",
      "chevronDoubleRight": "i-lucide-chevrons-right",
      "chevronDown": "i-lucide-chevron-down",
      "chevronLeft": "i-lucide-chevron-left",
      "chevronRight": "i-lucide-chevron-right",
      "chevronUp": "i-lucide-chevron-up",
      "close": "i-lucide-x",
      "copy": "i-lucide-copy",
      "copyCheck": "i-lucide-copy-check",
      "dark": "i-lucide-moon",
      "ellipsis": "i-lucide-ellipsis",
      "error": "i-lucide-circle-x",
      "external": "i-lucide-arrow-up-right",
      "eye": "i-lucide-eye",
      "eyeOff": "i-lucide-eye-off",
      "file": "i-lucide-file",
      "folder": "i-lucide-folder",
      "folderOpen": "i-lucide-folder-open",
      "hash": "i-lucide-hash",
      "info": "i-lucide-info",
      "light": "i-lucide-sun",
      "loading": "i-lucide-loader-circle",
      "menu": "i-lucide-menu",
      "minus": "i-lucide-minus",
      "panelClose": "i-lucide-panel-left-close",
      "panelOpen": "i-lucide-panel-left-open",
      "plus": "i-lucide-plus",
      "reload": "i-lucide-rotate-ccw",
      "search": "i-lucide-search",
      "stop": "i-lucide-square",
      "success": "i-lucide-circle-check",
      "system": "i-lucide-monitor",
      "tip": "i-lucide-lightbulb",
      "upload": "i-lucide-upload",
      "warning": "i-lucide-triangle-alert"
    },
    "tv": {
      "twMergeConfig": {}
    }
  },
  "icon": {
    "provider": "server",
    "class": "",
    "aliases": {},
    "iconifyApiEndpoint": "https://api.iconify.design",
    "localApiEndpoint": "/api/_nuxt_icon",
    "fallbackToApi": true,
    "cssSelectorPrefix": "i-",
    "cssWherePseudo": true,
    "cssLayer": "components",
    "mode": "css",
    "attrs": {
      "aria-hidden": true
    },
    "collections": [
      "academicons",
      "akar-icons",
      "ant-design",
      "arcticons",
      "basil",
      "bi",
      "bitcoin-icons",
      "bpmn",
      "brandico",
      "bx",
      "bxl",
      "bxs",
      "bytesize",
      "carbon",
      "catppuccin",
      "cbi",
      "charm",
      "ci",
      "cib",
      "cif",
      "cil",
      "circle-flags",
      "circum",
      "clarity",
      "codicon",
      "covid",
      "cryptocurrency",
      "cryptocurrency-color",
      "dashicons",
      "devicon",
      "devicon-plain",
      "ei",
      "el",
      "emojione",
      "emojione-monotone",
      "emojione-v1",
      "entypo",
      "entypo-social",
      "eos-icons",
      "ep",
      "et",
      "eva",
      "f7",
      "fa",
      "fa-brands",
      "fa-regular",
      "fa-solid",
      "fa6-brands",
      "fa6-regular",
      "fa6-solid",
      "fad",
      "fe",
      "feather",
      "file-icons",
      "flag",
      "flagpack",
      "flat-color-icons",
      "flat-ui",
      "flowbite",
      "fluent",
      "fluent-emoji",
      "fluent-emoji-flat",
      "fluent-emoji-high-contrast",
      "fluent-mdl2",
      "fontelico",
      "fontisto",
      "formkit",
      "foundation",
      "fxemoji",
      "gala",
      "game-icons",
      "geo",
      "gg",
      "gis",
      "gravity-ui",
      "gridicons",
      "grommet-icons",
      "guidance",
      "healthicons",
      "heroicons",
      "heroicons-outline",
      "heroicons-solid",
      "hugeicons",
      "humbleicons",
      "ic",
      "icomoon-free",
      "icon-park",
      "icon-park-outline",
      "icon-park-solid",
      "icon-park-twotone",
      "iconamoon",
      "iconoir",
      "icons8",
      "il",
      "ion",
      "iwwa",
      "jam",
      "la",
      "lets-icons",
      "line-md",
      "logos",
      "ls",
      "lucide",
      "lucide-lab",
      "mage",
      "majesticons",
      "maki",
      "map",
      "marketeq",
      "material-symbols",
      "material-symbols-light",
      "mdi",
      "mdi-light",
      "medical-icon",
      "memory",
      "meteocons",
      "mi",
      "mingcute",
      "mono-icons",
      "mynaui",
      "nimbus",
      "nonicons",
      "noto",
      "noto-v1",
      "octicon",
      "oi",
      "ooui",
      "openmoji",
      "oui",
      "pajamas",
      "pepicons",
      "pepicons-pencil",
      "pepicons-pop",
      "pepicons-print",
      "ph",
      "pixelarticons",
      "prime",
      "ps",
      "quill",
      "radix-icons",
      "raphael",
      "ri",
      "rivet-icons",
      "si-glyph",
      "simple-icons",
      "simple-line-icons",
      "skill-icons",
      "solar",
      "streamline",
      "streamline-emojis",
      "subway",
      "svg-spinners",
      "system-uicons",
      "tabler",
      "tdesign",
      "teenyicons",
      "token",
      "token-branded",
      "topcoat",
      "twemoji",
      "typcn",
      "uil",
      "uim",
      "uis",
      "uit",
      "uiw",
      "unjs",
      "vaadin",
      "vs",
      "vscode-icons",
      "websymbol",
      "weui",
      "whh",
      "wi",
      "wpf",
      "zmdi",
      "zondicons"
    ],
    "fetchTimeout": 1500
  }
};
const appConfig = /* @__PURE__ */ defuFn(inlineConfig);
function useAppConfig() {
  const nuxtApp = useNuxtApp();
  nuxtApp._appConfig ||= klona(appConfig);
  return nuxtApp._appConfig;
}
const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
function getColor(color, shade) {
  if (color in colors && typeof colors[color] === "object" && shade in colors[color]) {
    return colors[color][shade];
  }
  return "";
}
function generateShades(key, value, prefix) {
  const prefixStr = prefix ? `${prefix}-` : "";
  return `${shades.map((shade) => `--ui-color-${key}-${shade}: var(--${prefixStr}color-${value === "neutral" ? "old-neutral" : value}-${shade}, ${getColor(value, shade)});`).join("\n  ")}`;
}
function generateColor(key, shade) {
  return `--ui-${key}: var(--ui-color-${key}-${shade});`;
}
const colors_E7kSti5pGZ28QhUUurq6gGRU3l65WuXO_KJC3GQgzFo = /* @__PURE__ */ defineNuxtPlugin(() => {
  const appConfig2 = useAppConfig();
  useNuxtApp();
  const root = computed(() => {
    const { neutral, ...colors2 } = appConfig2.ui.colors;
    const prefix = appConfig2.ui.prefix;
    return `@layer theme {
  :root, :host {
  ${Object.entries(appConfig2.ui.colors).map(([key, value]) => generateShades(key, value, prefix)).join("\n  ")}
  }
  :root, :host, .light {
  ${Object.keys(colors2).map((key) => generateColor(key, 500)).join("\n  ")}
  }
  .dark {
  ${Object.keys(colors2).map((key) => generateColor(key, 400)).join("\n  ")}
  }
}`;
  });
  const headData = {
    style: [{
      innerHTML: () => root.value,
      tagPriority: -2,
      id: "nuxt-ui-colors"
    }]
  };
  useHead(headData);
});
const preference = "light";
const plugin_server_9Ca9_HhnjAGwBWpwAydRauMHxWoxTDY60BrArRnXN_A = /* @__PURE__ */ defineNuxtPlugin((nuxtApp) => {
  const colorMode = nuxtApp.ssrContext?.islandContext ? ref({}) : useState("color-mode", () => reactive({
    preference,
    value: preference,
    unknown: true,
    forced: false
  })).value;
  const htmlAttrs = {};
  {
    useHead({ htmlAttrs });
  }
  useRouter().afterEach((to) => {
    const forcedColorMode = to.meta.colorMode;
    if (forcedColorMode && forcedColorMode !== "system") {
      colorMode.value = htmlAttrs["data-color-mode-forced"] = forcedColorMode;
      colorMode.forced = true;
    } else if (forcedColorMode === "system") {
      console.warn("You cannot force the colorMode to system at the page level.");
    }
  });
  nuxtApp.provide("colorMode", colorMode);
});
const plugin_MeUvTuoKUi51yb_kBguab6hdcExVXeTtZtTg9TZZBB8 = /* @__PURE__ */ defineNuxtPlugin({
  name: "@nuxt/icon",
  setup() {
    const configs = /* @__PURE__ */ useRuntimeConfig();
    const options = useAppConfig().icon;
    _api.setFetch($fetch.native);
    const resources = [];
    if (options.provider === "server") {
      const baseURL2 = configs.app?.baseURL?.replace(/\/$/, "") ?? "";
      resources.push(baseURL2 + (options.localApiEndpoint || "/api/_nuxt_icon"));
      if (options.fallbackToApi === true || options.fallbackToApi === "client-only") {
        resources.push(options.iconifyApiEndpoint);
      }
    } else if (options.provider === "none") {
      _api.setFetch(() => Promise.resolve(new Response()));
    } else {
      resources.push(options.iconifyApiEndpoint);
    }
    async function customIconLoader(icons, prefix) {
      try {
        const data = await $fetch(resources[0] + "/" + prefix + ".json", {
          query: {
            icons: icons.join(",")
          }
        });
        if (!data || data.prefix !== prefix || !data.icons)
          throw new Error("Invalid data" + JSON.stringify(data));
        return data;
      } catch (e) {
        console.error("Failed to load custom icons", e);
        return null;
      }
    }
    addAPIProvider("", { resources });
    for (const prefix of options.customCollections || []) {
      if (prefix)
        setCustomIconsLoader(customIconLoader, prefix);
    }
  }
  // For type portability
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
});
const prerender_server_sqIxOBipVr4FbVMA9kqWL0wT8FPop6sKAXLVfifsJzk = /* @__PURE__ */ defineNuxtPlugin(async () => {
  {
    return;
  }
});
const plugins = [
  unhead_k2P3m_ZDyjlr2mMYnoDPwavjsDN8hBlk9cFai0bbopU,
  plugin,
  revive_payload_server_MVtmlZaQpj6ApFmshWfUWl5PehCebzaBf2NuRMiIbms,
  components_plugin_4kY4pyzJIYX99vmMAAIorFf3CnAaptHitJgf7JxiED8,
  dns_server_Ra8_F2GzcZ5EnW5bwpxFMZpu4rhlHsG_fCXvvBlwjzU,
  strapi_sKhLINQNdwt_mhHLPJB0LMn9ASgy8vLNsKSmAAgEZsg,
  colors_E7kSti5pGZ28QhUUurq6gGRU3l65WuXO_KJC3GQgzFo,
  plugin_server_9Ca9_HhnjAGwBWpwAydRauMHxWoxTDY60BrArRnXN_A,
  plugin_MeUvTuoKUi51yb_kBguab6hdcExVXeTtZtTg9TZZBB8,
  prerender_server_sqIxOBipVr4FbVMA9kqWL0wT8FPop6sKAXLVfifsJzk
];
const ServerPlaceholder = defineComponent({
  name: "ServerPlaceholder",
  render() {
    return createElementBlock("div");
  }
});
const layouts = {
  default: defineAsyncComponent(() => import('./default-B1GhrPud.mjs').then((m) => m.default || m))
};
const LayoutLoader = defineComponent({
  name: "LayoutLoader",
  inheritAttrs: false,
  props: {
    name: String,
    layoutProps: Object
  },
  setup(props, context) {
    return () => h(layouts[props.name], props.layoutProps, context.slots);
  }
});
const nuxtLayoutProps = {
  name: {
    type: [String, Boolean, Object],
    default: null
  },
  fallback: {
    type: [String, Object],
    default: null
  }
};
const __nuxt_component_1 = defineComponent({
  name: "NuxtLayout",
  inheritAttrs: false,
  props: nuxtLayoutProps,
  setup(props, context) {
    const nuxtApp = useNuxtApp();
    const injectedRoute = inject(PageRouteSymbol);
    const shouldUseEagerRoute = !injectedRoute || injectedRoute === useRoute();
    const route = shouldUseEagerRoute ? useRoute$1() : injectedRoute;
    const layout = computed(() => {
      let layout2 = unref(props.name) ?? route?.meta.layout ?? "default";
      if (layout2 && !(layout2 in layouts)) {
        if (props.fallback) {
          layout2 = unref(props.fallback);
        }
      }
      return layout2;
    });
    const layoutRef = shallowRef();
    context.expose({ layoutRef });
    const done = nuxtApp.deferHydration();
    let lastLayout;
    return () => {
      const hasLayout = layout.value && layout.value in layouts;
      const transitionProps = route?.meta.layoutTransition ?? appLayoutTransition;
      const previouslyRenderedLayout = lastLayout;
      lastLayout = layout.value;
      return _wrapInTransition(hasLayout && transitionProps, {
        default: () => h(Suspense, { suspensible: true, onResolve: () => {
          nextTick(done);
        } }, {
          default: () => h(
            LayoutProvider,
            {
              layoutProps: mergeProps(context.attrs, { ref: layoutRef }),
              key: layout.value || void 0,
              name: layout.value,
              shouldProvide: !props.name,
              isRenderingNewLayout: (name) => {
                return name !== previouslyRenderedLayout && name === layout.value;
              },
              hasTransition: !!transitionProps
            },
            context.slots
          )
        })
      }).default();
    };
  }
});
const LayoutProvider = defineComponent({
  name: "NuxtLayoutProvider",
  inheritAttrs: false,
  props: {
    name: {
      type: [String, Boolean]
    },
    layoutProps: {
      type: Object
    },
    hasTransition: {
      type: Boolean
    },
    shouldProvide: {
      type: Boolean
    },
    isRenderingNewLayout: {
      type: Function,
      required: true
    }
  },
  setup(props, context) {
    const name = props.name;
    if (props.shouldProvide) {
      provide(LayoutMetaSymbol, {
        isCurrent: (route) => name === (route.meta.layout ?? "default")
      });
    }
    const injectedRoute = inject(PageRouteSymbol);
    const isNotWithinNuxtPage = injectedRoute && injectedRoute === useRoute();
    if (isNotWithinNuxtPage) {
      const vueRouterRoute = useRoute$1();
      const reactiveChildRoute = {};
      for (const _key in vueRouterRoute) {
        const key = _key;
        Object.defineProperty(reactiveChildRoute, key, {
          enumerable: true,
          get: () => {
            return props.isRenderingNewLayout(props.name) ? vueRouterRoute[key] : injectedRoute[key];
          }
        });
      }
      provide(PageRouteSymbol, shallowReactive(reactiveChildRoute));
    }
    return () => {
      if (!name || typeof name === "string" && !(name in layouts)) {
        return context.slots.default?.();
      }
      return h(
        LayoutLoader,
        { key: name, layoutProps: props.layoutProps, name },
        context.slots
      );
    };
  }
});
const defineRouteProvider = (name = "RouteProvider") => defineComponent({
  name,
  props: {
    route: {
      type: Object,
      required: true
    },
    vnode: Object,
    vnodeRef: Object,
    renderKey: String,
    trackRootNodes: Boolean
  },
  setup(props) {
    const previousKey = props.renderKey;
    const previousRoute = props.route;
    const route = {};
    for (const key in props.route) {
      Object.defineProperty(route, key, {
        get: () => previousKey === props.renderKey ? props.route[key] : previousRoute[key],
        enumerable: true
      });
    }
    provide(PageRouteSymbol, shallowReactive(route));
    return () => {
      if (!props.vnode) {
        return props.vnode;
      }
      return h(props.vnode, { ref: props.vnodeRef });
    };
  }
});
const RouteProvider = defineRouteProvider();
const __nuxt_component_2 = defineComponent({
  name: "NuxtPage",
  inheritAttrs: false,
  props: {
    name: {
      type: String
    },
    transition: {
      type: [Boolean, Object],
      default: void 0
    },
    keepalive: {
      type: [Boolean, Object],
      default: void 0
    },
    route: {
      type: Object
    },
    pageKey: {
      type: [Function, String],
      default: null
    }
  },
  setup(props, { attrs, slots, expose }) {
    const nuxtApp = useNuxtApp();
    const pageRef = ref();
    inject(PageRouteSymbol, null);
    expose({ pageRef });
    inject(LayoutMetaSymbol, null);
    nuxtApp.deferHydration();
    return () => {
      return h(RouterView, { name: props.name, route: props.route, ...attrs }, {
        default: (routeProps) => {
          return h(Suspense, { suspensible: true }, {
            default() {
              return h(RouteProvider, {
                vnode: slots.default ? normalizeSlot(slots.default, routeProps) : routeProps.Component,
                route: routeProps.route,
                vnodeRef: pageRef
              });
            }
          });
        }
      });
    };
  }
});
function normalizeSlot(slot, data) {
  const slotContent = slot(data);
  return slotContent.length === 1 ? h(slotContent[0]) : h(Fragment, void 0, slotContent);
}
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "app",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      titleTemplate: "%s - Africa Business Bureau",
      meta: [
        { name: "description", content: "Africa Business Bureau (ABB): Your 360° Launchpad for Growth in Ghana and Africa." },
        { property: "og:image", content: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000" },
        { name: "twitter:card", content: "summary_large_image" }
      ],
      link: [{ rel: "icon", type: "image/png", href: "/abb-favicon.png" }]
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtRouteAnnouncer = ServerPlaceholder;
      const _component_NuxtLayout = __nuxt_component_1;
      const _component_NuxtPage = __nuxt_component_2;
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(_component_NuxtRouteAnnouncer, null, null, _parent));
      _push(ssrRenderComponent(_component_NuxtLayout, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_NuxtPage, null, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_NuxtPage)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("app.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "error",
  __ssrInlineRender: true,
  props: {
    error: Object
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen flex items-center justify-center bg-white px-4" }, _attrs))}><div class="max-w-md w-full text-center"><div class="mb-8 relative inline-flex justify-center items-center"><div class="absolute inset-0 bg-red-50 rounded-full blur-xl opacity-70"></div><div class="relative w-24 h-24 bg-white rounded-2xl shadow-lg border border-gray-100 flex items-center justify-center"><div class="text-[#E60000] text-4xl"> ⚠️ </div></div></div><h1 class="text-4xl font-bold font-display text-gray-900 mb-3 tracking-tight"> Oopss.. An Error Occurred </h1><p class="text-gray-500 mb-10 text-lg leading-relaxed">${ssrInterpolate(__props.error?.statusCode === 404 ? "We couldn't find the page you're looking for." : "We're currently updating this section to serve you better.")} <span class="block mt-2 text-sm text-gray-400">Error Code: ${ssrInterpolate(__props.error?.statusCode)}</span></p><button class="inline-flex items-center justify-center px-8 py-3.5 text-base font-bold text-white bg-black rounded-full hover:bg-[#E60000] transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"> Go back home </button></div></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("error.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {
  __name: "nuxt-root",
  __ssrInlineRender: true,
  setup(__props) {
    const IslandRenderer = () => null;
    const nuxtApp = useNuxtApp();
    nuxtApp.deferHydration();
    nuxtApp.ssrContext.url;
    const SingleRenderer = false;
    provide(PageRouteSymbol, useRoute());
    nuxtApp.hooks.callHookWith((hooks) => hooks.map((hook) => hook()), "vue:setup");
    const error = /* @__PURE__ */ useError();
    const abortRender = error.value && !nuxtApp.ssrContext.error;
    onErrorCaptured((err, target, info) => {
      nuxtApp.hooks.callHook("vue:error", err, target, info).catch((hookError) => console.error("[nuxt] Error in `vue:error` hook", hookError));
      {
        const p = nuxtApp.runWithContext(() => showError(err));
        onServerPrefetch(() => p);
        return false;
      }
    });
    const islandContext = nuxtApp.ssrContext.islandContext;
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderSuspense(_push, {
        default: () => {
          if (unref(abortRender)) {
            _push(`<div></div>`);
          } else if (unref(error)) {
            _push(ssrRenderComponent(unref(_sfc_main$1), { error: unref(error) }, null, _parent));
          } else if (unref(islandContext)) {
            _push(ssrRenderComponent(unref(IslandRenderer), { context: unref(islandContext) }, null, _parent));
          } else if (unref(SingleRenderer)) {
            ssrRenderVNode(_push, createVNode(resolveDynamicComponent(unref(SingleRenderer)), null, null), _parent);
          } else {
            _push(ssrRenderComponent(unref(_sfc_main$2), null, null, _parent));
          }
        },
        _: 1
      });
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/nuxt/dist/app/components/nuxt-root.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
let entry;
{
  entry = async function createNuxtAppServer(ssrContext) {
    const vueApp = createApp(_sfc_main);
    const nuxt = createNuxtApp({ vueApp, ssrContext });
    try {
      await applyPlugins(nuxt, plugins);
      await nuxt.hooks.callHook("app:created", vueApp);
    } catch (error) {
      await nuxt.hooks.callHook("app:error", error);
      nuxt.payload.error ||= createError(error);
    }
    if (ssrContext?._renderResponse) {
      throw new Error("skipping render");
    }
    return vueApp;
  };
}
const entry_default = (ssrContext) => entry(ssrContext);

export { useSeoMeta as a, useAppConfig as b, useNuxtApp as c, asyncDataDefaults as d, entry_default as default, createError as e, useHead as f, useRequestEvent as g, useRouter as h, nuxtLinkDefaults as i, appConfig as j, useRoute as k, navigateTo as n, resolveRouteObject as r, tryUseNuxtApp as t, useRuntimeConfig as u };
//# sourceMappingURL=server.mjs.map
