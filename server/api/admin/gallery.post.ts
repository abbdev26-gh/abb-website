import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { defineEventHandler, readBody } from 'h3';

export default defineEventHandler(async (event) => {
    const body = await readBody(event);

    if (!body.title || !body.order) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Title and Order are required',
        });
    }

    // Generate filename from title
    const filename = body.title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-') + '.json';
    const filePath = join(process.cwd(), 'content/gallery', filename);

    const content = {
        title: body.title,
        description: body.description || '',
        images: body.images || [],
        order: Number(body.order)
    };

    try {
        await writeFile(filePath, JSON.stringify(content, null, 2), 'utf-8');
        return { success: true, filename };
    } catch (error: any) {
        throw createError({
            statusCode: 500,
            statusMessage: `Failed to save file: ${error.message}`,
        });
    }
});
