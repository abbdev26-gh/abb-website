import { G as withoutTrailingSlash, H as getRequestHeaders } from '../nitro/nitro.mjs';
import { t as tryUseNuxtApp } from './server.mjs';

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
const buildGroup = (group, type) => {
  const conditions = group._conditions;
  return conditions.length > 0 ? `(${conditions.join(` ${type} `)})` : "";
};
const collectionQueryGroup = (collection) => {
  const conditions = [];
  const query = {
    // @ts-expect-error -- internal
    _conditions: conditions,
    where(field, operator, value) {
      let condition;
      switch (operator.toUpperCase()) {
        case "IN":
        case "NOT IN":
          if (Array.isArray(value)) {
            const values = value.map((val) => singleQuote(val)).join(", ");
            condition = `"${String(field)}" ${operator.toUpperCase()} (${values})`;
          } else {
            throw new TypeError(`Value for ${operator} must be an array`);
          }
          break;
        case "BETWEEN":
        case "NOT BETWEEN":
          if (Array.isArray(value) && value.length === 2) {
            condition = `"${String(field)}" ${operator.toUpperCase()} ${singleQuote(value[0])} AND ${singleQuote(value[1])}`;
          } else {
            throw new Error(`Value for ${operator} must be an array with two elements`);
          }
          break;
        case "IS NULL":
        case "IS NOT NULL":
          condition = `"${String(field)}" ${operator.toUpperCase()}`;
          break;
        case "LIKE":
        case "NOT LIKE":
          condition = `"${String(field)}" ${operator.toUpperCase()} ${singleQuote(value)}`;
          break;
        default:
          condition = `"${String(field)}" ${operator} ${singleQuote(typeof value === "boolean" ? Number(value) : value)}`;
      }
      conditions.push(`${condition}`);
      return query;
    },
    andWhere(groupFactory) {
      const group = groupFactory(collectionQueryGroup());
      conditions.push(buildGroup(group, "AND"));
      return query;
    },
    orWhere(groupFactory) {
      const group = groupFactory(collectionQueryGroup());
      conditions.push(buildGroup(group, "OR"));
      return query;
    }
  };
  return query;
};
const collectionQueryBuilder = (collection, fetch) => {
  const params = {
    conditions: [],
    selectedFields: [],
    offset: 0,
    limit: 0,
    orderBy: [],
    // Count query
    count: {
      field: "",
      distinct: false
    }
  };
  const query = {
    // @ts-expect-error -- internal
    __params: params,
    andWhere(groupFactory) {
      const group = groupFactory(collectionQueryGroup());
      params.conditions.push(buildGroup(group, "AND"));
      return query;
    },
    orWhere(groupFactory) {
      const group = groupFactory(collectionQueryGroup());
      params.conditions.push(buildGroup(group, "OR"));
      return query;
    },
    path(path) {
      return query.where("path", "=", withoutTrailingSlash(path));
    },
    skip(skip) {
      params.offset = skip;
      return query;
    },
    where(field, operator, value) {
      query.andWhere((group) => group.where(String(field), operator, value));
      return query;
    },
    limit(limit) {
      params.limit = limit;
      return query;
    },
    select(...fields) {
      if (fields.length) {
        params.selectedFields.push(...fields);
      }
      return query;
    },
    order(field, direction) {
      params.orderBy.push(`"${String(field)}" ${direction}`);
      return query;
    },
    async all() {
      return fetch(collection, buildQuery()).then((res) => res || []);
    },
    async first() {
      return fetch(collection, buildQuery({ limit: 1 })).then((res) => res[0] || null);
    },
    async count(field = "*", distinct = false) {
      return fetch(collection, buildQuery({
        count: { field: String(field), distinct }
      })).then((m) => m[0].count);
    }
  };
  function buildQuery(opts = {}) {
    let query2 = "SELECT ";
    if (opts?.count) {
      query2 += `COUNT(${opts.count.distinct ? "DISTINCT " : ""}${opts.count.field}) as count`;
    } else {
      const fields = Array.from(new Set(params.selectedFields));
      query2 += fields.length > 0 ? fields.map((f) => `"${String(f)}"`).join(", ") : "*";
    }
    query2 += ` FROM ${tables[String(collection)]}`;
    if (params.conditions.length > 0) {
      query2 += ` WHERE ${params.conditions.join(" AND ")}`;
    }
    if (params.orderBy.length > 0) {
      query2 += ` ORDER BY ${params.orderBy.join(", ")}`;
    } else {
      query2 += ` ORDER BY stem ASC`;
    }
    const limit = opts?.limit || params.limit;
    if (limit > 0) {
      if (params.offset > 0) {
        query2 += ` LIMIT ${limit} OFFSET ${params.offset}`;
      } else {
        query2 += ` LIMIT ${limit}`;
      }
    }
    return query2;
  }
  return query;
};
function singleQuote(value) {
  return `'${String(value).replace(/'/g, "''")}'`;
}
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
async function fetchQuery(event, collection, sql) {
  return fetchContent(event, collection, "query", {
    headers: {
      "content-type": "application/json"
    },
    method: "POST",
    body: {
      sql
    }
  });
}
const queryCollection = (collection) => {
  const event = tryUseNuxtApp()?.ssrContext?.event;
  return collectionQueryBuilder(collection, (collection2, sql) => executeContentQuery(event, collection2, sql));
};
async function executeContentQuery(event, collection, sql) {
  {
    return fetchQuery(event, String(collection), sql);
  }
}

export { queryCollection as q };
//# sourceMappingURL=client-DqbjtPWP.mjs.map
