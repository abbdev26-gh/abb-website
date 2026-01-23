import { readdir } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { defineEventHandler } from 'h3';

export default defineEventHandler(async () => {
    const publicDir = join(process.cwd(), 'public');
    const imagesDir = join(publicDir, 'images');

    async function getFiles(dir: string): Promise<string[]> {
        const entries = await readdir(dir, { withFileTypes: true });
        const files = await Promise.all(entries.map((res: any) => {
            const resPath = join(dir, res.name);
            return res.isDirectory() ? getFiles(resPath) : resPath;
        }));
        return Array.prototype.concat(...files);
    }

    try {
        const allFiles = await getFiles(imagesDir);
        const relativePaths = allFiles
            .filter(file => /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(file))
            .map(file => '/' + relative(publicDir, file));

        return relativePaths;
    } catch (error: any) {
        return [];
    }
});
