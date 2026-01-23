
export default defineCachedEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const target = event.context.params?._
    const strapiUrl = config.strapiUpstreamUrl || 'http://localhost:1337'

    // Construct the full URL for the upstream request
    // Ensure we don't have double slashes if target starts with /
    const path = target?.startsWith('/') ? target : `/${target}`
    const url = `${strapiUrl}${path}`

    // Only log if we are actually executing the handler (cache miss or bypass)
    console.log(`[Strapi Proxy] Requesting: ${url}`)
    const authHeader = event.headers.get('authorization')
    console.log(`[Strapi Proxy] Auth Header: ${authHeader ? 'Present' : 'Missing'}`)

    try {
        const response = await $fetch(url, {
            method: event.method,
            headers: {
                'Content-Type': 'application/json',
                ...(authHeader ? { 'Authorization': authHeader } : {}),
            },
            // Forward query parameters
            query: getQuery(event),
            // Forward body for non-GET requests
            ...(event.method !== 'GET' ? { body: await readBody(event).catch(() => undefined) } : {})
        })
        console.log(`[Strapi Proxy] Response from Strapi:`, typeof response, Object.keys(response || {}))
        return response
    } catch (error: any) {
        // Forward error status code
        console.error(`[Strapi Proxy] Error fetching ${url}:`, error.message)
        event.node.res.statusCode = error.statusCode || 500
        return error.data || { error: 'Internal Server Error' }
    }
}, {
    swr: true,
    maxAge: 60 * 60 * 24 * 7, // 7 days
    getKey: (event) => {
        // Cache key based on path AND authorization header to prevent data leakage
        const auth = event.headers.get('authorization') || 'public'
        return `${event.path}-${auth}`
    },
    shouldBypassCache: (event) => {
        // Only cache GET requests
        return event.method !== 'GET'
    }
})
