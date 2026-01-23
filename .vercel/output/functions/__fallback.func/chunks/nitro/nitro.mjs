import process from 'node:process';globalThis._importMeta_=globalThis._importMeta_||{url:"file:///_entry.js",env:process.env};import nodeCrypto, { createHash } from 'node:crypto';
import http from 'node:http';
import https from 'node:https';
import { EventEmitter } from 'node:events';
import { Buffer as Buffer$1 } from 'node:buffer';
import { promises, existsSync, mkdirSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { getIcons } from '@iconify/utils';
import { consola } from 'consola';
import { minimatch } from 'minimatch';
import Database from 'better-sqlite3';
import { fileURLToPath } from 'node:url';
import { ipxFSStorage, ipxHttpStorage, createIPX, createIPXH3Handler } from 'ipx';

const suspectProtoRx = /"(?:_|\\u0{2}5[Ff]){2}(?:p|\\u0{2}70)(?:r|\\u0{2}72)(?:o|\\u0{2}6[Ff])(?:t|\\u0{2}74)(?:o|\\u0{2}6[Ff])(?:_|\\u0{2}5[Ff]){2}"\s*:/;
const suspectConstructorRx = /"(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)"\s*:/;
const JsonSigRx = /^\s*["[{]|^\s*-?\d{1,16}(\.\d{1,17})?([Ee][+-]?\d+)?\s*$/;
function jsonParseTransform(key, value) {
  if (key === "__proto__" || key === "constructor" && value && typeof value === "object" && "prototype" in value) {
    warnKeyDropped(key);
    return;
  }
  return value;
}
function warnKeyDropped(key) {
  console.warn(`[destr] Dropping "${key}" key to prevent prototype pollution.`);
}
function destr(value, options = {}) {
  if (typeof value !== "string") {
    return value;
  }
  if (value[0] === '"' && value[value.length - 1] === '"' && value.indexOf("\\") === -1) {
    return value.slice(1, -1);
  }
  const _value = value.trim();
  if (_value.length <= 9) {
    switch (_value.toLowerCase()) {
      case "true": {
        return true;
      }
      case "false": {
        return false;
      }
      case "undefined": {
        return void 0;
      }
      case "null": {
        return null;
      }
      case "nan": {
        return Number.NaN;
      }
      case "infinity": {
        return Number.POSITIVE_INFINITY;
      }
      case "-infinity": {
        return Number.NEGATIVE_INFINITY;
      }
    }
  }
  if (!JsonSigRx.test(value)) {
    if (options.strict) {
      throw new SyntaxError("[destr] Invalid JSON");
    }
    return value;
  }
  try {
    if (suspectProtoRx.test(value) || suspectConstructorRx.test(value)) {
      if (options.strict) {
        throw new Error("[destr] Possible prototype pollution");
      }
      return JSON.parse(value, jsonParseTransform);
    }
    return JSON.parse(value);
  } catch (error) {
    if (options.strict) {
      throw error;
    }
    return value;
  }
}

const HASH_RE = /#/g;
const AMPERSAND_RE = /&/g;
const SLASH_RE = /\//g;
const EQUAL_RE = /=/g;
const IM_RE = /\?/g;
const PLUS_RE = /\+/g;
const ENC_CARET_RE = /%5e/gi;
const ENC_BACKTICK_RE = /%60/gi;
const ENC_PIPE_RE = /%7c/gi;
const ENC_SPACE_RE = /%20/gi;
const ENC_ENC_SLASH_RE = /%252f/gi;
function encode(text) {
  return encodeURI("" + text).replace(ENC_PIPE_RE, "|");
}
function encodeQueryValue(input) {
  return encode(typeof input === "string" ? input : JSON.stringify(input)).replace(PLUS_RE, "%2B").replace(ENC_SPACE_RE, "+").replace(HASH_RE, "%23").replace(AMPERSAND_RE, "%26").replace(ENC_BACKTICK_RE, "`").replace(ENC_CARET_RE, "^").replace(SLASH_RE, "%2F");
}
function encodeQueryKey(text) {
  return encodeQueryValue(text).replace(EQUAL_RE, "%3D");
}
function encodePath(text) {
  return encode(text).replace(HASH_RE, "%23").replace(IM_RE, "%3F").replace(ENC_ENC_SLASH_RE, "%2F").replace(AMPERSAND_RE, "%26").replace(PLUS_RE, "%2B");
}
function encodeParam(text) {
  return encodePath(text).replace(SLASH_RE, "%2F");
}
function decode$1(text = "") {
  try {
    return decodeURIComponent("" + text);
  } catch {
    return "" + text;
  }
}
function decodeQueryKey(text) {
  return decode$1(text.replace(PLUS_RE, " "));
}
function decodeQueryValue(text) {
  return decode$1(text.replace(PLUS_RE, " "));
}

function parseQuery(parametersString = "") {
  const object = /* @__PURE__ */ Object.create(null);
  if (parametersString[0] === "?") {
    parametersString = parametersString.slice(1);
  }
  for (const parameter of parametersString.split("&")) {
    const s = parameter.match(/([^=]+)=?(.*)/) || [];
    if (s.length < 2) {
      continue;
    }
    const key = decodeQueryKey(s[1]);
    if (key === "__proto__" || key === "constructor") {
      continue;
    }
    const value = decodeQueryValue(s[2] || "");
    if (object[key] === void 0) {
      object[key] = value;
    } else if (Array.isArray(object[key])) {
      object[key].push(value);
    } else {
      object[key] = [object[key], value];
    }
  }
  return object;
}
function encodeQueryItem(key, value) {
  if (typeof value === "number" || typeof value === "boolean") {
    value = String(value);
  }
  if (!value) {
    return encodeQueryKey(key);
  }
  if (Array.isArray(value)) {
    return value.map(
      (_value) => `${encodeQueryKey(key)}=${encodeQueryValue(_value)}`
    ).join("&");
  }
  return `${encodeQueryKey(key)}=${encodeQueryValue(value)}`;
}
function stringifyQuery(query) {
  return Object.keys(query).filter((k) => query[k] !== void 0).map((k) => encodeQueryItem(k, query[k])).filter(Boolean).join("&");
}

const PROTOCOL_STRICT_REGEX = /^[\s\w\0+.-]{2,}:([/\\]{1,2})/;
const PROTOCOL_REGEX = /^[\s\w\0+.-]{2,}:([/\\]{2})?/;
const PROTOCOL_RELATIVE_REGEX = /^([/\\]\s*){2,}[^/\\]/;
const PROTOCOL_SCRIPT_RE = /^[\s\0]*(blob|data|javascript|vbscript):$/i;
const TRAILING_SLASH_RE = /\/$|\/\?|\/#/;
const JOIN_LEADING_SLASH_RE = /^\.?\//;
function hasProtocol(inputString, opts = {}) {
  if (typeof opts === "boolean") {
    opts = { acceptRelative: opts };
  }
  if (opts.strict) {
    return PROTOCOL_STRICT_REGEX.test(inputString);
  }
  return PROTOCOL_REGEX.test(inputString) || (opts.acceptRelative ? PROTOCOL_RELATIVE_REGEX.test(inputString) : false);
}
function isScriptProtocol(protocol) {
  return !!protocol && PROTOCOL_SCRIPT_RE.test(protocol);
}
function hasTrailingSlash(input = "", respectQueryAndFragment) {
  if (!respectQueryAndFragment) {
    return input.endsWith("/");
  }
  return TRAILING_SLASH_RE.test(input);
}
function withoutTrailingSlash(input = "", respectQueryAndFragment) {
  if (!respectQueryAndFragment) {
    return (hasTrailingSlash(input) ? input.slice(0, -1) : input) || "/";
  }
  if (!hasTrailingSlash(input, true)) {
    return input || "/";
  }
  let path = input;
  let fragment = "";
  const fragmentIndex = input.indexOf("#");
  if (fragmentIndex !== -1) {
    path = input.slice(0, fragmentIndex);
    fragment = input.slice(fragmentIndex);
  }
  const [s0, ...s] = path.split("?");
  const cleanPath = s0.endsWith("/") ? s0.slice(0, -1) : s0;
  return (cleanPath || "/") + (s.length > 0 ? `?${s.join("?")}` : "") + fragment;
}
function withTrailingSlash(input = "", respectQueryAndFragment) {
  if (!respectQueryAndFragment) {
    return input.endsWith("/") ? input : input + "/";
  }
  if (hasTrailingSlash(input, true)) {
    return input || "/";
  }
  let path = input;
  let fragment = "";
  const fragmentIndex = input.indexOf("#");
  if (fragmentIndex !== -1) {
    path = input.slice(0, fragmentIndex);
    fragment = input.slice(fragmentIndex);
    if (!path) {
      return fragment;
    }
  }
  const [s0, ...s] = path.split("?");
  return s0 + "/" + (s.length > 0 ? `?${s.join("?")}` : "") + fragment;
}
function hasLeadingSlash(input = "") {
  return input.startsWith("/");
}
function withLeadingSlash(input = "") {
  return hasLeadingSlash(input) ? input : "/" + input;
}
function withBase(input, base) {
  if (isEmptyURL(base) || hasProtocol(input)) {
    return input;
  }
  const _base = withoutTrailingSlash(base);
  if (input.startsWith(_base)) {
    const nextChar = input[_base.length];
    if (!nextChar || nextChar === "/" || nextChar === "?") {
      return input;
    }
  }
  return joinURL(_base, input);
}
function withoutBase(input, base) {
  if (isEmptyURL(base)) {
    return input;
  }
  const _base = withoutTrailingSlash(base);
  if (!input.startsWith(_base)) {
    return input;
  }
  const nextChar = input[_base.length];
  if (nextChar && nextChar !== "/" && nextChar !== "?") {
    return input;
  }
  const trimmed = input.slice(_base.length);
  return trimmed[0] === "/" ? trimmed : "/" + trimmed;
}
function withQuery(input, query) {
  const parsed = parseURL(input);
  const mergedQuery = { ...parseQuery(parsed.search), ...query };
  parsed.search = stringifyQuery(mergedQuery);
  return stringifyParsedURL(parsed);
}
function getQuery$1(input) {
  return parseQuery(parseURL(input).search);
}
function isEmptyURL(url) {
  return !url || url === "/";
}
function isNonEmptyURL(url) {
  return url && url !== "/";
}
function joinURL(base, ...input) {
  let url = base || "";
  for (const segment of input.filter((url2) => isNonEmptyURL(url2))) {
    if (url) {
      const _segment = segment.replace(JOIN_LEADING_SLASH_RE, "");
      url = withTrailingSlash(url) + _segment;
    } else {
      url = segment;
    }
  }
  return url;
}
function joinRelativeURL(..._input) {
  const JOIN_SEGMENT_SPLIT_RE = /\/(?!\/)/;
  const input = _input.filter(Boolean);
  const segments = [];
  let segmentsDepth = 0;
  for (const i of input) {
    if (!i || i === "/") {
      continue;
    }
    for (const [sindex, s] of i.split(JOIN_SEGMENT_SPLIT_RE).entries()) {
      if (!s || s === ".") {
        continue;
      }
      if (s === "..") {
        if (segments.length === 1 && hasProtocol(segments[0])) {
          continue;
        }
        segments.pop();
        segmentsDepth--;
        continue;
      }
      if (sindex === 1 && segments[segments.length - 1]?.endsWith(":/")) {
        segments[segments.length - 1] += "/" + s;
        continue;
      }
      segments.push(s);
      segmentsDepth++;
    }
  }
  let url = segments.join("/");
  if (segmentsDepth >= 0) {
    if (input[0]?.startsWith("/") && !url.startsWith("/")) {
      url = "/" + url;
    } else if (input[0]?.startsWith("./") && !url.startsWith("./")) {
      url = "./" + url;
    }
  } else {
    url = "../".repeat(-1 * segmentsDepth) + url;
  }
  if (input[input.length - 1]?.endsWith("/") && !url.endsWith("/")) {
    url += "/";
  }
  return url;
}

const protocolRelative = Symbol.for("ufo:protocolRelative");
function parseURL(input = "", defaultProto) {
  const _specialProtoMatch = input.match(
    /^[\s\0]*(blob:|data:|javascript:|vbscript:)(.*)/i
  );
  if (_specialProtoMatch) {
    const [, _proto, _pathname = ""] = _specialProtoMatch;
    return {
      protocol: _proto.toLowerCase(),
      pathname: _pathname,
      href: _proto + _pathname,
      auth: "",
      host: "",
      search: "",
      hash: ""
    };
  }
  if (!hasProtocol(input, { acceptRelative: true })) {
    return parsePath(input);
  }
  const [, protocol = "", auth, hostAndPath = ""] = input.replace(/\\/g, "/").match(/^[\s\0]*([\w+.-]{2,}:)?\/\/([^/@]+@)?(.*)/) || [];
  let [, host = "", path = ""] = hostAndPath.match(/([^#/?]*)(.*)?/) || [];
  if (protocol === "file:") {
    path = path.replace(/\/(?=[A-Za-z]:)/, "");
  }
  const { pathname, search, hash } = parsePath(path);
  return {
    protocol: protocol.toLowerCase(),
    auth: auth ? auth.slice(0, Math.max(0, auth.length - 1)) : "",
    host,
    pathname,
    search,
    hash,
    [protocolRelative]: !protocol
  };
}
function parsePath(input = "") {
  const [pathname = "", search = "", hash = ""] = (input.match(/([^#?]*)(\?[^#]*)?(#.*)?/) || []).splice(1);
  return {
    pathname,
    search,
    hash
  };
}
function stringifyParsedURL(parsed) {
  const pathname = parsed.pathname || "";
  const search = parsed.search ? (parsed.search.startsWith("?") ? "" : "?") + parsed.search : "";
  const hash = parsed.hash || "";
  const auth = parsed.auth ? parsed.auth + "@" : "";
  const host = parsed.host || "";
  const proto = parsed.protocol || parsed[protocolRelative] ? (parsed.protocol || "") + "//" : "";
  return proto + auth + host + pathname + search + hash;
}

function parse(str, options) {
  if (typeof str !== "string") {
    throw new TypeError("argument str must be a string");
  }
  const obj = {};
  const opt = {};
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

const fieldContentRegExp = /^[\u0009\u0020-\u007E\u0080-\u00FF]+$/;
function serialize$2(name, value, options) {
  const opt = options || {};
  const enc = opt.encode || encodeURIComponent;
  if (typeof enc !== "function") {
    throw new TypeError("option encode is invalid");
  }
  if (!fieldContentRegExp.test(name)) {
    throw new TypeError("argument name is invalid");
  }
  const encodedValue = enc(value);
  if (encodedValue && !fieldContentRegExp.test(encodedValue)) {
    throw new TypeError("argument val is invalid");
  }
  let str = name + "=" + encodedValue;
  if (void 0 !== opt.maxAge && opt.maxAge !== null) {
    const maxAge = opt.maxAge - 0;
    if (Number.isNaN(maxAge) || !Number.isFinite(maxAge)) {
      throw new TypeError("option maxAge is invalid");
    }
    str += "; Max-Age=" + Math.floor(maxAge);
  }
  if (opt.domain) {
    if (!fieldContentRegExp.test(opt.domain)) {
      throw new TypeError("option domain is invalid");
    }
    str += "; Domain=" + opt.domain;
  }
  if (opt.path) {
    if (!fieldContentRegExp.test(opt.path)) {
      throw new TypeError("option path is invalid");
    }
    str += "; Path=" + opt.path;
  }
  if (opt.expires) {
    if (!isDate(opt.expires) || Number.isNaN(opt.expires.valueOf())) {
      throw new TypeError("option expires is invalid");
    }
    str += "; Expires=" + opt.expires.toUTCString();
  }
  if (opt.httpOnly) {
    str += "; HttpOnly";
  }
  if (opt.secure) {
    str += "; Secure";
  }
  if (opt.priority) {
    const priority = typeof opt.priority === "string" ? opt.priority.toLowerCase() : opt.priority;
    switch (priority) {
      case "low": {
        str += "; Priority=Low";
        break;
      }
      case "medium": {
        str += "; Priority=Medium";
        break;
      }
      case "high": {
        str += "; Priority=High";
        break;
      }
      default: {
        throw new TypeError("option priority is invalid");
      }
    }
  }
  if (opt.sameSite) {
    const sameSite = typeof opt.sameSite === "string" ? opt.sameSite.toLowerCase() : opt.sameSite;
    switch (sameSite) {
      case true: {
        str += "; SameSite=Strict";
        break;
      }
      case "lax": {
        str += "; SameSite=Lax";
        break;
      }
      case "strict": {
        str += "; SameSite=Strict";
        break;
      }
      case "none": {
        str += "; SameSite=None";
        break;
      }
      default: {
        throw new TypeError("option sameSite is invalid");
      }
    }
  }
  if (opt.partitioned) {
    str += "; Partitioned";
  }
  return str;
}
function isDate(val) {
  return Object.prototype.toString.call(val) === "[object Date]" || val instanceof Date;
}

function parseSetCookie(setCookieValue, options) {
  const parts = (setCookieValue || "").split(";").filter((str) => typeof str === "string" && !!str.trim());
  const nameValuePairStr = parts.shift() || "";
  const parsed = _parseNameValuePair(nameValuePairStr);
  const name = parsed.name;
  let value = parsed.value;
  try {
    value = options?.decode === false ? value : (options?.decode || decodeURIComponent)(value);
  } catch {
  }
  const cookie = {
    name,
    value
  };
  for (const part of parts) {
    const sides = part.split("=");
    const partKey = (sides.shift() || "").trimStart().toLowerCase();
    const partValue = sides.join("=");
    switch (partKey) {
      case "expires": {
        cookie.expires = new Date(partValue);
        break;
      }
      case "max-age": {
        cookie.maxAge = Number.parseInt(partValue, 10);
        break;
      }
      case "secure": {
        cookie.secure = true;
        break;
      }
      case "httponly": {
        cookie.httpOnly = true;
        break;
      }
      case "samesite": {
        cookie.sameSite = partValue;
        break;
      }
      default: {
        cookie[partKey] = partValue;
      }
    }
  }
  return cookie;
}
function _parseNameValuePair(nameValuePairStr) {
  let name = "";
  let value = "";
  const nameValueArr = nameValuePairStr.split("=");
  if (nameValueArr.length > 1) {
    name = nameValueArr.shift();
    value = nameValueArr.join("=");
  } else {
    value = nameValuePairStr;
  }
  return { name, value };
}

const NODE_TYPES = {
  NORMAL: 0,
  WILDCARD: 1,
  PLACEHOLDER: 2
};

function createRouter$1(options = {}) {
  const ctx = {
    options,
    rootNode: createRadixNode(),
    staticRoutesMap: {}
  };
  const normalizeTrailingSlash = (p) => options.strictTrailingSlash ? p : p.replace(/\/$/, "") || "/";
  if (options.routes) {
    for (const path in options.routes) {
      insert(ctx, normalizeTrailingSlash(path), options.routes[path]);
    }
  }
  return {
    ctx,
    lookup: (path) => lookup(ctx, normalizeTrailingSlash(path)),
    insert: (path, data) => insert(ctx, normalizeTrailingSlash(path), data),
    remove: (path) => remove(ctx, normalizeTrailingSlash(path))
  };
}
function lookup(ctx, path) {
  const staticPathNode = ctx.staticRoutesMap[path];
  if (staticPathNode) {
    return staticPathNode.data;
  }
  const sections = path.split("/");
  const params = {};
  let paramsFound = false;
  let wildcardNode = null;
  let node = ctx.rootNode;
  let wildCardParam = null;
  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    if (node.wildcardChildNode !== null) {
      wildcardNode = node.wildcardChildNode;
      wildCardParam = sections.slice(i).join("/");
    }
    const nextNode = node.children.get(section);
    if (nextNode === void 0) {
      if (node && node.placeholderChildren.length > 1) {
        const remaining = sections.length - i;
        node = node.placeholderChildren.find((c) => c.maxDepth === remaining) || null;
      } else {
        node = node.placeholderChildren[0] || null;
      }
      if (!node) {
        break;
      }
      if (node.paramName) {
        params[node.paramName] = section;
      }
      paramsFound = true;
    } else {
      node = nextNode;
    }
  }
  if ((node === null || node.data === null) && wildcardNode !== null) {
    node = wildcardNode;
    params[node.paramName || "_"] = wildCardParam;
    paramsFound = true;
  }
  if (!node) {
    return null;
  }
  if (paramsFound) {
    return {
      ...node.data,
      params: paramsFound ? params : void 0
    };
  }
  return node.data;
}
function insert(ctx, path, data) {
  let isStaticRoute = true;
  const sections = path.split("/");
  let node = ctx.rootNode;
  let _unnamedPlaceholderCtr = 0;
  const matchedNodes = [node];
  for (const section of sections) {
    let childNode;
    if (childNode = node.children.get(section)) {
      node = childNode;
    } else {
      const type = getNodeType(section);
      childNode = createRadixNode({ type, parent: node });
      node.children.set(section, childNode);
      if (type === NODE_TYPES.PLACEHOLDER) {
        childNode.paramName = section === "*" ? `_${_unnamedPlaceholderCtr++}` : section.slice(1);
        node.placeholderChildren.push(childNode);
        isStaticRoute = false;
      } else if (type === NODE_TYPES.WILDCARD) {
        node.wildcardChildNode = childNode;
        childNode.paramName = section.slice(
          3
          /* "**:" */
        ) || "_";
        isStaticRoute = false;
      }
      matchedNodes.push(childNode);
      node = childNode;
    }
  }
  for (const [depth, node2] of matchedNodes.entries()) {
    node2.maxDepth = Math.max(matchedNodes.length - depth, node2.maxDepth || 0);
  }
  node.data = data;
  if (isStaticRoute === true) {
    ctx.staticRoutesMap[path] = node;
  }
  return node;
}
function remove(ctx, path) {
  let success = false;
  const sections = path.split("/");
  let node = ctx.rootNode;
  for (const section of sections) {
    node = node.children.get(section);
    if (!node) {
      return success;
    }
  }
  if (node.data) {
    const lastSection = sections.at(-1) || "";
    node.data = null;
    if (Object.keys(node.children).length === 0 && node.parent) {
      node.parent.children.delete(lastSection);
      node.parent.wildcardChildNode = null;
      node.parent.placeholderChildren = [];
    }
    success = true;
  }
  return success;
}
function createRadixNode(options = {}) {
  return {
    type: options.type || NODE_TYPES.NORMAL,
    maxDepth: 0,
    parent: options.parent || null,
    children: /* @__PURE__ */ new Map(),
    data: options.data || null,
    paramName: options.paramName || null,
    wildcardChildNode: null,
    placeholderChildren: []
  };
}
function getNodeType(str) {
  if (str.startsWith("**")) {
    return NODE_TYPES.WILDCARD;
  }
  if (str[0] === ":" || str === "*") {
    return NODE_TYPES.PLACEHOLDER;
  }
  return NODE_TYPES.NORMAL;
}

function toRouteMatcher(router) {
  const table = _routerNodeToTable("", router.ctx.rootNode);
  return _createMatcher(table, router.ctx.options.strictTrailingSlash);
}
function _createMatcher(table, strictTrailingSlash) {
  return {
    ctx: { table },
    matchAll: (path) => _matchRoutes(path, table, strictTrailingSlash)
  };
}
function _createRouteTable() {
  return {
    static: /* @__PURE__ */ new Map(),
    wildcard: /* @__PURE__ */ new Map(),
    dynamic: /* @__PURE__ */ new Map()
  };
}
function _matchRoutes(path, table, strictTrailingSlash) {
  if (strictTrailingSlash !== true && path.endsWith("/")) {
    path = path.slice(0, -1) || "/";
  }
  const matches = [];
  for (const [key, value] of _sortRoutesMap(table.wildcard)) {
    if (path === key || path.startsWith(key + "/")) {
      matches.push(value);
    }
  }
  for (const [key, value] of _sortRoutesMap(table.dynamic)) {
    if (path.startsWith(key + "/")) {
      const subPath = "/" + path.slice(key.length).split("/").splice(2).join("/");
      matches.push(..._matchRoutes(subPath, value));
    }
  }
  const staticMatch = table.static.get(path);
  if (staticMatch) {
    matches.push(staticMatch);
  }
  return matches.filter(Boolean);
}
function _sortRoutesMap(m) {
  return [...m.entries()].sort((a, b) => a[0].length - b[0].length);
}
function _routerNodeToTable(initialPath, initialNode) {
  const table = _createRouteTable();
  function _addNode(path, node) {
    if (path) {
      if (node.type === NODE_TYPES.NORMAL && !(path.includes("*") || path.includes(":"))) {
        if (node.data) {
          table.static.set(path, node.data);
        }
      } else if (node.type === NODE_TYPES.WILDCARD) {
        table.wildcard.set(path.replace("/**", ""), node.data);
      } else if (node.type === NODE_TYPES.PLACEHOLDER) {
        const subTable = _routerNodeToTable("", node);
        if (node.data) {
          subTable.static.set("/", node.data);
        }
        table.dynamic.set(path.replace(/\/\*|\/:\w+/, ""), subTable);
        return;
      }
    }
    for (const [childPath, child] of node.children.entries()) {
      _addNode(`${path}/${childPath}`.replace("//", "/"), child);
    }
  }
  _addNode(initialPath, initialNode);
  return table;
}

function isPlainObject(value) {
  if (value === null || typeof value !== "object") {
    return false;
  }
  const prototype = Object.getPrototypeOf(value);
  if (prototype !== null && prototype !== Object.prototype && Object.getPrototypeOf(prototype) !== null) {
    return false;
  }
  if (Symbol.iterator in value) {
    return false;
  }
  if (Symbol.toStringTag in value) {
    return Object.prototype.toString.call(value) === "[object Module]";
  }
  return true;
}

function _defu(baseObject, defaults, namespace = ".", merger) {
  if (!isPlainObject(defaults)) {
    return _defu(baseObject, {}, namespace, merger);
  }
  const object = Object.assign({}, defaults);
  for (const key in baseObject) {
    if (key === "__proto__" || key === "constructor") {
      continue;
    }
    const value = baseObject[key];
    if (value === null || value === void 0) {
      continue;
    }
    if (merger && merger(object, key, value, namespace)) {
      continue;
    }
    if (Array.isArray(value) && Array.isArray(object[key])) {
      object[key] = [...value, ...object[key]];
    } else if (isPlainObject(value) && isPlainObject(object[key])) {
      object[key] = _defu(
        value,
        object[key],
        (namespace ? `${namespace}.` : "") + key.toString(),
        merger
      );
    } else {
      object[key] = value;
    }
  }
  return object;
}
function createDefu(merger) {
  return (...arguments_) => (
    // eslint-disable-next-line unicorn/no-array-reduce
    arguments_.reduce((p, c) => _defu(p, c, "", merger), {})
  );
}
const defu = createDefu();
const defuFn = createDefu((object, key, currentValue) => {
  if (object[key] !== void 0 && typeof currentValue === "function") {
    object[key] = currentValue(object[key]);
    return true;
  }
});

const subtle = nodeCrypto.webcrypto?.subtle || {};
const randomUUID = () => {
  return nodeCrypto.randomUUID();
};
const getRandomValues = (array) => {
  return nodeCrypto.webcrypto.getRandomValues(array);
};
const _crypto = {
  randomUUID,
  getRandomValues,
  subtle
};

// src/utils.ts
var alphabetByEncoding = {};
var alphabetByValue = Array.from({ length: 64 });
for (let i = 0, start = "A".charCodeAt(0), limit = "Z".charCodeAt(0); i + start <= limit; i++) {
  const char = String.fromCharCode(i + start);
  alphabetByEncoding[char] = i;
  alphabetByValue[i] = char;
}
for (let i = 0, start = "a".charCodeAt(0), limit = "z".charCodeAt(0); i + start <= limit; i++) {
  const char = String.fromCharCode(i + start);
  const index = i + 26;
  alphabetByEncoding[char] = index;
  alphabetByValue[index] = char;
}
for (let i = 0; i < 10; i++) {
  alphabetByEncoding[i.toString(10)] = i + 52;
  const char = i.toString(10);
  const index = i + 52;
  alphabetByEncoding[char] = index;
  alphabetByValue[index] = char;
}
alphabetByEncoding["-"] = 62;
alphabetByValue[62] = "-";
alphabetByEncoding["_"] = 63;
alphabetByValue[63] = "_";
var bitsPerLetter = 6;
var bitsPerByte = 8;
var maxLetterValue = 63;
var stringToBuffer = (value) => {
  return new TextEncoder().encode(value);
};
var bufferToString = (value) => {
  return new TextDecoder().decode(value);
};
var base64urlDecode = (_input) => {
  const input = _input + "=".repeat((4 - _input.length % 4) % 4);
  let totalByteLength = input.length / 4 * 3;
  if (input.endsWith("==")) {
    totalByteLength -= 2;
  } else if (input.endsWith("=")) {
    totalByteLength--;
  }
  const out = new ArrayBuffer(totalByteLength);
  const dataView = new DataView(out);
  for (let i = 0; i < input.length; i += 4) {
    let bits = 0;
    let bitLength = 0;
    for (let j = i, limit = i + 3; j <= limit; j++) {
      if (input[j] === "=") {
        bits >>= bitsPerLetter;
      } else {
        if (!(input[j] in alphabetByEncoding)) {
          throw new TypeError(`Invalid character ${input[j]} in base64 string.`);
        }
        bits |= alphabetByEncoding[input[j]] << (limit - j) * bitsPerLetter;
        bitLength += bitsPerLetter;
      }
    }
    const chunkOffset = i / 4 * 3;
    bits >>= bitLength % bitsPerByte;
    const byteLength = Math.floor(bitLength / bitsPerByte);
    for (let k = 0; k < byteLength; k++) {
      const offset = (byteLength - k - 1) * bitsPerByte;
      dataView.setUint8(chunkOffset + k, (bits & 255 << offset) >> offset);
    }
  }
  return new Uint8Array(out);
};
var base64urlEncode = (_input) => {
  const input = typeof _input === "string" ? stringToBuffer(_input) : _input;
  let str = "";
  for (let i = 0; i < input.length; i += 3) {
    let bits = 0;
    let bitLength = 0;
    for (let j = i, limit = Math.min(i + 3, input.length); j < limit; j++) {
      bits |= input[j] << (limit - j - 1) * bitsPerByte;
      bitLength += bitsPerByte;
    }
    const bitClusterCount = Math.ceil(bitLength / bitsPerLetter);
    bits <<= bitClusterCount * bitsPerLetter - bitLength;
    for (let k = 1; k <= bitClusterCount; k++) {
      const offset = (bitClusterCount - k) * bitsPerLetter;
      str += alphabetByValue[(bits & maxLetterValue << offset) >> offset];
    }
  }
  return str;
};

// src/index.ts
var defaults = {
  encryption: { saltBits: 256, algorithm: "aes-256-cbc", iterations: 1, minPasswordlength: 32 },
  integrity: { saltBits: 256, algorithm: "sha256", iterations: 1, minPasswordlength: 32 },
  ttl: 0,
  timestampSkewSec: 60,
  localtimeOffsetMsec: 0
};
var clone = (options) => ({
  ...options,
  encryption: { ...options.encryption },
  integrity: { ...options.integrity }
});
var algorithms = {
  "aes-128-ctr": { keyBits: 128, ivBits: 128, name: "AES-CTR" },
  "aes-256-cbc": { keyBits: 256, ivBits: 128, name: "AES-CBC" },
  sha256: { keyBits: 256, name: "SHA-256" }
};
var macPrefix = "Fe26.2";
var randomBytes = (_crypto, size) => {
  const bytes = new Uint8Array(size);
  _crypto.getRandomValues(bytes);
  return bytes;
};
var randomBits = (_crypto, bits) => {
  if (bits < 1)
    throw new Error("Invalid random bits count");
  const bytes = Math.ceil(bits / 8);
  return randomBytes(_crypto, bytes);
};
var pbkdf2 = async (_crypto, password, salt, iterations, keyLength, hash) => {
  const passwordBuffer = stringToBuffer(password);
  const importedKey = await _crypto.subtle.importKey(
    "raw",
    passwordBuffer,
    { name: "PBKDF2" },
    false,
    ["deriveBits"]
  );
  const saltBuffer = stringToBuffer(salt);
  const params = { name: "PBKDF2", hash, salt: saltBuffer, iterations };
  const derivation = await _crypto.subtle.deriveBits(params, importedKey, keyLength * 8);
  return derivation;
};
var generateKey = async (_crypto, password, options) => {
  var _a;
  if (!(password == null ? void 0 : password.length))
    throw new Error("Empty password");
  if (options == null || typeof options !== "object")
    throw new Error("Bad options");
  if (!(options.algorithm in algorithms))
    throw new Error(`Unknown algorithm: ${options.algorithm}`);
  const algorithm = algorithms[options.algorithm];
  const result = {};
  const hmac = (_a = options.hmac) != null ? _a : false;
  const id = hmac ? { name: "HMAC", hash: algorithm.name } : { name: algorithm.name };
  const usage = hmac ? ["sign", "verify"] : ["encrypt", "decrypt"];
  if (typeof password === "string") {
    if (password.length < options.minPasswordlength)
      throw new Error(
        `Password string too short (min ${options.minPasswordlength} characters required)`
      );
    let { salt = "" } = options;
    if (!salt) {
      const { saltBits = 0 } = options;
      if (!saltBits)
        throw new Error("Missing salt and saltBits options");
      const randomSalt = randomBits(_crypto, saltBits);
      salt = [...new Uint8Array(randomSalt)].map((x) => x.toString(16).padStart(2, "0")).join("");
    }
    const derivedKey = await pbkdf2(
      _crypto,
      password,
      salt,
      options.iterations,
      algorithm.keyBits / 8,
      "SHA-1"
    );
    const importedEncryptionKey = await _crypto.subtle.importKey(
      "raw",
      derivedKey,
      id,
      false,
      usage
    );
    result.key = importedEncryptionKey;
    result.salt = salt;
  } else {
    if (password.length < algorithm.keyBits / 8)
      throw new Error("Key buffer (password) too small");
    result.key = await _crypto.subtle.importKey("raw", password, id, false, usage);
    result.salt = "";
  }
  if (options.iv)
    result.iv = options.iv;
  else if ("ivBits" in algorithm)
    result.iv = randomBits(_crypto, algorithm.ivBits);
  return result;
};
var getEncryptParams = (algorithm, key, data) => {
  return [
    algorithm === "aes-128-ctr" ? { name: "AES-CTR", counter: key.iv, length: 128 } : { name: "AES-CBC", iv: key.iv },
    key.key,
    typeof data === "string" ? stringToBuffer(data) : data
  ];
};
var encrypt = async (_crypto, password, options, data) => {
  const key = await generateKey(_crypto, password, options);
  const encrypted = await _crypto.subtle.encrypt(...getEncryptParams(options.algorithm, key, data));
  return { encrypted: new Uint8Array(encrypted), key };
};
var decrypt = async (_crypto, password, options, data) => {
  const key = await generateKey(_crypto, password, options);
  const decrypted = await _crypto.subtle.decrypt(...getEncryptParams(options.algorithm, key, data));
  return bufferToString(new Uint8Array(decrypted));
};
var hmacWithPassword = async (_crypto, password, options, data) => {
  const key = await generateKey(_crypto, password, { ...options, hmac: true });
  const textBuffer = stringToBuffer(data);
  const signed = await _crypto.subtle.sign({ name: "HMAC" }, key.key, textBuffer);
  const digest = base64urlEncode(new Uint8Array(signed));
  return { digest, salt: key.salt };
};
var normalizePassword = (password) => {
  if (typeof password === "string" || password instanceof Uint8Array)
    return { encryption: password, integrity: password };
  if ("secret" in password)
    return { id: password.id, encryption: password.secret, integrity: password.secret };
  return { id: password.id, encryption: password.encryption, integrity: password.integrity };
};
var seal = async (_crypto, object, password, options) => {
  if (!password)
    throw new Error("Empty password");
  const opts = clone(options);
  const now = Date.now() + (opts.localtimeOffsetMsec || 0);
  const objectString = JSON.stringify(object);
  const pass = normalizePassword(password);
  const { id = "", encryption, integrity } = pass;
  if (id && !/^\w+$/.test(id))
    throw new Error("Invalid password id");
  const { encrypted, key } = await encrypt(_crypto, encryption, opts.encryption, objectString);
  const encryptedB64 = base64urlEncode(new Uint8Array(encrypted));
  const iv = base64urlEncode(key.iv);
  const expiration = opts.ttl ? now + opts.ttl : "";
  const macBaseString = `${macPrefix}*${id}*${key.salt}*${iv}*${encryptedB64}*${expiration}`;
  const mac = await hmacWithPassword(_crypto, integrity, opts.integrity, macBaseString);
  const sealed = `${macBaseString}*${mac.salt}*${mac.digest}`;
  return sealed;
};
var fixedTimeComparison = (a, b) => {
  let mismatch = a.length === b.length ? 0 : 1;
  if (mismatch)
    b = a;
  for (let i = 0; i < a.length; i += 1)
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return mismatch === 0;
};
var unseal = async (_crypto, sealed, password, options) => {
  if (!password)
    throw new Error("Empty password");
  const opts = clone(options);
  const now = Date.now() + (opts.localtimeOffsetMsec || 0);
  const parts = sealed.split("*");
  if (parts.length !== 8)
    throw new Error("Incorrect number of sealed components");
  const prefix = parts[0];
  let passwordId = parts[1];
  const encryptionSalt = parts[2];
  const encryptionIv = parts[3];
  const encryptedB64 = parts[4];
  const expiration = parts[5];
  const hmacSalt = parts[6];
  const hmac = parts[7];
  const macBaseString = `${prefix}*${passwordId}*${encryptionSalt}*${encryptionIv}*${encryptedB64}*${expiration}`;
  if (macPrefix !== prefix)
    throw new Error("Wrong mac prefix");
  if (expiration) {
    if (!/^\d+$/.test(expiration))
      throw new Error("Invalid expiration");
    const exp = Number.parseInt(expiration, 10);
    if (exp <= now - opts.timestampSkewSec * 1e3)
      throw new Error("Expired seal");
  }
  let pass = "";
  passwordId = passwordId || "default";
  if (typeof password === "string" || password instanceof Uint8Array)
    pass = password;
  else if (passwordId in password) {
    pass = password[passwordId];
  } else {
    throw new Error(`Cannot find password: ${passwordId}`);
  }
  pass = normalizePassword(pass);
  const macOptions = opts.integrity;
  macOptions.salt = hmacSalt;
  const mac = await hmacWithPassword(_crypto, pass.integrity, macOptions, macBaseString);
  if (!fixedTimeComparison(mac.digest, hmac))
    throw new Error("Bad hmac value");
  const encrypted = base64urlDecode(encryptedB64);
  const decryptOptions = opts.encryption;
  decryptOptions.salt = encryptionSalt;
  decryptOptions.iv = base64urlDecode(encryptionIv);
  const decrypted = await decrypt(_crypto, pass.encryption, decryptOptions, encrypted);
  if (decrypted)
    return JSON.parse(decrypted);
  return null;
};

function o(n){throw new Error(`${n} is not implemented yet!`)}let i$1 = class i extends EventEmitter{__unenv__={};readableEncoding=null;readableEnded=true;readableFlowing=false;readableHighWaterMark=0;readableLength=0;readableObjectMode=false;readableAborted=false;readableDidRead=false;closed=false;errored=null;readable=false;destroyed=false;static from(e,t){return new i(t)}constructor(e){super();}_read(e){}read(e){}setEncoding(e){return this}pause(){return this}resume(){return this}isPaused(){return  true}unpipe(e){return this}unshift(e,t){}wrap(e){return this}push(e,t){return  false}_destroy(e,t){this.removeAllListeners();}destroy(e){return this.destroyed=true,this._destroy(e),this}pipe(e,t){return {}}compose(e,t){throw new Error("Method not implemented.")}[Symbol.asyncDispose](){return this.destroy(),Promise.resolve()}async*[Symbol.asyncIterator](){throw o("Readable.asyncIterator")}iterator(e){throw o("Readable.iterator")}map(e,t){throw o("Readable.map")}filter(e,t){throw o("Readable.filter")}forEach(e,t){throw o("Readable.forEach")}reduce(e,t,r){throw o("Readable.reduce")}find(e,t){throw o("Readable.find")}findIndex(e,t){throw o("Readable.findIndex")}some(e,t){throw o("Readable.some")}toArray(e){throw o("Readable.toArray")}every(e,t){throw o("Readable.every")}flatMap(e,t){throw o("Readable.flatMap")}drop(e,t){throw o("Readable.drop")}take(e,t){throw o("Readable.take")}asIndexedPairs(e){throw o("Readable.asIndexedPairs")}};let l$1 = class l extends EventEmitter{__unenv__={};writable=true;writableEnded=false;writableFinished=false;writableHighWaterMark=0;writableLength=0;writableObjectMode=false;writableCorked=0;closed=false;errored=null;writableNeedDrain=false;writableAborted=false;destroyed=false;_data;_encoding="utf8";constructor(e){super();}pipe(e,t){return {}}_write(e,t,r){if(this.writableEnded){r&&r();return}if(this._data===void 0)this._data=e;else {const s=typeof this._data=="string"?Buffer$1.from(this._data,this._encoding||t||"utf8"):this._data,a=typeof e=="string"?Buffer$1.from(e,t||this._encoding||"utf8"):e;this._data=Buffer$1.concat([s,a]);}this._encoding=t,r&&r();}_writev(e,t){}_destroy(e,t){}_final(e){}write(e,t,r){const s=typeof t=="string"?this._encoding:"utf8",a=typeof t=="function"?t:typeof r=="function"?r:void 0;return this._write(e,s,a),true}setDefaultEncoding(e){return this}end(e,t,r){const s=typeof e=="function"?e:typeof t=="function"?t:typeof r=="function"?r:void 0;if(this.writableEnded)return s&&s(),this;const a=e===s?void 0:e;if(a){const u=t===s?void 0:t;this.write(a,u,s);}return this.writableEnded=true,this.writableFinished=true,this.emit("close"),this.emit("finish"),this}cork(){}uncork(){}destroy(e){return this.destroyed=true,delete this._data,this.removeAllListeners(),this}compose(e,t){throw new Error("Method not implemented.")}[Symbol.asyncDispose](){return Promise.resolve()}};const c$1=class c{allowHalfOpen=true;_destroy;constructor(e=new i$1,t=new l$1){Object.assign(this,e),Object.assign(this,t),this._destroy=m(e._destroy,t._destroy);}};function _(){return Object.assign(c$1.prototype,i$1.prototype),Object.assign(c$1.prototype,l$1.prototype),c$1}function m(...n){return function(...e){for(const t of n)t(...e);}}const g=_();class A extends g{__unenv__={};bufferSize=0;bytesRead=0;bytesWritten=0;connecting=false;destroyed=false;pending=false;localAddress="";localPort=0;remoteAddress="";remoteFamily="";remotePort=0;autoSelectFamilyAttemptedAddresses=[];readyState="readOnly";constructor(e){super();}write(e,t,r){return  false}connect(e,t,r){return this}end(e,t,r){return this}setEncoding(e){return this}pause(){return this}resume(){return this}setTimeout(e,t){return this}setNoDelay(e){return this}setKeepAlive(e,t){return this}address(){return {}}unref(){return this}ref(){return this}destroySoon(){this.destroy();}resetAndDestroy(){const e=new Error("ERR_SOCKET_CLOSED");return e.code="ERR_SOCKET_CLOSED",this.destroy(e),this}}class y extends i$1{aborted=false;httpVersion="1.1";httpVersionMajor=1;httpVersionMinor=1;complete=true;connection;socket;headers={};trailers={};method="GET";url="/";statusCode=200;statusMessage="";closed=false;errored=null;readable=false;constructor(e){super(),this.socket=this.connection=e||new A;}get rawHeaders(){const e=this.headers,t=[];for(const r in e)if(Array.isArray(e[r]))for(const s of e[r])t.push(r,s);else t.push(r,e[r]);return t}get rawTrailers(){return []}setTimeout(e,t){return this}get headersDistinct(){return p(this.headers)}get trailersDistinct(){return p(this.trailers)}}function p(n){const e={};for(const[t,r]of Object.entries(n))t&&(e[t]=(Array.isArray(r)?r:[r]).filter(Boolean));return e}class w extends l$1{statusCode=200;statusMessage="";upgrading=false;chunkedEncoding=false;shouldKeepAlive=false;useChunkedEncodingByDefault=false;sendDate=false;finished=false;headersSent=false;strictContentLength=false;connection=null;socket=null;req;_headers={};constructor(e){super(),this.req=e;}assignSocket(e){e._httpMessage=this,this.socket=e,this.connection=e,this.emit("socket",e),this._flush();}_flush(){this.flushHeaders();}detachSocket(e){}writeContinue(e){}writeHead(e,t,r){e&&(this.statusCode=e),typeof t=="string"&&(this.statusMessage=t,t=void 0);const s=r||t;if(s&&!Array.isArray(s))for(const a in s)this.setHeader(a,s[a]);return this.headersSent=true,this}writeProcessing(){}setTimeout(e,t){return this}appendHeader(e,t){e=e.toLowerCase();const r=this._headers[e],s=[...Array.isArray(r)?r:[r],...Array.isArray(t)?t:[t]].filter(Boolean);return this._headers[e]=s.length>1?s:s[0],this}setHeader(e,t){return this._headers[e.toLowerCase()]=t,this}setHeaders(e){for(const[t,r]of Object.entries(e))this.setHeader(t,r);return this}getHeader(e){return this._headers[e.toLowerCase()]}getHeaders(){return this._headers}getHeaderNames(){return Object.keys(this._headers)}hasHeader(e){return e.toLowerCase()in this._headers}removeHeader(e){delete this._headers[e.toLowerCase()];}addTrailers(e){}flushHeaders(){}writeEarlyHints(e,t){typeof t=="function"&&t();}}const E=(()=>{const n=function(){};return n.prototype=Object.create(null),n})();function R(n={}){const e=new E,t=Array.isArray(n)||H(n)?n:Object.entries(n);for(const[r,s]of t)if(s){if(e[r]===void 0){e[r]=s;continue}e[r]=[...Array.isArray(e[r])?e[r]:[e[r]],...Array.isArray(s)?s:[s]];}return e}function H(n){return typeof n?.entries=="function"}function v(n={}){if(n instanceof Headers)return n;const e=new Headers;for(const[t,r]of Object.entries(n))if(r!==void 0){if(Array.isArray(r)){for(const s of r)e.append(t,String(s));continue}e.set(t,String(r));}return e}const S=new Set([101,204,205,304]);async function b(n,e){const t=new y,r=new w(t);t.url=e.url?.toString()||"/";let s;if(!t.url.startsWith("/")){const d=new URL(t.url);s=d.host,t.url=d.pathname+d.search+d.hash;}t.method=e.method||"GET",t.headers=R(e.headers||{}),t.headers.host||(t.headers.host=e.host||s||"localhost"),t.connection.encrypted=t.connection.encrypted||e.protocol==="https",t.body=e.body||null,t.__unenv__=e.context,await n(t,r);let a=r._data;(S.has(r.statusCode)||t.method.toUpperCase()==="HEAD")&&(a=null,delete r._headers["content-length"]);const u={status:r.statusCode,statusText:r.statusMessage,headers:r._headers,body:a};return t.destroy(),r.destroy(),u}async function C(n,e,t={}){try{const r=await b(n,{url:e,...t});return new Response(r.body,{status:r.status,statusText:r.statusText,headers:v(r.headers)})}catch(r){return new Response(r.toString(),{status:Number.parseInt(r.statusCode||r.code)||500,statusText:r.statusText})}}

function useBase(base, handler) {
  base = withoutTrailingSlash(base);
  if (!base || base === "/") {
    return handler;
  }
  return eventHandler(async (event) => {
    event.node.req.originalUrl = event.node.req.originalUrl || event.node.req.url || "/";
    const _path = event._path || event.node.req.url || "/";
    event._path = withoutBase(event.path || "/", base);
    event.node.req.url = event._path;
    try {
      return await handler(event);
    } finally {
      event._path = event.node.req.url = _path;
    }
  });
}

function hasProp(obj, prop) {
  try {
    return prop in obj;
  } catch {
    return false;
  }
}

class H3Error extends Error {
  static __h3_error__ = true;
  statusCode = 500;
  fatal = false;
  unhandled = false;
  statusMessage;
  data;
  cause;
  constructor(message, opts = {}) {
    super(message, opts);
    if (opts.cause && !this.cause) {
      this.cause = opts.cause;
    }
  }
  toJSON() {
    const obj = {
      message: this.message,
      statusCode: sanitizeStatusCode(this.statusCode, 500)
    };
    if (this.statusMessage) {
      obj.statusMessage = sanitizeStatusMessage(this.statusMessage);
    }
    if (this.data !== void 0) {
      obj.data = this.data;
    }
    return obj;
  }
}
function createError$1(input) {
  if (typeof input === "string") {
    return new H3Error(input);
  }
  if (isError(input)) {
    return input;
  }
  const err = new H3Error(input.message ?? input.statusMessage ?? "", {
    cause: input.cause || input
  });
  if (hasProp(input, "stack")) {
    try {
      Object.defineProperty(err, "stack", {
        get() {
          return input.stack;
        }
      });
    } catch {
      try {
        err.stack = input.stack;
      } catch {
      }
    }
  }
  if (input.data) {
    err.data = input.data;
  }
  if (input.statusCode) {
    err.statusCode = sanitizeStatusCode(input.statusCode, err.statusCode);
  } else if (input.status) {
    err.statusCode = sanitizeStatusCode(input.status, err.statusCode);
  }
  if (input.statusMessage) {
    err.statusMessage = input.statusMessage;
  } else if (input.statusText) {
    err.statusMessage = input.statusText;
  }
  if (err.statusMessage) {
    const originalMessage = err.statusMessage;
    const sanitizedMessage = sanitizeStatusMessage(err.statusMessage);
    if (sanitizedMessage !== originalMessage) {
      console.warn(
        "[h3] Please prefer using `message` for longer error messages instead of `statusMessage`. In the future, `statusMessage` will be sanitized by default."
      );
    }
  }
  if (input.fatal !== void 0) {
    err.fatal = input.fatal;
  }
  if (input.unhandled !== void 0) {
    err.unhandled = input.unhandled;
  }
  return err;
}
function sendError(event, error, debug) {
  if (event.handled) {
    return;
  }
  const h3Error = isError(error) ? error : createError$1(error);
  const responseBody = {
    statusCode: h3Error.statusCode,
    statusMessage: h3Error.statusMessage,
    stack: [],
    data: h3Error.data
  };
  if (debug) {
    responseBody.stack = (h3Error.stack || "").split("\n").map((l) => l.trim());
  }
  if (event.handled) {
    return;
  }
  const _code = Number.parseInt(h3Error.statusCode);
  setResponseStatus(event, _code, h3Error.statusMessage);
  event.node.res.setHeader("content-type", MIMES.json);
  event.node.res.end(JSON.stringify(responseBody, void 0, 2));
}
function isError(input) {
  return input?.constructor?.__h3_error__ === true;
}

function getQuery(event) {
  return getQuery$1(event.path || "");
}
function getRouterParams(event, opts = {}) {
  let params = event.context.params || {};
  if (opts.decode) {
    params = { ...params };
    for (const key in params) {
      params[key] = decode$1(params[key]);
    }
  }
  return params;
}
function getRouterParam(event, name, opts = {}) {
  const params = getRouterParams(event, opts);
  return params[name];
}
function isMethod(event, expected, allowHead) {
  if (typeof expected === "string") {
    if (event.method === expected) {
      return true;
    }
  } else if (expected.includes(event.method)) {
    return true;
  }
  return false;
}
function assertMethod(event, expected, allowHead) {
  if (!isMethod(event, expected)) {
    throw createError$1({
      statusCode: 405,
      statusMessage: "HTTP method is not allowed."
    });
  }
}
function getRequestHeaders(event) {
  const _headers = {};
  for (const key in event.node.req.headers) {
    const val = event.node.req.headers[key];
    _headers[key] = Array.isArray(val) ? val.filter(Boolean).join(", ") : val;
  }
  return _headers;
}
function getRequestHeader(event, name) {
  const headers = getRequestHeaders(event);
  const value = headers[name.toLowerCase()];
  return value;
}
function getRequestHost(event, opts = {}) {
  if (opts.xForwardedHost) {
    const _header = event.node.req.headers["x-forwarded-host"];
    const xForwardedHost = (_header || "").split(",").shift()?.trim();
    if (xForwardedHost) {
      return xForwardedHost;
    }
  }
  return event.node.req.headers.host || "localhost";
}
function getRequestProtocol(event, opts = {}) {
  if (opts.xForwardedProto !== false && event.node.req.headers["x-forwarded-proto"] === "https") {
    return "https";
  }
  return event.node.req.connection?.encrypted ? "https" : "http";
}
function getRequestURL(event, opts = {}) {
  const host = getRequestHost(event, opts);
  const protocol = getRequestProtocol(event, opts);
  const path = (event.node.req.originalUrl || event.path).replace(
    /^[/\\]+/g,
    "/"
  );
  return new URL(path, `${protocol}://${host}`);
}

const RawBodySymbol = Symbol.for("h3RawBody");
const ParsedBodySymbol = Symbol.for("h3ParsedBody");
const PayloadMethods$1 = ["PATCH", "POST", "PUT", "DELETE"];
function readRawBody(event, encoding = "utf8") {
  assertMethod(event, PayloadMethods$1);
  const _rawBody = event._requestBody || event.web?.request?.body || event.node.req[RawBodySymbol] || event.node.req.rawBody || event.node.req.body;
  if (_rawBody) {
    const promise2 = Promise.resolve(_rawBody).then((_resolved) => {
      if (Buffer.isBuffer(_resolved)) {
        return _resolved;
      }
      if (typeof _resolved.pipeTo === "function") {
        return new Promise((resolve, reject) => {
          const chunks = [];
          _resolved.pipeTo(
            new WritableStream({
              write(chunk) {
                chunks.push(chunk);
              },
              close() {
                resolve(Buffer.concat(chunks));
              },
              abort(reason) {
                reject(reason);
              }
            })
          ).catch(reject);
        });
      } else if (typeof _resolved.pipe === "function") {
        return new Promise((resolve, reject) => {
          const chunks = [];
          _resolved.on("data", (chunk) => {
            chunks.push(chunk);
          }).on("end", () => {
            resolve(Buffer.concat(chunks));
          }).on("error", reject);
        });
      }
      if (_resolved.constructor === Object) {
        return Buffer.from(JSON.stringify(_resolved));
      }
      if (_resolved instanceof URLSearchParams) {
        return Buffer.from(_resolved.toString());
      }
      if (_resolved instanceof FormData) {
        return new Response(_resolved).bytes().then((uint8arr) => Buffer.from(uint8arr));
      }
      return Buffer.from(_resolved);
    });
    return encoding ? promise2.then((buff) => buff.toString(encoding)) : promise2;
  }
  if (!Number.parseInt(event.node.req.headers["content-length"] || "") && !String(event.node.req.headers["transfer-encoding"] ?? "").split(",").map((e) => e.trim()).filter(Boolean).includes("chunked")) {
    return Promise.resolve(void 0);
  }
  const promise = event.node.req[RawBodySymbol] = new Promise(
    (resolve, reject) => {
      const bodyData = [];
      event.node.req.on("error", (err) => {
        reject(err);
      }).on("data", (chunk) => {
        bodyData.push(chunk);
      }).on("end", () => {
        resolve(Buffer.concat(bodyData));
      });
    }
  );
  const result = encoding ? promise.then((buff) => buff.toString(encoding)) : promise;
  return result;
}
async function readBody(event, options = {}) {
  const request = event.node.req;
  if (hasProp(request, ParsedBodySymbol)) {
    return request[ParsedBodySymbol];
  }
  const contentType = request.headers["content-type"] || "";
  const body = await readRawBody(event);
  let parsed;
  if (contentType === "application/json") {
    parsed = _parseJSON(body, options.strict ?? true);
  } else if (contentType.startsWith("application/x-www-form-urlencoded")) {
    parsed = _parseURLEncodedBody(body);
  } else if (contentType.startsWith("text/")) {
    parsed = body;
  } else {
    parsed = _parseJSON(body, options.strict ?? false);
  }
  request[ParsedBodySymbol] = parsed;
  return parsed;
}
function getRequestWebStream(event) {
  if (!PayloadMethods$1.includes(event.method)) {
    return;
  }
  const bodyStream = event.web?.request?.body || event._requestBody;
  if (bodyStream) {
    return bodyStream;
  }
  const _hasRawBody = RawBodySymbol in event.node.req || "rawBody" in event.node.req || "body" in event.node.req || "__unenv__" in event.node.req;
  if (_hasRawBody) {
    return new ReadableStream({
      async start(controller) {
        const _rawBody = await readRawBody(event, false);
        if (_rawBody) {
          controller.enqueue(_rawBody);
        }
        controller.close();
      }
    });
  }
  return new ReadableStream({
    start: (controller) => {
      event.node.req.on("data", (chunk) => {
        controller.enqueue(chunk);
      });
      event.node.req.on("end", () => {
        controller.close();
      });
      event.node.req.on("error", (err) => {
        controller.error(err);
      });
    }
  });
}
function _parseJSON(body = "", strict) {
  if (!body) {
    return void 0;
  }
  try {
    return destr(body, { strict });
  } catch {
    throw createError$1({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "Invalid JSON body"
    });
  }
}
function _parseURLEncodedBody(body) {
  const form = new URLSearchParams(body);
  const parsedForm = /* @__PURE__ */ Object.create(null);
  for (const [key, value] of form.entries()) {
    if (hasProp(parsedForm, key)) {
      if (!Array.isArray(parsedForm[key])) {
        parsedForm[key] = [parsedForm[key]];
      }
      parsedForm[key].push(value);
    } else {
      parsedForm[key] = value;
    }
  }
  return parsedForm;
}

function handleCacheHeaders(event, opts) {
  const cacheControls = ["public", ...opts.cacheControls || []];
  let cacheMatched = false;
  if (opts.maxAge !== void 0) {
    cacheControls.push(`max-age=${+opts.maxAge}`, `s-maxage=${+opts.maxAge}`);
  }
  if (opts.modifiedTime) {
    const modifiedTime = new Date(opts.modifiedTime);
    const ifModifiedSince = event.node.req.headers["if-modified-since"];
    event.node.res.setHeader("last-modified", modifiedTime.toUTCString());
    if (ifModifiedSince && new Date(ifModifiedSince) >= modifiedTime) {
      cacheMatched = true;
    }
  }
  if (opts.etag) {
    event.node.res.setHeader("etag", opts.etag);
    const ifNonMatch = event.node.req.headers["if-none-match"];
    if (ifNonMatch === opts.etag) {
      cacheMatched = true;
    }
  }
  event.node.res.setHeader("cache-control", cacheControls.join(", "));
  if (cacheMatched) {
    event.node.res.statusCode = 304;
    if (!event.handled) {
      event.node.res.end();
    }
    return true;
  }
  return false;
}

const MIMES = {
  html: "text/html",
  json: "application/json"
};

const DISALLOWED_STATUS_CHARS = /[^\u0009\u0020-\u007E]/g;
function sanitizeStatusMessage(statusMessage = "") {
  return statusMessage.replace(DISALLOWED_STATUS_CHARS, "");
}
function sanitizeStatusCode(statusCode, defaultStatusCode = 200) {
  if (!statusCode) {
    return defaultStatusCode;
  }
  if (typeof statusCode === "string") {
    statusCode = Number.parseInt(statusCode, 10);
  }
  if (statusCode < 100 || statusCode > 999) {
    return defaultStatusCode;
  }
  return statusCode;
}

function getDistinctCookieKey(name, opts) {
  return [name, opts.domain || "", opts.path || "/"].join(";");
}

function parseCookies(event) {
  return parse(event.node.req.headers.cookie || "");
}
function getCookie(event, name) {
  return parseCookies(event)[name];
}
function setCookie(event, name, value, serializeOptions = {}) {
  if (!serializeOptions.path) {
    serializeOptions = { path: "/", ...serializeOptions };
  }
  const newCookie = serialize$2(name, value, serializeOptions);
  const currentCookies = splitCookiesString(
    event.node.res.getHeader("set-cookie")
  );
  if (currentCookies.length === 0) {
    event.node.res.setHeader("set-cookie", newCookie);
    return;
  }
  const newCookieKey = getDistinctCookieKey(name, serializeOptions);
  event.node.res.removeHeader("set-cookie");
  for (const cookie of currentCookies) {
    const parsed = parseSetCookie(cookie);
    const key = getDistinctCookieKey(parsed.name, parsed);
    if (key === newCookieKey) {
      continue;
    }
    event.node.res.appendHeader("set-cookie", cookie);
  }
  event.node.res.appendHeader("set-cookie", newCookie);
}
function deleteCookie(event, name, serializeOptions) {
  setCookie(event, name, "", {
    ...serializeOptions,
    maxAge: 0
  });
}
function splitCookiesString(cookiesString) {
  if (Array.isArray(cookiesString)) {
    return cookiesString.flatMap((c) => splitCookiesString(c));
  }
  if (typeof cookiesString !== "string") {
    return [];
  }
  const cookiesStrings = [];
  let pos = 0;
  let start;
  let ch;
  let lastComma;
  let nextStart;
  let cookiesSeparatorFound;
  const skipWhitespace = () => {
    while (pos < cookiesString.length && /\s/.test(cookiesString.charAt(pos))) {
      pos += 1;
    }
    return pos < cookiesString.length;
  };
  const notSpecialChar = () => {
    ch = cookiesString.charAt(pos);
    return ch !== "=" && ch !== ";" && ch !== ",";
  };
  while (pos < cookiesString.length) {
    start = pos;
    cookiesSeparatorFound = false;
    while (skipWhitespace()) {
      ch = cookiesString.charAt(pos);
      if (ch === ",") {
        lastComma = pos;
        pos += 1;
        skipWhitespace();
        nextStart = pos;
        while (pos < cookiesString.length && notSpecialChar()) {
          pos += 1;
        }
        if (pos < cookiesString.length && cookiesString.charAt(pos) === "=") {
          cookiesSeparatorFound = true;
          pos = nextStart;
          cookiesStrings.push(cookiesString.slice(start, lastComma));
          start = pos;
        } else {
          pos = lastComma + 1;
        }
      } else {
        pos += 1;
      }
    }
    if (!cookiesSeparatorFound || pos >= cookiesString.length) {
      cookiesStrings.push(cookiesString.slice(start));
    }
  }
  return cookiesStrings;
}

const defer = typeof setImmediate === "undefined" ? (fn) => fn() : setImmediate;
function send(event, data, type) {
  if (type) {
    defaultContentType(event, type);
  }
  return new Promise((resolve) => {
    defer(() => {
      if (!event.handled) {
        event.node.res.end(data);
      }
      resolve();
    });
  });
}
function sendNoContent(event, code) {
  if (event.handled) {
    return;
  }
  if (!code && event.node.res.statusCode !== 200) {
    code = event.node.res.statusCode;
  }
  const _code = sanitizeStatusCode(code, 204);
  if (_code === 204) {
    event.node.res.removeHeader("content-length");
  }
  event.node.res.writeHead(_code);
  event.node.res.end();
}
function setResponseStatus(event, code, text) {
  if (code) {
    event.node.res.statusCode = sanitizeStatusCode(
      code,
      event.node.res.statusCode
    );
  }
  if (text) {
    event.node.res.statusMessage = sanitizeStatusMessage(text);
  }
}
function getResponseStatus(event) {
  return event.node.res.statusCode;
}
function getResponseStatusText(event) {
  return event.node.res.statusMessage;
}
function defaultContentType(event, type) {
  if (type && event.node.res.statusCode !== 304 && !event.node.res.getHeader("content-type")) {
    event.node.res.setHeader("content-type", type);
  }
}
function sendRedirect(event, location, code = 302) {
  event.node.res.statusCode = sanitizeStatusCode(
    code,
    event.node.res.statusCode
  );
  event.node.res.setHeader("location", location);
  const encodedLoc = location.replace(/"/g, "%22");
  const html = `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=${encodedLoc}"></head></html>`;
  return send(event, html, MIMES.html);
}
function getResponseHeader(event, name) {
  return event.node.res.getHeader(name);
}
function setResponseHeaders(event, headers) {
  for (const [name, value] of Object.entries(headers)) {
    event.node.res.setHeader(
      name,
      value
    );
  }
}
const setHeaders = setResponseHeaders;
function setResponseHeader(event, name, value) {
  event.node.res.setHeader(name, value);
}
const setHeader = setResponseHeader;
function appendResponseHeader(event, name, value) {
  let current = event.node.res.getHeader(name);
  if (!current) {
    event.node.res.setHeader(name, value);
    return;
  }
  if (!Array.isArray(current)) {
    current = [current.toString()];
  }
  event.node.res.setHeader(name, [...current, value]);
}
const appendHeader = appendResponseHeader;
function isStream(data) {
  if (!data || typeof data !== "object") {
    return false;
  }
  if (typeof data.pipe === "function") {
    if (typeof data._read === "function") {
      return true;
    }
    if (typeof data.abort === "function") {
      return true;
    }
  }
  if (typeof data.pipeTo === "function") {
    return true;
  }
  return false;
}
function isWebResponse(data) {
  return typeof Response !== "undefined" && data instanceof Response;
}
function sendStream(event, stream) {
  if (!stream || typeof stream !== "object") {
    throw new Error("[h3] Invalid stream provided.");
  }
  event.node.res._data = stream;
  if (!event.node.res.socket) {
    event._handled = true;
    return Promise.resolve();
  }
  if (hasProp(stream, "pipeTo") && typeof stream.pipeTo === "function") {
    return stream.pipeTo(
      new WritableStream({
        write(chunk) {
          event.node.res.write(chunk);
        }
      })
    ).then(() => {
      event.node.res.end();
    });
  }
  if (hasProp(stream, "pipe") && typeof stream.pipe === "function") {
    return new Promise((resolve, reject) => {
      stream.pipe(event.node.res);
      if (stream.on) {
        stream.on("end", () => {
          event.node.res.end();
          resolve();
        });
        stream.on("error", (error) => {
          reject(error);
        });
      }
      event.node.res.on("close", () => {
        if (stream.abort) {
          stream.abort();
        }
      });
    });
  }
  throw new Error("[h3] Invalid or incompatible stream provided.");
}
function sendWebResponse(event, response) {
  for (const [key, value] of response.headers) {
    if (key === "set-cookie") {
      event.node.res.appendHeader(key, splitCookiesString(value));
    } else {
      event.node.res.setHeader(key, value);
    }
  }
  if (response.status) {
    event.node.res.statusCode = sanitizeStatusCode(
      response.status,
      event.node.res.statusCode
    );
  }
  if (response.statusText) {
    event.node.res.statusMessage = sanitizeStatusMessage(response.statusText);
  }
  if (response.redirected) {
    event.node.res.setHeader("location", response.url);
  }
  if (!response.body) {
    event.node.res.end();
    return;
  }
  return sendStream(event, response.body);
}

const PayloadMethods = /* @__PURE__ */ new Set(["PATCH", "POST", "PUT", "DELETE"]);
const ignoredHeaders = /* @__PURE__ */ new Set([
  "transfer-encoding",
  "accept-encoding",
  "connection",
  "keep-alive",
  "upgrade",
  "expect",
  "host",
  "accept"
]);
async function proxyRequest(event, target, opts = {}) {
  let body;
  let duplex;
  if (PayloadMethods.has(event.method)) {
    if (opts.streamRequest) {
      body = getRequestWebStream(event);
      duplex = "half";
    } else {
      body = await readRawBody(event, false).catch(() => void 0);
    }
  }
  const method = opts.fetchOptions?.method || event.method;
  const fetchHeaders = mergeHeaders$1(
    getProxyRequestHeaders(event, { host: target.startsWith("/") }),
    opts.fetchOptions?.headers,
    opts.headers
  );
  return sendProxy(event, target, {
    ...opts,
    fetchOptions: {
      method,
      body,
      duplex,
      ...opts.fetchOptions,
      headers: fetchHeaders
    }
  });
}
async function sendProxy(event, target, opts = {}) {
  let response;
  try {
    response = await _getFetch(opts.fetch)(target, {
      headers: opts.headers,
      ignoreResponseError: true,
      // make $ofetch.raw transparent
      ...opts.fetchOptions
    });
  } catch (error) {
    throw createError$1({
      status: 502,
      statusMessage: "Bad Gateway",
      cause: error
    });
  }
  event.node.res.statusCode = sanitizeStatusCode(
    response.status,
    event.node.res.statusCode
  );
  event.node.res.statusMessage = sanitizeStatusMessage(response.statusText);
  const cookies = [];
  for (const [key, value] of response.headers.entries()) {
    if (key === "content-encoding") {
      continue;
    }
    if (key === "content-length") {
      continue;
    }
    if (key === "set-cookie") {
      cookies.push(...splitCookiesString(value));
      continue;
    }
    event.node.res.setHeader(key, value);
  }
  if (cookies.length > 0) {
    event.node.res.setHeader(
      "set-cookie",
      cookies.map((cookie) => {
        if (opts.cookieDomainRewrite) {
          cookie = rewriteCookieProperty(
            cookie,
            opts.cookieDomainRewrite,
            "domain"
          );
        }
        if (opts.cookiePathRewrite) {
          cookie = rewriteCookieProperty(
            cookie,
            opts.cookiePathRewrite,
            "path"
          );
        }
        return cookie;
      })
    );
  }
  if (opts.onResponse) {
    await opts.onResponse(event, response);
  }
  if (response._data !== void 0) {
    return response._data;
  }
  if (event.handled) {
    return;
  }
  if (opts.sendStream === false) {
    const data = new Uint8Array(await response.arrayBuffer());
    return event.node.res.end(data);
  }
  if (response.body) {
    for await (const chunk of response.body) {
      event.node.res.write(chunk);
    }
  }
  return event.node.res.end();
}
function getProxyRequestHeaders(event, opts) {
  const headers = /* @__PURE__ */ Object.create(null);
  const reqHeaders = getRequestHeaders(event);
  for (const name in reqHeaders) {
    if (!ignoredHeaders.has(name) || name === "host" && opts?.host) {
      headers[name] = reqHeaders[name];
    }
  }
  return headers;
}
function fetchWithEvent(event, req, init, options) {
  return _getFetch(options?.fetch)(req, {
    ...init,
    context: init?.context || event.context,
    headers: {
      ...getProxyRequestHeaders(event, {
        host: typeof req === "string" && req.startsWith("/")
      }),
      ...init?.headers
    }
  });
}
function _getFetch(_fetch) {
  if (_fetch) {
    return _fetch;
  }
  if (globalThis.fetch) {
    return globalThis.fetch;
  }
  throw new Error(
    "fetch is not available. Try importing `node-fetch-native/polyfill` for Node.js."
  );
}
function rewriteCookieProperty(header, map, property) {
  const _map = typeof map === "string" ? { "*": map } : map;
  return header.replace(
    new RegExp(`(;\\s*${property}=)([^;]+)`, "gi"),
    (match, prefix, previousValue) => {
      let newValue;
      if (previousValue in _map) {
        newValue = _map[previousValue];
      } else if ("*" in _map) {
        newValue = _map["*"];
      } else {
        return match;
      }
      return newValue ? prefix + newValue : "";
    }
  );
}
function mergeHeaders$1(defaults, ...inputs) {
  const _inputs = inputs.filter(Boolean);
  if (_inputs.length === 0) {
    return defaults;
  }
  const merged = new Headers(defaults);
  for (const input of _inputs) {
    const entries = Array.isArray(input) ? input : typeof input.entries === "function" ? input.entries() : Object.entries(input);
    for (const [key, value] of entries) {
      if (value !== void 0) {
        merged.set(key, value);
      }
    }
  }
  return merged;
}

const getSessionPromise = Symbol("getSession");
const DEFAULT_NAME = "h3";
const DEFAULT_COOKIE = {
  path: "/",
  secure: true,
  httpOnly: true
};
async function useSession(event, config) {
  const sessionName = config.name || DEFAULT_NAME;
  await getSession(event, config);
  const sessionManager = {
    get id() {
      return event.context.sessions?.[sessionName]?.id;
    },
    get data() {
      return event.context.sessions?.[sessionName]?.data || {};
    },
    update: async (update) => {
      if (!isEvent(event)) {
        throw new Error("[h3] Cannot update read-only session.");
      }
      await updateSession(event, config, update);
      return sessionManager;
    },
    clear: () => {
      if (!isEvent(event)) {
        throw new Error("[h3] Cannot clear read-only session.");
      }
      clearSession(event, config);
      return Promise.resolve(sessionManager);
    }
  };
  return sessionManager;
}
async function getSession(event, config) {
  const sessionName = config.name || DEFAULT_NAME;
  if (!event.context.sessions) {
    event.context.sessions = /* @__PURE__ */ Object.create(null);
  }
  const existingSession = event.context.sessions[sessionName];
  if (existingSession) {
    return existingSession[getSessionPromise] || existingSession;
  }
  const session = {
    id: "",
    createdAt: 0,
    data: /* @__PURE__ */ Object.create(null)
  };
  event.context.sessions[sessionName] = session;
  let sealedSession;
  if (config.sessionHeader !== false) {
    const headerName = typeof config.sessionHeader === "string" ? config.sessionHeader.toLowerCase() : `x-${sessionName.toLowerCase()}-session`;
    const headerValue = _getReqHeader(event, headerName);
    if (typeof headerValue === "string") {
      sealedSession = headerValue;
    }
  }
  if (!sealedSession) {
    const cookieHeader = _getReqHeader(event, "cookie");
    if (cookieHeader) {
      sealedSession = parse(cookieHeader + "")[sessionName];
    }
  }
  if (sealedSession) {
    const promise = unsealSession(event, config, sealedSession).catch(() => {
    }).then((unsealed) => {
      Object.assign(session, unsealed);
      delete event.context.sessions[sessionName][getSessionPromise];
      return session;
    });
    event.context.sessions[sessionName][getSessionPromise] = promise;
    await promise;
  }
  if (!session.id) {
    if (!isEvent(event)) {
      throw new Error(
        "Cannot initialize a new session. Make sure using `useSession(event)` in main handler."
      );
    }
    session.id = config.generateId?.() ?? (config.crypto || _crypto).randomUUID();
    session.createdAt = Date.now();
    await updateSession(event, config);
  }
  return session;
}
function _getReqHeader(event, name) {
  if (event.node) {
    return event.node?.req.headers[name];
  }
  if (event.request) {
    return event.request.headers?.get(name);
  }
  if (event.headers) {
    return event.headers.get(name);
  }
}
async function updateSession(event, config, update) {
  const sessionName = config.name || DEFAULT_NAME;
  const session = event.context.sessions?.[sessionName] || await getSession(event, config);
  if (typeof update === "function") {
    update = update(session.data);
  }
  if (update) {
    Object.assign(session.data, update);
  }
  if (config.cookie !== false) {
    const sealed = await sealSession(event, config);
    setCookie(event, sessionName, sealed, {
      ...DEFAULT_COOKIE,
      expires: config.maxAge ? new Date(session.createdAt + config.maxAge * 1e3) : void 0,
      ...config.cookie
    });
  }
  return session;
}
async function sealSession(event, config) {
  const sessionName = config.name || DEFAULT_NAME;
  const session = event.context.sessions?.[sessionName] || await getSession(event, config);
  const sealed = await seal(config.crypto || _crypto, session, config.password, {
    ...defaults,
    ttl: config.maxAge ? config.maxAge * 1e3 : 0,
    ...config.seal
  });
  return sealed;
}
async function unsealSession(_event, config, sealed) {
  const unsealed = await unseal(
    config.crypto || _crypto,
    sealed,
    config.password,
    {
      ...defaults,
      ttl: config.maxAge ? config.maxAge * 1e3 : 0,
      ...config.seal
    }
  );
  if (config.maxAge) {
    const age = Date.now() - (unsealed.createdAt || Number.NEGATIVE_INFINITY);
    if (age > config.maxAge * 1e3) {
      throw new Error("Session expired!");
    }
  }
  return unsealed;
}
function clearSession(event, config) {
  const sessionName = config.name || DEFAULT_NAME;
  if (event.context.sessions?.[sessionName]) {
    delete event.context.sessions[sessionName];
  }
  setCookie(event, sessionName, "", {
    ...DEFAULT_COOKIE,
    ...config.cookie
  });
  return Promise.resolve();
}

class H3Event {
  "__is_event__" = true;
  // Context
  node;
  // Node
  web;
  // Web
  context = {};
  // Shared
  // Request
  _method;
  _path;
  _headers;
  _requestBody;
  // Response
  _handled = false;
  // Hooks
  _onBeforeResponseCalled;
  _onAfterResponseCalled;
  constructor(req, res) {
    this.node = { req, res };
  }
  // --- Request ---
  get method() {
    if (!this._method) {
      this._method = (this.node.req.method || "GET").toUpperCase();
    }
    return this._method;
  }
  get path() {
    return this._path || this.node.req.url || "/";
  }
  get headers() {
    if (!this._headers) {
      this._headers = _normalizeNodeHeaders(this.node.req.headers);
    }
    return this._headers;
  }
  // --- Respoonse ---
  get handled() {
    return this._handled || this.node.res.writableEnded || this.node.res.headersSent;
  }
  respondWith(response) {
    return Promise.resolve(response).then(
      (_response) => sendWebResponse(this, _response)
    );
  }
  // --- Utils ---
  toString() {
    return `[${this.method}] ${this.path}`;
  }
  toJSON() {
    return this.toString();
  }
  // --- Deprecated ---
  /** @deprecated Please use `event.node.req` instead. */
  get req() {
    return this.node.req;
  }
  /** @deprecated Please use `event.node.res` instead. */
  get res() {
    return this.node.res;
  }
}
function isEvent(input) {
  return hasProp(input, "__is_event__");
}
function createEvent(req, res) {
  return new H3Event(req, res);
}
function _normalizeNodeHeaders(nodeHeaders) {
  const headers = new Headers();
  for (const [name, value] of Object.entries(nodeHeaders)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        headers.append(name, item);
      }
    } else if (value) {
      headers.set(name, value);
    }
  }
  return headers;
}

function defineEventHandler(handler) {
  if (typeof handler === "function") {
    handler.__is_handler__ = true;
    return handler;
  }
  const _hooks = {
    onRequest: _normalizeArray(handler.onRequest),
    onBeforeResponse: _normalizeArray(handler.onBeforeResponse)
  };
  const _handler = (event) => {
    return _callHandler(event, handler.handler, _hooks);
  };
  _handler.__is_handler__ = true;
  _handler.__resolve__ = handler.handler.__resolve__;
  _handler.__websocket__ = handler.websocket;
  return _handler;
}
function _normalizeArray(input) {
  return input ? Array.isArray(input) ? input : [input] : void 0;
}
async function _callHandler(event, handler, hooks) {
  if (hooks.onRequest) {
    for (const hook of hooks.onRequest) {
      await hook(event);
      if (event.handled) {
        return;
      }
    }
  }
  const body = await handler(event);
  const response = { body };
  if (hooks.onBeforeResponse) {
    for (const hook of hooks.onBeforeResponse) {
      await hook(event, response);
    }
  }
  return response.body;
}
const eventHandler = defineEventHandler;
function isEventHandler(input) {
  return hasProp(input, "__is_handler__");
}
function toEventHandler(input, _, _route) {
  if (!isEventHandler(input)) {
    console.warn(
      "[h3] Implicit event handler conversion is deprecated. Use `eventHandler()` or `fromNodeMiddleware()` to define event handlers.",
      _route && _route !== "/" ? `
     Route: ${_route}` : "",
      `
     Handler: ${input}`
    );
  }
  return input;
}
function defineLazyEventHandler(factory) {
  let _promise;
  let _resolved;
  const resolveHandler = () => {
    if (_resolved) {
      return Promise.resolve(_resolved);
    }
    if (!_promise) {
      _promise = Promise.resolve(factory()).then((r) => {
        const handler2 = r.default || r;
        if (typeof handler2 !== "function") {
          throw new TypeError(
            "Invalid lazy handler result. It should be a function:",
            handler2
          );
        }
        _resolved = { handler: toEventHandler(r.default || r) };
        return _resolved;
      });
    }
    return _promise;
  };
  const handler = eventHandler((event) => {
    if (_resolved) {
      return _resolved.handler(event);
    }
    return resolveHandler().then((r) => r.handler(event));
  });
  handler.__resolve__ = resolveHandler;
  return handler;
}
const lazyEventHandler = defineLazyEventHandler;

function createApp(options = {}) {
  const stack = [];
  const handler = createAppEventHandler(stack, options);
  const resolve = createResolver(stack);
  handler.__resolve__ = resolve;
  const getWebsocket = cachedFn(() => websocketOptions(resolve, options));
  const app = {
    // @ts-expect-error
    use: (arg1, arg2, arg3) => use(app, arg1, arg2, arg3),
    resolve,
    handler,
    stack,
    options,
    get websocket() {
      return getWebsocket();
    }
  };
  return app;
}
function use(app, arg1, arg2, arg3) {
  if (Array.isArray(arg1)) {
    for (const i of arg1) {
      use(app, i, arg2, arg3);
    }
  } else if (Array.isArray(arg2)) {
    for (const i of arg2) {
      use(app, arg1, i, arg3);
    }
  } else if (typeof arg1 === "string") {
    app.stack.push(
      normalizeLayer({ ...arg3, route: arg1, handler: arg2 })
    );
  } else if (typeof arg1 === "function") {
    app.stack.push(normalizeLayer({ ...arg2, handler: arg1 }));
  } else {
    app.stack.push(normalizeLayer({ ...arg1 }));
  }
  return app;
}
function createAppEventHandler(stack, options) {
  const spacing = options.debug ? 2 : void 0;
  return eventHandler(async (event) => {
    event.node.req.originalUrl = event.node.req.originalUrl || event.node.req.url || "/";
    const _reqPath = event._path || event.node.req.url || "/";
    let _layerPath;
    if (options.onRequest) {
      await options.onRequest(event);
    }
    for (const layer of stack) {
      if (layer.route.length > 1) {
        if (!_reqPath.startsWith(layer.route)) {
          continue;
        }
        _layerPath = _reqPath.slice(layer.route.length) || "/";
      } else {
        _layerPath = _reqPath;
      }
      if (layer.match && !layer.match(_layerPath, event)) {
        continue;
      }
      event._path = _layerPath;
      event.node.req.url = _layerPath;
      const val = await layer.handler(event);
      const _body = val === void 0 ? void 0 : await val;
      if (_body !== void 0) {
        const _response = { body: _body };
        if (options.onBeforeResponse) {
          event._onBeforeResponseCalled = true;
          await options.onBeforeResponse(event, _response);
        }
        await handleHandlerResponse(event, _response.body, spacing);
        if (options.onAfterResponse) {
          event._onAfterResponseCalled = true;
          await options.onAfterResponse(event, _response);
        }
        return;
      }
      if (event.handled) {
        if (options.onAfterResponse) {
          event._onAfterResponseCalled = true;
          await options.onAfterResponse(event, void 0);
        }
        return;
      }
    }
    if (!event.handled) {
      throw createError$1({
        statusCode: 404,
        statusMessage: `Cannot find any path matching ${event.path || "/"}.`
      });
    }
    if (options.onAfterResponse) {
      event._onAfterResponseCalled = true;
      await options.onAfterResponse(event, void 0);
    }
  });
}
function createResolver(stack) {
  return async (path) => {
    let _layerPath;
    for (const layer of stack) {
      if (layer.route === "/" && !layer.handler.__resolve__) {
        continue;
      }
      if (!path.startsWith(layer.route)) {
        continue;
      }
      _layerPath = path.slice(layer.route.length) || "/";
      if (layer.match && !layer.match(_layerPath, void 0)) {
        continue;
      }
      let res = { route: layer.route, handler: layer.handler };
      if (res.handler.__resolve__) {
        const _res = await res.handler.__resolve__(_layerPath);
        if (!_res) {
          continue;
        }
        res = {
          ...res,
          ..._res,
          route: joinURL(res.route || "/", _res.route || "/")
        };
      }
      return res;
    }
  };
}
function normalizeLayer(input) {
  let handler = input.handler;
  if (handler.handler) {
    handler = handler.handler;
  }
  if (input.lazy) {
    handler = lazyEventHandler(handler);
  } else if (!isEventHandler(handler)) {
    handler = toEventHandler(handler, void 0, input.route);
  }
  return {
    route: withoutTrailingSlash(input.route),
    match: input.match,
    handler
  };
}
function handleHandlerResponse(event, val, jsonSpace) {
  if (val === null) {
    return sendNoContent(event);
  }
  if (val) {
    if (isWebResponse(val)) {
      return sendWebResponse(event, val);
    }
    if (isStream(val)) {
      return sendStream(event, val);
    }
    if (val.buffer) {
      return send(event, val);
    }
    if (val.arrayBuffer && typeof val.arrayBuffer === "function") {
      return val.arrayBuffer().then((arrayBuffer) => {
        return send(event, Buffer.from(arrayBuffer), val.type);
      });
    }
    if (val instanceof Error) {
      throw createError$1(val);
    }
    if (typeof val.end === "function") {
      return true;
    }
  }
  const valType = typeof val;
  if (valType === "string") {
    return send(event, val, MIMES.html);
  }
  if (valType === "object" || valType === "boolean" || valType === "number") {
    return send(event, JSON.stringify(val, void 0, jsonSpace), MIMES.json);
  }
  if (valType === "bigint") {
    return send(event, val.toString(), MIMES.json);
  }
  throw createError$1({
    statusCode: 500,
    statusMessage: `[h3] Cannot send ${valType} as response.`
  });
}
function cachedFn(fn) {
  let cache;
  return () => {
    if (!cache) {
      cache = fn();
    }
    return cache;
  };
}
function websocketOptions(evResolver, appOptions) {
  return {
    ...appOptions.websocket,
    async resolve(info) {
      const url = info.request?.url || info.url || "/";
      const { pathname } = typeof url === "string" ? parseURL(url) : url;
      const resolved = await evResolver(pathname);
      return resolved?.handler?.__websocket__ || {};
    }
  };
}

const RouterMethods = [
  "connect",
  "delete",
  "get",
  "head",
  "options",
  "post",
  "put",
  "trace",
  "patch"
];
function createRouter(opts = {}) {
  const _router = createRouter$1({});
  const routes = {};
  let _matcher;
  const router = {};
  const addRoute = (path, handler, method) => {
    let route = routes[path];
    if (!route) {
      routes[path] = route = { path, handlers: {} };
      _router.insert(path, route);
    }
    if (Array.isArray(method)) {
      for (const m of method) {
        addRoute(path, handler, m);
      }
    } else {
      route.handlers[method] = toEventHandler(handler, void 0, path);
    }
    return router;
  };
  router.use = router.add = (path, handler, method) => addRoute(path, handler, method || "all");
  for (const method of RouterMethods) {
    router[method] = (path, handle) => router.add(path, handle, method);
  }
  const matchHandler = (path = "/", method = "get") => {
    const qIndex = path.indexOf("?");
    if (qIndex !== -1) {
      path = path.slice(0, Math.max(0, qIndex));
    }
    const matched = _router.lookup(path);
    if (!matched || !matched.handlers) {
      return {
        error: createError$1({
          statusCode: 404,
          name: "Not Found",
          statusMessage: `Cannot find any route matching ${path || "/"}.`
        })
      };
    }
    let handler = matched.handlers[method] || matched.handlers.all;
    if (!handler) {
      if (!_matcher) {
        _matcher = toRouteMatcher(_router);
      }
      const _matches = _matcher.matchAll(path).reverse();
      for (const _match of _matches) {
        if (_match.handlers[method]) {
          handler = _match.handlers[method];
          matched.handlers[method] = matched.handlers[method] || handler;
          break;
        }
        if (_match.handlers.all) {
          handler = _match.handlers.all;
          matched.handlers.all = matched.handlers.all || handler;
          break;
        }
      }
    }
    if (!handler) {
      return {
        error: createError$1({
          statusCode: 405,
          name: "Method Not Allowed",
          statusMessage: `Method ${method} is not allowed on this route.`
        })
      };
    }
    return { matched, handler };
  };
  const isPreemptive = opts.preemptive || opts.preemtive;
  router.handler = eventHandler((event) => {
    const match = matchHandler(
      event.path,
      event.method.toLowerCase()
    );
    if ("error" in match) {
      if (isPreemptive) {
        throw match.error;
      } else {
        return;
      }
    }
    event.context.matchedRoute = match.matched;
    const params = match.matched.params || {};
    event.context.params = params;
    return Promise.resolve(match.handler(event)).then((res) => {
      if (res === void 0 && isPreemptive) {
        return null;
      }
      return res;
    });
  });
  router.handler.__resolve__ = async (path) => {
    path = withLeadingSlash(path);
    const match = matchHandler(path);
    if ("error" in match) {
      return;
    }
    let res = {
      route: match.matched.path,
      handler: match.handler
    };
    if (match.handler.__resolve__) {
      const _res = await match.handler.__resolve__(path);
      if (!_res) {
        return;
      }
      res = { ...res, ..._res };
    }
    return res;
  };
  return router;
}
function toNodeListener(app) {
  const toNodeHandle = async function(req, res) {
    const event = createEvent(req, res);
    try {
      await app.handler(event);
    } catch (_error) {
      const error = createError$1(_error);
      if (!isError(_error)) {
        error.unhandled = true;
      }
      setResponseStatus(event, error.statusCode, error.statusMessage);
      if (app.options.onError) {
        await app.options.onError(error, event);
      }
      if (event.handled) {
        return;
      }
      if (error.unhandled || error.fatal) {
        console.error("[h3]", error.fatal ? "[fatal]" : "[unhandled]", error);
      }
      if (app.options.onBeforeResponse && !event._onBeforeResponseCalled) {
        await app.options.onBeforeResponse(event, { body: error });
      }
      await sendError(event, error, !!app.options.debug);
      if (app.options.onAfterResponse && !event._onAfterResponseCalled) {
        await app.options.onAfterResponse(event, { body: error });
      }
    }
  };
  return toNodeHandle;
}

function flatHooks(configHooks, hooks = {}, parentName) {
  for (const key in configHooks) {
    const subHook = configHooks[key];
    const name = parentName ? `${parentName}:${key}` : key;
    if (typeof subHook === "object" && subHook !== null) {
      flatHooks(subHook, hooks, name);
    } else if (typeof subHook === "function") {
      hooks[name] = subHook;
    }
  }
  return hooks;
}
const defaultTask = { run: (function_) => function_() };
const _createTask = () => defaultTask;
const createTask = typeof console.createTask !== "undefined" ? console.createTask : _createTask;
function serialTaskCaller(hooks, args) {
  const name = args.shift();
  const task = createTask(name);
  return hooks.reduce(
    (promise, hookFunction) => promise.then(() => task.run(() => hookFunction(...args))),
    Promise.resolve()
  );
}
function parallelTaskCaller(hooks, args) {
  const name = args.shift();
  const task = createTask(name);
  return Promise.all(hooks.map((hook) => task.run(() => hook(...args))));
}
function callEachWith(callbacks, arg0) {
  for (const callback of [...callbacks]) {
    callback(arg0);
  }
}

class Hookable {
  constructor() {
    this._hooks = {};
    this._before = void 0;
    this._after = void 0;
    this._deprecatedMessages = void 0;
    this._deprecatedHooks = {};
    this.hook = this.hook.bind(this);
    this.callHook = this.callHook.bind(this);
    this.callHookWith = this.callHookWith.bind(this);
  }
  hook(name, function_, options = {}) {
    if (!name || typeof function_ !== "function") {
      return () => {
      };
    }
    const originalName = name;
    let dep;
    while (this._deprecatedHooks[name]) {
      dep = this._deprecatedHooks[name];
      name = dep.to;
    }
    if (dep && !options.allowDeprecated) {
      let message = dep.message;
      if (!message) {
        message = `${originalName} hook has been deprecated` + (dep.to ? `, please use ${dep.to}` : "");
      }
      if (!this._deprecatedMessages) {
        this._deprecatedMessages = /* @__PURE__ */ new Set();
      }
      if (!this._deprecatedMessages.has(message)) {
        console.warn(message);
        this._deprecatedMessages.add(message);
      }
    }
    if (!function_.name) {
      try {
        Object.defineProperty(function_, "name", {
          get: () => "_" + name.replace(/\W+/g, "_") + "_hook_cb",
          configurable: true
        });
      } catch {
      }
    }
    this._hooks[name] = this._hooks[name] || [];
    this._hooks[name].push(function_);
    return () => {
      if (function_) {
        this.removeHook(name, function_);
        function_ = void 0;
      }
    };
  }
  hookOnce(name, function_) {
    let _unreg;
    let _function = (...arguments_) => {
      if (typeof _unreg === "function") {
        _unreg();
      }
      _unreg = void 0;
      _function = void 0;
      return function_(...arguments_);
    };
    _unreg = this.hook(name, _function);
    return _unreg;
  }
  removeHook(name, function_) {
    if (this._hooks[name]) {
      const index = this._hooks[name].indexOf(function_);
      if (index !== -1) {
        this._hooks[name].splice(index, 1);
      }
      if (this._hooks[name].length === 0) {
        delete this._hooks[name];
      }
    }
  }
  deprecateHook(name, deprecated) {
    this._deprecatedHooks[name] = typeof deprecated === "string" ? { to: deprecated } : deprecated;
    const _hooks = this._hooks[name] || [];
    delete this._hooks[name];
    for (const hook of _hooks) {
      this.hook(name, hook);
    }
  }
  deprecateHooks(deprecatedHooks) {
    Object.assign(this._deprecatedHooks, deprecatedHooks);
    for (const name in deprecatedHooks) {
      this.deprecateHook(name, deprecatedHooks[name]);
    }
  }
  addHooks(configHooks) {
    const hooks = flatHooks(configHooks);
    const removeFns = Object.keys(hooks).map(
      (key) => this.hook(key, hooks[key])
    );
    return () => {
      for (const unreg of removeFns.splice(0, removeFns.length)) {
        unreg();
      }
    };
  }
  removeHooks(configHooks) {
    const hooks = flatHooks(configHooks);
    for (const key in hooks) {
      this.removeHook(key, hooks[key]);
    }
  }
  removeAllHooks() {
    for (const key in this._hooks) {
      delete this._hooks[key];
    }
  }
  callHook(name, ...arguments_) {
    arguments_.unshift(name);
    return this.callHookWith(serialTaskCaller, name, ...arguments_);
  }
  callHookParallel(name, ...arguments_) {
    arguments_.unshift(name);
    return this.callHookWith(parallelTaskCaller, name, ...arguments_);
  }
  callHookWith(caller, name, ...arguments_) {
    const event = this._before || this._after ? { name, args: arguments_, context: {} } : void 0;
    if (this._before) {
      callEachWith(this._before, event);
    }
    const result = caller(
      name in this._hooks ? [...this._hooks[name]] : [],
      arguments_
    );
    if (result instanceof Promise) {
      return result.finally(() => {
        if (this._after && event) {
          callEachWith(this._after, event);
        }
      });
    }
    if (this._after && event) {
      callEachWith(this._after, event);
    }
    return result;
  }
  beforeEach(function_) {
    this._before = this._before || [];
    this._before.push(function_);
    return () => {
      if (this._before !== void 0) {
        const index = this._before.indexOf(function_);
        if (index !== -1) {
          this._before.splice(index, 1);
        }
      }
    };
  }
  afterEach(function_) {
    this._after = this._after || [];
    this._after.push(function_);
    return () => {
      if (this._after !== void 0) {
        const index = this._after.indexOf(function_);
        if (index !== -1) {
          this._after.splice(index, 1);
        }
      }
    };
  }
}
function createHooks() {
  return new Hookable();
}

const s$1=globalThis.Headers,i=globalThis.AbortController,l=globalThis.fetch||(()=>{throw new Error("[node-fetch-native] Failed to fetch: `globalThis.fetch` is not available!")});

class FetchError extends Error {
  constructor(message, opts) {
    super(message, opts);
    this.name = "FetchError";
    if (opts?.cause && !this.cause) {
      this.cause = opts.cause;
    }
  }
}
function createFetchError(ctx) {
  const errorMessage = ctx.error?.message || ctx.error?.toString() || "";
  const method = ctx.request?.method || ctx.options?.method || "GET";
  const url = ctx.request?.url || String(ctx.request) || "/";
  const requestStr = `[${method}] ${JSON.stringify(url)}`;
  const statusStr = ctx.response ? `${ctx.response.status} ${ctx.response.statusText}` : "<no response>";
  const message = `${requestStr}: ${statusStr}${errorMessage ? ` ${errorMessage}` : ""}`;
  const fetchError = new FetchError(
    message,
    ctx.error ? { cause: ctx.error } : void 0
  );
  for (const key of ["request", "options", "response"]) {
    Object.defineProperty(fetchError, key, {
      get() {
        return ctx[key];
      }
    });
  }
  for (const [key, refKey] of [
    ["data", "_data"],
    ["status", "status"],
    ["statusCode", "status"],
    ["statusText", "statusText"],
    ["statusMessage", "statusText"]
  ]) {
    Object.defineProperty(fetchError, key, {
      get() {
        return ctx.response && ctx.response[refKey];
      }
    });
  }
  return fetchError;
}

const payloadMethods = new Set(
  Object.freeze(["PATCH", "POST", "PUT", "DELETE"])
);
function isPayloadMethod(method = "GET") {
  return payloadMethods.has(method.toUpperCase());
}
function isJSONSerializable(value) {
  if (value === void 0) {
    return false;
  }
  const t = typeof value;
  if (t === "string" || t === "number" || t === "boolean" || t === null) {
    return true;
  }
  if (t !== "object") {
    return false;
  }
  if (Array.isArray(value)) {
    return true;
  }
  if (value.buffer) {
    return false;
  }
  if (value instanceof FormData || value instanceof URLSearchParams) {
    return false;
  }
  return value.constructor && value.constructor.name === "Object" || typeof value.toJSON === "function";
}
const textTypes = /* @__PURE__ */ new Set([
  "image/svg",
  "application/xml",
  "application/xhtml",
  "application/html"
]);
const JSON_RE = /^application\/(?:[\w!#$%&*.^`~-]*\+)?json(;.+)?$/i;
function detectResponseType(_contentType = "") {
  if (!_contentType) {
    return "json";
  }
  const contentType = _contentType.split(";").shift() || "";
  if (JSON_RE.test(contentType)) {
    return "json";
  }
  if (contentType === "text/event-stream") {
    return "stream";
  }
  if (textTypes.has(contentType) || contentType.startsWith("text/")) {
    return "text";
  }
  return "blob";
}
function resolveFetchOptions(request, input, defaults, Headers) {
  const headers = mergeHeaders(
    input?.headers ?? request?.headers,
    defaults?.headers,
    Headers
  );
  let query;
  if (defaults?.query || defaults?.params || input?.params || input?.query) {
    query = {
      ...defaults?.params,
      ...defaults?.query,
      ...input?.params,
      ...input?.query
    };
  }
  return {
    ...defaults,
    ...input,
    query,
    params: query,
    headers
  };
}
function mergeHeaders(input, defaults, Headers) {
  if (!defaults) {
    return new Headers(input);
  }
  const headers = new Headers(defaults);
  if (input) {
    for (const [key, value] of Symbol.iterator in input || Array.isArray(input) ? input : new Headers(input)) {
      headers.set(key, value);
    }
  }
  return headers;
}
async function callHooks(context, hooks) {
  if (hooks) {
    if (Array.isArray(hooks)) {
      for (const hook of hooks) {
        await hook(context);
      }
    } else {
      await hooks(context);
    }
  }
}

const retryStatusCodes = /* @__PURE__ */ new Set([
  408,
  // Request Timeout
  409,
  // Conflict
  425,
  // Too Early (Experimental)
  429,
  // Too Many Requests
  500,
  // Internal Server Error
  502,
  // Bad Gateway
  503,
  // Service Unavailable
  504
  // Gateway Timeout
]);
const nullBodyResponses = /* @__PURE__ */ new Set([101, 204, 205, 304]);
function createFetch(globalOptions = {}) {
  const {
    fetch = globalThis.fetch,
    Headers = globalThis.Headers,
    AbortController = globalThis.AbortController
  } = globalOptions;
  async function onError(context) {
    const isAbort = context.error && context.error.name === "AbortError" && !context.options.timeout || false;
    if (context.options.retry !== false && !isAbort) {
      let retries;
      if (typeof context.options.retry === "number") {
        retries = context.options.retry;
      } else {
        retries = isPayloadMethod(context.options.method) ? 0 : 1;
      }
      const responseCode = context.response && context.response.status || 500;
      if (retries > 0 && (Array.isArray(context.options.retryStatusCodes) ? context.options.retryStatusCodes.includes(responseCode) : retryStatusCodes.has(responseCode))) {
        const retryDelay = typeof context.options.retryDelay === "function" ? context.options.retryDelay(context) : context.options.retryDelay || 0;
        if (retryDelay > 0) {
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
        }
        return $fetchRaw(context.request, {
          ...context.options,
          retry: retries - 1
        });
      }
    }
    const error = createFetchError(context);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(error, $fetchRaw);
    }
    throw error;
  }
  const $fetchRaw = async function $fetchRaw2(_request, _options = {}) {
    const context = {
      request: _request,
      options: resolveFetchOptions(
        _request,
        _options,
        globalOptions.defaults,
        Headers
      ),
      response: void 0,
      error: void 0
    };
    if (context.options.method) {
      context.options.method = context.options.method.toUpperCase();
    }
    if (context.options.onRequest) {
      await callHooks(context, context.options.onRequest);
      if (!(context.options.headers instanceof Headers)) {
        context.options.headers = new Headers(
          context.options.headers || {}
          /* compat */
        );
      }
    }
    if (typeof context.request === "string") {
      if (context.options.baseURL) {
        context.request = withBase(context.request, context.options.baseURL);
      }
      if (context.options.query) {
        context.request = withQuery(context.request, context.options.query);
        delete context.options.query;
      }
      if ("query" in context.options) {
        delete context.options.query;
      }
      if ("params" in context.options) {
        delete context.options.params;
      }
    }
    if (context.options.body && isPayloadMethod(context.options.method)) {
      if (isJSONSerializable(context.options.body)) {
        const contentType = context.options.headers.get("content-type");
        if (typeof context.options.body !== "string") {
          context.options.body = contentType === "application/x-www-form-urlencoded" ? new URLSearchParams(
            context.options.body
          ).toString() : JSON.stringify(context.options.body);
        }
        if (!contentType) {
          context.options.headers.set("content-type", "application/json");
        }
        if (!context.options.headers.has("accept")) {
          context.options.headers.set("accept", "application/json");
        }
      } else if (
        // ReadableStream Body
        "pipeTo" in context.options.body && typeof context.options.body.pipeTo === "function" || // Node.js Stream Body
        typeof context.options.body.pipe === "function"
      ) {
        if (!("duplex" in context.options)) {
          context.options.duplex = "half";
        }
      }
    }
    let abortTimeout;
    if (!context.options.signal && context.options.timeout) {
      const controller = new AbortController();
      abortTimeout = setTimeout(() => {
        const error = new Error(
          "[TimeoutError]: The operation was aborted due to timeout"
        );
        error.name = "TimeoutError";
        error.code = 23;
        controller.abort(error);
      }, context.options.timeout);
      context.options.signal = controller.signal;
    }
    try {
      context.response = await fetch(
        context.request,
        context.options
      );
    } catch (error) {
      context.error = error;
      if (context.options.onRequestError) {
        await callHooks(
          context,
          context.options.onRequestError
        );
      }
      return await onError(context);
    } finally {
      if (abortTimeout) {
        clearTimeout(abortTimeout);
      }
    }
    const hasBody = (context.response.body || // https://github.com/unjs/ofetch/issues/324
    // https://github.com/unjs/ofetch/issues/294
    // https://github.com/JakeChampion/fetch/issues/1454
    context.response._bodyInit) && !nullBodyResponses.has(context.response.status) && context.options.method !== "HEAD";
    if (hasBody) {
      const responseType = (context.options.parseResponse ? "json" : context.options.responseType) || detectResponseType(context.response.headers.get("content-type") || "");
      switch (responseType) {
        case "json": {
          const data = await context.response.text();
          const parseFunction = context.options.parseResponse || destr;
          context.response._data = parseFunction(data);
          break;
        }
        case "stream": {
          context.response._data = context.response.body || context.response._bodyInit;
          break;
        }
        default: {
          context.response._data = await context.response[responseType]();
        }
      }
    }
    if (context.options.onResponse) {
      await callHooks(
        context,
        context.options.onResponse
      );
    }
    if (!context.options.ignoreResponseError && context.response.status >= 400 && context.response.status < 600) {
      if (context.options.onResponseError) {
        await callHooks(
          context,
          context.options.onResponseError
        );
      }
      return await onError(context);
    }
    return context.response;
  };
  const $fetch = async function $fetch2(request, options) {
    const r = await $fetchRaw(request, options);
    return r._data;
  };
  $fetch.raw = $fetchRaw;
  $fetch.native = (...args) => fetch(...args);
  $fetch.create = (defaultOptions = {}, customGlobalOptions = {}) => createFetch({
    ...globalOptions,
    ...customGlobalOptions,
    defaults: {
      ...globalOptions.defaults,
      ...customGlobalOptions.defaults,
      ...defaultOptions
    }
  });
  return $fetch;
}

function createNodeFetch() {
  const useKeepAlive = JSON.parse(process.env.FETCH_KEEP_ALIVE || "false");
  if (!useKeepAlive) {
    return l;
  }
  const agentOptions = { keepAlive: true };
  const httpAgent = new http.Agent(agentOptions);
  const httpsAgent = new https.Agent(agentOptions);
  const nodeFetchOptions = {
    agent(parsedURL) {
      return parsedURL.protocol === "http:" ? httpAgent : httpsAgent;
    }
  };
  return function nodeFetchWithKeepAlive(input, init) {
    return l(input, { ...nodeFetchOptions, ...init });
  };
}
const fetch$1 = globalThis.fetch ? (...args) => globalThis.fetch(...args) : createNodeFetch();
const Headers$1 = globalThis.Headers || s$1;
const AbortController = globalThis.AbortController || i;
const ofetch = createFetch({ fetch: fetch$1, Headers: Headers$1, AbortController });
const $fetch$1 = ofetch;

function wrapToPromise(value) {
  if (!value || typeof value.then !== "function") {
    return Promise.resolve(value);
  }
  return value;
}
function asyncCall(function_, ...arguments_) {
  try {
    return wrapToPromise(function_(...arguments_));
  } catch (error) {
    return Promise.reject(error);
  }
}
function isPrimitive(value) {
  const type = typeof value;
  return value === null || type !== "object" && type !== "function";
}
function isPureObject(value) {
  const proto = Object.getPrototypeOf(value);
  return !proto || proto.isPrototypeOf(Object);
}
function stringify(value) {
  if (isPrimitive(value)) {
    return String(value);
  }
  if (isPureObject(value) || Array.isArray(value)) {
    return JSON.stringify(value);
  }
  if (typeof value.toJSON === "function") {
    return stringify(value.toJSON());
  }
  throw new Error("[unstorage] Cannot stringify value!");
}
const BASE64_PREFIX = "base64:";
function serializeRaw(value) {
  if (typeof value === "string") {
    return value;
  }
  return BASE64_PREFIX + base64Encode(value);
}
function deserializeRaw(value) {
  if (typeof value !== "string") {
    return value;
  }
  if (!value.startsWith(BASE64_PREFIX)) {
    return value;
  }
  return base64Decode(value.slice(BASE64_PREFIX.length));
}
function base64Decode(input) {
  if (globalThis.Buffer) {
    return Buffer.from(input, "base64");
  }
  return Uint8Array.from(
    globalThis.atob(input),
    (c) => c.codePointAt(0)
  );
}
function base64Encode(input) {
  if (globalThis.Buffer) {
    return Buffer.from(input).toString("base64");
  }
  return globalThis.btoa(String.fromCodePoint(...input));
}

const storageKeyProperties = [
  "has",
  "hasItem",
  "get",
  "getItem",
  "getItemRaw",
  "set",
  "setItem",
  "setItemRaw",
  "del",
  "remove",
  "removeItem",
  "getMeta",
  "setMeta",
  "removeMeta",
  "getKeys",
  "clear",
  "mount",
  "unmount"
];
function prefixStorage(storage, base) {
  base = normalizeBaseKey(base);
  if (!base) {
    return storage;
  }
  const nsStorage = { ...storage };
  for (const property of storageKeyProperties) {
    nsStorage[property] = (key = "", ...args) => (
      // @ts-ignore
      storage[property](base + key, ...args)
    );
  }
  nsStorage.getKeys = (key = "", ...arguments_) => storage.getKeys(base + key, ...arguments_).then((keys) => keys.map((key2) => key2.slice(base.length)));
  nsStorage.keys = nsStorage.getKeys;
  nsStorage.getItems = async (items, commonOptions) => {
    const prefixedItems = items.map(
      (item) => typeof item === "string" ? base + item : { ...item, key: base + item.key }
    );
    const results = await storage.getItems(prefixedItems, commonOptions);
    return results.map((entry) => ({
      key: entry.key.slice(base.length),
      value: entry.value
    }));
  };
  nsStorage.setItems = async (items, commonOptions) => {
    const prefixedItems = items.map((item) => ({
      key: base + item.key,
      value: item.value,
      options: item.options
    }));
    return storage.setItems(prefixedItems, commonOptions);
  };
  return nsStorage;
}
function normalizeKey$1(key) {
  if (!key) {
    return "";
  }
  return key.split("?")[0]?.replace(/[/\\]/g, ":").replace(/:+/g, ":").replace(/^:|:$/g, "") || "";
}
function joinKeys(...keys) {
  return normalizeKey$1(keys.join(":"));
}
function normalizeBaseKey(base) {
  base = normalizeKey$1(base);
  return base ? base + ":" : "";
}
function filterKeyByDepth(key, depth) {
  if (depth === void 0) {
    return true;
  }
  let substrCount = 0;
  let index = key.indexOf(":");
  while (index > -1) {
    substrCount++;
    index = key.indexOf(":", index + 1);
  }
  return substrCount <= depth;
}
function filterKeyByBase(key, base) {
  if (base) {
    return key.startsWith(base) && key[key.length - 1] !== "$";
  }
  return key[key.length - 1] !== "$";
}

function defineDriver$1(factory) {
  return factory;
}

const DRIVER_NAME$1 = "memory";
const memory = defineDriver$1(() => {
  const data = /* @__PURE__ */ new Map();
  return {
    name: DRIVER_NAME$1,
    getInstance: () => data,
    hasItem(key) {
      return data.has(key);
    },
    getItem(key) {
      return data.get(key) ?? null;
    },
    getItemRaw(key) {
      return data.get(key) ?? null;
    },
    setItem(key, value) {
      data.set(key, value);
    },
    setItemRaw(key, value) {
      data.set(key, value);
    },
    removeItem(key) {
      data.delete(key);
    },
    getKeys() {
      return [...data.keys()];
    },
    clear() {
      data.clear();
    },
    dispose() {
      data.clear();
    }
  };
});

function createStorage(options = {}) {
  const context = {
    mounts: { "": options.driver || memory() },
    mountpoints: [""],
    watching: false,
    watchListeners: [],
    unwatch: {}
  };
  const getMount = (key) => {
    for (const base of context.mountpoints) {
      if (key.startsWith(base)) {
        return {
          base,
          relativeKey: key.slice(base.length),
          driver: context.mounts[base]
        };
      }
    }
    return {
      base: "",
      relativeKey: key,
      driver: context.mounts[""]
    };
  };
  const getMounts = (base, includeParent) => {
    return context.mountpoints.filter(
      (mountpoint) => mountpoint.startsWith(base) || includeParent && base.startsWith(mountpoint)
    ).map((mountpoint) => ({
      relativeBase: base.length > mountpoint.length ? base.slice(mountpoint.length) : void 0,
      mountpoint,
      driver: context.mounts[mountpoint]
    }));
  };
  const onChange = (event, key) => {
    if (!context.watching) {
      return;
    }
    key = normalizeKey$1(key);
    for (const listener of context.watchListeners) {
      listener(event, key);
    }
  };
  const startWatch = async () => {
    if (context.watching) {
      return;
    }
    context.watching = true;
    for (const mountpoint in context.mounts) {
      context.unwatch[mountpoint] = await watch(
        context.mounts[mountpoint],
        onChange,
        mountpoint
      );
    }
  };
  const stopWatch = async () => {
    if (!context.watching) {
      return;
    }
    for (const mountpoint in context.unwatch) {
      await context.unwatch[mountpoint]();
    }
    context.unwatch = {};
    context.watching = false;
  };
  const runBatch = (items, commonOptions, cb) => {
    const batches = /* @__PURE__ */ new Map();
    const getBatch = (mount) => {
      let batch = batches.get(mount.base);
      if (!batch) {
        batch = {
          driver: mount.driver,
          base: mount.base,
          items: []
        };
        batches.set(mount.base, batch);
      }
      return batch;
    };
    for (const item of items) {
      const isStringItem = typeof item === "string";
      const key = normalizeKey$1(isStringItem ? item : item.key);
      const value = isStringItem ? void 0 : item.value;
      const options2 = isStringItem || !item.options ? commonOptions : { ...commonOptions, ...item.options };
      const mount = getMount(key);
      getBatch(mount).items.push({
        key,
        value,
        relativeKey: mount.relativeKey,
        options: options2
      });
    }
    return Promise.all([...batches.values()].map((batch) => cb(batch))).then(
      (r) => r.flat()
    );
  };
  const storage = {
    // Item
    hasItem(key, opts = {}) {
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      return asyncCall(driver.hasItem, relativeKey, opts);
    },
    getItem(key, opts = {}) {
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      return asyncCall(driver.getItem, relativeKey, opts).then(
        (value) => destr(value)
      );
    },
    getItems(items, commonOptions = {}) {
      return runBatch(items, commonOptions, (batch) => {
        if (batch.driver.getItems) {
          return asyncCall(
            batch.driver.getItems,
            batch.items.map((item) => ({
              key: item.relativeKey,
              options: item.options
            })),
            commonOptions
          ).then(
            (r) => r.map((item) => ({
              key: joinKeys(batch.base, item.key),
              value: destr(item.value)
            }))
          );
        }
        return Promise.all(
          batch.items.map((item) => {
            return asyncCall(
              batch.driver.getItem,
              item.relativeKey,
              item.options
            ).then((value) => ({
              key: item.key,
              value: destr(value)
            }));
          })
        );
      });
    },
    getItemRaw(key, opts = {}) {
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      if (driver.getItemRaw) {
        return asyncCall(driver.getItemRaw, relativeKey, opts);
      }
      return asyncCall(driver.getItem, relativeKey, opts).then(
        (value) => deserializeRaw(value)
      );
    },
    async setItem(key, value, opts = {}) {
      if (value === void 0) {
        return storage.removeItem(key);
      }
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      if (!driver.setItem) {
        return;
      }
      await asyncCall(driver.setItem, relativeKey, stringify(value), opts);
      if (!driver.watch) {
        onChange("update", key);
      }
    },
    async setItems(items, commonOptions) {
      await runBatch(items, commonOptions, async (batch) => {
        if (batch.driver.setItems) {
          return asyncCall(
            batch.driver.setItems,
            batch.items.map((item) => ({
              key: item.relativeKey,
              value: stringify(item.value),
              options: item.options
            })),
            commonOptions
          );
        }
        if (!batch.driver.setItem) {
          return;
        }
        await Promise.all(
          batch.items.map((item) => {
            return asyncCall(
              batch.driver.setItem,
              item.relativeKey,
              stringify(item.value),
              item.options
            );
          })
        );
      });
    },
    async setItemRaw(key, value, opts = {}) {
      if (value === void 0) {
        return storage.removeItem(key, opts);
      }
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      if (driver.setItemRaw) {
        await asyncCall(driver.setItemRaw, relativeKey, value, opts);
      } else if (driver.setItem) {
        await asyncCall(driver.setItem, relativeKey, serializeRaw(value), opts);
      } else {
        return;
      }
      if (!driver.watch) {
        onChange("update", key);
      }
    },
    async removeItem(key, opts = {}) {
      if (typeof opts === "boolean") {
        opts = { removeMeta: opts };
      }
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      if (!driver.removeItem) {
        return;
      }
      await asyncCall(driver.removeItem, relativeKey, opts);
      if (opts.removeMeta || opts.removeMata) {
        await asyncCall(driver.removeItem, relativeKey + "$", opts);
      }
      if (!driver.watch) {
        onChange("remove", key);
      }
    },
    // Meta
    async getMeta(key, opts = {}) {
      if (typeof opts === "boolean") {
        opts = { nativeOnly: opts };
      }
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      const meta = /* @__PURE__ */ Object.create(null);
      if (driver.getMeta) {
        Object.assign(meta, await asyncCall(driver.getMeta, relativeKey, opts));
      }
      if (!opts.nativeOnly) {
        const value = await asyncCall(
          driver.getItem,
          relativeKey + "$",
          opts
        ).then((value_) => destr(value_));
        if (value && typeof value === "object") {
          if (typeof value.atime === "string") {
            value.atime = new Date(value.atime);
          }
          if (typeof value.mtime === "string") {
            value.mtime = new Date(value.mtime);
          }
          Object.assign(meta, value);
        }
      }
      return meta;
    },
    setMeta(key, value, opts = {}) {
      return this.setItem(key + "$", value, opts);
    },
    removeMeta(key, opts = {}) {
      return this.removeItem(key + "$", opts);
    },
    // Keys
    async getKeys(base, opts = {}) {
      base = normalizeBaseKey(base);
      const mounts = getMounts(base, true);
      let maskedMounts = [];
      const allKeys = [];
      let allMountsSupportMaxDepth = true;
      for (const mount of mounts) {
        if (!mount.driver.flags?.maxDepth) {
          allMountsSupportMaxDepth = false;
        }
        const rawKeys = await asyncCall(
          mount.driver.getKeys,
          mount.relativeBase,
          opts
        );
        for (const key of rawKeys) {
          const fullKey = mount.mountpoint + normalizeKey$1(key);
          if (!maskedMounts.some((p) => fullKey.startsWith(p))) {
            allKeys.push(fullKey);
          }
        }
        maskedMounts = [
          mount.mountpoint,
          ...maskedMounts.filter((p) => !p.startsWith(mount.mountpoint))
        ];
      }
      const shouldFilterByDepth = opts.maxDepth !== void 0 && !allMountsSupportMaxDepth;
      return allKeys.filter(
        (key) => (!shouldFilterByDepth || filterKeyByDepth(key, opts.maxDepth)) && filterKeyByBase(key, base)
      );
    },
    // Utils
    async clear(base, opts = {}) {
      base = normalizeBaseKey(base);
      await Promise.all(
        getMounts(base, false).map(async (m) => {
          if (m.driver.clear) {
            return asyncCall(m.driver.clear, m.relativeBase, opts);
          }
          if (m.driver.removeItem) {
            const keys = await m.driver.getKeys(m.relativeBase || "", opts);
            return Promise.all(
              keys.map((key) => m.driver.removeItem(key, opts))
            );
          }
        })
      );
    },
    async dispose() {
      await Promise.all(
        Object.values(context.mounts).map((driver) => dispose(driver))
      );
    },
    async watch(callback) {
      await startWatch();
      context.watchListeners.push(callback);
      return async () => {
        context.watchListeners = context.watchListeners.filter(
          (listener) => listener !== callback
        );
        if (context.watchListeners.length === 0) {
          await stopWatch();
        }
      };
    },
    async unwatch() {
      context.watchListeners = [];
      await stopWatch();
    },
    // Mount
    mount(base, driver) {
      base = normalizeBaseKey(base);
      if (base && context.mounts[base]) {
        throw new Error(`already mounted at ${base}`);
      }
      if (base) {
        context.mountpoints.push(base);
        context.mountpoints.sort((a, b) => b.length - a.length);
      }
      context.mounts[base] = driver;
      if (context.watching) {
        Promise.resolve(watch(driver, onChange, base)).then((unwatcher) => {
          context.unwatch[base] = unwatcher;
        }).catch(console.error);
      }
      return storage;
    },
    async unmount(base, _dispose = true) {
      base = normalizeBaseKey(base);
      if (!base || !context.mounts[base]) {
        return;
      }
      if (context.watching && base in context.unwatch) {
        context.unwatch[base]?.();
        delete context.unwatch[base];
      }
      if (_dispose) {
        await dispose(context.mounts[base]);
      }
      context.mountpoints = context.mountpoints.filter((key) => key !== base);
      delete context.mounts[base];
    },
    getMount(key = "") {
      key = normalizeKey$1(key) + ":";
      const m = getMount(key);
      return {
        driver: m.driver,
        base: m.base
      };
    },
    getMounts(base = "", opts = {}) {
      base = normalizeKey$1(base);
      const mounts = getMounts(base, opts.parents);
      return mounts.map((m) => ({
        driver: m.driver,
        base: m.mountpoint
      }));
    },
    // Aliases
    keys: (base, opts = {}) => storage.getKeys(base, opts),
    get: (key, opts = {}) => storage.getItem(key, opts),
    set: (key, value, opts = {}) => storage.setItem(key, value, opts),
    has: (key, opts = {}) => storage.hasItem(key, opts),
    del: (key, opts = {}) => storage.removeItem(key, opts),
    remove: (key, opts = {}) => storage.removeItem(key, opts)
  };
  return storage;
}
function watch(driver, onChange, base) {
  return driver.watch ? driver.watch((event, key) => onChange(event, base + key)) : () => {
  };
}
async function dispose(driver) {
  if (typeof driver.dispose === "function") {
    await asyncCall(driver.dispose);
  }
}

const _assets = {

};

const normalizeKey = function normalizeKey(key) {
  if (!key) {
    return "";
  }
  return key.split("?")[0]?.replace(/[/\\]/g, ":").replace(/:+/g, ":").replace(/^:|:$/g, "") || "";
};

const assets = {
  getKeys() {
    return Promise.resolve(Object.keys(_assets))
  },
  hasItem (id) {
    id = normalizeKey(id);
    return Promise.resolve(id in _assets)
  },
  getItem (id) {
    id = normalizeKey(id);
    return Promise.resolve(_assets[id] ? _assets[id].import() : null)
  },
  getMeta (id) {
    id = normalizeKey(id);
    return Promise.resolve(_assets[id] ? _assets[id].meta : {})
  }
};

function defineDriver(factory) {
  return factory;
}
function createError(driver, message, opts) {
  const err = new Error(`[unstorage] [${driver}] ${message}`, opts);
  if (Error.captureStackTrace) {
    Error.captureStackTrace(err, createError);
  }
  return err;
}
function createRequiredError(driver, name) {
  if (Array.isArray(name)) {
    return createError(
      driver,
      `Missing some of the required options ${name.map((n) => "`" + n + "`").join(", ")}`
    );
  }
  return createError(driver, `Missing required option \`${name}\`.`);
}

function ignoreNotfound(err) {
  return err.code === "ENOENT" || err.code === "EISDIR" ? null : err;
}
function ignoreExists(err) {
  return err.code === "EEXIST" ? null : err;
}
async function writeFile(path, data, encoding) {
  await ensuredir(dirname(path));
  return promises.writeFile(path, data, encoding);
}
function readFile(path, encoding) {
  return promises.readFile(path, encoding).catch(ignoreNotfound);
}
function unlink(path) {
  return promises.unlink(path).catch(ignoreNotfound);
}
function readdir(dir) {
  return promises.readdir(dir, { withFileTypes: true }).catch(ignoreNotfound).then((r) => r || []);
}
async function ensuredir(dir) {
  if (existsSync(dir)) {
    return;
  }
  await ensuredir(dirname(dir)).catch(ignoreExists);
  await promises.mkdir(dir).catch(ignoreExists);
}
async function readdirRecursive(dir, ignore, maxDepth) {
  if (ignore && ignore(dir)) {
    return [];
  }
  const entries = await readdir(dir);
  const files = [];
  await Promise.all(
    entries.map(async (entry) => {
      const entryPath = resolve(dir, entry.name);
      if (entry.isDirectory()) {
        if (maxDepth === void 0 || maxDepth > 0) {
          const dirFiles = await readdirRecursive(
            entryPath,
            ignore,
            maxDepth === void 0 ? void 0 : maxDepth - 1
          );
          files.push(...dirFiles.map((f) => entry.name + "/" + f));
        }
      } else {
        if (!(ignore && ignore(entry.name))) {
          files.push(entry.name);
        }
      }
    })
  );
  return files;
}
async function rmRecursive(dir) {
  const entries = await readdir(dir);
  await Promise.all(
    entries.map((entry) => {
      const entryPath = resolve(dir, entry.name);
      if (entry.isDirectory()) {
        return rmRecursive(entryPath).then(() => promises.rmdir(entryPath));
      } else {
        return promises.unlink(entryPath);
      }
    })
  );
}

const PATH_TRAVERSE_RE = /\.\.:|\.\.$/;
const DRIVER_NAME = "fs-lite";
const unstorage_47drivers_47fs_45lite = defineDriver((opts = {}) => {
  if (!opts.base) {
    throw createRequiredError(DRIVER_NAME, "base");
  }
  opts.base = resolve(opts.base);
  const r = (key) => {
    if (PATH_TRAVERSE_RE.test(key)) {
      throw createError(
        DRIVER_NAME,
        `Invalid key: ${JSON.stringify(key)}. It should not contain .. segments`
      );
    }
    const resolved = join(opts.base, key.replace(/:/g, "/"));
    return resolved;
  };
  return {
    name: DRIVER_NAME,
    options: opts,
    flags: {
      maxDepth: true
    },
    hasItem(key) {
      return existsSync(r(key));
    },
    getItem(key) {
      return readFile(r(key), "utf8");
    },
    getItemRaw(key) {
      return readFile(r(key));
    },
    async getMeta(key) {
      const { atime, mtime, size, birthtime, ctime } = await promises.stat(r(key)).catch(() => ({}));
      return { atime, mtime, size, birthtime, ctime };
    },
    setItem(key, value) {
      if (opts.readOnly) {
        return;
      }
      return writeFile(r(key), value, "utf8");
    },
    setItemRaw(key, value) {
      if (opts.readOnly) {
        return;
      }
      return writeFile(r(key), value);
    },
    removeItem(key) {
      if (opts.readOnly) {
        return;
      }
      return unlink(r(key));
    },
    getKeys(_base, topts) {
      return readdirRecursive(r("."), opts.ignore, topts?.maxDepth);
    },
    async clear() {
      if (opts.readOnly || opts.noClear) {
        return;
      }
      await rmRecursive(r("."));
    }
  };
});

const storage = createStorage({});

storage.mount('/assets', assets);

storage.mount('data', unstorage_47drivers_47fs_45lite({"driver":"fsLite","base":"./.data/kv"}));

function useStorage(base = "") {
  return base ? prefixStorage(storage, base) : storage;
}

function serialize$1(o){return typeof o=="string"?`'${o}'`:new c().serialize(o)}const c=/*@__PURE__*/function(){class o{#t=new Map;compare(t,r){const e=typeof t,n=typeof r;return e==="string"&&n==="string"?t.localeCompare(r):e==="number"&&n==="number"?t-r:String.prototype.localeCompare.call(this.serialize(t,true),this.serialize(r,true))}serialize(t,r){if(t===null)return "null";switch(typeof t){case "string":return r?t:`'${t}'`;case "bigint":return `${t}n`;case "object":return this.$object(t);case "function":return this.$function(t)}return String(t)}serializeObject(t){const r=Object.prototype.toString.call(t);if(r!=="[object Object]")return this.serializeBuiltInType(r.length<10?`unknown:${r}`:r.slice(8,-1),t);const e=t.constructor,n=e===Object||e===void 0?"":e.name;if(n!==""&&globalThis[n]===e)return this.serializeBuiltInType(n,t);if(typeof t.toJSON=="function"){const i=t.toJSON();return n+(i!==null&&typeof i=="object"?this.$object(i):`(${this.serialize(i)})`)}return this.serializeObjectEntries(n,Object.entries(t))}serializeBuiltInType(t,r){const e=this["$"+t];if(e)return e.call(this,r);if(typeof r?.entries=="function")return this.serializeObjectEntries(t,r.entries());throw new Error(`Cannot serialize ${t}`)}serializeObjectEntries(t,r){const e=Array.from(r).sort((i,a)=>this.compare(i[0],a[0]));let n=`${t}{`;for(let i=0;i<e.length;i++){const[a,l]=e[i];n+=`${this.serialize(a,true)}:${this.serialize(l)}`,i<e.length-1&&(n+=",");}return n+"}"}$object(t){let r=this.#t.get(t);return r===void 0&&(this.#t.set(t,`#${this.#t.size}`),r=this.serializeObject(t),this.#t.set(t,r)),r}$function(t){const r=Function.prototype.toString.call(t);return r.slice(-15)==="[native code] }"?`${t.name||""}()[native]`:`${t.name}(${t.length})${r.replace(/\s*\n\s*/g,"")}`}$Array(t){let r="[";for(let e=0;e<t.length;e++)r+=this.serialize(t[e]),e<t.length-1&&(r+=",");return r+"]"}$Date(t){try{return `Date(${t.toISOString()})`}catch{return "Date(null)"}}$ArrayBuffer(t){return `ArrayBuffer[${new Uint8Array(t).join(",")}]`}$Set(t){return `Set${this.$Array(Array.from(t).sort((r,e)=>this.compare(r,e)))}`}$Map(t){return this.serializeObjectEntries("Map",t.entries())}}for(const s of ["Error","RegExp","URL"])o.prototype["$"+s]=function(t){return `${s}(${t})`};for(const s of ["Int8Array","Uint8Array","Uint8ClampedArray","Int16Array","Uint16Array","Int32Array","Uint32Array","Float32Array","Float64Array"])o.prototype["$"+s]=function(t){return `${s}[${t.join(",")}]`};for(const s of ["BigInt64Array","BigUint64Array"])o.prototype["$"+s]=function(t){return `${s}[${t.join("n,")}${t.length>0?"n":""}]`};return o}();

function isEqual(object1, object2) {
  if (object1 === object2) {
    return true;
  }
  if (serialize$1(object1) === serialize$1(object2)) {
    return true;
  }
  return false;
}

const e=globalThis.process?.getBuiltinModule?.("crypto")?.hash,r="sha256",s="base64url";function digest(t){if(e)return e(r,t,s);const o=createHash(r).update(t);return globalThis.process?.versions?.webcontainer?o.digest().toString(s):o.digest(s)}

function hash$1(input) {
  return digest(serialize$1(input));
}

const Hasher = /* @__PURE__ */ (() => {
  class Hasher2 {
    buff = "";
    #context = /* @__PURE__ */ new Map();
    write(str) {
      this.buff += str;
    }
    dispatch(value) {
      const type = value === null ? "null" : typeof value;
      return this[type](value);
    }
    object(object) {
      if (object && typeof object.toJSON === "function") {
        return this.object(object.toJSON());
      }
      const objString = Object.prototype.toString.call(object);
      let objType = "";
      const objectLength = objString.length;
      objType = objectLength < 10 ? "unknown:[" + objString + "]" : objString.slice(8, objectLength - 1);
      objType = objType.toLowerCase();
      let objectNumber = null;
      if ((objectNumber = this.#context.get(object)) === void 0) {
        this.#context.set(object, this.#context.size);
      } else {
        return this.dispatch("[CIRCULAR:" + objectNumber + "]");
      }
      if (typeof Buffer !== "undefined" && Buffer.isBuffer && Buffer.isBuffer(object)) {
        this.write("buffer:");
        return this.write(object.toString("utf8"));
      }
      if (objType !== "object" && objType !== "function" && objType !== "asyncfunction") {
        if (this[objType]) {
          this[objType](object);
        } else {
          this.unknown(object, objType);
        }
      } else {
        const keys = Object.keys(object).sort();
        const extraKeys = [];
        this.write("object:" + (keys.length + extraKeys.length) + ":");
        const dispatchForKey = (key) => {
          this.dispatch(key);
          this.write(":");
          this.dispatch(object[key]);
          this.write(",");
        };
        for (const key of keys) {
          dispatchForKey(key);
        }
        for (const key of extraKeys) {
          dispatchForKey(key);
        }
      }
    }
    array(arr, unordered) {
      unordered = unordered === void 0 ? false : unordered;
      this.write("array:" + arr.length + ":");
      if (!unordered || arr.length <= 1) {
        for (const entry of arr) {
          this.dispatch(entry);
        }
        return;
      }
      const contextAdditions = /* @__PURE__ */ new Map();
      const entries = arr.map((entry) => {
        const hasher = new Hasher2();
        hasher.dispatch(entry);
        for (const [key, value] of hasher.#context) {
          contextAdditions.set(key, value);
        }
        return hasher.toString();
      });
      this.#context = contextAdditions;
      entries.sort();
      return this.array(entries, false);
    }
    date(date) {
      return this.write("date:" + date.toJSON());
    }
    symbol(sym) {
      return this.write("symbol:" + sym.toString());
    }
    unknown(value, type) {
      this.write(type);
      if (!value) {
        return;
      }
      this.write(":");
      if (value && typeof value.entries === "function") {
        return this.array(
          [...value.entries()],
          true
          /* ordered */
        );
      }
    }
    error(err) {
      return this.write("error:" + err.toString());
    }
    boolean(bool) {
      return this.write("bool:" + bool);
    }
    string(string) {
      this.write("string:" + string.length + ":");
      this.write(string);
    }
    function(fn) {
      this.write("fn:");
      if (isNativeFunction(fn)) {
        this.dispatch("[native]");
      } else {
        this.dispatch(fn.toString());
      }
    }
    number(number) {
      return this.write("number:" + number);
    }
    null() {
      return this.write("Null");
    }
    undefined() {
      return this.write("Undefined");
    }
    regexp(regex) {
      return this.write("regex:" + regex.toString());
    }
    arraybuffer(arr) {
      this.write("arraybuffer:");
      return this.dispatch(new Uint8Array(arr));
    }
    url(url) {
      return this.write("url:" + url.toString());
    }
    map(map) {
      this.write("map:");
      const arr = [...map];
      return this.array(arr, false);
    }
    set(set) {
      this.write("set:");
      const arr = [...set];
      return this.array(arr, false);
    }
    bigint(number) {
      return this.write("bigint:" + number.toString());
    }
  }
  for (const type of [
    "uint8array",
    "uint8clampedarray",
    "unt8array",
    "uint16array",
    "unt16array",
    "uint32array",
    "unt32array",
    "float32array",
    "float64array"
  ]) {
    Hasher2.prototype[type] = function(arr) {
      this.write(type + ":");
      return this.array([...arr], false);
    };
  }
  function isNativeFunction(f) {
    if (typeof f !== "function") {
      return false;
    }
    return Function.prototype.toString.call(f).slice(
      -15
      /* "[native code] }".length */
    ) === "[native code] }";
  }
  return Hasher2;
})();
function serialize(object) {
  const hasher = new Hasher();
  hasher.dispatch(object);
  return hasher.buff;
}
function hash(value) {
  return digest(typeof value === "string" ? value : serialize(value)).replace(/[-_]/g, "").slice(0, 10);
}

function defaultCacheOptions() {
  return {
    name: "_",
    base: "/cache",
    swr: true,
    maxAge: 1
  };
}
function defineCachedFunction(fn, opts = {}) {
  opts = { ...defaultCacheOptions(), ...opts };
  const pending = {};
  const group = opts.group || "nitro/functions";
  const name = opts.name || fn.name || "_";
  const integrity = opts.integrity || hash([fn, opts]);
  const validate = opts.validate || ((entry) => entry.value !== void 0);
  async function get(key, resolver, shouldInvalidateCache, event) {
    const cacheKey = [opts.base, group, name, key + ".json"].filter(Boolean).join(":").replace(/:\/$/, ":index");
    let entry = await useStorage().getItem(cacheKey).catch((error) => {
      console.error(`[cache] Cache read error.`, error);
      useNitroApp().captureError(error, { event, tags: ["cache"] });
    }) || {};
    if (typeof entry !== "object") {
      entry = {};
      const error = new Error("Malformed data read from cache.");
      console.error("[cache]", error);
      useNitroApp().captureError(error, { event, tags: ["cache"] });
    }
    const ttl = (opts.maxAge ?? 0) * 1e3;
    if (ttl) {
      entry.expires = Date.now() + ttl;
    }
    const expired = shouldInvalidateCache || entry.integrity !== integrity || ttl && Date.now() - (entry.mtime || 0) > ttl || validate(entry) === false;
    const _resolve = async () => {
      const isPending = pending[key];
      if (!isPending) {
        if (entry.value !== void 0 && (opts.staleMaxAge || 0) >= 0 && opts.swr === false) {
          entry.value = void 0;
          entry.integrity = void 0;
          entry.mtime = void 0;
          entry.expires = void 0;
        }
        pending[key] = Promise.resolve(resolver());
      }
      try {
        entry.value = await pending[key];
      } catch (error) {
        if (!isPending) {
          delete pending[key];
        }
        throw error;
      }
      if (!isPending) {
        entry.mtime = Date.now();
        entry.integrity = integrity;
        delete pending[key];
        if (validate(entry) !== false) {
          let setOpts;
          if (opts.maxAge && !opts.swr) {
            setOpts = { ttl: opts.maxAge };
          }
          const promise = useStorage().setItem(cacheKey, entry, setOpts).catch((error) => {
            console.error(`[cache] Cache write error.`, error);
            useNitroApp().captureError(error, { event, tags: ["cache"] });
          });
          if (event?.waitUntil) {
            event.waitUntil(promise);
          }
        }
      }
    };
    const _resolvePromise = expired ? _resolve() : Promise.resolve();
    if (entry.value === void 0) {
      await _resolvePromise;
    } else if (expired && event && event.waitUntil) {
      event.waitUntil(_resolvePromise);
    }
    if (opts.swr && validate(entry) !== false) {
      _resolvePromise.catch((error) => {
        console.error(`[cache] SWR handler error.`, error);
        useNitroApp().captureError(error, { event, tags: ["cache"] });
      });
      return entry;
    }
    return _resolvePromise.then(() => entry);
  }
  return async (...args) => {
    const shouldBypassCache = await opts.shouldBypassCache?.(...args);
    if (shouldBypassCache) {
      return fn(...args);
    }
    const key = await (opts.getKey || getKey)(...args);
    const shouldInvalidateCache = await opts.shouldInvalidateCache?.(...args);
    const entry = await get(
      key,
      () => fn(...args),
      shouldInvalidateCache,
      args[0] && isEvent(args[0]) ? args[0] : void 0
    );
    let value = entry.value;
    if (opts.transform) {
      value = await opts.transform(entry, ...args) || value;
    }
    return value;
  };
}
function cachedFunction(fn, opts = {}) {
  return defineCachedFunction(fn, opts);
}
function getKey(...args) {
  return args.length > 0 ? hash(args) : "";
}
function escapeKey(key) {
  return String(key).replace(/\W/g, "");
}
function defineCachedEventHandler(handler, opts = defaultCacheOptions()) {
  const variableHeaderNames = (opts.varies || []).filter(Boolean).map((h) => h.toLowerCase()).sort();
  const _opts = {
    ...opts,
    getKey: async (event) => {
      const customKey = await opts.getKey?.(event);
      if (customKey) {
        return escapeKey(customKey);
      }
      const _path = event.node.req.originalUrl || event.node.req.url || event.path;
      let _pathname;
      try {
        _pathname = escapeKey(decodeURI(parseURL(_path).pathname)).slice(0, 16) || "index";
      } catch {
        _pathname = "-";
      }
      const _hashedPath = `${_pathname}.${hash(_path)}`;
      const _headers = variableHeaderNames.map((header) => [header, event.node.req.headers[header]]).map(([name, value]) => `${escapeKey(name)}.${hash(value)}`);
      return [_hashedPath, ..._headers].join(":");
    },
    validate: (entry) => {
      if (!entry.value) {
        return false;
      }
      if (entry.value.code >= 400) {
        return false;
      }
      if (entry.value.body === void 0) {
        return false;
      }
      if (entry.value.headers.etag === "undefined" || entry.value.headers["last-modified"] === "undefined") {
        return false;
      }
      return true;
    },
    group: opts.group || "nitro/handlers",
    integrity: opts.integrity || hash([handler, opts])
  };
  const _cachedHandler = cachedFunction(
    async (incomingEvent) => {
      const variableHeaders = {};
      for (const header of variableHeaderNames) {
        const value = incomingEvent.node.req.headers[header];
        if (value !== void 0) {
          variableHeaders[header] = value;
        }
      }
      const reqProxy = cloneWithProxy(incomingEvent.node.req, {
        headers: variableHeaders
      });
      const resHeaders = {};
      let _resSendBody;
      const resProxy = cloneWithProxy(incomingEvent.node.res, {
        statusCode: 200,
        writableEnded: false,
        writableFinished: false,
        headersSent: false,
        closed: false,
        getHeader(name) {
          return resHeaders[name];
        },
        setHeader(name, value) {
          resHeaders[name] = value;
          return this;
        },
        getHeaderNames() {
          return Object.keys(resHeaders);
        },
        hasHeader(name) {
          return name in resHeaders;
        },
        removeHeader(name) {
          delete resHeaders[name];
        },
        getHeaders() {
          return resHeaders;
        },
        end(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2();
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return this;
        },
        write(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2(void 0);
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return true;
        },
        writeHead(statusCode, headers2) {
          this.statusCode = statusCode;
          if (headers2) {
            if (Array.isArray(headers2) || typeof headers2 === "string") {
              throw new TypeError("Raw headers  is not supported.");
            }
            for (const header in headers2) {
              const value = headers2[header];
              if (value !== void 0) {
                this.setHeader(
                  header,
                  value
                );
              }
            }
          }
          return this;
        }
      });
      const event = createEvent(reqProxy, resProxy);
      event.fetch = (url, fetchOptions) => fetchWithEvent(event, url, fetchOptions, {
        fetch: useNitroApp().localFetch
      });
      event.$fetch = (url, fetchOptions) => fetchWithEvent(event, url, fetchOptions, {
        fetch: globalThis.$fetch
      });
      event.waitUntil = incomingEvent.waitUntil;
      event.context = incomingEvent.context;
      event.context.cache = {
        options: _opts
      };
      const body = await handler(event) || _resSendBody;
      const headers = event.node.res.getHeaders();
      headers.etag = String(
        headers.Etag || headers.etag || `W/"${hash(body)}"`
      );
      headers["last-modified"] = String(
        headers["Last-Modified"] || headers["last-modified"] || (/* @__PURE__ */ new Date()).toUTCString()
      );
      const cacheControl = [];
      if (opts.swr) {
        if (opts.maxAge) {
          cacheControl.push(`s-maxage=${opts.maxAge}`);
        }
        if (opts.staleMaxAge) {
          cacheControl.push(`stale-while-revalidate=${opts.staleMaxAge}`);
        } else {
          cacheControl.push("stale-while-revalidate");
        }
      } else if (opts.maxAge) {
        cacheControl.push(`max-age=${opts.maxAge}`);
      }
      if (cacheControl.length > 0) {
        headers["cache-control"] = cacheControl.join(", ");
      }
      const cacheEntry = {
        code: event.node.res.statusCode,
        headers,
        body
      };
      return cacheEntry;
    },
    _opts
  );
  return defineEventHandler(async (event) => {
    if (opts.headersOnly) {
      if (handleCacheHeaders(event, { maxAge: opts.maxAge })) {
        return;
      }
      return handler(event);
    }
    const response = await _cachedHandler(
      event
    );
    if (event.node.res.headersSent || event.node.res.writableEnded) {
      return response.body;
    }
    if (handleCacheHeaders(event, {
      modifiedTime: new Date(response.headers["last-modified"]),
      etag: response.headers.etag,
      maxAge: opts.maxAge
    })) {
      return;
    }
    event.node.res.statusCode = response.code;
    for (const name in response.headers) {
      const value = response.headers[name];
      if (name === "set-cookie") {
        event.node.res.appendHeader(
          name,
          splitCookiesString(value)
        );
      } else {
        if (value !== void 0) {
          event.node.res.setHeader(name, value);
        }
      }
    }
    return response.body;
  });
}
function cloneWithProxy(obj, overrides) {
  return new Proxy(obj, {
    get(target, property, receiver) {
      if (property in overrides) {
        return overrides[property];
      }
      return Reflect.get(target, property, receiver);
    },
    set(target, property, value, receiver) {
      if (property in overrides) {
        overrides[property] = value;
        return true;
      }
      return Reflect.set(target, property, value, receiver);
    }
  });
}
const cachedEventHandler = defineCachedEventHandler;

function klona(x) {
	if (typeof x !== 'object') return x;

	var k, tmp, str=Object.prototype.toString.call(x);

	if (str === '[object Object]') {
		if (x.constructor !== Object && typeof x.constructor === 'function') {
			tmp = new x.constructor();
			for (k in x) {
				if (x.hasOwnProperty(k) && tmp[k] !== x[k]) {
					tmp[k] = klona(x[k]);
				}
			}
		} else {
			tmp = {}; // null
			for (k in x) {
				if (k === '__proto__') {
					Object.defineProperty(tmp, k, {
						value: klona(x[k]),
						configurable: true,
						enumerable: true,
						writable: true,
					});
				} else {
					tmp[k] = klona(x[k]);
				}
			}
		}
		return tmp;
	}

	if (str === '[object Array]') {
		k = x.length;
		for (tmp=Array(k); k--;) {
			tmp[k] = klona(x[k]);
		}
		return tmp;
	}

	if (str === '[object Set]') {
		tmp = new Set;
		x.forEach(function (val) {
			tmp.add(klona(val));
		});
		return tmp;
	}

	if (str === '[object Map]') {
		tmp = new Map;
		x.forEach(function (val, key) {
			tmp.set(klona(key), klona(val));
		});
		return tmp;
	}

	if (str === '[object Date]') {
		return new Date(+x);
	}

	if (str === '[object RegExp]') {
		tmp = new RegExp(x.source, x.flags);
		tmp.lastIndex = x.lastIndex;
		return tmp;
	}

	if (str === '[object DataView]') {
		return new x.constructor( klona(x.buffer) );
	}

	if (str === '[object ArrayBuffer]') {
		return x.slice(0);
	}

	// ArrayBuffer.isView(x)
	// ~> `new` bcuz `Buffer.slice` => ref
	if (str.slice(-6) === 'Array]') {
		return new x.constructor(x);
	}

	return x;
}

const inlineAppConfig = {
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



const appConfig = defuFn(inlineAppConfig);

const NUMBER_CHAR_RE = /\d/;
const STR_SPLITTERS = ["-", "_", "/", "."];
function isUppercase(char = "") {
  if (NUMBER_CHAR_RE.test(char)) {
    return void 0;
  }
  return char !== char.toLowerCase();
}
function splitByCase(str, separators) {
  const splitters = STR_SPLITTERS;
  const parts = [];
  if (!str || typeof str !== "string") {
    return parts;
  }
  let buff = "";
  let previousUpper;
  let previousSplitter;
  for (const char of str) {
    const isSplitter = splitters.includes(char);
    if (isSplitter === true) {
      parts.push(buff);
      buff = "";
      previousUpper = void 0;
      continue;
    }
    const isUpper = isUppercase(char);
    if (previousSplitter === false) {
      if (previousUpper === false && isUpper === true) {
        parts.push(buff);
        buff = char;
        previousUpper = isUpper;
        continue;
      }
      if (previousUpper === true && isUpper === false && buff.length > 1) {
        const lastChar = buff.at(-1);
        parts.push(buff.slice(0, Math.max(0, buff.length - 1)));
        buff = lastChar + char;
        previousUpper = isUpper;
        continue;
      }
    }
    buff += char;
    previousUpper = isUpper;
    previousSplitter = isSplitter;
  }
  parts.push(buff);
  return parts;
}
function upperFirst(str) {
  return str ? str[0].toUpperCase() + str.slice(1) : "";
}
function pascalCase(str, opts) {
  return str ? (Array.isArray(str) ? str : splitByCase(str)).map((p) => upperFirst(p)).join("") : "";
}
function kebabCase(str, joiner) {
  return str ? (Array.isArray(str) ? str : splitByCase(str)).map((p) => p.toLowerCase()).join(joiner) : "";
}
function snakeCase(str) {
  return kebabCase(str || "", "_");
}

function getEnv(key, opts) {
  const envKey = snakeCase(key).toUpperCase();
  return destr(
    process.env[opts.prefix + envKey] ?? process.env[opts.altPrefix + envKey]
  );
}
function _isObject(input) {
  return typeof input === "object" && !Array.isArray(input);
}
function applyEnv(obj, opts, parentKey = "") {
  for (const key in obj) {
    const subKey = parentKey ? `${parentKey}_${key}` : key;
    const envValue = getEnv(subKey, opts);
    if (_isObject(obj[key])) {
      if (_isObject(envValue)) {
        obj[key] = { ...obj[key], ...envValue };
        applyEnv(obj[key], opts, subKey);
      } else if (envValue === void 0) {
        applyEnv(obj[key], opts, subKey);
      } else {
        obj[key] = envValue ?? obj[key];
      }
    } else {
      obj[key] = envValue ?? obj[key];
    }
    if (opts.envExpansion && typeof obj[key] === "string") {
      obj[key] = _expandFromEnv(obj[key]);
    }
  }
  return obj;
}
const envExpandRx = /\{\{([^{}]*)\}\}/g;
function _expandFromEnv(value) {
  return value.replace(envExpandRx, (match, key) => {
    return process.env[key] || match;
  });
}

const _inlineRuntimeConfig = {
  "app": {
    "baseURL": "/",
    "buildId": "1cccd9d8-81bf-45a2-9f7e-9d63c95c3196",
    "buildAssetsDir": "/_nuxt/",
    "cdnURL": ""
  },
  "nitro": {
    "envPrefix": "NUXT_",
    "routeRules": {
      "/__nuxt_error": {
        "cache": false,
        "isr": false
      },
      "/": {
        "swr": true,
        "cache": {
          "swr": true
        },
        "isr": true
      },
      "/about": {
        "swr": true,
        "cache": {
          "swr": true
        },
        "isr": true
      },
      "/contact": {
        "swr": true,
        "cache": {
          "swr": true
        },
        "isr": true
      },
      "/gallery": {
        "swr": true,
        "cache": {
          "swr": true
        },
        "isr": true
      },
      "/pricing": {
        "swr": true,
        "cache": {
          "swr": true
        },
        "isr": true
      },
      "/locations/**": {
        "swr": true,
        "cache": {
          "swr": true
        },
        "isr": true
      },
      "/services/**": {
        "swr": true,
        "cache": {
          "swr": true
        },
        "isr": true
      },
      "/__nuxt_content/**": {
        "robots": false,
        "cache": false,
        "isr": false
      },
      "/__nuxt_content/hero/sql_dump.txt": {
        "prerender": true
      },
      "/__nuxt_content/about/sql_dump.txt": {
        "prerender": true
      },
      "/__nuxt_content/home_about/sql_dump.txt": {
        "prerender": true
      },
      "/__nuxt_content/services/sql_dump.txt": {
        "prerender": true
      },
      "/__nuxt_content/testimonials/sql_dump.txt": {
        "prerender": true
      },
      "/__nuxt_content/partners/sql_dump.txt": {
        "prerender": true
      },
      "/__nuxt_content/gallery/sql_dump.txt": {
        "prerender": true
      },
      "/__nuxt_content/locations/sql_dump.txt": {
        "prerender": true
      },
      "/__nuxt_content/membership/sql_dump.txt": {
        "prerender": true
      },
      "/__nuxt_content/contact/sql_dump.txt": {
        "prerender": true
      },
      "/__nuxt_content/cta/sql_dump.txt": {
        "prerender": true
      },
      "/__nuxt_content/team/sql_dump.txt": {
        "prerender": true
      },
      "/_nuxt/builds/meta/**": {
        "headers": {
          "cache-control": "public, max-age=31536000, immutable"
        }
      },
      "/_nuxt/builds/**": {
        "headers": {
          "cache-control": "public, max-age=1, immutable"
        }
      },
      "/_fonts/**": {
        "headers": {
          "cache-control": "public, max-age=31536000, immutable"
        }
      },
      "/_nuxt/**": {
        "headers": {
          "cache-control": "public, max-age=31536000, immutable"
        }
      }
    }
  },
  "public": {
    "strapiUrl": "/api/strapi",
    "strapiToken": "",
    "strapi": {
      "url": "http://localhost:1337",
      "token": "1d783e096b05e2d74b6afa8ecbe3bc8d87b9d5f424dc6771958541f1a3dcd3882f7376962b4d128bd9c4d56911c07253d92e931442cab22dc0ab422581c78c543b0457f4d005017cb18f1a983be672abcb4b5bbf4b412c3514547855a523af3e9f4b623187a7c7db433e9ac0c79ab4c728d7b5cf7a44925d0cc445d9c9fcc8ec",
      "prefix": "/api",
      "admin": "/admin",
      "version": "v5",
      "cookie": {},
      "auth": {},
      "cookieName": "strapi_jwt",
      "devtools": false
    },
    "studio": {
      "route": "/_studio",
      "dev": false,
      "development": {
        "server": ""
      },
      "repository": {
        "provider": "github",
        "owner": "cnaallotey",
        "repo": "abb-website",
        "branch": "main",
        "rootDir": "",
        "private": true
      },
      "i18n": {
        "defaultLocale": "en"
      }
    },
    "mdc": {
      "components": {
        "prose": true,
        "map": {
          "accordion": "ProseAccordion",
          "accordion-item": "ProseAccordionItem",
          "badge": "ProseBadge",
          "callout": "ProseCallout",
          "card": "ProseCard",
          "card-group": "ProseCardGroup",
          "caution": "ProseCaution",
          "code-collapse": "ProseCodeCollapse",
          "code-group": "ProseCodeGroup",
          "code-icon": "ProseCodeIcon",
          "code-preview": "ProseCodePreview",
          "code-tree": "ProseCodeTree",
          "collapsible": "ProseCollapsible",
          "field": "ProseField",
          "field-group": "ProseFieldGroup",
          "icon": "ProseIcon",
          "kbd": "ProseKbd",
          "note": "ProseNote",
          "steps": "ProseSteps",
          "tabs": "ProseTabs",
          "tabs-item": "ProseTabsItem",
          "tip": "ProseTip",
          "warning": "ProseWarning"
        },
        "customElements": []
      },
      "headings": {
        "anchorLinks": {
          "h1": false,
          "h2": true,
          "h3": true,
          "h4": true,
          "h5": false,
          "h6": false
        }
      },
      "highlight": {
        "noApiRoute": true,
        "theme": {
          "light": "material-theme-lighter",
          "default": "material-theme",
          "dark": "material-theme-palenight"
        },
        "highlighter": "shiki",
        "shikiEngine": "oniguruma",
        "langs": [
          "js",
          "jsx",
          "json",
          "ts",
          "tsx",
          "vue",
          "css",
          "html",
          "bash",
          "md",
          "mdc",
          "yaml"
        ]
      }
    },
    "content": {
      "wsUrl": ""
    }
  },
  "strapiUpstreamUrl": "http://localhost:1337",
  "icon": {
    "serverKnownCssClasses": []
  },
  "strapi": {
    "url": "http://localhost:1337",
    "token": "1d783e096b05e2d74b6afa8ecbe3bc8d87b9d5f424dc6771958541f1a3dcd3882f7376962b4d128bd9c4d56911c07253d92e931442cab22dc0ab422581c78c543b0457f4d005017cb18f1a983be672abcb4b5bbf4b412c3514547855a523af3e9f4b623187a7c7db433e9ac0c79ab4c728d7b5cf7a44925d0cc445d9c9fcc8ec",
    "prefix": "/api",
    "admin": "/admin",
    "version": "v5",
    "cookie": {},
    "auth": {},
    "cookieName": "strapi_jwt",
    "devtools": false
  },
  "studio": {
    "auth": {
      "sessionSecret": "d41d8cd98f00b204e9800998ecf8427e",
      "github": {
        "clientId": "",
        "clientSecret": ""
      },
      "gitlab": {
        "applicationId": "",
        "applicationSecret": "",
        "instanceUrl": "https://gitlab.com"
      },
      "google": {
        "clientId": "",
        "clientSecret": ""
      }
    },
    "repository": {
      "provider": "github",
      "owner": "cnaallotey",
      "repo": "abb-website",
      "branch": "main",
      "rootDir": "",
      "private": true
    },
    "meta": {
      "components": {
        "include": [],
        "exclude": []
      }
    },
    "markdown": {}
  },
  "content": {
    "databaseVersion": "v3.5.0",
    "version": "3.11.0",
    "database": {
      "type": "sqlite",
      "filename": "/tmp/contents.sqlite"
    },
    "localDatabase": {
      "type": "sqlite",
      "filename": "/Users/mac/Documents/abb-apps/abb-website/.data/content/contents.sqlite"
    },
    "integrityCheck": true
  },
  "ipx": {
    "baseURL": "/_ipx",
    "alias": {},
    "fs": {
      "dir": "../../static"
    },
    "http": {
      "domains": [
        "tidy-friend-384c97c42d.media.strapiapp.com",
        "images.unsplash.com"
      ]
    }
  }
};
const envOptions = {
  prefix: "NITRO_",
  altPrefix: _inlineRuntimeConfig.nitro.envPrefix ?? process.env.NITRO_ENV_PREFIX ?? "_",
  envExpansion: _inlineRuntimeConfig.nitro.envExpansion ?? process.env.NITRO_ENV_EXPANSION ?? false
};
const _sharedRuntimeConfig = _deepFreeze(
  applyEnv(klona(_inlineRuntimeConfig), envOptions)
);
function useRuntimeConfig(event) {
  if (!event) {
    return _sharedRuntimeConfig;
  }
  if (event.context.nitro.runtimeConfig) {
    return event.context.nitro.runtimeConfig;
  }
  const runtimeConfig = klona(_inlineRuntimeConfig);
  applyEnv(runtimeConfig, envOptions);
  event.context.nitro.runtimeConfig = runtimeConfig;
  return runtimeConfig;
}
const _sharedAppConfig = _deepFreeze(klona(appConfig));
function useAppConfig(event) {
  {
    return _sharedAppConfig;
  }
}
function _deepFreeze(object) {
  const propNames = Object.getOwnPropertyNames(object);
  for (const name of propNames) {
    const value = object[name];
    if (value && typeof value === "object") {
      _deepFreeze(value);
    }
  }
  return Object.freeze(object);
}
new Proxy(/* @__PURE__ */ Object.create(null), {
  get: (_, prop) => {
    console.warn(
      "Please use `useRuntimeConfig()` instead of accessing config directly."
    );
    const runtimeConfig = useRuntimeConfig();
    if (prop in runtimeConfig) {
      return runtimeConfig[prop];
    }
    return void 0;
  }
});

function createContext(opts = {}) {
  let currentInstance;
  let isSingleton = false;
  const checkConflict = (instance) => {
    if (currentInstance && currentInstance !== instance) {
      throw new Error("Context conflict");
    }
  };
  let als;
  if (opts.asyncContext) {
    const _AsyncLocalStorage = opts.AsyncLocalStorage || globalThis.AsyncLocalStorage;
    if (_AsyncLocalStorage) {
      als = new _AsyncLocalStorage();
    } else {
      console.warn("[unctx] `AsyncLocalStorage` is not provided.");
    }
  }
  const _getCurrentInstance = () => {
    if (als) {
      const instance = als.getStore();
      if (instance !== void 0) {
        return instance;
      }
    }
    return currentInstance;
  };
  return {
    use: () => {
      const _instance = _getCurrentInstance();
      if (_instance === void 0) {
        throw new Error("Context is not available");
      }
      return _instance;
    },
    tryUse: () => {
      return _getCurrentInstance();
    },
    set: (instance, replace) => {
      if (!replace) {
        checkConflict(instance);
      }
      currentInstance = instance;
      isSingleton = true;
    },
    unset: () => {
      currentInstance = void 0;
      isSingleton = false;
    },
    call: (instance, callback) => {
      checkConflict(instance);
      currentInstance = instance;
      try {
        return als ? als.run(instance, callback) : callback();
      } finally {
        if (!isSingleton) {
          currentInstance = void 0;
        }
      }
    },
    async callAsync(instance, callback) {
      currentInstance = instance;
      const onRestore = () => {
        currentInstance = instance;
      };
      const onLeave = () => currentInstance === instance ? onRestore : void 0;
      asyncHandlers.add(onLeave);
      try {
        const r = als ? als.run(instance, callback) : callback();
        if (!isSingleton) {
          currentInstance = void 0;
        }
        return await r;
      } finally {
        asyncHandlers.delete(onLeave);
      }
    }
  };
}
function createNamespace(defaultOpts = {}) {
  const contexts = {};
  return {
    get(key, opts = {}) {
      if (!contexts[key]) {
        contexts[key] = createContext({ ...defaultOpts, ...opts });
      }
      return contexts[key];
    }
  };
}
const _globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof global !== "undefined" ? global : {};
const globalKey = "__unctx__";
const defaultNamespace = _globalThis[globalKey] || (_globalThis[globalKey] = createNamespace());
const getContext = (key, opts = {}) => defaultNamespace.get(key, opts);
const asyncHandlersKey = "__unctx_async_handlers__";
const asyncHandlers = _globalThis[asyncHandlersKey] || (_globalThis[asyncHandlersKey] = /* @__PURE__ */ new Set());
function executeAsync(function_) {
  const restores = [];
  for (const leaveHandler of asyncHandlers) {
    const restore2 = leaveHandler();
    if (restore2) {
      restores.push(restore2);
    }
  }
  const restore = () => {
    for (const restore2 of restores) {
      restore2();
    }
  };
  let awaitable = function_();
  if (awaitable && typeof awaitable === "object" && "catch" in awaitable) {
    awaitable = awaitable.catch((error) => {
      restore();
      throw error;
    });
  }
  return [awaitable, restore];
}

getContext("nitro-app", {
  asyncContext: false,
  AsyncLocalStorage: void 0
});

const config = useRuntimeConfig();
const _routeRulesMatcher = toRouteMatcher(
  createRouter$1({ routes: config.nitro.routeRules })
);
function createRouteRulesHandler(ctx) {
  return eventHandler((event) => {
    const routeRules = getRouteRules(event);
    if (routeRules.headers) {
      setHeaders(event, routeRules.headers);
    }
    if (routeRules.redirect) {
      let target = routeRules.redirect.to;
      if (target.endsWith("/**")) {
        let targetPath = event.path;
        const strpBase = routeRules.redirect._redirectStripBase;
        if (strpBase) {
          targetPath = withoutBase(targetPath, strpBase);
        }
        target = joinURL(target.slice(0, -3), targetPath);
      } else if (event.path.includes("?")) {
        const query = getQuery$1(event.path);
        target = withQuery(target, query);
      }
      return sendRedirect(event, target, routeRules.redirect.statusCode);
    }
    if (routeRules.proxy) {
      let target = routeRules.proxy.to;
      if (target.endsWith("/**")) {
        let targetPath = event.path;
        const strpBase = routeRules.proxy._proxyStripBase;
        if (strpBase) {
          targetPath = withoutBase(targetPath, strpBase);
        }
        target = joinURL(target.slice(0, -3), targetPath);
      } else if (event.path.includes("?")) {
        const query = getQuery$1(event.path);
        target = withQuery(target, query);
      }
      return proxyRequest(event, target, {
        fetch: ctx.localFetch,
        ...routeRules.proxy
      });
    }
  });
}
function getRouteRules(event) {
  event.context._nitro = event.context._nitro || {};
  if (!event.context._nitro.routeRules) {
    event.context._nitro.routeRules = getRouteRulesForPath(
      withoutBase(event.path.split("?")[0], useRuntimeConfig().app.baseURL)
    );
  }
  return event.context._nitro.routeRules;
}
function getRouteRulesForPath(path) {
  return defu({}, ..._routeRulesMatcher.matchAll(path).reverse());
}

function joinHeaders(value) {
  return Array.isArray(value) ? value.join(", ") : String(value);
}
function normalizeFetchResponse(response) {
  if (!response.headers.has("set-cookie")) {
    return response;
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: normalizeCookieHeaders(response.headers)
  });
}
function normalizeCookieHeader(header = "") {
  return splitCookiesString(joinHeaders(header));
}
function normalizeCookieHeaders(headers) {
  const outgoingHeaders = new Headers();
  for (const [name, header] of headers) {
    if (name === "set-cookie") {
      for (const cookie of normalizeCookieHeader(header)) {
        outgoingHeaders.append("set-cookie", cookie);
      }
    } else {
      outgoingHeaders.set(name, joinHeaders(header));
    }
  }
  return outgoingHeaders;
}

function isJsonRequest(event) {
  if (hasReqHeader(event, "accept", "text/html")) {
    return false;
  }
  return hasReqHeader(event, "accept", "application/json") || hasReqHeader(event, "user-agent", "curl/") || hasReqHeader(event, "user-agent", "httpie/") || hasReqHeader(event, "sec-fetch-mode", "cors") || event.path.startsWith("/api/") || event.path.endsWith(".json");
}
function hasReqHeader(event, name, includes) {
  const value = getRequestHeader(event, name);
  return value && typeof value === "string" && value.toLowerCase().includes(includes);
}

const errorHandler$0 = (async function errorhandler(error, event, { defaultHandler }) {
  if (event.handled || isJsonRequest(event)) {
    return;
  }
  const defaultRes = await defaultHandler(error, event, { json: true });
  const statusCode = error.statusCode || 500;
  if (statusCode === 404 && defaultRes.status === 302) {
    setResponseHeaders(event, defaultRes.headers);
    setResponseStatus(event, defaultRes.status, defaultRes.statusText);
    return send(event, JSON.stringify(defaultRes.body, null, 2));
  }
  const errorObject = defaultRes.body;
  const url = new URL(errorObject.url);
  errorObject.url = withoutBase(url.pathname, useRuntimeConfig(event).app.baseURL) + url.search + url.hash;
  errorObject.message ||= "Server Error";
  errorObject.data ||= error.data;
  errorObject.statusMessage ||= error.statusMessage;
  delete defaultRes.headers["content-type"];
  delete defaultRes.headers["content-security-policy"];
  setResponseHeaders(event, defaultRes.headers);
  const reqHeaders = getRequestHeaders(event);
  const isRenderingError = event.path.startsWith("/__nuxt_error") || !!reqHeaders["x-nuxt-error"];
  const res = isRenderingError ? null : await useNitroApp().localFetch(
    withQuery(joinURL(useRuntimeConfig(event).app.baseURL, "/__nuxt_error"), errorObject),
    {
      headers: { ...reqHeaders, "x-nuxt-error": "true" },
      redirect: "manual"
    }
  ).catch(() => null);
  if (event.handled) {
    return;
  }
  if (!res) {
    const { template } = await import('../_/error-500.mjs');
    setResponseHeader(event, "Content-Type", "text/html;charset=UTF-8");
    return send(event, template(errorObject));
  }
  const html = await res.text();
  for (const [header, value] of res.headers.entries()) {
    if (header === "set-cookie") {
      appendResponseHeader(event, header, value);
      continue;
    }
    setResponseHeader(event, header, value);
  }
  setResponseStatus(event, res.status && res.status !== 200 ? res.status : defaultRes.status, res.statusText || defaultRes.statusText);
  return send(event, html);
});

function defineNitroErrorHandler(handler) {
  return handler;
}

const errorHandler$1 = defineNitroErrorHandler(
  function defaultNitroErrorHandler(error, event) {
    const res = defaultHandler(error, event);
    setResponseHeaders(event, res.headers);
    setResponseStatus(event, res.status, res.statusText);
    return send(event, JSON.stringify(res.body, null, 2));
  }
);
function defaultHandler(error, event, opts) {
  const isSensitive = error.unhandled || error.fatal;
  const statusCode = error.statusCode || 500;
  const statusMessage = error.statusMessage || "Server Error";
  const url = getRequestURL(event, { xForwardedHost: true, xForwardedProto: true });
  if (statusCode === 404) {
    const baseURL = "/";
    if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) {
      const redirectTo = `${baseURL}${url.pathname.slice(1)}${url.search}`;
      return {
        status: 302,
        statusText: "Found",
        headers: { location: redirectTo },
        body: `Redirecting...`
      };
    }
  }
  if (isSensitive && !opts?.silent) {
    const tags = [error.unhandled && "[unhandled]", error.fatal && "[fatal]"].filter(Boolean).join(" ");
    console.error(`[request error] ${tags} [${event.method}] ${url}
`, error);
  }
  const headers = {
    "content-type": "application/json",
    // Prevent browser from guessing the MIME types of resources.
    "x-content-type-options": "nosniff",
    // Prevent error page from being embedded in an iframe
    "x-frame-options": "DENY",
    // Prevent browsers from sending the Referer header
    "referrer-policy": "no-referrer",
    // Disable the execution of any js
    "content-security-policy": "script-src 'none'; frame-ancestors 'none';"
  };
  setResponseStatus(event, statusCode, statusMessage);
  if (statusCode === 404 || !getResponseHeader(event, "cache-control")) {
    headers["cache-control"] = "no-cache";
  }
  const body = {
    error: true,
    url: url.href,
    statusCode,
    statusMessage,
    message: isSensitive ? "Server Error" : error.message,
    data: isSensitive ? void 0 : error.data
  };
  return {
    status: statusCode,
    statusText: statusMessage,
    headers,
    body
  };
}

const errorHandlers = [errorHandler$0, errorHandler$1];

async function errorHandler(error, event) {
  for (const handler of errorHandlers) {
    try {
      await handler(error, event, { defaultHandler });
      if (event.handled) {
        return; // Response handled
      }
    } catch(error) {
      // Handler itself thrown, log and continue
      console.error(error);
    }
  }
  // H3 will handle fallback
}

const script = "\"use strict\";(()=>{const t=window,e=document.documentElement,c=[\"dark\",\"light\"],n=getStorageValue(\"localStorage\",\"nuxt-color-mode\")||\"light\";let i=n===\"system\"?u():n;const r=e.getAttribute(\"data-color-mode-forced\");r&&(i=r),l(i),t[\"__NUXT_COLOR_MODE__\"]={preference:n,value:i,getColorScheme:u,addColorScheme:l,removeColorScheme:d};function l(o){const s=\"\"+o+\"\",a=\"\";e.classList?e.classList.add(s):e.className+=\" \"+s,a&&e.setAttribute(\"data-\"+a,o)}function d(o){const s=\"\"+o+\"\",a=\"\";e.classList?e.classList.remove(s):e.className=e.className.replace(new RegExp(s,\"g\"),\"\"),a&&e.removeAttribute(\"data-\"+a)}function f(o){return t.matchMedia(\"(prefers-color-scheme\"+o+\")\")}function u(){if(t.matchMedia&&f(\"\").media!==\"not all\"){for(const o of c)if(f(\":\"+o).matches)return o}return\"light\"}})();function getStorageValue(t,e){switch(t){case\"localStorage\":return window.localStorage.getItem(e);case\"sessionStorage\":return window.sessionStorage.getItem(e);case\"cookie\":return getCookie(e);default:return null}}function getCookie(t){const c=(\"; \"+window.document.cookie).split(\"; \"+t+\"=\");if(c.length===2)return c.pop()?.split(\";\").shift()}";

const _r6Nx1TRDH9CtVuzw4U26pxgphbjgrVc_b4KAb9elroE = (function(nitro) {
  nitro.hooks.hook("render:html", (htmlContext) => {
    htmlContext.head.push(`<script>${script}<\/script>`);
  });
});

const plugins = [
  _r6Nx1TRDH9CtVuzw4U26pxgphbjgrVc_b4KAb9elroE
];

const _SxA8c9 = defineEventHandler(() => {});

const _DRIVE_LETTER_START_RE = /^[A-Za-z]:\//;
function normalizeWindowsPath(input = "") {
  if (!input) {
    return input;
  }
  return input.replace(/\\/g, "/").replace(_DRIVE_LETTER_START_RE, (r) => r.toUpperCase());
}
const _IS_ABSOLUTE_RE = /^[/\\](?![/\\])|^[/\\]{2}(?!\.)|^[A-Za-z]:[/\\]/;
const isAbsolute = function(p) {
  return _IS_ABSOLUTE_RE.test(p);
};
const basename = function(p, extension) {
  const segments = normalizeWindowsPath(p).split("/");
  let lastSegment = "";
  for (let i = segments.length - 1; i >= 0; i--) {
    const val = segments[i];
    if (val) {
      lastSegment = val;
      break;
    }
  }
  return extension && lastSegment.endsWith(extension) ? lastSegment.slice(0, -extension.length) : lastSegment;
};

function defineRenderHandler(render) {
  const runtimeConfig = useRuntimeConfig();
  return eventHandler(async (event) => {
    const nitroApp = useNitroApp();
    const ctx = { event, render, response: void 0 };
    await nitroApp.hooks.callHook("render:before", ctx);
    if (!ctx.response) {
      if (event.path === `${runtimeConfig.app.baseURL}favicon.ico`) {
        setResponseHeader(event, "Content-Type", "image/x-icon");
        return send(
          event,
          "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
        );
      }
      ctx.response = await ctx.render(event);
      if (!ctx.response) {
        const _currentStatus = getResponseStatus(event);
        setResponseStatus(event, _currentStatus === 200 ? 500 : _currentStatus);
        return send(
          event,
          "No response returned from render handler: " + event.path
        );
      }
    }
    await nitroApp.hooks.callHook("render:response", ctx.response, ctx);
    if (ctx.response.headers) {
      setResponseHeaders(event, ctx.response.headers);
    }
    if (ctx.response.statusCode || ctx.response.statusMessage) {
      setResponseStatus(
        event,
        ctx.response.statusCode,
        ctx.response.statusMessage
      );
    }
    return ctx.response.body;
  });
}

function baseURL() {
  return useRuntimeConfig().app.baseURL;
}
function buildAssetsDir() {
  return useRuntimeConfig().app.buildAssetsDir;
}
function buildAssetsURL(...path) {
  return joinRelativeURL(publicAssetsURL(), buildAssetsDir(), ...path);
}
function publicAssetsURL(...path) {
  const app = useRuntimeConfig().app;
  const publicBase = app.cdnURL || app.baseURL;
  return path.length ? joinRelativeURL(publicBase, ...path) : publicBase;
}

const checksums = {
  "hero": "v3.5.0--uTiMFWlbYr7PSnh6SqLko9RWnTSNgbAlLJxtP79XA8w",
  "about": "v3.5.0--W5OuwY68xyKIVEJkxQ-geM1RHT_S_5dPV6QNiS_Nwtw",
  "home_about": "v3.5.0--W5FfZkSiLZ6JGAAquPGuoePPLygfQG4sY1b01YUwbms",
  "services": "v3.5.0--yAUulI4VQEtpV-a1Jat8eXKofI7-0tPzSgi5tXnMQ6c",
  "testimonials": "v3.5.0--aUDjuDRHRzpRHbFbiLq65HZc8iC3sDiUQHz9qbsJkPg",
  "partners": "v3.5.0--cdqebqfw7yIIdfyXwQ2Ci6QZvo5b7Vz1_5M_GR0yUAw",
  "gallery": "v3.5.0--v5cacpBHIhdBPHAn7DMqkzRte2GqPQvC-fLGSidtuRg",
  "locations": "v3.5.0--HDHsL5b6gvQucidYooaBRNE4Bx1jjmd4JbqMksVrPxQ",
  "membership": "v3.5.0--xgze_7jQ2fynJ_crcGavsT-7txiSw2W2olDgVWd9nvc",
  "contact": "v3.5.0--JmjjhxoIXwGq1saEJxjckl5Cf-gGTwNklQmSoc--BdM",
  "cta": "v3.5.0--iURSra36bd5TEey_j0gnH7Lw8DfGxEU9I99O2lmnS-M",
  "team": "v3.5.0--w0Ger7JgXXtlS4hViMfy8eUoYcs4taDEaHY8XiVa8C0"
};
const checksumsStructure = {
  "hero": "U1tpB4RlNTfKr_rYjn2kkGm_BGwpE3MdSsWq14SpgNs",
  "about": "_r0YJN3FCFoCmqJ0nucYofytWMPdgvZ7vlNFd1u5pe0",
  "home_about": "oPLvAiNmTG6o2QHMHm4ZOsGPQMBMNhopCXBaXAXGDfY",
  "services": "05-1mHqI42OlMhfDcCtgNX8RZ48-jV9agkeJcAnKyik",
  "testimonials": "_r-ZYf0XrhAvKM6-1N0HQVMAbzu6ehjpLWVmnsjJz2U",
  "partners": "wIKE9afqA-k3fLaSMuPwfhYYvkEy5iFCjZXOc_ySCxA",
  "gallery": "EE-QZNA5RfbRcsX7B8YHRlW7tOJAij7UEjnFB-XbRik",
  "locations": "4d5JyO1hGFVdgsUubMNnqz4WZDuL2CJ-kwglhcaq0FM",
  "membership": "qzMlynrGzfRsyijaPnoa3MYhbzvsrCutYPDBxGvGDyc",
  "contact": "j3WlNPRroVFKkq8nqLqO5QzzBb_cLaYv7lKSk8vCUtA",
  "cta": "8RyV522_kUuVqN0Xl6ODyxG_k4qRq764yDkRly1qJtc",
  "team": "IR1VDy0EganCRubZYbrPvNKBtMQY0I3MAP6z6neJPns"
};

const tables = {
  "hero": "_content_hero",
  "about": "_content_about",
  "home_about": "_content_home_about",
  "services": "_content_services",
  "testimonials": "_content_testimonials",
  "partners": "_content_partners",
  "gallery": "_content_gallery",
  "locations": "_content_locations",
  "membership": "_content_membership",
  "contact": "_content_contact",
  "cta": "_content_cta",
  "team": "_content_team",
  "info": "_content_info"
};

const contentManifest = {
  "hero": {
    "type": "data",
    "fields": {
      "id": "string",
      "title": "string",
      "description": "string",
      "extension": "string",
      "heroCTA": "string",
      "meta": "json",
      "stem": "string",
      "videoURL": "string"
    }
  },
  "about": {
    "type": "data",
    "fields": {
      "id": "string",
      "title": "string",
      "description": "string",
      "extension": "string",
      "meta": "json",
      "scrollSectionAttribution": "string",
      "scrollSectionBottomText": "string",
      "scrollSectionTopText": "string",
      "stats": "json",
      "stem": "string",
      "storyDescription": "string",
      "storyTitle": "string",
      "values": "json",
      "valuesSectionDescription": "string",
      "valuesSectionTitle": "string"
    }
  },
  "home_about": {
    "type": "data",
    "fields": {
      "id": "string",
      "title": "string",
      "body": "string",
      "extension": "string",
      "meta": "json",
      "preDescription": "string",
      "preHeader": "string",
      "sectionCTA": "string",
      "sectionImage": "string",
      "stats": "json",
      "stem": "string",
      "storyTimeline": "json"
    }
  },
  "services": {
    "type": "page",
    "fields": {
      "id": "string",
      "title": "string",
      "body": "json",
      "description": "string",
      "extension": "string",
      "featuresList": "json",
      "longDescription": "string",
      "masterclasses": "json",
      "meta": "json",
      "name": "string",
      "navigation": "json",
      "path": "string",
      "programComparisons": "json",
      "publishedAt": "string",
      "seo": "json",
      "serviceImage": "string",
      "shortDescription": "string",
      "slug": "string",
      "stat": "string",
      "stem": "string",
      "virtualOffices": "json",
      "virtualPresence": "json",
      "workspaceSolutions": "json"
    }
  },
  "testimonials": {
    "type": "data",
    "fields": {
      "id": "string",
      "extension": "string",
      "image": "json",
      "meta": "json",
      "name": "string",
      "quote": "string",
      "role": "string",
      "stem": "string"
    }
  },
  "partners": {
    "type": "data",
    "fields": {
      "id": "string",
      "extension": "string",
      "logo": "string",
      "meta": "json",
      "name": "string",
      "stem": "string"
    }
  },
  "gallery": {
    "type": "data",
    "fields": {
      "id": "string",
      "extension": "string",
      "meta": "json",
      "sections": "json",
      "stem": "string"
    }
  },
  "locations": {
    "type": "data",
    "fields": {
      "id": "string",
      "address": "string",
      "city": "string",
      "email": "string",
      "extension": "string",
      "fullAddress": "string",
      "hours": "string",
      "mapUrl": "string",
      "meta": "json",
      "name": "string",
      "phone": "string",
      "slug": "string",
      "stem": "string"
    }
  },
  "membership": {
    "type": "data",
    "fields": {
      "id": "string",
      "title": "string",
      "cta": "string",
      "description": "string",
      "extension": "string",
      "listItems": "json",
      "meta": "json",
      "sectionImage": "json",
      "stem": "string"
    }
  },
  "contact": {
    "type": "data",
    "fields": {
      "id": "string",
      "title": "string",
      "contactOptions": "json",
      "description": "string",
      "extension": "string",
      "meta": "json",
      "stem": "string"
    }
  },
  "cta": {
    "type": "data",
    "fields": {
      "id": "string",
      "cta": "string",
      "description": "string",
      "extension": "string",
      "heading": "string",
      "meta": "json",
      "stem": "string"
    }
  },
  "team": {
    "type": "data",
    "fields": {
      "id": "string",
      "email": "string",
      "extension": "string",
      "image": "string",
      "linkedin": "string",
      "meta": "json",
      "name": "string",
      "role": "string",
      "stem": "string",
      "twitter": "string"
    }
  },
  "info": {
    "type": "data",
    "fields": {}
  }
};

async function fetchContent(event, collection, path, options) {
  const headers = event ? getRequestHeaders(event) : {};
  const url = `/__nuxt_content/${collection}/${path}`;
  const fetchOptions = {
    ...options,
    headers: {
      ...headers,
      ...options.headers
    },
    query: { v: checksums[String(collection)], t: void 0 }
  };
  return event ? await event.$fetch(url, fetchOptions) : await $fetch(url, fetchOptions);
}
async function fetchDatabase(event, collection) {
  return fetchContent(event, collection, "sql_dump.txt", {
    responseType: "text",
    headers: {
      "content-type": "text/plain"
    }
  });
}

const requiredUserFields = ["name", "email"];
async function setInternalStudioUserSession(event, user) {
  const missingFields = requiredUserFields.filter((key) => !user[key]);
  if (missingFields.length > 0) {
    throw createError$1({
      statusCode: 400,
      statusMessage: `Missing required Studio user fields: ${missingFields.join(", ")}`
    });
  }
  const session = await useSession(event, {
    name: "studio-session",
    password: useRuntimeConfig(event).studio?.auth?.sessionSecret,
    cookie: {
      // Use secure cookies over HTTPS, required for locally testing purposes
      secure: getRequestProtocol(event) === "https",
      path: "/"
    }
  });
  const payload = defu({
    user: {
      ...user
    }
  }, session.data);
  await session.update(payload);
  setCookie(event, "studio-session-check", "true", {
    httpOnly: false,
    path: "/",
    // Keep behavior consistent with the session cookie and OAuth cookies
    secure: getRequestProtocol(event) === "https",
    sameSite: "lax"
  });
  await useNitroApp().hooks.callHook("studio:auth:login", { user, event });
  return {
    ...payload,
    id: session.id
  };
}
async function clearStudioUserSession(event) {
  const session = await useSession(event, {
    name: "studio-session",
    password: useRuntimeConfig(event).studio?.auth?.sessionSecret,
    cookie: {
      // Use secure cookies over HTTPS, required for locally testing purposes
      secure: getRequestProtocol(event) === "https",
      path: "/"
    }
  });
  const user = session.data.user;
  await session.clear();
  deleteCookie(event, "studio-session-check", { path: "/" });
  if (user) {
    await useNitroApp().hooks.callHook("studio:auth:logout", { user, event });
  }
  return { loggedOut: true };
}

const collections = {
  'lucide': () => import('../_/icons.mjs').then(m => m.default),
};

const DEFAULT_ENDPOINT = "https://api.iconify.design";
const _A18zAr = defineCachedEventHandler(async (event) => {
  const url = getRequestURL(event);
  if (!url)
    return createError$1({ status: 400, message: "Invalid icon request" });
  const options = useAppConfig().icon;
  const collectionName = event.context.params?.collection?.replace(/\.json$/, "");
  const collection = collectionName ? await collections[collectionName]?.() : null;
  const apiEndPoint = options.iconifyApiEndpoint || DEFAULT_ENDPOINT;
  const icons = url.searchParams.get("icons")?.split(",");
  if (collection) {
    if (icons?.length) {
      const data = getIcons(
        collection,
        icons
      );
      consola.debug(`[Icon] serving ${(icons || []).map((i) => "`" + collectionName + ":" + i + "`").join(",")} from bundled collection`);
      return data;
    }
  }
  if (options.fallbackToApi === true || options.fallbackToApi === "server-only") {
    const apiUrl = new URL("./" + basename(url.pathname) + url.search, apiEndPoint);
    consola.debug(`[Icon] fetching ${(icons || []).map((i) => "`" + collectionName + ":" + i + "`").join(",")} from iconify api`);
    if (apiUrl.host !== new URL(apiEndPoint).host) {
      return createError$1({ status: 400, message: "Invalid icon request" });
    }
    try {
      const data = await $fetch(apiUrl.href);
      return data;
    } catch (e) {
      consola.error(e);
      if (e.status === 404)
        return createError$1({ status: 404 });
      else
        return createError$1({ status: 500, message: "Failed to fetch fallback icon" });
    }
  }
  return createError$1({ status: 404 });
}, {
  group: "nuxt",
  name: "icon",
  getKey(event) {
    const collection = event.context.params?.collection?.replace(/\.json$/, "") || "unknown";
    const icons = String(getQuery(event).icons || "");
    return `${collection}_${icons.split(",")[0]}_${icons.length}_${hash$1(icons)}`;
  },
  swr: true,
  maxAge: 60 * 60 * 24 * 7
  // 1 week
});

async function requestAccessToken$1(url, options) {
  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
    ...options.headers
  };
  const body = headers["Content-Type"] === "application/x-www-form-urlencoded" ? new URLSearchParams(
    options.body || options.params || {}
  ).toString() : options.body;
  return $fetch(url, {
    method: "POST",
    headers,
    body
  }).catch((error) => {
    if (error instanceof FetchError && error.status === 401) {
      return error.data;
    }
    throw error;
  });
}
async function generateOAuthState(event) {
  const newState = getRandomBytes(32);
  setCookie(event, "studio-oauth-state", newState, {
    path: "/",
    httpOnly: true,
    // Use secure cookies over HTTPS, required for locally testing purposes
    secure: getRequestProtocol(event) === "https",
    sameSite: "lax",
    maxAge: 60 * 15
    // 15 minutes
  });
  return newState;
}
function validateOAuthState(event, receivedState) {
  const storedState = getCookie(event, "studio-oauth-state");
  if (!storedState) {
    throw createError$1({
      statusCode: 400,
      message: "OAuth state cookie not found. Please try logging in again.",
      data: {
        hint: "State cookie may have expired or been cleared"
      }
    });
  }
  if (receivedState !== storedState) {
    throw createError$1({
      statusCode: 400,
      message: "Invalid state - OAuth state mismatch",
      data: {
        hint: "This may be caused by browser refresh, navigation, or expired session"
      }
    });
  }
  deleteCookie(event, "studio-oauth-state");
}
function getRandomBytes(size = 32) {
  return encodeBase64Url(getRandomValues(new Uint8Array(size)));
}
function encodeBase64Url(input) {
  return btoa(String.fromCharCode.apply(null, Array.from(input))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

const _PoO0j4 = eventHandler(async (event) => {
  const studioConfig = useRuntimeConfig(event).studio;
  const config = defu(studioConfig?.auth?.github, {
    clientId: process.env.STUDIO_GITHUB_CLIENT_ID,
    clientSecret: process.env.STUDIO_GITHUB_CLIENT_SECRET,
    redirectURL: process.env.STUDIO_GITHUB_REDIRECT_URL,
    authorizationURL: "https://github.com/login/oauth/authorize",
    tokenURL: "https://github.com/login/oauth/access_token",
    apiURL: "https://api.github.com",
    authorizationParams: {},
    emailRequired: true
  });
  const query = getQuery(event);
  if (query.error) {
    throw createError$1({
      statusCode: 401,
      message: `GitHub login failed: ${query.error || "Unknown error"}`,
      data: query
    });
  }
  if (!config.clientId || !config.clientSecret) {
    throw createError$1({
      statusCode: 500,
      message: "Missing GitHub client ID or secret",
      data: config
    });
  }
  const requestURL = getRequestURL(event);
  config.redirectURL = config.redirectURL || `${requestURL.protocol}//${requestURL.host}${requestURL.pathname}`;
  if (!query.code) {
    const state = await generateOAuthState(event);
    config.scope = config.scope || [];
    if (config.emailRequired && !config.scope.includes("user:email")) {
      config.scope.push("user:email");
    }
    if (config.emailRequired && !config.scope.includes("repo") && !config.scope.includes("public_repo")) {
      config.scope.push(studioConfig.repository.private ? "repo" : "public_repo");
    }
    return sendRedirect(
      event,
      withQuery(config.authorizationURL, {
        client_id: config.clientId,
        redirect_uri: config.redirectURL,
        scope: config.scope.join(" "),
        state,
        ...config.authorizationParams
      })
    );
  }
  validateOAuthState(event, query.state);
  if (studioConfig.repository.provider !== "github") {
    throw createError$1({
      statusCode: 500,
      message: "GitHub Oauth provider only supports GitHub repository provider"
    });
  }
  const token = await requestAccessToken$1(config.tokenURL, {
    body: {
      grant_type: "authorization_code",
      client_id: config.clientId,
      client_secret: config.clientSecret,
      redirect_uri: config.redirectURL,
      code: query.code
    }
  });
  if (token.error || !token.access_token) {
    throw createError$1({
      statusCode: 500,
      message: "Failed to get access token",
      data: token
    });
  }
  const accessToken = token.access_token;
  const user = await $fetch(`${config.apiURL}/user`, {
    headers: {
      "User-Agent": `Github-OAuth-${config.clientId}`,
      "Authorization": `token ${accessToken}`
    }
  });
  if (!user.email && config.emailRequired) {
    const emails = await $fetch(`${config.apiURL}/user/emails`, {
      headers: {
        "User-Agent": `Github-OAuth-${config.clientId}`,
        "Authorization": `token ${accessToken}`
      }
    });
    const primaryEmail = emails.find((email) => email.primary);
    if (!primaryEmail) {
      throw createError$1({
        statusCode: 500,
        message: "Could not get GitHub user email",
        data: token
      });
    }
    user.email = primaryEmail.email;
  }
  const moderators = process.env.STUDIO_GITHUB_MODERATORS?.split(",") || [];
  if (moderators.length > 0 && !moderators.includes(String(user.email))) {
    throw createError$1({
      statusCode: 403,
      message: "You are not authorized to access the studio"
    });
  }
  await setInternalStudioUserSession(event, {
    providerId: user.id.toString(),
    accessToken: token.access_token,
    name: user.name || user.login,
    avatar: user.avatar_url,
    email: user.email,
    provider: "github"
  });
  const redirect = decodeURIComponent(getCookie(event, "studio-redirect") || "");
  deleteCookie(event, "studio-redirect");
  if (redirect && redirect.startsWith("/") && !redirect.startsWith("//")) {
    return sendRedirect(event, redirect);
  }
  return sendRedirect(event, "/");
});

const _ot6zVZ = eventHandler(async (event) => {
  const studioConfig = useRuntimeConfig(event).studio;
  const config = defu(studioConfig?.auth?.google, {
    clientId: process.env.STUDIO_GOOGLE_CLIENT_ID,
    clientSecret: process.env.STUDIO_GOOGLE_CLIENT_SECRET,
    redirectURL: process.env.STUDIO_GOOGLE_REDIRECT_URL,
    authorizationURL: "https://accounts.google.com/o/oauth2/v2/auth",
    tokenURL: "https://oauth2.googleapis.com/token",
    userURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    authorizationParams: {},
    emailRequired: true
  });
  const query = getQuery(event);
  if (query.error) {
    throw createError$1({
      statusCode: 401,
      message: `Google login failed: ${query.error || "Unknown error"}`,
      data: query
    });
  }
  if (!config.clientId || !config.clientSecret) {
    throw createError$1({
      statusCode: 500,
      message: "Missing Google client ID or secret",
      data: config
    });
  }
  const requestURL = getRequestURL(event);
  config.redirectURL = config.redirectURL || `${requestURL.protocol}//${requestURL.host}${requestURL.pathname}`;
  if (!query.code) {
    const state = await generateOAuthState(event);
    config.scope = config.scope || ["email", "profile"];
    return sendRedirect(
      event,
      withQuery(config.authorizationURL, {
        response_type: "code",
        client_id: config.clientId,
        redirect_uri: config.redirectURL,
        scope: config.scope.join(" "),
        state,
        ...config.authorizationParams
      })
    );
  }
  validateOAuthState(event, query.state);
  const provider = studioConfig?.repository.provider;
  if (provider === "github" && !process.env.STUDIO_GITHUB_TOKEN) {
    throw createError$1({
      statusCode: 500,
      message: "`STUDIO_GITHUB_TOKEN` is not set. Google authenticated users cannot push changes to the repository without a valid GitHub token."
    });
  }
  if (provider === "gitlab" && !process.env.STUDIO_GITLAB_TOKEN) {
    throw createError$1({
      statusCode: 500,
      message: "`STUDIO_GITLAB_TOKEN` is not set. Google authenticated users cannot push changes to the repository without a valid GitLab token."
    });
  }
  const repositoryToken = provider === "github" ? process.env.STUDIO_GITHUB_TOKEN : process.env.STUDIO_GITLAB_TOKEN;
  const token = await requestAccessToken$1(config.tokenURL, {
    body: {
      grant_type: "authorization_code",
      code: query.code,
      client_id: config.clientId,
      client_secret: config.clientSecret,
      redirect_uri: config.redirectURL
    }
  });
  if (token.error || !token.access_token) {
    throw createError$1({
      statusCode: 500,
      message: "Failed to get access token",
      data: token
    });
  }
  const accessToken = token.access_token;
  const user = await $fetch(
    config.userURL,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  );
  if (!user.email && config.emailRequired) {
    throw createError$1({
      statusCode: 500,
      message: "Could not get Google user email",
      data: user
    });
  }
  const moderators = process.env.STUDIO_GOOGLE_MODERATORS?.split(",") || [];
  if (!moderators.includes(user.email)) {
    throw createError$1({
      statusCode: 403,
      message: "You are not authorized to access the studio"
    });
  }
  await setInternalStudioUserSession(event, {
    providerId: String(user.sub).toString(),
    accessToken: repositoryToken,
    name: user.name || `${user.given_name || ""} ${user.family_name || ""}`.trim(),
    avatar: user.picture,
    email: user.email,
    provider: "google"
  });
  const redirect = decodeURIComponent(getCookie(event, "studio-redirect") || "");
  deleteCookie(event, "studio-redirect");
  if (redirect && redirect.startsWith("/") && !redirect.startsWith("//")) {
    return sendRedirect(event, redirect);
  }
  return sendRedirect(event, "/");
});

const _IDBmFC = eventHandler(async (event) => {
  const studioConfig = useRuntimeConfig(event).studio;
  const instanceUrl = studioConfig?.auth?.gitlab?.instanceUrl || "https://gitlab.com";
  const config = defu(studioConfig?.auth?.gitlab, {
    applicationId: process.env.STUDIO_GITLAB_APPLICATION_ID,
    applicationSecret: process.env.STUDIO_GITLAB_APPLICATION_SECRET,
    redirectURL: process.env.STUDIO_GITLAB_REDIRECT_URL,
    instanceUrl,
    authorizationURL: `${instanceUrl}/oauth/authorize`,
    tokenURL: `${instanceUrl}/oauth/token`,
    apiURL: `${instanceUrl}/api/v4`,
    authorizationParams: {},
    emailRequired: true
  });
  const query = getQuery(event);
  if (query.error) {
    throw createError$1({
      statusCode: 401,
      message: `GitLab login failed: ${query.error || "Unknown error"}`,
      data: query
    });
  }
  if (!config.applicationId || !config.applicationSecret) {
    throw createError$1({
      statusCode: 500,
      message: "Missing GitLab application ID or secret",
      data: config
    });
  }
  const requestURL = getRequestURL(event);
  config.redirectURL = config.redirectURL || `${requestURL.protocol}//${requestURL.host}${requestURL.pathname}`;
  if (!query.code) {
    const state = await generateOAuthState(event);
    config.scope = config.scope || [];
    if (!config.scope.includes("api")) {
      config.scope.push("api");
    }
    return sendRedirect(
      event,
      withQuery(config.authorizationURL, {
        client_id: config.applicationId,
        redirect_uri: config.redirectURL,
        response_type: "code",
        scope: config.scope.join(" "),
        state,
        ...config.authorizationParams
      })
    );
  }
  validateOAuthState(event, query.state);
  if (studioConfig.repository.provider !== "gitlab") {
    throw createError$1({
      statusCode: 500,
      message: "GitLab Oauth provider only supports GitLab repository provider"
    });
  }
  const token = await requestAccessToken(config.tokenURL, {
    body: {
      grant_type: "authorization_code",
      client_id: config.applicationId,
      client_secret: config.applicationSecret,
      redirect_uri: config.redirectURL,
      code: query.code
    }
  });
  if (token.error || !token.access_token) {
    throw createError$1({
      statusCode: 500,
      message: "Failed to get access token",
      data: token
    });
  }
  const accessToken = token.access_token;
  const user = await $fetch(`${config.apiURL}/user`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
  if (!user.email && config.emailRequired) {
    throw createError$1({
      statusCode: 500,
      message: "Could not get GitLab user email",
      data: token
    });
  }
  const moderators = process.env.STUDIO_GITLAB_MODERATORS?.split(",") || [];
  if (moderators.length > 0 && !moderators.includes(String(user.email))) {
    throw createError$1({
      statusCode: 403,
      message: "You are not authorized to access the studio"
    });
  }
  await setInternalStudioUserSession(event, {
    providerId: user.id.toString(),
    accessToken: token.access_token,
    name: user.name || user.username,
    avatar: user.avatar_url,
    email: user.email,
    provider: "gitlab"
  });
  const redirect = decodeURIComponent(getCookie(event, "studio-redirect") || "/");
  deleteCookie(event, "studio-redirect");
  if (redirect && redirect.startsWith("/") && !redirect.startsWith("//")) {
    return sendRedirect(event, redirect);
  }
  return sendRedirect(event, "/");
});
async function requestAccessToken(url, options) {
  try {
    return await $fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: options.body,
      params: options.params
    });
  } catch (error) {
    if (error instanceof FetchError) {
      return error.data || { error: error.message };
    }
    return { error: "Unknown error" };
  }
}

const _tnzxeg = eventHandler(async (event) => {
  const session = await useSession(event, {
    name: "studio-session",
    password: useRuntimeConfig(event).studio?.auth?.sessionSecret,
    cookie: {
      // Use secure cookies over HTTPS, required for locally testing purposes
      secure: getRequestProtocol(event) === "https",
      path: "/"
    }
  });
  if (!session.data || Object.keys(session.data).length === 0) {
    deleteCookie(event, "studio-session-check", { path: "/" });
  }
  return {
    ...session.data,
    id: session.id
  };
});

const _jIExYM = eventHandler(async (event) => {
  return await clearStudioUserSession(event);
});

const _lW0pBe = eventHandler((event) => {
  const { redirect } = getQuery(event);
  if (redirect) {
    setCookie(event, "studio-redirect", String(redirect), {
      path: "/",
      // Use secure cookies over HTTPS, required for locally testing purposes
      secure: getRequestProtocol(event) === "https",
      httpOnly: true
    });
  }
  const hasGithub = process.env.STUDIO_GITHUB_CLIENT_ID && "github";
  const hasGitlab = process.env.STUDIO_GITLAB_APPLICATION_ID && "gitlab";
  const hasGoogle = process.env.STUDIO_GOOGLE_CLIENT_ID && "google";
  const providers = [hasGithub, hasGitlab, hasGoogle].filter(Boolean);
  if (providers.length === 0) {
    throw createError$1({
      statusCode: 404,
      message: "No authentication provider found"
    });
  }
  if (providers.length === 1) {
    return sendRedirect(event, `/__nuxt_studio/auth/${providers[0]}`);
  }
  const githubButton = hasGithub ? `<a href="#" class="provider-btn github" data-provider="github">
                <svg viewBox="0 0 16 16" version="1.1" aria-hidden="true">
                    <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>
                </svg>
                Continue with GitHub
            </a>` : "";
  const gitlabButton = hasGitlab ? `<a href="#" class="provider-btn gitlab" data-provider="gitlab">
                <svg viewBox="0 0 380 380" aria-hidden="true">
                    <g fill="#ffffff">
                        <path d="M282.83,170.73l-.27-.69-26.14-68.22a6.81,6.81,0,0,0-2.69-3.24,7,7,0,0,0-8,.43,7,7,0,0,0-2.32,3.52l-17.65,54H154.29l-17.65-54A6.86,6.86,0,0,0,134.32,99a7,7,0,0,0-8-.43,6.87,6.87,0,0,0-2.69,3.24L97.44,170l-.26.69a48.54,48.54,0,0,0,16.1,56.1l.09.07.24.17,39.82,29.82,19.7,14.91,12,9.06a8.07,8.07,0,0,0,9.76,0l12-9.06,19.7-14.91,40.06-30,.1-.08A48.56,48.56,0,0,0,282.83,170.73Z"/>
                    </g>
                </svg>
                Continue with GitLab
            </a>` : "";
  const googleButton = hasGoogle ? `<a href="#" class="provider-btn google" data-provider="google">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
            </a>` : "";
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <title>Content Studio</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script>
      (function () {
        var storageListenerKey = 'studio-auth-popup'

        function navigateToProvider(provider) {
          window.location.assign('/__nuxt_studio/auth/' + provider)
        }

        function notifyOpenerAndClose() {
          try {
            if (window.opener && !window.opener.closed) {
              window.opener.localStorage.setItem('temp-' + storageListenerKey, String(Date.now()))
            }
          } catch (_) {}
          setTimeout(function () { window.close() }, 100)
        }

        // If this page was opened as a popup with ?done=1, signal the opener and close
        var params = new URLSearchParams(window.location.search)
        if (params.get('done') === '1') {
          notifyOpenerAndClose()
        }

        window.addEventListener('DOMContentLoaded', function () {
          var buttons = document.querySelectorAll('.provider-btn')
          buttons.forEach(function(btn) {
            btn.addEventListener('click', function (e) {
              e.preventDefault()
              var provider = btn.getAttribute('data-provider')
              navigateToProvider(provider)
            })
          })
        })
      })()
    <\/script>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        :root {
            --background: #0d1117;
            --surface: #161b22;
            --surface-hover: #21262d;
            --border: #30363d;
            --text-primary: #f0f6fc;
            --text-secondary: #8b949e;
            --github: #24292f;
            --github-hover: #32383f;
            --gitlab: #fc6d26;
            --gitlab-hover: #e85b15;
            --google: #ffffff;
            --google-hover: #f8f9fa;
            --google-text: #1f1f1f;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif;
            background: var(--background);
            color: var(--text-primary);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            line-height: 1.5;
        }

        .login-container {
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: 12px;
            padding: 48px;
            width: 100%;
            max-width: 400px;
            box-shadow: 0 16px 32px rgba(1, 4, 9, 0.85);
        }

        .logo {
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .logo img {
            width: 48px;
            height: 48px;
        }

        .header {
            text-align: center;
            margin-bottom: 24px;
        }

        .header h1 {
            font-size: 24px;
            font-weight: 600;
            margin-bottom: 8px;
            color: var(--text-primary);
        }

        .header p {
            color: var(--text-secondary);
            font-size: 16px;
        }

        .providers {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .provider-btn {
            width: 100%;
            border: 1px solid var(--border);
            padding: 14px 20px;
            border-radius: 8px;
            font-size: 15px;
            font-weight: 600;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
            transition: all 0.2s ease;
            text-decoration: none;
        }

        .provider-btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .provider-btn svg {
            width: 20px;
            height: 20px;
            flex-shrink: 0;
        }

        .provider-btn.gitlab svg {
            height: 30px;
            width: 30px;
        }

        .provider-btn.github {
            background: var(--github);
            color: var(--text-primary);
        }

        .provider-btn.github:hover {
            background: var(--github-hover);
            border-color: var(--github-hover);
        }

        .provider-btn.github svg {
            fill: currentColor;
        }

        .provider-btn.gitlab {
            background: var(--gitlab);
            color: #ffffff;
            border-color: var(--gitlab);
        }

        .provider-btn.gitlab:hover {
            background: var(--gitlab-hover);
            border-color: var(--gitlab-hover);
        }

        .provider-btn.google {
            background: var(--google);
            color: var(--google-text);
            border-color: #dadce0;
        }

        .provider-btn.google:hover {
            background: var(--google-hover);
            border-color: #d2d3d4;
        }

        .footer {
            text-align: center;
            margin-top: 32px;
            padding-top: 24px;
            border-top: 1px solid var(--border);
        }

        .footer p {
            color: var(--text-secondary);
            font-size: 14px;
        }

        .footer a {
            color: #0969da;
            text-decoration: none;
        }

        .footer a:hover {
            text-decoration: underline;
        }

        @media (max-width: 480px) {
            .login-container {
                padding: 32px 24px;
                margin: 16px;
            }

            .provider-btn {
                font-size: 14px;
                padding: 12px 16px;
            }
        }
    </style>
</head>
<body>
    <div class="login-container">
        <div class="logo">
          <img src="https://nuxt.com/assets/design-kit/icon-white.svg" alt="Nuxt Logo" />
        </div>

        <div class="header">
            <h1>Nuxt Studio</h1>
            <p>Sign in to start editing your website.</p>
        </div>

        <div class="providers">
            ${githubButton}
            ${gitlabButton}
            ${googleButton}
        </div>

    </div>
</body>
</html>`;
});

// Auto-generated deduplicated module
// Strings and objects extracted for memory efficiency

const _s = [
  "",
  "string",
  "{}",
  "param",
  "ClassNameValue",
  "object",
  "all",
  "event",
  "default",
  "any",
  "enum",
  "boolean",
  "defaultValue",
  "ui",
  "false",
  "() => string",
  "(): string",
  "true",
  "number",
  "LocationQueryRaw",
  "HistoryState",
  "name",
  "icon",
  "replace",
  "id",
  "string | number",
  "hash",
  "array",
  "label",
  "description",
  "string | RouteLocationAsRelativeGeneric | RouteLocationAsPathGeneric",
  "RouteRecordNameGeneric",
  "RouteParamsRawGeneric",
  "path",
  "undefined",
  "query",
  "Replace the entry in the history instead of pushing a new entry",
  "force",
  "Triggers the navigation even if the location is the same as the current one.\nNote this will also add a new entry to the history unless `replace: true`\nis passed.",
  "state",
  "State to save using the History API. This cannot contain any reactive\nvalues and some primitives like Symbols are forbidden. More info at\nhttps://developer.mozilla.org/en-US/docs/Web/API/History/state",
  "\"_blank\" | \"_parent\" | \"_self\" | \"_top\" | (string & {})",
  "(searchString: string, position?: number) => number",
  "(searchString: string, position?: number): number",
  "that String to compare to target string",
  "{ (that: string): number; (that: string, locales?: string | string[], options?: Intl.CollatorOptions): number; }",
  "{ (searchValue: string | RegExp, replaceValue: string): string; (searchValue: string | RegExp, replacer: (substring: string, ...args: any[]) => string): string; }",
  "(locales?: string | string[]) => string",
  "(locales?: string | string[]): string",
  "\"primary\" | \"secondary\" | \"success\" | \"info\" | \"warning\" | \"error\" | \"neutral\"",
  "{ base?: ClassNameValue; link?: ClassNameValue; }",
  "{ base?: ClassNameValue; leading?: ClassNameValue; leadingIcon?: ClassNameValue; link?: ClassNameValue; }",
  "class",
  "l9_4za4CroH3LkkS8qYb-ZIOesbEfWuIV8vW5khOCH8",
  "target",
  "\"_blank\"",
  "\"_parent\"",
  "\"_self\"",
  "\"_top\"",
  "root",
  "0",
  "0n",
  "ClassNameArray",
  "trigger",
  "content",
  "toString",
  "length",
  "color",
  "\"primary\"",
  "\"secondary\"",
  "\"success\"",
  "\"info\"",
  "\"warning\"",
  "\"error\"",
  "\"neutral\"",
  "example",
  "null",
  "Function"
];

const _emptyArray = [];
const _emptyObject = {};
const _ref0 = [_s[4]];
const _ref1 = {"0": _s[14], "1": _s[17]};
const _ref2 = {kind: _s[7], type: _s[16]};
const _ref3 = {name: _s[3], text: _s[44]};
const _ref4 = {"0": _s[1], "1": _s[18]};
const _ref5 = {name: _s[63], global: false, description: _s[0], tags: _emptyArray, required: false, type: _s[4], schema: _s[4]};
const _ref6 = {name: _s[64], global: false, description: _s[0], tags: _emptyArray, required: false, type: _s[4], schema: _s[4]};
const _ref7 = {name: _s[29], global: false, description: _s[0], tags: _emptyArray, required: false, type: _s[1], schema: _s[1]};
const _ref8 = {name: _s[35], global: false, description: _s[0], tags: _emptyArray, required: false, type: _s[19], schema: _s[19]};
const _ref9 = {name: _s[26], global: false, description: _s[0], tags: _emptyArray, required: false, type: _s[1], schema: _s[1]};
const _ref10 = {name: _s[37], global: false, description: _s[38], tags: _emptyArray, required: false, type: _s[11], schema: _s[11]};
const _ref11 = {name: _s[22], global: false, description: _s[0], tags: _emptyArray, required: false, type: _s[9], schema: _s[9]};
const _ref12 = {name: _s[24], global: false, description: _s[0], tags: _emptyArray, required: false, type: _s[1], schema: _s[1]};
const _ref13 = {name: _s[52], global: false, description: _s[0], tags: _emptyArray, required: false, type: _s[9], schema: _s[9]};
const _ref14 = {type: 1, props: _emptyArray, slots: _emptyArray, events: _emptyArray, exposed: _emptyArray, hash: _s[53]};
const _ref15 = {kind: _s[5], type: _s[2], schema: _emptyObject};
const _ref16 = {kind: _s[7], type: _s[43], schema: _emptyObject};
const _ref17 = {kind: _s[7], type: _s[48], schema: _emptyObject};
const _ref18 = {kind: _s[27], type: _s[62], schema: _ref0};
const _ref19 = {kind: _s[10], type: _s[11], schema: _ref1};
const _ref20 = {kind: _s[10], type: _s[25], schema: _ref4};
const _ref21 = {name: _s[8], type: _s[2], description: _s[0], tags: _emptyArray, schema: _ref15};
const _ref22 = {"0": _s[1], "1": _s[14], "2": _s[60], "3": _s[61], "4": _ref18};
const _ref23 = [_ref21];
const _ref24 = {kind: _s[10], type: _s[4], schema: _ref22};
const _ref25 = {name: _s[59], global: false, description: _s[0], tags: _emptyArray, required: false, type: _s[4], schema: _ref24};

const components = {ProseA: {mode: _s[6], global: true, prefetch: false, preload: false, filePath: "node_modules/@nuxt/ui/dist/runtime/components/prose/A.vue", declarationPath: "/Users/mac/Documents/abb-apps/abb-website/node_modules/@nuxt/ui/dist/runtime/components/prose/A.vue", pascalName: "ProseA", kebabName: "prose-a", chunkName: "components/prose-a", priority: 0, _scanned: true, meta: {type: 1, props: [{name: "href", global: false, description: _s[0], tags: _emptyArray, required: false, type: _s[1], schema: _s[1]}, {name: _s[54], global: false, description: _s[0], tags: _emptyArray, required: false, type: "\"_blank\" | \"_parent\" | \"_self\" | \"_top\"", schema: {kind: _s[10], type: "\"_blank\" | \"_parent\" | \"_self\" | \"_top\"", schema: {"0": _s[55], "1": _s[56], "2": _s[57], "3": _s[58]}}}], slots: _ref23, events: _emptyArray, exposed: _emptyArray, hash: "Eiu_fiFQ2DAfIezNpFp9FqigbcqmuDqPODn70DUCyjU"}}, ProseAccordion: {mode: _s[6], global: true, prefetch: false, preload: false, filePath: "node_modules/@nuxt/ui/dist/runtime/components/prose/Accordion.vue", declarationPath: "/Users/mac/Documents/abb-apps/abb-website/node_modules/@nuxt/ui/dist/runtime/components/prose/Accordion.vue", pascalName: "ProseAccordion", kebabName: "prose-accordion", chunkName: "components/prose-accordion", priority: 0, _scanned: true, meta: {type: 1, props: [{name: "type", global: false, description: _s[0], tags: _emptyArray, required: false, type: "\"single\" | \"multiple\"", schema: {kind: _s[10], type: "\"single\" | \"multiple\"", schema: {"0": "\"single\"", "1": "\"multiple\""}}}, {name: _s[13], global: false, description: _s[0], tags: _emptyArray, required: false, type: "{ root?: ClassNameValue; trigger?: ClassNameValue; } & { root?: ClassNameValue; item?: ClassNameValue; header?: ClassNameValue; trigger?: ClassNameValue; content?: ClassNameValue; body?: ClassNameValue; leadingIcon?: ClassNameValue; trailingIcon?: ClassNameValue; label?: ClassNameValue; }", schema: {kind: _s[5], type: "{ root?: ClassNameValue; trigger?: ClassNameValue; } & { root?: ClassNameValue; item?: ClassNameValue; header?: ClassNameValue; trigger?: ClassNameValue; content?: ClassNameValue; body?: ClassNameValue; leadingIcon?: ClassNameValue; trailingIcon?: ClassNameValue; label?: ClassNameValue; }", schema: {root: _ref25, trigger: _ref5, item: {name: "item", global: false, description: _s[0], tags: _emptyArray, required: false, type: _s[4], schema: _s[4]}, header: {name: "header", global: false, description: _s[0], tags: _emptyArray, required: false, type: _s[4], schema: _s[4]}, content: _ref6, body: {name: "body", global: false, description: _s[0], tags: _emptyArray, required: false, type: _s[4], schema: _s[4]}, leadingIcon: {name: "leadingIcon", global: false, description: _s[0], tags: _emptyArray, required: false, type: _s[4], schema: _s[4]}, trailingIcon: {name: "trailingIcon", global: false, description: _s[0], tags: _emptyArray, required: false, type: _s[4], schema: _s[4]}, label: {name: _s[28], global: false, description: _s[0], tags: _emptyArray, required: false, type: _s[4], schema: _s[4]}}}}], slots: _ref23, events: _emptyArray, exposed: _emptyArray, hash: "7CuM9QXEAQyI3j-wmVcbyYBctZpmIbo4Nr2Jv0op060"}}, ProseAccordionItem: {mode: _s[6], global: true, prefetch: false, preload: false, filePath: "node_modules/@nuxt/ui/dist/runtime/components/prose/AccordionItem.vue", declarationPath: "/Users/mac/Documents/abb-apps/abb-website/node_modules/@nuxt/ui/dist/runtime/components/prose/AccordionItem.vue", pascalName: "ProseAccordionItem", kebabName: "prose-accordion-item", chunkName: "components/prose-accordion-item", priority: 0, _scanned: true, meta: {type: 1, props: [{name: _s[28], global: false, description: _s[0], tags: _emptyArray, required: true, type: _s[1], schema: _s[1]}, _ref7], slots: _ref23, events: _emptyArray, exposed: _emptyArray, hash: "9mshd9xQJzI9AETIDQfzK4gm6CG4wkOe7nb3KcCKqLs"}}, ProseBadge: {mode: _s[6], global: true, prefetch: false, preload: false, filePath: "node_modules/@nuxt/ui/dist/runtime/components/prose/Badge.vue", declarationPath: "/Users/mac/Documents/abb-apps/abb-website/node_modules/@nuxt/ui/dist/runtime/components/prose/Badge.vue", pascalName: "ProseBadge", kebabName: "prose-badge", chunkName: "components/prose-badge", priority: 0, _scanned: true, meta: {type: 1, props: _emptyArray, slots: _ref23, events: _emptyArray, exposed: _emptyArray, hash: "2joJ6AplkrZLwaEOf5v_vhUtMMHOXpXyvmGEyFD4mYU"}}, ProseBlockquote: {mode: _s[6], global: true, prefetch: false, preload: false, filePath: "node_modules/@nuxt/ui/dist/runtime/components/prose/Blockquote.vue", declarationPath: "/Users/mac/Documents/abb-apps/abb-website/node_modules/@nuxt/ui/dist/runtime/components/prose/Blockquote.vue", pascalName: "ProseBlockquote", kebabName: "prose-blockquote", chunkName: "components/prose-blockquote", priority: 0, _scanned: true, meta: {type: 1, props: _emptyArray, slots: _ref23, events: _emptyArray, exposed: _emptyArray, hash: "1f9yxaNry3whzit8VyaB3xKcIPCIvNteby-uVWlLJpI"}}, ProseCallout: {mode: _s[6], global: true, prefetch: false, preload: false, filePath: "node_modules/@nuxt/ui/dist/runtime/components/prose/Callout.vue", declarationPath: "/Users/mac/Documents/abb-apps/abb-website/node_modules/@nuxt/ui/dist/runtime/components/prose/Callout.vue", pascalName: "ProseCallout", kebabName: "prose-callout", chunkName: "components/prose-callout", priority: 0, _scanned: true, meta: {type: 1, props: [{name: "to", global: false, description: _s[0], tags: _emptyArray, required: false, type: _s[30], schema: {kind: _s[10], type: _s[30], schema: {"0": _s[1], "1": {kind: _s[5], type: "RouteLocationAsRelativeGeneric", schema: {name: {name: _s[21], global: false, description: _s[0], tags: _emptyArray, required: false, type: _s[31], schema: {kind: _s[10], type: _s[31], schema: {"0": _s[1], "1": "symbol"}}}, params: {name: "params", global: false, description: _s[0], tags: _emptyArray, required: false, type: _s[32], schema: _s[32]}, path: {name: _s[33], global: false, description: "A relative path to the current location. This property should be removed", tags: _emptyArray, required: false, type: _s[34], schema: _s[34]}, query: _ref8, hash: _ref9, replace: {name: _s[23], global: false, description: _s[36], tags: _emptyArray, required: false, type: _s[11], schema: _ref19}, force: _ref10, state: {name: _s[39], global: false, description: _s[40], tags: _emptyArray, required: false, type: _s[20], schema: {kind: _s[5], type: _s[20], schema: _emptyObject}}}}, "2": {kind: _s[5], type: "RouteLocationAsPathGeneric", schema: {path: {name: _s[33], global: false, description: "Percentage encoded pathname section of the URL.", tags: _emptyArray, required: true, type: _s[1], schema: _s[1]}, query: _ref8, hash: _ref9, replace: {name: _s[23], global: false, description: _s[36], tags: _emptyArray, required: false, type: _s[11], schema: _s[11]}, force: _ref10, state: {name: _s[39], global: false, description: _s[40], tags: _emptyArray, required: false, type: _s[20], schema: _s[20]}}}}}}, {name: _s[54], global: false, description: _s[0], tags: _emptyArray, required: false, type: _s[41], schema: {kind: _s[10], type: _s[41], schema: {"0": _s[55], "1": _s[56], "2": _s[57], "3": _s[58], "4": {kind: _s[5], type: "string & {}", schema: {toString: {name: _s[65], global: false, description: "Returns a string representation of a string.", tags: _emptyArray, required: true, type: _s[15], schema: _ref2}, charAt: {name: "charAt", global: false, description: "Returns the character at the specified index.", tags: [{name: _s[3], text: "pos The zero-based index of the desired character."}], required: true, type: "(pos: number) => string", schema: {kind: _s[7], type: "(pos: number): string", schema: _emptyObject}}, charCodeAt: {name: "charCodeAt", global: false, description: "Returns the Unicode value of the character at the specified location.", tags: [{name: _s[3], text: "index The zero-based index of the desired character. If there is no character at the specified index, NaN is returned."}], required: true, type: "(index: number) => number", schema: {kind: _s[7], type: "(index: number): number", schema: _emptyObject}}, concat: {name: "concat", global: false, description: "Returns a string that contains the concatenation of two or more strings.", tags: [{name: _s[3], text: "strings The strings to append to the end of the string."}], required: true, type: "(...strings: string[]) => string", schema: {kind: _s[7], type: "(...strings: string[]): string", schema: {"0": _s[1]}}}, indexOf: {name: "indexOf", global: false, description: "Returns the position of the first occurrence of a substring.", tags: [{name: _s[3], text: "searchString The substring to search for in the string"}, {name: _s[3], text: "position The index at which to begin searching the String object. If omitted, search starts at the beginning of the string."}], required: true, type: _s[42], schema: _ref16}, lastIndexOf: {name: "lastIndexOf", global: false, description: "Returns the last occurrence of a substring in the string.", tags: [{name: _s[3], text: "searchString The substring to search for."}, {name: _s[3], text: "position The index at which to begin searching. If omitted, the search begins at the end of the string."}], required: true, type: _s[42], schema: _ref16}, localeCompare: {name: "localeCompare", global: false, description: "Determines whether two strings are equivalent in the current locale.\nDetermines whether two strings are equivalent in the current or specified locale.", tags: [_ref3, _ref3, {name: _s[3], text: "locales A locale string or array of locale strings that contain one or more language or locale tags. If you include more than one locale string, list them in descending order of priority so that the first entry is the preferred locale. If you omit this parameter, the default locale of the JavaScript runtime is used. This parameter must conform to BCP 47 standards; see the Intl.Collator object for details."}, {name: _s[3], text: "options An object that contains one or more properties that specify comparison options. see the Intl.Collator object for details."}], required: true, type: _s[45], schema: _s[45]}, match: {name: "match", global: false, description: "Matches a string with a regular expression, and returns an array containing the results of that search.", tags: [{name: _s[3], text: "regexp A variable name or string literal containing the regular expression pattern and flags."}], required: true, type: "(regexp: string | RegExp) => RegExpMatchArray", schema: {kind: _s[7], type: "(regexp: string | RegExp): RegExpMatchArray", schema: _emptyObject}}, replace: {name: _s[23], global: false, description: "Replaces text in a string, using a regular expression or search string.", tags: [{name: _s[3], text: "searchValue A string or regular expression to search for."}, {name: _s[3], text: "replaceValue A string containing the text to replace. When the {@linkcode searchValue} is a `RegExp`, all matches are replaced if the `g` flag is set (or only those matches at the beginning, if the `y` flag is also present). Otherwise, only the first match of {@linkcode searchValue} is replaced."}, {name: _s[3], text: "searchValue A string to search for."}, {name: _s[3], text: "replacer A function that returns the replacement text."}], required: true, type: _s[46], schema: _s[46]}, search: {name: "search", global: false, description: "Finds the first substring match in a regular expression search.", tags: [{name: _s[3], text: "regexp The regular expression pattern and applicable flags."}], required: true, type: "(regexp: string | RegExp) => number", schema: {kind: _s[7], type: "(regexp: string | RegExp): number", schema: _emptyObject}}, slice: {name: "slice", global: false, description: "Returns a section of a string.", tags: [{name: _s[3], text: "start The index to the beginning of the specified portion of stringObj."}, {name: _s[3], text: "end The index to the end of the specified portion of stringObj. The substring includes the characters up to, but not including, the character indicated by end.\nIf this value is not specified, the substring continues to the end of stringObj."}], required: true, type: "(start?: number, end?: number) => string", schema: {kind: _s[7], type: "(start?: number, end?: number): string", schema: _emptyObject}}, split: {name: "split", global: false, description: "Split a string into substrings using the specified separator and return them as an array.", tags: [{name: _s[3], text: "separator A string that identifies character or characters to use in separating the string. If omitted, a single-element array containing the entire string is returned."}, {name: _s[3], text: "limit A value used to limit the number of elements returned in the array."}], required: true, type: "(separator: string | RegExp, limit?: number) => string[]", schema: {kind: _s[7], type: "(separator: string | RegExp, limit?: number): string[]", schema: _emptyObject}}, substring: {name: "substring", global: false, description: "Returns the substring at the specified location within a String object.", tags: [{name: _s[3], text: "start The zero-based index number indicating the beginning of the substring."}, {name: _s[3], text: "end Zero-based index number indicating the end of the substring. The substring includes the characters up to, but not including, the character indicated by end.\nIf end is omitted, the characters from start through the end of the original string are returned."}], required: true, type: "(start: number, end?: number) => string", schema: {kind: _s[7], type: "(start: number, end?: number): string", schema: _emptyObject}}, toLowerCase: {name: "toLowerCase", global: false, description: "Converts all the alphabetic characters in a string to lowercase.", tags: _emptyArray, required: true, type: _s[15], schema: _ref2}, toLocaleLowerCase: {name: "toLocaleLowerCase", global: false, description: "Converts all alphabetic characters to lowercase, taking into account the host environment's current locale.", tags: _emptyArray, required: true, type: _s[47], schema: _ref17}, toUpperCase: {name: "toUpperCase", global: false, description: "Converts all the alphabetic characters in a string to uppercase.", tags: _emptyArray, required: true, type: _s[15], schema: _ref2}, toLocaleUpperCase: {name: "toLocaleUpperCase", global: false, description: "Returns a string where all alphabetic characters have been converted to uppercase, taking into account the host environment's current locale.", tags: _emptyArray, required: true, type: _s[47], schema: _ref17}, trim: {name: "trim", global: false, description: "Removes the leading and trailing white space and line terminator characters from a string.", tags: _emptyArray, required: true, type: _s[15], schema: _ref2}, length: {name: _s[66], global: false, description: "Returns the length of a String object.", tags: _emptyArray, required: true, type: _s[18], schema: _s[18]}, substr: {name: "substr", global: false, description: "Gets a substring beginning at the specified location and having the specified length.", tags: [{name: "deprecated", text: "A legacy feature for browser compatibility"}, {name: _s[3], text: "from The starting position of the desired substring. The index of the first character in the string is zero."}, {name: _s[3], text: "length The number of characters to include in the returned substring."}], required: true, type: "(from: number, length?: number) => string", schema: {kind: _s[7], type: "(from: number, length?: number): string", schema: _emptyObject}}, valueOf: {name: "valueOf", global: false, description: "Returns the primitive value of the specified object.", tags: _emptyArray, required: true, type: _s[15], schema: _ref2}}}}}}, _ref11, {name: _s[67], global: false, description: _s[0], tags: [{name: _s[12], text: "'neutral'"}], required: false, type: _s[49], schema: {kind: _s[10], type: _s[49], schema: {"0": _s[68], "1": _s[69], "2": _s[70], "3": _s[71], "4": _s[72], "5": _s[73], "6": _s[74]}}}, {name: _s[13], global: false, description: _s[0], tags: _emptyArray, required: false, type: "{ base?: ClassNameValue; icon?: ClassNameValue; externalIcon?: ClassNameValue; }", schema: "{ base?: ClassNameValue; icon?: ClassNameValue; externalIcon?: ClassNameValue; }"}], slots: _ref23, events: _emptyArray, exposed: _emptyArray, hash: "51Bpo1M7qUWJlrBP5ubOmV3LQnAip-BiHnucV_4x7yY"}}, ProseCard: {mode: _s[6], global: true, prefetch: false, preload: false, filePath: "node_modules/@nuxt/ui/dist/runtime/components/prose/Card.vue", declarationPath: "/Users/mac/Documents/abb-apps/abb-website/node_modules/@nuxt/ui/dist/runtime/components/prose/Card.vue", pascalName: "ProseCard", kebabName: "prose-card", chunkName: "components/prose-card", priority: 0, _scanned: true, meta: {type: 1, props: [{name: "to", global: false, description: _s[0], tags: _emptyArray, required: false, type: _s[30], schema: {kind: _s[10], type: _s[30], schema: {"0": _s[1], "1": {kind: _s[5], type: "RouteLocationAsRelativeGeneric", schema: {name: {name: _s[21], global: false, description: _s[0], tags: _emptyArray, required: false, type: _s[31], schema: {kind: _s[10], type: _s[31], schema: {"0": _s[1], "1": "symbol"}}}, params: {name: "params", global: false, description: _s[0], tags: _emptyArray, required: false, type: _s[32], schema: _s[32]}, path: {name: _s[33], global: false, description: "A relative path to the current location. This property should be removed", tags: _emptyArray, required: false, type: _s[34], schema: _s[34]}, query: _ref8, hash: _ref9, replace: {name: _s[23], global: false, description: _s[36], tags: _emptyArray, required: false, type: _s[11], schema: _ref19}, force: _ref10, state: {name: _s[39], global: false, description: _s[40], tags: _emptyArray, required: false, type: _s[20], schema: {kind: _s[5], type: _s[20], schema: _emptyObject}}}}, "2": {kind: _s[5], type: "RouteLocationAsPathGeneric", schema: {path: {name: _s[33], global: false, description: "Percentage encoded pathname section of the URL.", tags: _emptyArray, required: true, type: _s[1], schema: _s[1]}, query: _ref8, hash: _ref9, replace: {name: _s[23], global: false, description: _s[36], tags: _emptyArray, required: false, type: _s[11], schema: _s[11]}, force: _ref10, state: {name: _s[39], global: false, description: _s[40], tags: _emptyArray, required: false, type: _s[20], schema: _s[20]}}}}}}, {name: _s[54], global: false, description: _s[0], tags: _emptyArray, required: false, type: _s[41], schema: {kind: _s[10], type: _s[41], schema: {"0": _s[55], "1": _s[56], "2": _s[57], "3": _s[58], "4": {kind: _s[5], type: "string & {}", schema: {toString: {name: _s[65], global: false, description: "Returns a string representation of a string.", tags: _emptyArray, required: true, type: _s[15], schema: _ref2}, charAt: {name: "charAt", global: false, description: "Returns the character at the specified index.", tags: [{name: _s[3], text: "pos The zero-based index of the desired character."}], required: true, type: "(pos: number) => string", schema: {kind: _s[7], type: "(pos: number): string", schema: _emptyObject}}, charCodeAt: {name: "charCodeAt", global: false, description: "Returns the Unicode value of the character at the specified location.", tags: [{name: _s[3], text: "index The zero-based index of the desired character. If there is no character at the specified index, NaN is returned."}], required: true, type: "(index: number) => number", schema: {kind: _s[7], type: "(index: number): number", schema: _emptyObject}}, concat: {name: "concat", global: false, description: "Returns a string that contains the concatenation of two or more strings.", tags: [{name: _s[3], text: "strings The strings to append to the end of the string."}], required: true, type: "(...strings: string[]) => string", schema: {kind: _s[7], type: "(...strings: string[]): string", schema: {"0": _s[1]}}}, indexOf: {name: "indexOf", global: false, description: "Returns the position of the first occurrence of a substring.", tags: [{name: _s[3], text: "searchString The substring to search for in the string"}, {name: _s[3], text: "position The index at which to begin searching the String object. If omitted, search starts at the beginning of the string."}], required: true, type: _s[42], schema: _ref16}, lastIndexOf: {name: "lastIndexOf", global: false, description: "Returns the last occurrence of a substring in the string.", tags: [{name: _s[3], text: "searchString The substring to search for."}, {name: _s[3], text: "position The index at which to begin searching. If omitted, the search begins at the end of the string."}], required: true, type: _s[42], schema: _ref16}, localeCompare: {name: "localeCompare", global: false, description: "Determines whether two strings are equivalent in the current locale.\nDetermines whether two strings are equivalent in the current or specified locale.", tags: [_ref3, _ref3, {name: _s[3], text: "locales A locale string or array of locale strings that contain one or more language or locale tags. If you include more than one locale string, list them in descending order of priority so that the first entry is the preferred locale. If you omit this parameter, the default locale of the JavaScript runtime is used. This parameter must conform to BCP 47 standards; see the Intl.Collator object for details."}, {name: _s[3], text: "options An object that contains one or more properties that specify comparison options. see the Intl.Collator object for details."}], required: true, type: _s[45], schema: _s[45]}, match: {name: "match", global: false, description: "Matches a string with a regular expression, and returns an array containing the results of that search.", tags: [{name: _s[3], text: "regexp A variable name or string literal containing the regular expression pattern and flags."}], required: true, type: "(regexp: string | RegExp) => RegExpMatchArray", schema: {kind: _s[7], type: "(regexp: string | RegExp): RegExpMatchArray", schema: _emptyObject}}, replace: {name: _s[23], global: false, description: "Replaces text in a string, using a regular expression or search string.", tags: [{name: _s[3], text: "searchValue A string or regular expression to search for."}, {name: _s[3], text: "replaceValue A string containing the text to replace. When the {@linkcode searchValue} is a `RegExp`, all matches are replaced if the `g` flag is set (or only those matches at the beginning, if the `y` flag is also present). Otherwise, only the first match of {@linkcode searchValue} is replaced."}, {name: _s[3], text: "searchValue A string to search for."}, {name: _s[3], text: "replacer A function that returns the replacement text."}], required: true, type: _s[46], schema: _s[46]}, search: {name: "search", global: false, description: "Finds the first substring match in a regular expression search.", tags: [{name: _s[3], text: "regexp The regular expression pattern and applicable flags."}], required: true, type: "(regexp: string | RegExp) => number", schema: {kind: _s[7], type: "(regexp: string | RegExp): number", schema: _emptyObject}}, slice: {name: "slice", global: false, description: "Returns a section of a string.", tags: [{name: _s[3], text: "start The index to the beginning of the specified portion of stringObj."}, {name: _s[3], text: "end The index to the end of the specified portion of stringObj. The substring includes the characters up to, but not including, the character indicated by end.\nIf this value is not specified, the substring continues to the end of stringObj."}], required: true, type: "(start?: number, end?: number) => string", schema: {kind: _s[7], type: "(start?: number, end?: number): string", schema: _emptyObject}}, split: {name: "split", global: false, description: "Split a string into substrings using the specified separator and return them as an array.", tags: [{name: _s[3], text: "separator A string that identifies character or characters to use in separating the string. If omitted, a single-element array containing the entire string is returned."}, {name: _s[3], text: "limit A value used to limit the number of elements returned in the array."}], required: true, type: "(separator: string | RegExp, limit?: number) => string[]", schema: {kind: _s[7], type: "(separator: string | RegExp, limit?: number): string[]", schema: _emptyObject}}, substring: {name: "substring", global: false, description: "Returns the substring at the specified location within a String object.", tags: [{name: _s[3], text: "start The zero-based index number indicating the beginning of the substring."}, {name: _s[3], text: "end Zero-based index number indicating the end of the substring. The substring includes the characters up to, but not including, the character indicated by end.\nIf end is omitted, the characters from start through the end of the original string are returned."}], required: true, type: "(start: number, end?: number) => string", schema: {kind: _s[7], type: "(start: number, end?: number): string", schema: _emptyObject}}, toLowerCase: {name: "toLowerCase", global: false, description: "Converts all the alphabetic characters in a string to lowercase.", tags: _emptyArray, required: true, type: _s[15], schema: _ref2}, toLocaleLowerCase: {name: "toLocaleLowerCase", global: false, description: "Converts all alphabetic characters to lowercase, taking into account the host environment's current locale.", tags: _emptyArray, required: true, type: _s[47], schema: _ref17}, toUpperCase: {name: "toUpperCase", global: false, description: "Converts all the alphabetic characters in a string to uppercase.", tags: _emptyArray, required: true, type: _s[15], schema: _ref2}, toLocaleUpperCase: {name: "toLocaleUpperCase", global: false, description: "Returns a string where all alphabetic characters have been converted to uppercase, taking into account the host environment's current locale.", tags: _emptyArray, required: true, type: _s[47], schema: _ref17}, trim: {name: "trim", global: false, description: "Removes the leading and trailing white space and line terminator characters from a string.", tags: _emptyArray, required: true, type: _s[15], schema: _ref2}, length: {name: _s[66], global: false, description: "Returns the length of a String object.", tags: _emptyArray, required: true, type: _s[18], schema: _s[18]}, substr: {name: "substr", global: false, description: "Gets a substring beginning at the specified location and having the specified length.", tags: [{name: "deprecated", text: "A legacy feature for browser compatibility"}, {name: _s[3], text: "from The starting position of the desired substring. The index of the first character in the string is zero."}, {name: _s[3], text: "length The number of characters to include in the returned substring."}], required: true, type: "(from: number, length?: number) => string", schema: {kind: _s[7], type: "(from: number, length?: number): string", schema: _emptyObject}}, valueOf: {name: "valueOf", global: false, description: "Returns the primitive value of the specified object.", tags: _emptyArray, required: true, type: _s[15], schema: _ref2}}}}}}, _ref11, {name: "title", global: false, description: _s[0], tags: _emptyArray, required: false, type: _s[1], schema: _s[1]}, _ref7, {name: _s[67], global: false, description: _s[0], tags: [{name: _s[12], text: "'primary'"}], required: false, type: _s[49], schema: {kind: _s[10], type: _s[49], schema: {"0": _s[68], "1": _s[69], "2": _s[70], "3": _s[71], "4": _s[72], "5": _s[73], "6": _s[74]}}}, {name: _s[13], global: false, description: _s[0], tags: _emptyArray, required: false, type: "{ base?: ClassNameValue; icon?: ClassNameValue; title?: ClassNameValue; description?: ClassNameValue; externalIcon?: ClassNameValue; }", schema: "{ base?: ClassNameValue; icon?: ClassNameValue; title?: ClassNameValue; description?: ClassNameValue; externalIcon?: ClassNameValue; }"}], slots: [_ref21, {name: "title", type: _s[2], description: _s[0], tags: _emptyArray, schema: _ref15}], events: _emptyArray, exposed: _emptyArray, hash: "elfkVqrknjKoZzaLiO1wXPl_ZyrByrzFySzhoXovvCk"}}, ProseCardGroup: {mode: _s[6], global: true, prefetch: false, preload: false, filePath: "node_modules/@nuxt/ui/dist/runtime/components/prose/CardGroup.vue", declarationPath: "/Users/mac/Documents/abb-apps/abb-website/node_modules/@nuxt/ui/dist/runtime/components/prose/CardGroup.vue", pascalName: "ProseCardGroup", kebabName: "prose-card-group", chunkName: "components/prose-card-group", priority: 0, _scanned: true, meta: {type: 1, props: _emptyArray, slots: _ref23, events: _emptyArray, exposed: _emptyArray, hash: "df3drvcEflYQfC_oPSpYBrt1-6slTecQKM79Ca2B0J8"}}, ProseCode: {mode: _s[6], global: true, prefetch: false, preload: false, filePath: "node_modules/@nuxt/ui/dist/runtime/components/prose/Code.vue", declarationPath: "/Users/mac/Documents/abb-apps/abb-website/node_modules/@nuxt/ui/dist/runtime/components/prose/Code.vue", pascalName: "ProseCode", kebabName: "prose-code", chunkName: "components/prose-code", priority: 0, _scanned: true, meta: {type: 1, props: [{name: "lang", global: false, description: _s[0], tags: _emptyArray, required: false, type: _s[1], schema: _s[1]}, {name: _s[67], global: false, description: _s[0], tags: [{name: _s[12], text: "'neutral'"}], required: false, type: "\"neutral\" | \"primary\" | \"secondary\" | \"success\" | \"info\" | \"warning\" | \"error\"", schema: {kind: _s[10], type: "\"neutral\" | \"primary\" | \"secondary\" | \"success\" | \"info\" | \"warning\" | \"error\"", schema: {"0": _s[74], "1": _s[68], "2": _s[69], "3": _s[70], "4": _s[71], "5": _s[72], "6": _s[73]}}}], slots: _ref23, events: _emptyArray, exposed: _emptyArray, hash: "VR_IFIhEL9sjhZ0PFV0sSGLgF6dkdrDTit3qzy1daNI"}}, ProseCodeCollapse: {mode: _s[6], global: true, prefetch: false, preload: false, filePath: "node_modules/@nuxt/ui/dist/runtime/components/prose/CodeCollapse.vue", declarationPath: "/Users/mac/Documents/abb-apps/abb-website/node_modules/@nuxt/ui/dist/runtime/components/prose/CodeCollapse.vue", pascalName: "ProseCodeCollapse", kebabName: "prose-code-collapse", chunkName: "components/prose-code-collapse", priority: 0, _scanned: true, meta: {type: 1, props: [{name: _s[22], global: false, description: "The icon displayed to toggle the code.", tags: [{name: _s[12], text: "appConfig.ui.icons.chevronDown"}], required: false, type: _s[9], schema: _s[9]}, {name: _s[21], global: false, description: "The name displayed in the trigger label.", tags: [{name: _s[12], text: "t('prose.codeCollapse.name')"}], required: false, type: _s[1], schema: _s[1]}, {name: "openText", global: false, description: "The text displayed when the code is collapsed.", tags: [{name: _s[12], text: "t('prose.codeCollapse.openText')"}], required: false, type: _s[1], schema: _s[1]}, {name: "closeText", global: false, description: "The text displayed when the code is expanded.", tags: [{name: _s[12], text: "t('prose.codeCollapse.closeText')"}], required: false, type: _s[1], schema: _s[1]}, {name: _s[13], global: false, description: _s[0], tags: _emptyArray, required: false, type: "{ root?: ClassNameValue; footer?: ClassNameValue; trigger?: ClassNameValue; triggerIcon?: ClassNameValue; }", schema: "{ root?: ClassNameValue; footer?: ClassNameValue; trigger?: ClassNameValue; triggerIcon?: ClassNameValue; }"}, {name: "open", global: false, description: _s[0], tags: _emptyArray, required: false, type: _s[11], schema: _ref19}], slots: _ref23, events: [{name: "update:open", description: _s[0], tags: _emptyArray, type: "[value: boolean]", signature: "(event: \"update:open\", value: boolean): void", schema: [{kind: _s[10], type: _s[11], schema: [_s[14], _s[17]]}]}], exposed: _emptyArray, hash: "8akucCJIqprF7KPoZaPmL5VFFVqIOPidJPyDaOPcsG8"}}, ProseCodeGroup: {mode: _s[6], global: true, prefetch: false, preload: false, filePath: "node_modules/@nuxt/ui/dist/runtime/components/prose/CodeGroup.vue", declarationPath: "/Users/mac/Documents/abb-apps/abb-website/node_modules/@nuxt/ui/dist/runtime/components/prose/CodeGroup.vue", pascalName: "ProseCodeGroup", kebabName: "prose-code-group", chunkName: "components/prose-code-group", priority: 0, _scanned: true, meta: {type: 1, props: [{name: _s[12], global: false, description: "The default tab to select.", tags: [{name: _s[75], text: "'1'"}], required: false, type: _s[1], schema: _s[1]}, {name: "sync", global: false, description: "Sync the selected tab with a local storage key.", tags: _emptyArray, required: false, type: _s[1], schema: _s[1]}, {name: _s[13], global: false, description: _s[0], tags: _emptyArray, required: false, type: "{ root?: ClassNameValue; list?: ClassNameValue; indicator?: ClassNameValue; trigger?: ClassNameValue; triggerIcon?: ClassNameValue; triggerLabel?: ClassNameValue; }", schema: "{ root?: ClassNameValue; list?: ClassNameValue; indicator?: ClassNameValue; trigger?: ClassNameValue; triggerIcon?: ClassNameValue; triggerLabel?: ClassNameValue; }"}, {name: "modelValue", global: false, description: _s[0], tags: _emptyArray, required: false, type: _s[1], schema: _s[1]}], slots: _ref23, events: [{name: "update:modelValue", description: _s[0], tags: _emptyArray, type: "[value: string]", signature: "(event: \"update:modelValue\", value: string): void", schema: [_s[1]]}], exposed: _emptyArray, hash: "Mf47MANFumHvOcH6MmWdhwEibRYi7e3CohyLr3fnHFA"}}, ProseCodeIcon: {mode: _s[6], global: true, prefetch: false, preload: false, filePath: "node_modules/@nuxt/ui/dist/runtime/components/prose/CodeIcon.vue", declarationPath: "/Users/mac/Documents/abb-apps/abb-website/node_modules/@nuxt/ui/dist/runtime/components/prose/CodeIcon.vue", pascalName: "ProseCodeIcon", kebabName: "prose-code-icon", chunkName: "components/prose-code-icon", priority: 0, _scanned: true, meta: {type: 1, props: [_ref11, {name: "filename", global: false, description: _s[0], tags: _emptyArray, required: false, type: _s[1], schema: _s[1]}], slots: _emptyArray, events: _emptyArray, exposed: _emptyArray, hash: "T6zszGKaUHhMee4spR8Heir5ys63s05fMzKVvLgRfes"}}, ProseCodePreview: {mode: _s[6], global: true, prefetch: false, preload: false, filePath: "node_modules/@nuxt/ui/dist/runtime/components/prose/CodePreview.vue", declarationPath: "/Users/mac/Documents/abb-apps/abb-website/node_modules/@nuxt/ui/dist/runtime/components/prose/CodePreview.vue", pascalName: "ProseCodePreview", kebabName: "prose-code-preview", chunkName: "components/prose-code-preview", priority: 0, _scanned: true, meta: {type: 1, props: [{name: _s[13], global: false, description: _s[0], tags: _emptyArray, required: false, type: "{ root?: ClassNameValue; preview?: ClassNameValue; code?: ClassNameValue; }", schema: "{ root?: ClassNameValue; preview?: ClassNameValue; code?: ClassNameValue; }"}], slots: [_ref21, {name: "code", type: _s[2], description: _s[0], tags: _emptyArray, schema: _ref15}], events: _emptyArray, exposed: _emptyArray, hash: "jeCa1mhFupqM269Jrgby2Sd1r_CTdQq3GLbO8FYSF8w"}}, ProseCodeTree: {mode: _s[6], global: true, prefetch: false, preload: false, filePath: "node_modules/@nuxt/ui/dist/runtime/components/prose/CodeTree.vue", declarationPath: "/Users/mac/Documents/abb-apps/abb-website/node_modules/@nuxt/ui/dist/runtime/components/prose/CodeTree.vue", pascalName: "ProseCodeTree", kebabName: "prose-code-tree", chunkName: "components/prose-code-tree", priority: 0, _scanned: true, meta: {type: 1, props: [{name: _s[12], global: false, description: "The default path to select.", tags: [{name: _s[75], text: "'package.json'"}], required: false, type: _s[1], schema: _s[1]}, {name: _s[13], global: false, description: _s[0], tags: _emptyArray, required: false, type: "{ root?: ClassNameValue; list?: ClassNameValue; item?: ClassNameValue; listWithChildren?: ClassNameValue; itemWithChildren?: ClassNameValue; link?: ClassNameValue; linkLeadingIcon?: ClassNameValue; linkLabel?: ClassNameValue; linkTrailing?: ClassNameValue; linkTrailingIcon?: ClassNameValue; content?: ClassNameValue; }", schema: "{ root?: ClassNameValue; list?: ClassNameValue; item?: ClassNameValue; listWithChildren?: ClassNameValue; itemWithChildren?: ClassNameValue; link?: ClassNameValue; linkLeadingIcon?: ClassNameValue; linkLabel?: ClassNameValue; linkTrailing?: ClassNameValue; linkTrailingIcon?: ClassNameValue; content?: ClassNameValue; }"}, {name: "expandAll", global: false, description: "Expand all directories by default.", tags: [{name: _s[12], text: _s[14]}], required: false, type: _s[11], schema: _ref19}], slots: _ref23, events: _emptyArray, exposed: _emptyArray, hash: "hqZzcLRgucVyP6oZjXzm3TNKb9TNzFjnBqDBBsmzeeU"}}, ProseCollapsible: {mode: _s[6], global: true, prefetch: false, preload: false, filePath: "node_modules/@nuxt/ui/dist/runtime/components/prose/Collapsible.vue", declarationPath: "/Users/mac/Documents/abb-apps/abb-website/node_modules/@nuxt/ui/dist/runtime/components/prose/Collapsible.vue", pascalName: "ProseCollapsible", kebabName: "prose-collapsible", chunkName: "components/prose-collapsible", priority: 0, _scanned: true, meta: {type: 1, props: [{name: _s[22], global: false, description: "The icon displayed to toggle the collapsible.", tags: [{name: _s[12], text: "appConfig.ui.icons.chevronDown"}], required: false, type: _s[9], schema: _s[9]}, {name: _s[21], global: false, description: "The name displayed in the trigger label.", tags: [{name: _s[12], text: "t('prose.collapsible.name')"}], required: false, type: _s[1], schema: _s[1]}, {name: "openText", global: false, description: "The text displayed when the collapsible is open.", tags: [{name: _s[12], text: "t('prose.collapsible.openText')"}], required: false, type: _s[1], schema: _s[1]}, {name: "closeText", global: false, description: "The text displayed when the collapsible is closed.", tags: [{name: _s[12], text: "t('prose.collapsible.closeText')"}], required: false, type: _s[1], schema: _s[1]}, {name: _s[13], global: false, description: _s[0], tags: _emptyArray, required: false, type: "{ root?: ClassNameValue; trigger?: ClassNameValue; triggerIcon?: ClassNameValue; triggerLabel?: ClassNameValue; content?: ClassNameValue; } & { root?: ClassNameValue; content?: ClassNameValue; }", schema: {kind: _s[5], type: "{ root?: ClassNameValue; trigger?: ClassNameValue; triggerIcon?: ClassNameValue; triggerLabel?: ClassNameValue; content?: ClassNameValue; } & { root?: ClassNameValue; content?: ClassNameValue; }", schema: {root: _ref25, trigger: _ref5, triggerIcon: {name: "triggerIcon", global: false, description: _s[0], tags: _emptyArray, required: false, type: _s[4], schema: _s[4]}, triggerLabel: {name: "triggerLabel", global: false, description: _s[0], tags: _emptyArray, required: false, type: _s[4], schema: _s[4]}, content: _ref6}}}], slots: _ref23, events: _emptyArray, exposed: _emptyArray, hash: "w_rRfzqJ24dOvFi6P7Xx0I4IMjGQnUCU4TGKVkwwdgA"}}, ProseEm: {mode: _s[6], global: true, prefetch: false, preload: false, filePath: "node_modules/@nuxt/ui/dist/runtime/components/prose/Em.vue", declarationPath: "/Users/mac/Documents/abb-apps/abb-website/node_modules/@nuxt/ui/dist/runtime/components/prose/Em.vue", pascalName: "ProseEm", kebabName: "prose-em", chunkName: "components/prose-em", priority: 0, _scanned: true, meta: {type: 1, props: _emptyArray, slots: _ref23, events: _emptyArray, exposed: _emptyArray, hash: "BJ2hsVg_3M0fyHi_dpz5uPYWMeaIL0ZtGHg1m0ajcPc"}}, ProseField: {mode: _s[6], global: true, prefetch: false, preload: false, filePath: "node_modules/@nuxt/ui/dist/runtime/components/prose/Field.vue", declarationPath: "/Users/mac/Documents/abb-apps/abb-website/node_modules/@nuxt/ui/dist/runtime/components/prose/Field.vue", pascalName: "ProseField", kebabName: "prose-field", chunkName: "components/prose-field", priority: 0, _scanned: true, meta: {type: 1, props: [{name: "as", global: false, description: "The element or component this component should render as.", tags: [{name: _s[12], text: "'div'"}], required: false, type: _s[9], schema: _s[9]}, {name: _s[21], global: false, description: "The name of the field.", tags: _emptyArray, required: false, type: _s[1], schema: _s[1]}, {name: "type", global: false, description: "Expected type of the field's value", tags: _emptyArray, required: false, type: _s[1], schema: _s[1]}, {name: _s[29], global: false, description: "Description of the field", tags: _emptyArray, required: false, type: _s[1], schema: _s[1]}, {name: _s[13], global: false, description: _s[0], tags: _emptyArray, required: false, type: "{ root?: ClassNameValue; container?: ClassNameValue; name?: ClassNameValue; wrapper?: ClassNameValue; required?: ClassNameValue; type?: ClassNameValue; description?: ClassNameValue; }", schema: "{ root?: ClassNameValue; container?: ClassNameValue; name?: ClassNameValue; wrapper?: ClassNameValue; required?: ClassNameValue; type?: ClassNameValue; description?: ClassNameValue; }"}, {name: "required", global: false, description: "Indicate whether the field is required", tags: _emptyArray, required: false, type: _s[11], schema: _ref19}], slots: _ref23, events: _emptyArray, exposed: _emptyArray, hash: "2oJCkWmLTxdU8pwqraq1SNZrrX7TOyjhxIb5e1Qq1yk"}}, ProseFieldGroup: {mode: _s[6], global: true, prefetch: false, preload: false, filePath: "node_modules/@nuxt/ui/dist/runtime/components/prose/FieldGroup.vue", declarationPath: "/Users/mac/Documents/abb-apps/abb-website/node_modules/@nuxt/ui/dist/runtime/components/prose/FieldGroup.vue", pascalName: "ProseFieldGroup", kebabName: "prose-field-group", chunkName: "components/prose-field-group", priority: 0, _scanned: true, meta: {type: 1, props: [{name: "as", global: false, description: "The element or component this component should render as.", tags: [{name: _s[12], text: "'div'"}], required: false, type: _s[9], schema: _s[9]}], slots: _ref23, events: _emptyArray, exposed: _emptyArray, hash: "g0ta3_nHZQVEg0X6P1cEGOCzRCi8Mxaw1Phw4ND47_M"}}, ProseH1: {mode: _s[6], global: true, prefetch: false, preload: false, filePath: "node_modules/@nuxt/ui/dist/runtime/components/prose/H1.vue", declarationPath: "/Users/mac/Documents/abb-apps/abb-website/node_modules/@nuxt/ui/dist/runtime/components/prose/H1.vue", pascalName: "ProseH1", kebabName: "prose-h1", chunkName: "components/prose-h1", priority: 0, _scanned: true, meta: {type: 1, props: [_ref12, {name: _s[13], global: false, description: _s[0], tags: _emptyArray, required: false, type: _s[50], schema: _s[50]}], slots: _ref23, events: _emptyArray, exposed: _emptyArray, hash: "cDFkpdyqQqzV864kDZ5UQ7dt-7GOgRrLP1d4glGfGRM"}}, ProseH2: {mode: _s[6], global: true, prefetch: false, preload: false, filePath: "node_modules/@nuxt/ui/dist/runtime/components/prose/H2.vue", declarationPath: "/Users/mac/Documents/abb-apps/abb-website/node_modules/@nuxt/ui/dist/runtime/components/prose/H2.vue", pascalName: "ProseH2", kebabName: "prose-h2", chunkName: "components/prose-h2", priority: 0, _scanned: true, meta: {type: 1, props: [_ref12, {name: _s[13], global: false, description: _s[0], tags: _emptyArray, required: false, type: _s[51], schema: _s[51]}], slots: _ref23, events: _emptyArray, exposed: _emptyArray, hash: "MsSHhHyBgDFIPgUXqHsPyVIPMzH6R09CfobCiSeD5FM"}}, ProseH3: {mode: _s[6], global: true, prefetch: false, preload: false, filePath: "node_modules/@nuxt/ui/dist/runtime/components/prose/H3.vue", declarationPath: "/Users/mac/Documents/abb-apps/abb-website/node_modules/@nuxt/ui/dist/runtime/components/prose/H3.vue", pascalName: "ProseH3", kebabName: "prose-h3", chunkName: "components/prose-h3", priority: 0, _scanned: true, meta: {type: 1, props: [_ref12, {name: _s[13], global: false, description: _s[0], tags: _emptyArray, required: false, type: _s[51], schema: _s[51]}], slots: _ref23, events: _emptyArray, exposed: _emptyArray, hash: "bW8Q6mK64nhxxYkIHzLy4s8OZu9ORiM92O_1UFFcR5Q"}}, ProseH4: {mode: _s[6], global: true, prefetch: false, preload: false, filePath: "node_modules/@nuxt/ui/dist/runtime/components/prose/H4.vue", declarationPath: "/Users/mac/Documents/abb-apps/abb-website/node_modules/@nuxt/ui/dist/runtime/components/prose/H4.vue", pascalName: "ProseH4", kebabName: "prose-h4", chunkName: "components/prose-h4", priority: 0, _scanned: true, meta: {type: 1, props: [_ref12, {name: _s[13], global: false, description: _s[0], tags: _emptyArray, required: false, type: _s[50], schema: _s[50]}], slots: _ref23, events: _emptyArray, exposed: _emptyArray, hash: "tG6NsVK7AaIJRD-mfRNAofGKpbD6gAyGh0oj_i9--sM"}}, ProseHr: {mode: _s[6], global: true, prefetch: false, preload: false, filePath: "node_modules/@nuxt/ui/dist/runtime/components/prose/Hr.vue", declarationPath: "/Users/mac/Documents/abb-apps/abb-website/node_modules/@nuxt/ui/dist/runtime/components/prose/Hr.vue", pascalName: "ProseHr", kebabName: "prose-hr", chunkName: "components/prose-hr", priority: 0, _scanned: true, meta: {type: 1, props: [_ref13], slots: _emptyArray, events: _emptyArray, exposed: _emptyArray, hash: "sAN0d63Paq7SuXLpgTz64dYWaXakTGmRHqrwhRdRgjA"}}, ProseIcon: {mode: _s[6], global: true, prefetch: false, preload: false, filePath: "node_modules/@nuxt/ui/dist/runtime/components/prose/Icon.vue", declarationPath: "/Users/mac/Documents/abb-apps/abb-website/node_modules/@nuxt/ui/dist/runtime/components/prose/Icon.vue", pascalName: "ProseIcon", kebabName: "prose-icon", chunkName: "components/prose-icon", priority: 0, _scanned: true, meta: {type: 1, props: [{name: _s[21], global: false, description: _s[0], tags: _emptyArray, required: true, type: _s[1], schema: _s[1]}, _ref13], slots: _emptyArray, events: _emptyArray, exposed: _emptyArray, hash: "BwQxxvPsJ7OgASWM0_F_9Avnf9LKc0fuK-AztsrTKik"}}, ProseImg: {mode: _s[6], global: true, prefetch: false, preload: false, filePath: "node_modules/@nuxt/ui/dist/runtime/components/prose/Img.vue", declarationPath: "/Users/mac/Documents/abb-apps/abb-website/node_modules/@nuxt/ui/dist/runtime/components/prose/Img.vue", pascalName: "ProseImg", kebabName: "prose-img", chunkName: "components/prose-img", priority: 0, _scanned: true, meta: {type: 1, props: [{name: "src", global: false, description: _s[0], tags: _emptyArray, required: true, type: _s[1], schema: _s[1]}, {name: "alt", global: false, description: _s[0], tags: _emptyArray, required: true, type: _s[1], schema: _s[1]}, _ref13, {name: "width", global: false, description: _s[0], tags: _emptyArray, required: false, type: _s[25], schema: _ref20}, {name: "height", global: false, description: _s[0], tags: _emptyArray, required: false, type: _s[25], schema: _ref20}, {name: _s[13], global: false, description: _s[0], tags: _emptyArray, required: false, type: "{ base?: ClassNameValue; overlay?: ClassNameValue; content?: ClassNameValue; zoomedImage?: ClassNameValue; }", schema: "{ base?: ClassNameValue; overlay?: ClassNameValue; content?: ClassNameValue; zoomedImage?: ClassNameValue; }"}, {name: "zoom", global: false, description: "Zoom image on click", tags: [{name: _s[12], text: _s[17]}], required: false, type: _s[11], schema: _ref19}], slots: _emptyArray, events: _emptyArray, exposed: _emptyArray, hash: "x4TxeH-xo6C8P3NnRFSGkgiaBH2Zz2EMejwwffWzmr0"}}, ProseKbd: {mode: _s[6], global: true, prefetch: false, preload: false, filePath: "node_modules/@nuxt/ui/dist/runtime/components/prose/Kbd.vue", declarationPath: "/Users/mac/Documents/abb-apps/abb-website/node_modules/@nuxt/ui/dist/runtime/components/prose/Kbd.vue", pascalName: "ProseKbd", kebabName: "prose-kbd", chunkName: "components/prose-kbd", priority: 0, _scanned: true, meta: {type: 1, props: [{name: "value", global: false, description: _s[0], tags: _emptyArray, required: true, type: _s[1], schema: _s[1]}, _ref13], slots: _emptyArray, events: _emptyArray, exposed: _emptyArray, hash: "D7iFIuZsq6UEoCP9piDcth2cz4l-Stx9085CITw2-oQ"}}, ProseLi: {mode: _s[6], global: true, prefetch: false, preload: false, filePath: "node_modules/@nuxt/ui/dist/runtime/components/prose/Li.vue", declarationPath: "/Users/mac/Documents/abb-apps/abb-website/node_modules/@nuxt/ui/dist/runtime/components/prose/Li.vue", pascalName: "ProseLi", kebabName: "prose-li", chunkName: "components/prose-li", priority: 0, _scanned: true, meta: {type: 1, props: _emptyArray, slots: _ref23, events: _emptyArray, exposed: _emptyArray, hash: "7HBfkj5lGE7O79hI-qV8cEjARIm7_5k7Hucj7-KqI-0"}}, ProseOl: {mode: _s[6], global: true, prefetch: false, preload: false, filePath: "node_modules/@nuxt/ui/dist/runtime/components/prose/Ol.vue", declarationPath: "/Users/mac/Documents/abb-apps/abb-website/node_modules/@nuxt/ui/dist/runtime/components/prose/Ol.vue", pascalName: "ProseOl", kebabName: "prose-ol", chunkName: "components/prose-ol", priority: 0, _scanned: true, meta: {type: 1, props: _emptyArray, slots: _ref23, events: _emptyArray, exposed: _emptyArray, hash: "TKXtYKynS5a0ao5ozP1vIqY-DAweoCNxjIOwuYYubjg"}}, ProseP: {mode: _s[6], global: true, prefetch: false, preload: false, filePath: "node_modules/@nuxt/ui/dist/runtime/components/prose/P.vue", declarationPath: "/Users/mac/Documents/abb-apps/abb-website/node_modules/@nuxt/ui/dist/runtime/components/prose/P.vue", pascalName: "ProseP", kebabName: "prose-p", chunkName: "components/prose-p", priority: 0, _scanned: true, meta: {type: 1, props: _emptyArray, slots: _ref23, events: _emptyArray, exposed: _emptyArray, hash: "1f6Rckdq-U-lDCrTn0Ar1YR8rIlRtRyfMN7dnHWJ9WQ"}}, ProsePre: {mode: _s[6], global: true, prefetch: false, preload: false, filePath: "node_modules/@nuxt/ui/dist/runtime/components/prose/Pre.vue", declarationPath: "/Users/mac/Documents/abb-apps/abb-website/node_modules/@nuxt/ui/dist/runtime/components/prose/Pre.vue", pascalName: "ProsePre", kebabName: "prose-pre", chunkName: "components/prose-pre", priority: 0, _scanned: true, meta: {type: 1, props: [_ref11, {name: "code", global: false, description: _s[0], tags: _emptyArray, required: false, type: _s[1], schema: _s[1]}, {name: "language", global: false, description: _s[0], tags: _emptyArray, required: false, type: _s[1], schema: _s[1]}, {name: "filename", global: false, description: _s[0], tags: _emptyArray, required: false, type: _s[1], schema: _s[1]}, {name: "highlights", global: false, description: _s[0], tags: _emptyArray, required: false, type: "number[]", schema: {kind: _s[27], type: "number[]", schema: {"0": _s[18]}}}, {name: "meta", global: false, description: _s[0], tags: _emptyArray, required: false, type: _s[1], schema: _s[1]}, {name: _s[13], global: false, description: _s[0], tags: _emptyArray, required: false, type: "{ root?: ClassNameValue; header?: ClassNameValue; filename?: ClassNameValue; icon?: ClassNameValue; copy?: ClassNameValue; base?: ClassNameValue; }", schema: "{ root?: ClassNameValue; header?: ClassNameValue; filename?: ClassNameValue; icon?: ClassNameValue; copy?: ClassNameValue; base?: ClassNameValue; }"}, {name: "hideHeader", global: false, description: _s[0], tags: _emptyArray, required: false, type: _s[11], schema: _ref19}], slots: _ref23, events: _emptyArray, exposed: _emptyArray, hash: "MRW_mZm9Mk-AzY3OXO4w4x5eGy28VqN_W9R6Lk4xZ5I"}}, ProseScript: {mode: _s[6], global: true, prefetch: false, preload: false, filePath: "node_modules/@nuxt/ui/dist/runtime/components/prose/Script.vue", declarationPath: "/Users/mac/Documents/abb-apps/abb-website/node_modules/@nuxt/ui/dist/runtime/components/prose/Script.vue", pascalName: "ProseScript", kebabName: "prose-script", chunkName: "components/prose-script", priority: 0, _scanned: true, meta: {type: 1, props: [{name: "src", global: false, description: _s[0], tags: _emptyArray, required: true, type: _s[1], schema: _s[1]}], slots: _emptyArray, events: _emptyArray, exposed: _emptyArray, hash: "P5a1W22-fzQL0JnsptjsM6xO3R0fJPAQ7vn8EKc7kQc"}}, ProseSteps: {mode: _s[6], global: true, prefetch: false, preload: false, filePath: "node_modules/@nuxt/ui/dist/runtime/components/prose/Steps.vue", declarationPath: "/Users/mac/Documents/abb-apps/abb-website/node_modules/@nuxt/ui/dist/runtime/components/prose/Steps.vue", pascalName: "ProseSteps", kebabName: "prose-steps", chunkName: "components/prose-steps", priority: 0, _scanned: true, meta: {type: 1, props: [{name: "level", global: false, description: "The heading level to apply to the steps.", tags: [{name: _s[12], text: "'3'"}], required: false, type: "\"3\" | \"2\" | \"4\"", schema: {kind: _s[10], type: "\"3\" | \"2\" | \"4\"", schema: {"0": "\"3\"", "1": "\"2\"", "2": "\"4\""}}}], slots: _ref23, events: _emptyArray, exposed: _emptyArray, hash: "6v4iinarPIfctfKza12EUImb8PyQbA72xor8SA4VkPw"}}, ProseStrong: {mode: _s[6], global: true, prefetch: false, preload: false, filePath: "node_modules/@nuxt/ui/dist/runtime/components/prose/Strong.vue", declarationPath: "/Users/mac/Documents/abb-apps/abb-website/node_modules/@nuxt/ui/dist/runtime/components/prose/Strong.vue", pascalName: "ProseStrong", kebabName: "prose-strong", chunkName: "components/prose-strong", priority: 0, _scanned: true, meta: {type: 1, props: _emptyArray, slots: _ref23, events: _emptyArray, exposed: _emptyArray, hash: "bPg92ceXmXrYI7iT-Q-ve1Zzk7CtKDQzhtoFyjzmvjk"}}, ProseTable: {mode: _s[6], global: true, prefetch: false, preload: false, filePath: "node_modules/@nuxt/ui/dist/runtime/components/prose/Table.vue", declarationPath: "/Users/mac/Documents/abb-apps/abb-website/node_modules/@nuxt/ui/dist/runtime/components/prose/Table.vue", pascalName: "ProseTable", kebabName: "prose-table", chunkName: "components/prose-table", priority: 0, _scanned: true, meta: {type: 1, props: [{name: _s[13], global: false, description: _s[0], tags: _emptyArray, required: false, type: "{ root?: ClassNameValue; base?: ClassNameValue; }", schema: "{ root?: ClassNameValue; base?: ClassNameValue; }"}], slots: _ref23, events: _emptyArray, exposed: _emptyArray, hash: "08ywO_8POq_x2PBQwNhJPH_H71vlmt50tHMRSFuz7zY"}}, ProseTabs: {mode: _s[6], global: true, prefetch: false, preload: false, filePath: "node_modules/@nuxt/ui/dist/runtime/components/prose/Tabs.vue", declarationPath: "/Users/mac/Documents/abb-apps/abb-website/node_modules/@nuxt/ui/dist/runtime/components/prose/Tabs.vue", pascalName: "ProseTabs", kebabName: "prose-tabs", chunkName: "components/prose-tabs", priority: 0, _scanned: true, meta: {type: 1, props: [{name: _s[12], global: false, description: "The default tab to select.", tags: [{name: _s[75], text: "'1'"}], required: false, type: _s[1], schema: _s[1]}, {name: "sync", global: false, description: "Sync the selected tab with a local storage key.", tags: _emptyArray, required: false, type: _s[1], schema: _s[1]}, {name: _s[26], global: false, description: "The hash to scroll to when the tab is selected.", tags: _emptyArray, required: false, type: _s[1], schema: _s[1]}, {name: _s[13], global: false, description: _s[0], tags: _emptyArray, required: false, type: "{ root?: ClassNameValue; } & { root?: ClassNameValue; list?: ClassNameValue; indicator?: ClassNameValue; trigger?: ClassNameValue; leadingIcon?: ClassNameValue; leadingAvatar?: ClassNameValue; leadingAvatarSize?: ClassNameValue; label?: ClassNameValue; trailingBadge?: ClassNameValue; trailingBadgeSize?: ClassNameValue; content?: ClassNameValue; }", schema: {kind: _s[5], type: "{ root?: ClassNameValue; } & { root?: ClassNameValue; list?: ClassNameValue; indicator?: ClassNameValue; trigger?: ClassNameValue; leadingIcon?: ClassNameValue; leadingAvatar?: ClassNameValue; leadingAvatarSize?: ClassNameValue; label?: ClassNameValue; trailingBadge?: ClassNameValue; trailingBadgeSize?: ClassNameValue; content?: ClassNameValue; }", schema: {root: _ref25, list: {name: "list", global: false, description: _s[0], tags: _emptyArray, required: false, type: _s[4], schema: _s[4]}, indicator: {name: "indicator", global: false, description: _s[0], tags: _emptyArray, required: false, type: _s[4], schema: _s[4]}, trigger: _ref5, leadingIcon: {name: "leadingIcon", global: false, description: _s[0], tags: _emptyArray, required: false, type: _s[4], schema: _s[4]}, leadingAvatar: {name: "leadingAvatar", global: false, description: _s[0], tags: _emptyArray, required: false, type: _s[4], schema: _s[4]}, leadingAvatarSize: {name: "leadingAvatarSize", global: false, description: _s[0], tags: _emptyArray, required: false, type: _s[4], schema: _s[4]}, label: {name: _s[28], global: false, description: _s[0], tags: _emptyArray, required: false, type: _s[4], schema: _s[4]}, trailingBadge: {name: "trailingBadge", global: false, description: _s[0], tags: _emptyArray, required: false, type: _s[4], schema: _s[4]}, trailingBadgeSize: {name: "trailingBadgeSize", global: false, description: _s[0], tags: _emptyArray, required: false, type: _s[4], schema: _s[4]}, content: _ref6}}}, {name: "modelValue", global: false, description: _s[0], tags: _emptyArray, required: false, type: _s[1], schema: _s[1]}], slots: _ref23, events: [{name: "update:modelValue", description: _s[0], tags: _emptyArray, type: "[value: string]", signature: "(event: \"update:modelValue\", value: string): void", schema: [_s[1]]}], exposed: _emptyArray, hash: "Wu4ofhHF5UUOJGs_MvEm7yASlRCCFVzbIYWbY-HgW90"}}, ProseTabsItem: {mode: _s[6], global: true, prefetch: false, preload: false, filePath: "node_modules/@nuxt/ui/dist/runtime/components/prose/TabsItem.vue", declarationPath: "/Users/mac/Documents/abb-apps/abb-website/node_modules/@nuxt/ui/dist/runtime/components/prose/TabsItem.vue", pascalName: "ProseTabsItem", kebabName: "prose-tabs-item", chunkName: "components/prose-tabs-item", priority: 0, _scanned: true, meta: {type: 1, props: [{name: _s[28], global: false, description: _s[0], tags: _emptyArray, required: true, type: _s[1], schema: _s[1]}, _ref7], slots: _ref23, events: _emptyArray, exposed: _emptyArray, hash: "kHQBCxObaryWAeoHkoMrZw1WPQwwPltu9DZBsn-s1D8"}}, ProseTbody: {mode: _s[6], global: true, prefetch: false, preload: false, filePath: "node_modules/@nuxt/ui/dist/runtime/components/prose/Tbody.vue", declarationPath: "/Users/mac/Documents/abb-apps/abb-website/node_modules/@nuxt/ui/dist/runtime/components/prose/Tbody.vue", pascalName: "ProseTbody", kebabName: "prose-tbody", chunkName: "components/prose-tbody", priority: 0, _scanned: true, meta: {type: 1, props: _emptyArray, slots: _ref23, events: _emptyArray, exposed: _emptyArray, hash: "8D6pQZlqXXdrG8Rt6L6rqooBPYKMQY5fdg9zrGPU6sY"}}, ProseTd: {mode: _s[6], global: true, prefetch: false, preload: false, filePath: "node_modules/@nuxt/ui/dist/runtime/components/prose/Td.vue", declarationPath: "/Users/mac/Documents/abb-apps/abb-website/node_modules/@nuxt/ui/dist/runtime/components/prose/Td.vue", pascalName: "ProseTd", kebabName: "prose-td", chunkName: "components/prose-td", priority: 0, _scanned: true, meta: {type: 1, props: _emptyArray, slots: _ref23, events: _emptyArray, exposed: _emptyArray, hash: "Y8YMbBohiV_nyYxh8J7N_7LiZxXu0_vQx3NvU8vC5Ro"}}, ProseTh: {mode: _s[6], global: true, prefetch: false, preload: false, filePath: "node_modules/@nuxt/ui/dist/runtime/components/prose/Th.vue", declarationPath: "/Users/mac/Documents/abb-apps/abb-website/node_modules/@nuxt/ui/dist/runtime/components/prose/Th.vue", pascalName: "ProseTh", kebabName: "prose-th", chunkName: "components/prose-th", priority: 0, _scanned: true, meta: {type: 1, props: _emptyArray, slots: _ref23, events: _emptyArray, exposed: _emptyArray, hash: "IBz4FUIUAcaDkdXisS8dWeEM9wT7Dg-ytFg4o75l4Do"}}, ProseThead: {mode: _s[6], global: true, prefetch: false, preload: false, filePath: "node_modules/@nuxt/ui/dist/runtime/components/prose/Thead.vue", declarationPath: "/Users/mac/Documents/abb-apps/abb-website/node_modules/@nuxt/ui/dist/runtime/components/prose/Thead.vue", pascalName: "ProseThead", kebabName: "prose-thead", chunkName: "components/prose-thead", priority: 0, _scanned: true, meta: {type: 1, props: _emptyArray, slots: _ref23, events: _emptyArray, exposed: _emptyArray, hash: "v8rWeRicqgjEnKpBchTslwkdIMsIuxQmK5kkg_NTqp4"}}, ProseTr: {mode: _s[6], global: true, prefetch: false, preload: false, filePath: "node_modules/@nuxt/ui/dist/runtime/components/prose/Tr.vue", declarationPath: "/Users/mac/Documents/abb-apps/abb-website/node_modules/@nuxt/ui/dist/runtime/components/prose/Tr.vue", pascalName: "ProseTr", kebabName: "prose-tr", chunkName: "components/prose-tr", priority: 0, _scanned: true, meta: {type: 1, props: _emptyArray, slots: _ref23, events: _emptyArray, exposed: _emptyArray, hash: "4jvernFXCCoEAjO6jahzU6aNJmARzLmALWstEgi1a6Y"}}, ProseUl: {mode: _s[6], global: true, prefetch: false, preload: false, filePath: "node_modules/@nuxt/ui/dist/runtime/components/prose/Ul.vue", declarationPath: "/Users/mac/Documents/abb-apps/abb-website/node_modules/@nuxt/ui/dist/runtime/components/prose/Ul.vue", pascalName: "ProseUl", kebabName: "prose-ul", chunkName: "components/prose-ul", priority: 0, _scanned: true, meta: {type: 1, props: _emptyArray, slots: _ref23, events: _emptyArray, exposed: _emptyArray, hash: "GUI72QUymDUw2fH5U917wbL-KMBwLK_MOd2sinrq0Qo"}}, ProseCaution: {mode: _s[6], global: true, prefetch: false, preload: false, filePath: "node_modules/@nuxt/ui/dist/runtime/components/prose/callout/Caution.vue", declarationPath: "/Users/mac/Documents/abb-apps/abb-website/node_modules/@nuxt/ui/dist/runtime/components/prose/callout/Caution.vue", pascalName: "ProseCaution", kebabName: "prose-caution", chunkName: "components/prose-caution", priority: 0, _scanned: true, meta: _ref14}, ProseNote: {mode: _s[6], global: true, prefetch: false, preload: false, filePath: "node_modules/@nuxt/ui/dist/runtime/components/prose/callout/Note.vue", declarationPath: "/Users/mac/Documents/abb-apps/abb-website/node_modules/@nuxt/ui/dist/runtime/components/prose/callout/Note.vue", pascalName: "ProseNote", kebabName: "prose-note", chunkName: "components/prose-note", priority: 0, _scanned: true, meta: _ref14}, ProseTip: {mode: _s[6], global: true, prefetch: false, preload: false, filePath: "node_modules/@nuxt/ui/dist/runtime/components/prose/callout/Tip.vue", declarationPath: "/Users/mac/Documents/abb-apps/abb-website/node_modules/@nuxt/ui/dist/runtime/components/prose/callout/Tip.vue", pascalName: "ProseTip", kebabName: "prose-tip", chunkName: "components/prose-tip", priority: 0, _scanned: true, meta: _ref14}, ProseWarning: {mode: _s[6], global: true, prefetch: false, preload: false, filePath: "node_modules/@nuxt/ui/dist/runtime/components/prose/callout/Warning.vue", declarationPath: "/Users/mac/Documents/abb-apps/abb-website/node_modules/@nuxt/ui/dist/runtime/components/prose/callout/Warning.vue", pascalName: "ProseWarning", kebabName: "prose-warning", chunkName: "components/prose-warning", priority: 0, _scanned: true, meta: _ref14}, ProseH5: {mode: _s[6], global: true, prefetch: false, preload: false, filePath: "node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseH5.vue", declarationPath: "/Users/mac/Documents/abb-apps/abb-website/node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseH5.vue", pascalName: "ProseH5", kebabName: "prose-h5", chunkName: "components/prose-h5", priority: 0, _scanned: true, meta: {type: 1, props: [_ref12], slots: _emptyArray, events: _emptyArray, exposed: _emptyArray, hash: "7NpFNd5Rf6HVlizsmOfqORLvw42su90eq6uzqbwPPAc"}}, ProseH6: {mode: _s[6], global: true, prefetch: false, preload: false, filePath: "node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseH6.vue", declarationPath: "/Users/mac/Documents/abb-apps/abb-website/node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseH6.vue", pascalName: "ProseH6", kebabName: "prose-h6", chunkName: "components/prose-h6", priority: 0, _scanned: true, meta: {type: 1, props: [_ref12], slots: _emptyArray, events: _emptyArray, exposed: _emptyArray, hash: "7NpFNd5Rf6HVlizsmOfqORLvw42su90eq6uzqbwPPAc"}}, Icon: {chunkName: "components/icon", global: true, kebabName: _s[22], pascalName: "Icon", prefetch: false, preload: false, mode: _s[6], priority: 0, meta: {type: 1, props: [{name: _s[21], global: false, description: _s[0], tags: _emptyArray, required: true, type: _s[1], schema: _s[1]}, {name: "mode", global: false, default: _s[76], description: _s[0], tags: _emptyArray, required: false, type: _s[1], schema: _s[1]}, {name: "size", global: false, default: _s[76], description: _s[0], tags: _emptyArray, required: false, type: _s[25], schema: _ref20}, {name: "customize", global: false, default: _s[76], description: _s[0], tags: _emptyArray, required: false, type: "boolean | Function", schema: {kind: _s[10], type: "boolean | Function", schema: {"0": _s[14], "1": _s[17], "2": {kind: _s[5], type: _s[77], schema: {apply: {name: "apply", global: false, description: "Calls the function, substituting the specified object for the this value of the function, and the specified array for the arguments of the function.", tags: [{name: _s[3], text: "thisArg The object to be used as the this object."}, {name: _s[3], text: "argArray A set of arguments to be passed to the function."}], required: true, type: "(this: Function, thisArg: any, argArray?: any) => any", schema: {kind: _s[7], type: "(this: Function, thisArg: any, argArray?: any): any", schema: _emptyObject}}, call: {name: "call", global: false, description: "Calls a method of an object, substituting another object for the current object.", tags: [{name: _s[3], text: "thisArg The object to be used as the current object."}, {name: _s[3], text: "argArray A list of arguments to be passed to the method."}], required: true, type: "(this: Function, thisArg: any, ...argArray: any[]) => any", schema: {kind: _s[7], type: "(this: Function, thisArg: any, ...argArray: any[]): any", schema: _emptyObject}}, bind: {name: "bind", global: false, description: "For a given function, creates a bound function that has the same body as the original function.\nThe this object of the bound function is associated with the specified object, and has the specified initial parameters.", tags: [{name: _s[3], text: "thisArg An object to which the this keyword can refer inside the new function."}, {name: _s[3], text: "argArray A list of arguments to be passed to the new function."}], required: true, type: "(this: Function, thisArg: any, ...argArray: any[]) => any", schema: {kind: _s[7], type: "(this: Function, thisArg: any, ...argArray: any[]): any", schema: _emptyObject}}, toString: {name: _s[65], global: false, description: "Returns a string representation of a function.", tags: _emptyArray, required: true, type: _s[15], schema: _ref2}, prototype: {name: "prototype", global: false, description: _s[0], tags: _emptyArray, required: true, type: _s[9], schema: _s[9]}, length: {name: _s[66], global: false, description: _s[0], tags: _emptyArray, required: true, type: _s[18], schema: _s[18]}, arguments: {name: "arguments", global: false, description: _s[0], tags: _emptyArray, required: true, type: _s[9], schema: _s[9]}, caller: {name: "caller", global: false, description: _s[0], tags: _emptyArray, required: true, type: _s[77], schema: _s[77]}}}}}}], slots: _emptyArray, events: _emptyArray, exposed: _emptyArray, hash: "aFktfg79RoxhUJUbTqae26vK6eRtWxXTPNQOUXaL02A"}, name: "Icon", filePath: "node_modules/@nuxt/icon/dist/runtime/components/index.js"}};

const highlight = {"theme":{"light":"material-theme-lighter","default":"material-theme","dark":"material-theme-palenight"}};

function filterComponents(components, options) {
  const { include = [], exclude = [] } = options;
  if (components.length === 0) {
    return [];
  }
  let result = components;
  if (include.length > 0) {
    result = result.filter((component) => matchAnyPattern(component, include));
  }
  if (exclude.length > 0) {
    result = result.filter((component) => !matchAnyPattern(component, exclude));
  }
  return result;
}
function matchAnyPattern(component, patterns) {
  return patterns.some((pattern) => {
    const value = pattern.includes("/") ? component.path : component.name;
    return minimatch(value, pattern);
  });
}

const _a9p2Sq = eventHandler(async (event) => {
  const config = useRuntimeConfig();
  {
    const session = await useSession(event, {
      name: "studio-session",
      password: config.studio?.auth?.sessionSecret,
      cookie: {
        // Use secure cookies over HTTPS, required for locally testing purposes
        secure: getRequestProtocol(event) === "https",
        path: "/"
      }
    });
    if (!session?.data?.user) {
      throw createError$1({
        statusCode: 404,
        message: "Not found"
      });
    }
  }
  const mappedComponents = Object.values(components).map(({ pascalName, filePath, meta }) => {
    return {
      name: pascalName,
      path: filePath,
      meta: {
        props: meta.props,
        slots: meta.slots,
        events: meta.events
      }
    };
  });
  const filteredComponents = filterComponents(
    mappedComponents,
    config.studio?.meta?.components
  );
  return {
    markdownConfig: config.studio.markdown || {},
    highlightTheme: highlight?.theme || { default: "github-light", dark: "github-dark", light: "github-light" },
    components: filteredComponents
  };
});

const n=()=>"\nconst DB_NAME = 'studio-media'\nconst STORE_NAME = 'drafts'\n\nconst DraftStatus = {\n  Deleted: 'deleted',\n  Created: 'created',\n  Updated: 'updated',\n  Pristine: 'pristine'\n}\n\nconst MEDIA_EXTENSIONS = [\n  'png',\n  'jpg',\n  'jpeg',\n  'svg',\n  'webp',\n  'avif',\n  'ico',\n  'gif',\n  'mp4',\n  'mov',\n  'avi',\n  'mkv',\n  'webm',\n  'ogg',\n  'mp3',\n  'wav',\n  'aac',\n  'm4a',\n  'm4v',\n  'm4b',\n]\n\nfunction extractImagePath(url) {\n  const pathname = url.pathname;\n  if (pathname.startsWith('/_ipx/_/')) {\n    return pathname.replace('/_ipx/_', '')\n  }\n\n  if (pathname.startsWith('/_vercel/image')) {\n    return url.searchParams.get('url') || null\n  }\n\n  if (MEDIA_EXTENSIONS.includes(pathname.split('.').pop())) {\n    return pathname\n  }\n\n  return null\n}\n\nself.addEventListener('install', event => {\n  self.skipWaiting()\n})\n\nself.addEventListener('activate', event => {\n  event.waitUntil(self.clients.claim())\n})\n\nself.addEventListener('fetch', event => {\n  const url = new URL(event.request.url);\n  const isSameDomain = url.origin === self.location.origin;\n\n  if (!isSameDomain) {\n    return\n  }\n\n  const imageUrl = extractImagePath(url);\n  if (imageUrl) {\n    return event.respondWith(fetchFromIndexedDB(event, imageUrl));\n  }\n})\n\nfunction fetchFromIndexedDB(event, url) {\n  const dbKey = url.replace(/^\\//g, '').replace(/\\//g, ':')\n  return getData(dbKey).then(data => {\n    if (!data) {\n      return fetch(event.request);\n    }\n\n    const dbItem = JSON.parse(data)\n\n    console.log('Data found in IndexedDB:', dbItem);\n\n    // Deleted file\n    if (dbItem.status === DraftStatus.Deleted) {\n      return fetch('https://placehold.co/1200x800?text=Deleted');\n    }\n\n    // Renamed file\n    if (dbItem.original?.path) {\n      return fetch(dbItem.original.path);\n    }\n\n    // Created file\n    const parsed = parseDataUrl(dbItem.modified.raw);\n    const bytes = base64ToUint8Array(parsed.base64);\n\n    return new Response(bytes, {\n      headers: { 'Content-Type': parsed.mime }\n    });\n  })\n}\n\nfunction parseDataUrl(dataUrl) {\n  // Example: data:image/png;base64,iVBORw0KG...\n  const match = dataUrl.match(/^data:(.+);base64,(.+)$/);\n  if (!match) return null;\n  return {\n    mime: match[1],\n    base64: match[2]\n  };\n}\n\nfunction base64ToUint8Array(base64) {\n  const binary = atob(base64);\n  const len = binary.length;\n  const bytes = new Uint8Array(len);\n  for (let i = 0; i < len; i++) {\n    bytes[i] = binary.charCodeAt(i);\n  }\n  return bytes;\n}\n\n// IndexedDB\nfunction openDB() {\n  return new Promise((resolve, reject) => {\n    const request = indexedDB.open(DB_NAME, 1);\n    request.onupgradeneeded = event => {\n      const db = event.target.result;\n      db.createObjectStore(STORE_NAME, { keyPath: 'id' });\n    };\n    request.onsuccess = event => resolve(event.target.result);\n    request.onerror = event => reject(event.target.error);\n  });\n}\n\n// Read data from the object store\nfunction getData(key) {\n  return openDB().then(db => {\n    return new Promise((resolve, reject) => {\n      const tx = db.transaction('drafts', 'readonly');\n      const store = tx.objectStore('drafts');\n      const request = store.get(key);\n      request.onsuccess = () => resolve(request.result);\n      request.onerror = () => reject(request.error);\n    });\n  });\n}\n";

const _KadmXo = eventHandler(async (event) => {
  setHeader(event, "Content-Type", "application/javascript");
  return n();
});

const _GVXCRc = eventHandler(async (event) => {
  const collection = getRouterParam(event, "collection") || event.path?.split("/")?.[2] || "";
  setHeader(event, "Content-Type", "text/plain");
  const data = await useStorage().getItem(`build:content:database.compressed.mjs`) || "";
  if (data) {
    const lineStart = `export const ${collection} = "`;
    const content = String(data).split("\n").find((line) => line.startsWith(lineStart));
    if (content) {
      return content.substring(lineStart.length, content.length - 1);
    }
  }
  return await import('../build/database.compressed.mjs').then((m) => m[collection]);
});

const _yqSb1b = defineEventHandler((event) => {
  appendHeader(event, "Access-Control-Allow-Origin", "*");
  const componentName = (event.context.params?.["component?"] || "").replace(/\.json$/, "");
  if (componentName) {
    const meta = components[pascalCase(componentName)];
    if (!meta) {
      throw createError$1({
        statusMessage: "Components not found!",
        statusCode: 404,
        data: {
          description: "Please make sure you are looking for correct component"
        }
      });
    }
    return meta;
  }
  return components;
});

async function decompressSQLDump(base64Str, compressionType = "gzip") {
  let binaryData;
  if (typeof Buffer !== "undefined") {
    const buffer = Buffer.from(base64Str, "base64");
    binaryData = Uint8Array.from(buffer);
  } else if (typeof atob !== "undefined") {
    binaryData = Uint8Array.from(atob(base64Str), (c) => c.charCodeAt(0));
  } else {
    throw new TypeError("No base64 decoding method available");
  }
  const response = new Response(new Blob([binaryData]));
  const decompressedStream = response.body?.pipeThrough(new DecompressionStream(compressionType));
  const text = await new Response(decompressedStream).text();
  return JSON.parse(text);
}

function refineContentFields(sql, doc) {
  const fields = findCollectionFields(sql);
  const item = { ...doc };
  for (const key in item) {
    if (fields[key] === "json" && item[key] && item[key] !== "undefined") {
      item[key] = JSON.parse(item[key]);
    }
    if (fields[key] === "boolean" && item[key] !== "undefined") {
      item[key] = Boolean(item[key]);
    }
  }
  for (const key in item) {
    if (item[key] === "NULL") {
      item[key] = void 0;
    }
  }
  return item;
}
function findCollectionFields(sql) {
  const table = sql.match(/FROM\s+(\w+)/);
  if (!table) {
    return {};
  }
  const info = contentManifest[getCollectionName(table[1])];
  return info?.fields || {};
}
function getCollectionName(table) {
  return table.replace(/^_content_/, "");
}

class BoundableStatement {
	_statement;
	constructor(rawStmt) {
		this._statement = rawStmt;
	}
	bind(...params) {
		return new BoundStatement(this, params);
	}
}
class BoundStatement {
	#statement;
	#params;
	constructor(statement, params) {
		this.#statement = statement;
		this.#params = params;
	}
	bind(...params) {
		return new BoundStatement(this.#statement, params);
	}
	all() {
		return this.#statement.all(...this.#params);
	}
	run() {
		return this.#statement.run(...this.#params);
	}
	get() {
		return this.#statement.get(...this.#params);
	}
}

function sqliteConnector(opts) {
	let _db;
	const getDB = () => {
		if (_db) {
			return _db;
		}
		if (opts.name === ":memory:") {
			_db = new Database(":memory:");
			return _db;
		}
		const filePath = resolve(opts.cwd || ".", opts.path || `.data/${opts.name || "db"}.sqlite3`);
		mkdirSync(dirname(filePath), { recursive: true });
		_db = new Database(filePath);
		return _db;
	};
	return {
		name: "sqlite",
		dialect: "sqlite",
		getInstance: () => getDB(),
		exec: (sql) => getDB().exec(sql),
		prepare: (sql) => new StatementWrapper(() => getDB().prepare(sql)),
		dispose: () => {
			_db?.close?.();
			_db = undefined;
		}
	};
}
class StatementWrapper extends BoundableStatement {
	async all(...params) {
		return this._statement().all(...params);
	}
	async run(...params) {
		const res = this._statement().run(...params);
		return {
			success: res.changes > 0,
			...res
		};
	}
	async get(...params) {
		return this._statement().get(...params);
	}
}

let db;
function loadDatabaseAdapter(config) {
  const { database, localDatabase } = config;
  if (!db) {
    if (["nitro-prerender", "nitro-dev"].includes("vercel")) {
      db = sqliteConnector(refineDatabaseConfig(localDatabase));
    } else {
      db = sqliteConnector(refineDatabaseConfig(database));
    }
  }
  return {
    all: async (sql, params = []) => {
      return db.prepare(sql).all(...params).then((result) => (result || []).map((item) => refineContentFields(sql, item)));
    },
    first: async (sql, params = []) => {
      return db.prepare(sql).get(...params).then((item) => item ? refineContentFields(sql, item) : item);
    },
    exec: async (sql, params = []) => {
      return db.prepare(sql).run(...params);
    }
  };
}
const checkDatabaseIntegrity = /* @__PURE__ */ new Map();
const integrityCheckPromise = /* @__PURE__ */ new Map();
async function checkAndImportDatabaseIntegrity(event, collection, config) {
  if (checkDatabaseIntegrity.get(collection) !== false) {
    checkDatabaseIntegrity.set(collection, false);
    if (!integrityCheckPromise.has(collection)) {
      const _integrityCheck = _checkAndImportDatabaseIntegrity(event, collection, checksums[collection], checksumsStructure[collection], config).then((isValid) => {
        checkDatabaseIntegrity.set(collection, !isValid);
      }).catch((error) => {
        console.error("Database integrity check failed", error);
        checkDatabaseIntegrity.set(collection, true);
        integrityCheckPromise.delete(collection);
      });
      integrityCheckPromise.set(collection, _integrityCheck);
    }
  }
  if (integrityCheckPromise.has(collection)) {
    await integrityCheckPromise.get(collection);
  }
}
async function _checkAndImportDatabaseIntegrity(event, collection, integrityVersion, structureIntegrityVersion, config) {
  const db2 = loadDatabaseAdapter(config);
  const before = await db2.first(`SELECT * FROM ${tables.info} WHERE id = ?`, [`checksum_${collection}`]).catch(() => null);
  if (before?.version && !String(before.version)?.startsWith(`${config.databaseVersion}--`)) {
    await db2.exec(`DROP TABLE IF EXISTS ${tables.info}`);
    before.version = "";
  }
  const unchangedStructure = before?.structureVersion === structureIntegrityVersion;
  if (before?.version) {
    if (before.version === integrityVersion) {
      if (before.ready) {
        return true;
      }
      await waitUntilDatabaseIsReady(db2, collection);
      return true;
    }
    await db2.exec(`DELETE FROM ${tables.info} WHERE id = ?`, [`checksum_${collection}`]);
    if (!unchangedStructure) {
      await db2.exec(`DROP TABLE IF EXISTS ${tables[collection]}`);
    }
  }
  const dump = await loadDatabaseDump(event, collection).then(decompressSQLDump);
  const dumpLinesHash = dump.map((row) => row.split(" -- ").pop());
  let hashesInDb = /* @__PURE__ */ new Set();
  if (unchangedStructure) {
    const hashListFromTheDump = new Set(dumpLinesHash);
    const hashesInDbRecords = await db2.all(`SELECT __hash__ FROM ${tables[collection]}`).catch(() => []);
    hashesInDb = new Set(hashesInDbRecords.map((r) => r.__hash__));
    const hashesToDelete = hashesInDb.difference(hashListFromTheDump);
    if (hashesToDelete.size) {
      await db2.exec(`DELETE FROM ${tables[collection]} WHERE __hash__ IN (${Array(hashesToDelete.size).fill("?").join(",")})`, Array.from(hashesToDelete));
    }
  }
  await dump.reduce(async (prev, sql, index) => {
    await prev;
    const hash = dumpLinesHash[index];
    const statement = sql.substring(0, sql.length - hash.length - 4);
    if (unchangedStructure) {
      if (hash === "structure") {
        return Promise.resolve();
      }
      if (hashesInDb.has(hash)) {
        return Promise.resolve();
      }
    }
    await db2.exec(statement).catch((err) => {
      const message = err.message || "Unknown error";
      console.error(`Failed to execute SQL ${sql}: ${message}`);
    });
  }, Promise.resolve());
  const after = await db2.first(`SELECT version FROM ${tables.info} WHERE id = ?`, [`checksum_${collection}`]).catch(() => ({ version: "" }));
  return after?.version === integrityVersion;
}
const REQUEST_TIMEOUT = 90;
async function waitUntilDatabaseIsReady(db2, collection) {
  let iterationCount = 0;
  let interval;
  await new Promise((resolve, reject) => {
    interval = setInterval(async () => {
      const row = await db2.first(`SELECT ready FROM ${tables.info} WHERE id = ?`, [`checksum_${collection}`]).catch(() => ({ ready: true }));
      if (row?.ready) {
        clearInterval(interval);
        resolve(0);
      }
      if (iterationCount++ > REQUEST_TIMEOUT) {
        clearInterval(interval);
        reject(new Error("Waiting for another database initialization timed out"));
      }
    }, 1e3);
  }).catch((e) => {
    throw e;
  }).finally(() => {
    if (interval) {
      clearInterval(interval);
    }
  });
}
async function loadDatabaseDump(event, collection) {
  return await fetchDatabase(event, collection).catch((e) => {
    console.error("Failed to fetch compressed dump", e);
    return "";
  });
}
function refineDatabaseConfig(config) {
  if (config.type === "d1") {
    return { ...config, bindingName: config.bindingName || config.binding };
  }
  if (config.type === "sqlite") {
    const _config = { ...config };
    if (config.filename === ":memory:") {
      return { name: ":memory:" };
    }
    if ("filename" in config) {
      const filename = isAbsolute(config?.filename || "") || config?.filename === ":memory:" ? config?.filename : new URL(config.filename, globalThis._importMeta_.url).pathname;
      _config.path = process.platform === "win32" && filename.startsWith("/") ? filename.slice(1) : filename;
    }
    return _config;
  }
  if (config.type === "pglite") {
    return {
      dataDir: config.dataDir,
      // Pass through any other PGlite-specific options
      ...config
    };
  }
  return config;
}

const SQL_COMMANDS = /SELECT|INSERT|UPDATE|DELETE|DROP|ALTER|\$/i;
const SQL_COUNT_REGEX = /COUNT\((DISTINCT )?([a-z_]\w+|\*)\)/i;
const SQL_SELECT_REGEX = /^SELECT (.*) FROM (\w+)( WHERE .*)? ORDER BY (["\w,\s]+) (ASC|DESC)( LIMIT \d+)?( OFFSET \d+)?$/;
function assertSafeQuery(sql, collection) {
  if (!sql) {
    throw new Error("Invalid query: Query cannot be empty");
  }
  const cleanedupQuery = cleanupQuery(sql);
  if (cleanedupQuery !== sql) {
    throw new Error("Invalid query: SQL comments are not allowed");
  }
  const match = sql.match(SQL_SELECT_REGEX);
  if (!match) {
    throw new Error("Invalid query: Query must be a valid SELECT statement with proper syntax");
  }
  const [_, select, from, where, orderBy, order, limit, offset] = match;
  const columns = select?.trim().split(", ") || [];
  if (columns.length === 1) {
    if (columns[0] !== "*" && !columns[0]?.match(SQL_COUNT_REGEX) && !columns[0]?.match(/^"[a-z_]\w+"$/i)) {
      throw new Error(`Invalid query: Column '${columns[0]}' has invalid format. Expected *, COUNT(), or a quoted column name`);
    }
  } else if (!columns.every((column) => column.match(/^"[a-z_]\w+"$/i))) {
    throw new Error("Invalid query: Multiple columns must be properly quoted and alphanumeric");
  }
  if (from !== `_content_${collection}`) {
    const collection2 = String(from || "").replace(/^_content_/, "");
    throw new Error(`Invalid query: Collection '${collection2}' does not exist`);
  }
  if (where) {
    if (!where.startsWith(" WHERE (") || !where.endsWith(")")) {
      throw new Error("Invalid query: WHERE clause must be properly enclosed in parentheses");
    }
    const noString = cleanupQuery(where, { removeString: true });
    if (noString.match(SQL_COMMANDS)) {
      throw new Error("Invalid query: WHERE clause contains unsafe SQL commands");
    }
  }
  const _order = (orderBy + " " + order).split(", ");
  if (!_order.every((column) => column.match(/^("[a-zA-Z_]+"|[a-zA-Z_]+) (ASC|DESC)$/))) {
    throw new Error("Invalid query: ORDER BY clause must contain valid column names followed by ASC or DESC");
  }
  if (limit !== void 0 && !limit.match(/^ LIMIT \d+$/)) {
    throw new Error("Invalid query: LIMIT clause must be a positive number");
  }
  if (offset !== void 0 && !offset.match(/^ OFFSET \d+$/)) {
    throw new Error("Invalid query: OFFSET clause must be a positive number");
  }
  return true;
}
function cleanupQuery(query, options = { removeString: false }) {
  let inString = false;
  let stringFence = "";
  let result = "";
  for (let i = 0; i < query.length; i++) {
    const char = query[i];
    const prevChar = query[i - 1];
    const nextChar = query[i + 1];
    if (char === "'" || char === '"') {
      if (!options?.removeString) {
        result += char;
        continue;
      }
      if (inString) {
        if (char !== stringFence || nextChar === stringFence || prevChar === stringFence) {
          continue;
        }
        inString = false;
        stringFence = "";
        continue;
      } else {
        inString = true;
        stringFence = char;
        continue;
      }
    }
    if (!inString) {
      if (char === "-" && nextChar === "-") {
        return result;
      }
      if (char === "/" && nextChar === "*") {
        i += 2;
        while (i < query.length && !(query[i] === "*" && query[i + 1] === "/")) {
          i += 1;
        }
        i += 2;
        continue;
      }
      result += char;
    }
  }
  return result;
}

const _BGlQ6_ = eventHandler(async (event) => {
  const { sql } = await readBody(event);
  const collection = getRouterParam(event, "collection") || event.path?.split("/")?.[2] || "";
  assertSafeQuery(sql, collection);
  const conf = useRuntimeConfig().content;
  if (conf.integrityCheck) {
    await checkAndImportDatabaseIntegrity(event, collection, conf);
  }
  return loadDatabaseAdapter(conf).all(sql);
});

const _HW04Uv = lazyEventHandler(() => {
  const opts = useRuntimeConfig().ipx || {};
  const fsDir = opts?.fs?.dir ? (Array.isArray(opts.fs.dir) ? opts.fs.dir : [opts.fs.dir]).map((dir) => isAbsolute(dir) ? dir : fileURLToPath(new URL(dir, globalThis._importMeta_.url))) : void 0;
  const fsStorage = opts.fs?.dir ? ipxFSStorage({ ...opts.fs, dir: fsDir }) : void 0;
  const httpStorage = opts.http?.domains ? ipxHttpStorage({ ...opts.http }) : void 0;
  if (!fsStorage && !httpStorage) {
    throw new Error("IPX storage is not configured!");
  }
  const ipxOptions = {
    ...opts,
    storage: fsStorage || httpStorage,
    httpStorage
  };
  const ipx = createIPX(ipxOptions);
  const ipxHandler = createIPXH3Handler(ipx);
  return useBase(opts.baseURL, ipxHandler);
});

const _lazy_WZ62Q1 = () => import('../routes/api/strapi/_..._.mjs');
const _lazy_t8uQLc = () => import('../routes/renderer.mjs').then(function (n) { return n.r; });

const handlers = [
  { route: '/api/strapi/**', handler: _lazy_WZ62Q1, lazy: true, middleware: false, method: undefined },
  { route: '/__nuxt_error', handler: _lazy_t8uQLc, lazy: true, middleware: false, method: undefined },
  { route: '/__nuxt_island/**', handler: _SxA8c9, lazy: false, middleware: false, method: undefined },
  { route: '/api/_nuxt_icon/:collection', handler: _A18zAr, lazy: false, middleware: false, method: undefined },
  { route: '/__nuxt_studio/auth/github', handler: _PoO0j4, lazy: false, middleware: false, method: "get" },
  { route: '/__nuxt_studio/auth/google', handler: _ot6zVZ, lazy: false, middleware: false, method: "get" },
  { route: '/__nuxt_studio/auth/gitlab', handler: _IDBmFC, lazy: false, middleware: false, method: "get" },
  { route: '/__nuxt_studio/auth/session', handler: _tnzxeg, lazy: false, middleware: false, method: "get" },
  { route: '/__nuxt_studio/auth/session', handler: _jIExYM, lazy: false, middleware: false, method: "delete" },
  { route: '/_studio', handler: _lW0pBe, lazy: false, middleware: false, method: undefined },
  { route: '/__nuxt_studio/meta', handler: _a9p2Sq, lazy: false, middleware: false, method: undefined },
  { route: '/sw.js', handler: _KadmXo, lazy: false, middleware: false, method: undefined },
  { route: '/__nuxt_content/hero/sql_dump.txt', handler: _GVXCRc, lazy: false, middleware: false, method: undefined },
  { route: '/__nuxt_content/about/sql_dump.txt', handler: _GVXCRc, lazy: false, middleware: false, method: undefined },
  { route: '/__nuxt_content/home_about/sql_dump.txt', handler: _GVXCRc, lazy: false, middleware: false, method: undefined },
  { route: '/__nuxt_content/services/sql_dump.txt', handler: _GVXCRc, lazy: false, middleware: false, method: undefined },
  { route: '/__nuxt_content/testimonials/sql_dump.txt', handler: _GVXCRc, lazy: false, middleware: false, method: undefined },
  { route: '/__nuxt_content/partners/sql_dump.txt', handler: _GVXCRc, lazy: false, middleware: false, method: undefined },
  { route: '/__nuxt_content/gallery/sql_dump.txt', handler: _GVXCRc, lazy: false, middleware: false, method: undefined },
  { route: '/__nuxt_content/locations/sql_dump.txt', handler: _GVXCRc, lazy: false, middleware: false, method: undefined },
  { route: '/__nuxt_content/membership/sql_dump.txt', handler: _GVXCRc, lazy: false, middleware: false, method: undefined },
  { route: '/__nuxt_content/contact/sql_dump.txt', handler: _GVXCRc, lazy: false, middleware: false, method: undefined },
  { route: '/__nuxt_content/cta/sql_dump.txt', handler: _GVXCRc, lazy: false, middleware: false, method: undefined },
  { route: '/__nuxt_content/team/sql_dump.txt', handler: _GVXCRc, lazy: false, middleware: false, method: undefined },
  { route: '/__nuxt_content/info/sql_dump.txt', handler: _GVXCRc, lazy: false, middleware: false, method: undefined },
  { route: '/api/component-meta', handler: _yqSb1b, lazy: false, middleware: false, method: "get" },
  { route: '/api/component-meta.json', handler: _yqSb1b, lazy: false, middleware: false, method: "get" },
  { route: '/api/component-meta/:component?', handler: _yqSb1b, lazy: false, middleware: false, method: "get" },
  { route: '/__nuxt_content/hero/query', handler: _BGlQ6_, lazy: false, middleware: false, method: undefined },
  { route: '/__nuxt_content/about/query', handler: _BGlQ6_, lazy: false, middleware: false, method: undefined },
  { route: '/__nuxt_content/home_about/query', handler: _BGlQ6_, lazy: false, middleware: false, method: undefined },
  { route: '/__nuxt_content/services/query', handler: _BGlQ6_, lazy: false, middleware: false, method: undefined },
  { route: '/__nuxt_content/testimonials/query', handler: _BGlQ6_, lazy: false, middleware: false, method: undefined },
  { route: '/__nuxt_content/partners/query', handler: _BGlQ6_, lazy: false, middleware: false, method: undefined },
  { route: '/__nuxt_content/gallery/query', handler: _BGlQ6_, lazy: false, middleware: false, method: undefined },
  { route: '/__nuxt_content/locations/query', handler: _BGlQ6_, lazy: false, middleware: false, method: undefined },
  { route: '/__nuxt_content/membership/query', handler: _BGlQ6_, lazy: false, middleware: false, method: undefined },
  { route: '/__nuxt_content/contact/query', handler: _BGlQ6_, lazy: false, middleware: false, method: undefined },
  { route: '/__nuxt_content/cta/query', handler: _BGlQ6_, lazy: false, middleware: false, method: undefined },
  { route: '/__nuxt_content/team/query', handler: _BGlQ6_, lazy: false, middleware: false, method: undefined },
  { route: '/__nuxt_content/info/query', handler: _BGlQ6_, lazy: false, middleware: false, method: undefined },
  { route: '/_ipx/**', handler: _HW04Uv, lazy: false, middleware: false, method: undefined },
  { route: '/', handler: _lazy_t8uQLc, lazy: true, middleware: false, method: undefined },
  { route: '/about', handler: _lazy_t8uQLc, lazy: true, middleware: false, method: undefined },
  { route: '/contact', handler: _lazy_t8uQLc, lazy: true, middleware: false, method: undefined },
  { route: '/gallery', handler: _lazy_t8uQLc, lazy: true, middleware: false, method: undefined },
  { route: '/pricing', handler: _lazy_t8uQLc, lazy: true, middleware: false, method: undefined },
  { route: '/locations/**', handler: _lazy_t8uQLc, lazy: true, middleware: false, method: undefined },
  { route: '/services/**', handler: _lazy_t8uQLc, lazy: true, middleware: false, method: undefined },
  { route: '/**', handler: _lazy_t8uQLc, lazy: true, middleware: false, method: undefined }
];

function createNitroApp() {
  const config = useRuntimeConfig();
  const hooks = createHooks();
  const captureError = (error, context = {}) => {
    const promise = hooks.callHookParallel("error", error, context).catch((error_) => {
      console.error("Error while capturing another error", error_);
    });
    if (context.event && isEvent(context.event)) {
      const errors = context.event.context.nitro?.errors;
      if (errors) {
        errors.push({ error, context });
      }
      if (context.event.waitUntil) {
        context.event.waitUntil(promise);
      }
    }
  };
  const h3App = createApp({
    debug: destr(false),
    onError: (error, event) => {
      captureError(error, { event, tags: ["request"] });
      return errorHandler(error, event);
    },
    onRequest: async (event) => {
      event.context.nitro = event.context.nitro || { errors: [] };
      const fetchContext = event.node.req?.__unenv__;
      if (fetchContext?._platform) {
        event.context = {
          _platform: fetchContext?._platform,
          // #3335
          ...fetchContext._platform,
          ...event.context
        };
      }
      if (!event.context.waitUntil && fetchContext?.waitUntil) {
        event.context.waitUntil = fetchContext.waitUntil;
      }
      event.fetch = (req, init) => fetchWithEvent(event, req, init, { fetch: localFetch });
      event.$fetch = (req, init) => fetchWithEvent(event, req, init, {
        fetch: $fetch
      });
      event.waitUntil = (promise) => {
        if (!event.context.nitro._waitUntilPromises) {
          event.context.nitro._waitUntilPromises = [];
        }
        event.context.nitro._waitUntilPromises.push(promise);
        if (event.context.waitUntil) {
          event.context.waitUntil(promise);
        }
      };
      event.captureError = (error, context) => {
        captureError(error, { event, ...context });
      };
      await nitroApp$1.hooks.callHook("request", event).catch((error) => {
        captureError(error, { event, tags: ["request"] });
      });
    },
    onBeforeResponse: async (event, response) => {
      await nitroApp$1.hooks.callHook("beforeResponse", event, response).catch((error) => {
        captureError(error, { event, tags: ["request", "response"] });
      });
    },
    onAfterResponse: async (event, response) => {
      await nitroApp$1.hooks.callHook("afterResponse", event, response).catch((error) => {
        captureError(error, { event, tags: ["request", "response"] });
      });
    }
  });
  const router = createRouter({
    preemptive: true
  });
  const nodeHandler = toNodeListener(h3App);
  const localCall = (aRequest) => b(
    nodeHandler,
    aRequest
  );
  const localFetch = (input, init) => {
    if (!input.toString().startsWith("/")) {
      return globalThis.fetch(input, init);
    }
    return C(
      nodeHandler,
      input,
      init
    ).then((response) => normalizeFetchResponse(response));
  };
  const $fetch = createFetch({
    fetch: localFetch,
    Headers: Headers$1,
    defaults: { baseURL: config.app.baseURL }
  });
  globalThis.$fetch = $fetch;
  h3App.use(createRouteRulesHandler({ localFetch }));
  for (const h of handlers) {
    let handler = h.lazy ? lazyEventHandler(h.handler) : h.handler;
    if (h.middleware || !h.route) {
      const middlewareBase = (config.app.baseURL + (h.route || "/")).replace(
        /\/+/g,
        "/"
      );
      h3App.use(middlewareBase, handler);
    } else {
      const routeRules = getRouteRulesForPath(
        h.route.replace(/:\w+|\*\*/g, "_")
      );
      if (routeRules.cache) {
        handler = cachedEventHandler(handler, {
          group: "nitro/routes",
          ...routeRules.cache
        });
      }
      router.use(h.route, handler, h.method);
    }
  }
  h3App.use(config.app.baseURL, router.handler);
  const app = {
    hooks,
    h3App,
    router,
    localCall,
    localFetch,
    captureError
  };
  return app;
}
function runNitroPlugins(nitroApp2) {
  for (const plugin of plugins) {
    try {
      plugin(nitroApp2);
    } catch (error) {
      nitroApp2.captureError(error, { tags: ["plugin"] });
      throw error;
    }
  }
}
const nitroApp$1 = createNitroApp();
function useNitroApp() {
  return nitroApp$1;
}
runNitroPlugins(nitroApp$1);

const nitroApp = useNitroApp();
const handler = toNodeListener(nitroApp.h3App);
const listener = function(req, res) {
  const query = req.headers["x-now-route-matches"];
  if (query) {
    const { url } = parseQuery(query);
    if (url) {
      req.url = url;
    }
  }
  return handler(req, res);
};

export { $fetch$1 as $, defu as A, getRequestHeader as B, isEqual as C, setCookie as D, getCookie as E, deleteCookie as F, withoutTrailingSlash as G, getRequestHeaders as H, withLeadingSlash as I, parseURL as J, encodeParam as K, encodePath as L, parseQuery as M, withTrailingSlash as N, serialize$1 as O, listener as P, getResponseStatusText as a, buildAssetsURL as b, getResponseStatus as c, defineCachedEventHandler as d, defineRenderHandler as e, createError$1 as f, getQuery as g, destr as h, getRouteRules as i, useNitroApp as j, defuFn as k, klona as l, hasProtocol as m, isScriptProtocol as n, joinURL as o, publicAssetsURL as p, getContext as q, readBody as r, sanitizeStatusCode as s, baseURL as t, useRuntimeConfig as u, createHooks as v, withQuery as w, executeAsync as x, toRouteMatcher as y, createRouter$1 as z };
//# sourceMappingURL=nitro.mjs.map
