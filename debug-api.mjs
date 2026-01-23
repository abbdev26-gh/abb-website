
import { fetch } from 'ofetch';

const BASE_URL = 'http://localhost:3000';

async function debugApi() {
    console.log(`Debugging API at ${BASE_URL}...`);

    try {
        // 1. Check About Page Story
        console.log('\n--- 1. About Page Story ---');
        const storyUrl = `${BASE_URL}/api/strapi/api/about-page?populate[story][populate]=*`;
        console.log(`Fetching: ${storyUrl}`);
        try {
            const aboutRes = await fetch(storyUrl, {
                onResponse({ response }) {
                    console.log(`Status: ${response.status} ${response.statusText}`);
                }
            });
            if (aboutRes?.data?.story) {
                console.log(`✅ Story items found: ${aboutRes.data.story.length}`);
            } else {
                console.log('❌ No story data found (Response is OK but empty).');
                console.log('Keys:', Object.keys(aboutRes));
            }
        } catch (e) {
            console.log(`❌ Request failed: ${e.statusCode} ${e.statusMessage}`);
            console.log('Body:', e.data);
        }

        // 2. Check Testimonials
        console.log('\n--- 2. Testimonials ---');
        const testUrl = `${BASE_URL}/api/strapi/api/testimonials?populate[image]=*`;
        try {
            const testRes = await fetch(testUrl, {
                onResponse({ response }) {
                    console.log(`Status: ${response.status} ${response.statusText}`);
                }
            });
            if (testRes?.data && testRes.data.length > 0) {
                console.log(`✅ Testimonials found: ${testRes.data.length}`);
            } else {
                console.log('❌ No testimonials found.');
            }
        } catch (e) {
            console.log(`❌ Request failed: ${e.statusCode} ${e.statusMessage}`);
            console.log('Body:', e.data);
        }

    } catch (error) {
        console.error('❌ Script Error:', error);
    }
}

debugApi();
