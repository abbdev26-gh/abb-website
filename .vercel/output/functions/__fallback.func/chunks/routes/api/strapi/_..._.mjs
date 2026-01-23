import { d as defineCachedEventHandler, u as useRuntimeConfig, r as readBody, g as getQuery } from '../../../nitro/nitro.mjs';
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

const _____ = defineCachedEventHandler(async (event) => {
  var _a;
  const config = useRuntimeConfig();
  const target = (_a = event.context.params) == null ? void 0 : _a._;
  const strapiUrl = config.strapiUpstreamUrl || "http://localhost:1337";
  const path = (target == null ? void 0 : target.startsWith("/")) ? target : `/${target}`;
  const url = `${strapiUrl}${path}`;
  console.log(`[Strapi Proxy] Requesting: ${url}`);
  const authHeader = event.headers.get("authorization");
  console.log(`[Strapi Proxy] Auth Header: ${authHeader ? "Present" : "Missing"}`);
  try {
    const response = await $fetch(url, {
      method: event.method,
      headers: {
        "Content-Type": "application/json",
        ...authHeader ? { "Authorization": authHeader } : {}
      },
      // Forward query parameters
      query: getQuery(event),
      // Forward body for non-GET requests
      ...event.method !== "GET" ? { body: await readBody(event).catch(() => void 0) } : {}
    });
    console.log(`[Strapi Proxy] Response from Strapi:`, typeof response, Object.keys(response || {}));
    return response;
  } catch (error) {
    console.error(`[Strapi Proxy] Error fetching ${url}:`, error.message);
    event.node.res.statusCode = error.statusCode || 500;
    return error.data || { error: "Internal Server Error" };
  }
}, {
  swr: true,
  maxAge: 60 * 60 * 24 * 7,
  // 7 days
  getKey: (event) => {
    const auth = event.headers.get("authorization") || "public";
    return `${event.path}-${auth}`;
  },
  shouldBypassCache: (event) => {
    return event.method !== "GET";
  }
});

export { _____ as default };
//# sourceMappingURL=_..._.mjs.map
