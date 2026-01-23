
import fs from 'fs';
import path from 'path';

const STRAPI_URL = 'https://tidy-friend-384c97c42d.strapiapp.com';
const STRAPI_TOKEN = 'ec003f801094d84510e6b279612986c4506461b5ba974d0f1336bad32c1d9340776820a838ed8eccf06f198a6ad78878834bbb666c02b931228fc33d14ed9df5f6d2672e616b973bccedbf8d43424fc97a12957f0796db0aeab1193b8026017facd02d3103d49eebb31b533274edc80a0e79f41d96222fd62d892f2bd87d05fa';

const MAPPINGS = [
    {
        name: 'hero',
        endpoint: '/api/pages?populate[blocks][on][shared.hero-section][populate][heroCTA]=true',
        transform: (data) => {
            // Find Home page data
            const home = data.find(p => p.slug === 'home');
            const heroBlock = home?.blocks.find(b => b.__component === 'shared.hero-section');
            return heroBlock || {};
        },
        output: 'content/hero.json'
    },
    {
        name: 'home_about',
        endpoint: '/api/home-about-section?populate=*',
        transform: (data) => data, // Save as is (attributes flattened by our generic fetcher hopefully)
        output: 'content/home_about.json',
        isSingle: true
    },
    {
        name: 'about',
        endpoint: '/api/about-page?populate[stats]=true',
        transform: (data) => data,
        output: 'content/about.json',
        isSingle: true
    },
    {
        name: 'testimonials',
        endpoint: '/api/testimonials?populate=*',
        transform: (data) => ({ testimonials: data }), // Wrap in object
        output: 'content/testimonials.json'
    },
    {
        name: 'partners',
        endpoint: '/api/pages?filters[slug]=home&populate[blocks][on][shared.trusted-companies-section][populate][partners][populate]=*',
        transform: (data) => {
            const home = data[0];
            const partnerBlock = home?.blocks.find(b => b.__component === 'shared.trusted-companies-section');
            return { partners: partnerBlock?.partners || [] };
        },
        output: 'content/partners.json'
    },
    {
        name: 'services',
        endpoint: '/api/services?populate[workspaceSolutions]=true&populate[programComparisons]=true&populate[virtualPresence][populate]=*&populate[serviceImage]=true&populate[featuresList]=true&populate[virtualOffices]=true&populate[masterclasses]=true',
        transform: (data) => data,
        outputDir: 'content/services', // Special handling
        splitBy: 'slug'
    },
    {
        name: 'gallery',
        endpoint: '/api/pages?filters[slug]=gallery&populate[blocks][on][shared.gallery-section][populate][images]=true',
        transform: (data) => {
            const page = data[0];
            const galleryBlocks = page?.blocks.filter(b => b.__component === 'shared.gallery-section') || [];
            return {
                sections: galleryBlocks.map(b => ({
                    id: b.id,
                    title: b.title,
                    description: b.description,
                    images: b.images || []
                }))
            };
        },
        output: 'content/gallery.json'
    },
    {
        name: 'locations',
        endpoint: '/api/locations',
        transform: (data) => ({ locations: data }),
        output: 'content/locations.json'
    },
    {
        name: 'membership',
        endpoint: '/api/benefit-section?populate[listItems]=*&populate[cta]=*&populate[sectionImage]=true',
        transform: (data) => data,
        output: 'content/membership.json',
        isSingle: true
    },
    {
        name: 'contact_hero',
        endpoint: '/api/pages?filters[slug][$eq]=contact-us&populate[blocks][on][shared.contact-section][populate][contactOptions]=true',
        transform: (data) => {
            const page = data[0];
            const block = page?.blocks.find(b => b.__component === 'shared.contact-section');
            return block || {};
        },
        output: 'content/contact.json'
    },
    {
        name: 'cta',
        endpoint: '/api/pages?filters[slug][$eq]=home&populate[blocks][on][shared.cta-section][populate][cta]=true',
        transform: (data) => {
            const page = data[0];
            const block = page?.blocks.find(b => b.__component === 'shared.cta-section');
            return block || {};
        },
        output: 'content/cta.json'
    }
];

function processImages(obj) {
    if (!obj) return obj;
    if (typeof obj !== 'object') return obj;

    // Check if it's an image object (has url and probably ext/mime)
    if (obj.url && typeof obj.url === 'string' && obj.url.startsWith('/')) {
        obj.url = `${STRAPI_URL}${obj.url}`;
    }

    for (const key in obj) {
        if (Array.isArray(obj[key])) {
            obj[key] = obj[key].map(item => processImages(item));
        } else if (typeof obj[key] === 'object') {
            obj[key] = processImages(obj[key]);
        }
    }
    return obj;
}

async function fetchData() {
    for (const mapping of MAPPINGS) {
        try {
            console.log(`Fetching ${mapping.name}...`);
            const response = await fetch(`${STRAPI_URL}${mapping.endpoint}`, {
                headers: { Authorization: `Bearer ${STRAPI_TOKEN}` }
            });

            if (!response.ok) throw new Error(`Failed to fetch ${mapping.name}: ${response.status}`);

            const json = await response.json();

            // Strapi v4/v5 response structure handling
            // Usually { data: ... }
            // If single type: data is object. If collection: data is array.
            // But populate=* might return complex structures.

            let rawData = json.data;
            if (!rawData && json.data === null) rawData = null; // Single type might differ

            // Apply image processing to raw data first
            rawData = processImages(rawData);

            const content = mapping.transform(rawData);

            if (mapping.outputDir) {
                // Handle split (Services)
                if (!fs.existsSync(mapping.outputDir)) fs.mkdirSync(mapping.outputDir, { recursive: true });

                if (Array.isArray(content)) {
                    content.forEach(item => {
                        const filename = item[mapping.splitBy] || item.id || 'unknown';
                        const filePath = path.join(mapping.outputDir, `${filename}.json`);
                        fs.writeFileSync(filePath, JSON.stringify(item, null, 2));
                        console.log(`Saved ${mapping.name} item to ${filePath}`);
                    });
                }
            } else {
                const dir = path.dirname(mapping.output);
                if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
                fs.writeFileSync(mapping.output, JSON.stringify(content, null, 2));
                console.log(`Saved ${mapping.name} to ${mapping.output}`);
            }

        } catch (error) {
            console.error(`Error processing ${mapping.name}:`, error.message);
        }
    }
}

fetchData();
