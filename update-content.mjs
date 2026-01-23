
import { fetch } from 'ofetch';

const STRAPI_URL = 'http://localhost:1337';
const TOKEN = '1d783e096b05e2d74b6afa8ecbe3bc8d87b9d5f424dc6771958541f1a3dcd3882f7376962b4d128bd9c4d56911c07253d92e931442cab22dc0ab422581c78c543b0457f4d005017cb18f1a983be672abcb4b5bbf4b412c3514547855a523af3e9f4b623187a7c7db433e9ac0c79ab4c728d7b5cf7a44925d0cc445d9c9fcc8ec';

async function updateContent() {
    console.log('Fetching current About Page data...');
    try {
        // 1. Fetch current data
        const res = await fetch(`${STRAPI_URL}/api/about-page?populate[values]=*`, {
            headers: { Authorization: `Bearer ${TOKEN}` },
            ignoreResponseError: true
        });

        console.log('Fetch Status:', res.status || 'OK'); // ofetch might return body directly if parsed

        if (!res.data && !res.values) { // Check for v4/v5 structure
            console.error('Failed to fetch data. Response:', JSON.stringify(res, null, 2));
            return;
        }

        const currentValues = res.data?.values || res.values || [];
        console.log('Current Values:', currentValues.map(v => v.title));

        // 2. Prepare new values
        const newValues = currentValues.map(item => {
            if (item.title === 'Mission') {
                return {
                    ...item,
                    description: 'To inspire and empower business owners and talented individuals by providing comprehensive business support that leverages technology, resources, and networking.'
                };
            }
            if (item.title === 'Vision' || item.title === 'Vision 2035') {
                return {
                    ...item,
                    title: 'Vision 2035',
                    description: 'To become the leading accelerator in Ghana, fostering over 10,000 success stories of incubated and accelerated businesses, and providing innovative growth opportunities across Africa.'
                };
            }
            return item;
        });

        // If Vision doesn't exist, maybe we should add it? 
        // Assuming it exists for now based on context.

        // 3. Update Strapi
        console.log('Sending update...');
        const updateRes = await fetch(`${STRAPI_URL}/api/about-page`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: {
                data: {
                    values: newValues
                }
            }
        });

        console.log('Update Status:', updateRes?.data ? 'Success' : 'Failed');
        if (updateRes?.data) {
            console.log('Updated Values:', updateRes.data.values.map(v => `${v.title}: ${v.description.substring(0, 20)}...`));
        }

    } catch (error) {
        console.error('Error updating content:', error);
        if (error.data) console.error('Error details:', error.data);
    }
}

updateContent();
