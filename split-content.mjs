
import fs from 'node:fs';
import path from 'node:path';

const contentDir = './content';

const mappings = [
    {
        file: 'team.json',
        dir: 'team',
        arrayKey: 'teamMember',
        idKey: 'name',
        useSlug: false // use slugify on idKey
    },
    {
        file: 'testimonials.json',
        dir: 'testimonials',
        arrayKey: 'testimonials',
        idKey: 'name',
        useSlug: false
    },
    {
        file: 'partners.json',
        dir: 'partners',
        arrayKey: 'partners',
        idKey: 'name',
        useSlug: false
    },
    {
        file: 'locations.json',
        dir: 'locations',
        arrayKey: 'locations',
        idKey: 'slug',
        useSlug: true // idKey is already a slug
    }
];

function slugify(text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
}

mappings.forEach(mapping => {
    const filePath = path.join(contentDir, mapping.file);
    if (!fs.existsSync(filePath)) {
        console.log(`Skipping ${mapping.file} (not found)`);
        return;
    }

    const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const items = content[mapping.arrayKey];

    if (!items || !Array.isArray(items)) {
        console.log(`Skipping ${mapping.file} (array key '${mapping.arrayKey}' not found or valid)`);
        return;
    }

    const targetDir = path.join(contentDir, mapping.dir);
    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
    }

    items.forEach(item => {
        let filename;
        if (mapping.useSlug) {
            filename = item[mapping.idKey];
        } else {
            filename = slugify(item[mapping.idKey]);
        }

        // Handle duplicates or missing keys
        if (!filename) {
            filename = `item-${Math.random().toString(36).substring(7)}`;
        }

        const targetPath = path.join(targetDir, `${filename}.json`);
        fs.writeFileSync(targetPath, JSON.stringify(item, null, 2));
        console.log(`Created ${targetPath}`);
    });

    // Optionally define schema or log success
    console.log(`Split ${mapping.file} into ${items.length} files in ${targetDir}`);

    // Rename original file to avoid conflicts (optional, but good for cleanup)
    fs.renameSync(filePath, `${filePath}.bak`);
});
