
import { fetch } from 'ofetch';

const BASE_URL = 'http://localhost:3000'; // Adjust if running on a different port

async function verifyCache() {
    const endpoint = '/'; // Test home page
    const url = `${BASE_URL}${endpoint}`;

    console.log(`Testing cache on ${url}...`);

    try {
        // First request (Cache miss)
        const start1 = performance.now();
        await fetch(url);
        const end1 = performance.now();
        const time1 = end1 - start1;
        console.log(`1st Request: ${time1.toFixed(2)}ms`);

        // Second request (Possible Cache hit)
        const start2 = performance.now();
        await fetch(url);
        const end2 = performance.now();
        const time2 = end2 - start2;
        console.log(`2nd Request: ${time2.toFixed(2)}ms`);

        if (time2 < time1) {
            console.log('✅ Success: 2nd request was faster, indicating caching might be working.');
        } else {
            console.log('⚠️ Warning: 2nd request was not significantly faster. Check if caching is enabled or if network latency is fluctuating.');
        }

    } catch (error) {
        console.error('Error during verification:', error);
        console.log('Ensure the Nuxt server is running (npm run dev/build+start) before running this script.');
    }
}

verifyCache();
