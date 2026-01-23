
const STRAPI_URL = 'http://localhost:1337';
const TOKEN = '1d783e096b05e2d74b6afa8ecbe3bc8d87b9d5f424dc6771958541f1a3dcd3882f7376962b4d128bd9c4d56911c07253d92e931442cab22dc0ab422581c78c543b0457f4d005017cb18f1a983be672abcb4b5bbf4b412c3514547855a523af3e9f4b623187a7c7db433e9ac0c79ab4c728d7b5cf7a44925d0cc445d9c9fcc8ec';

async function run() {
    console.log('Searching for Workspace service...');
    const res = await fetch(`${STRAPI_URL}/api/services?filters[slug][$contains]=workspace`, {
        headers: { Authorization: `Bearer ${TOKEN}` }
    });

    if (!res.ok) {
        console.error('Failed to fetch services:', res.status, await res.text());
        return;
    }

    const json = await res.json();
    const services = json.data;

    if (services.length === 0) {
        console.error('No service found with slug containing "workspace"');
        console.log('Available services:', await fetch(`${STRAPI_URL}/api/services`, { headers: { Authorization: `Bearer ${TOKEN}` } }).then(r => r.json()).then(j => j.data.map(s => s.attributes?.name || s.name)));
        return;
    }

    const service = services[0];
    console.log(`Found service: ${service.attributes ? service.attributes.name : service.name} (ID: ${service.documentId})`);

    const serviceId = service.documentId;

    const virtualPresenceData = [
        {
            title: 'Virtual Presence Solutions',
            description: 'The Virtual Address System allows businesses to leverage our prime location without needing a physical office space, instantly boosting credibility.',
            features: [
                {
                    title: 'Primary/Auxiliary Address',
                    description: 'We provide a primary or auxiliary professional address at our recognized Airport City hub for formal registration and official correspondence.'
                },
                {
                    title: 'Official Registration Address',
                    description: 'Eliminates the credibility gap for new businesses and offshore entities by providing a reputable location for business licensing and registration.'
                },
                {
                    title: 'Full Mail Handling',
                    description: 'Secure reception and management of all physical mail and correspondence.'
                },
                {
                    title: 'Notification & Forwarding',
                    description: 'Prompt client notification of new mail, with secure forwarding services to a designated physical or digital location.'
                }
            ],
            benefitsTitle: 'Why Choose ABB Workspaces?',
            benefits: [
                {
                    title: 'Enhanced Credibility',
                    description: 'Instantly gain a professional reputation with a recognized Airport City address, eliminating the credibility gap.'
                },
                {
                    title: 'Unmatched Flexibility',
                    description: 'Benefit from cost-effective, flexible terms and unrestricted access to both the Tema and Airport City hubs.'
                },
                {
                    title: 'Guaranteed Operational Reliability',
                    description: 'Maintain uninterrupted productivity with a robust infrastructure, including guaranteed power backup and high-speed internet.'
                }
            ]
        }
    ];

    console.log('Updating service...');

    const updateUrl = `${STRAPI_URL}/api/services/${serviceId}`;

    const updateRes = await fetch(updateUrl, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${TOKEN}`
        },
        body: JSON.stringify({
            data: {
                virtualPresence: virtualPresenceData
            }
        })
    });

    if (!updateRes.ok) {
        console.error('Update failed:', updateRes.status, await updateRes.text());
    } else {
        console.log('Successfully updated service content!');
        const updated = await updateRes.json();
        console.log('Result:', JSON.stringify(updated, null, 2));
    }
}

run().catch(console.error);
