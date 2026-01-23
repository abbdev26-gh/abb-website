
import { fetch } from 'ofetch';

const STRAPI_URL = 'http://localhost:1337';
const TOKEN = '1d783e096b05e2d74b6afa8ecbe3bc8d87b9d5f424dc6771958541f1a3dcd3882f7376962b4d128bd9c4d56911c07253d92e931442cab22dc0ab422581c78c543b0457f4d005017cb18f1a983be672abcb4b5bbf4b412c3514547855a523af3e9f4b623187a7c7db433e9ac0c79ab4c728d7b5cf7a44925d0cc445d9c9fcc8ec';

async function checkData() {
    console.log(`Checking Strapi directly at ${STRAPI_URL}...`);

    try {
        const headers = {
            Authorization: `Bearer ${TOKEN}`
        };

        // Check About Page Values (Mission/Vision)
        console.log('\n--- Checking About Page Values ---');
        // Using the same query params as the frontend logic
        const aboutRes = await fetch(`${STRAPI_URL}/api/about-page?populate[values]=true`, { headers });

        if (aboutRes?.data?.values && aboutRes.data.values.length > 0) {
            console.log(`✅ Found ${aboutRes.data.values.length} values:`);
            aboutRes.data.values.forEach(v => console.log(`   - ${v.title}`));
        } else {
            console.log('❌ No values found in About Page.');
            console.log('Raw response:', JSON.stringify(aboutRes?.data, null, 2));
        }

        // Check Testimonials
        console.log('\n--- Checking Testimonials ---');
        const testimonialsRes = await fetch(`${STRAPI_URL}/api/testimonials?populate=*`, { headers });

        if (testimonialsRes?.data && testimonialsRes.data.length > 0) {
            console.log(`✅ Found ${testimonialsRes.data.length} testimonials:`);
            testimonialsRes.data.forEach(t => console.log(`   - ${t.name} (Role: ${t.role})`));
        } else {
            console.log('❌ No testimonials found.');
            console.log('Raw response:', JSON.stringify(testimonialsRes?.data, null, 2));
        }

    } catch (error) {
        console.error('Error fetching data from Strapi:', error);
    }
}

checkData();
