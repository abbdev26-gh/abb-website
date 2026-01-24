import { Forminit } from 'forminit';
import { defineEventHandler, readBody, createError } from 'h3';

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    const body = await readBody(event);

    // Check for Forminit API key
    if (!config.forminitApiKey) {
        console.error('FORMINIT_API_KEY is not configured');
        throw createError({
            statusCode: 500,
            statusMessage: 'Form service is not configured correctly',
        });
    }

    const { firstName, lastName, email, phone, message } = body;

    // Validate required fields
    if (!firstName || !email || !message) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Missing required fields (First Name, Email, and Message are required)',
        });
    }

    const forminit = new Forminit({
        apiKey: config.forminitApiKey,
    });

    const FORM_ID = 't90924betnm';

    try {
        const { data, error } = await forminit.submit(FORM_ID, {
            blocks: [
                {
                    type: 'sender',
                    properties: {
                        email,
                        firstName,
                        lastName,
                        phone: phone || undefined,
                    },
                },
                {
                    type: 'text',
                    name: 'message',
                    value: message,
                },
            ],
        });

        if (error) {
            console.error('Forminit submission error:', error);
            throw createError({
                statusCode: 400,
                statusMessage: error.message || 'Failed to submit form',
            });
        }

        return { success: true, id: data.hashId };

    } catch (err: any) {
        console.error('Submission error:', err);
        // If it's already an h3 error, rethrow it
        if (err.statusCode) {
            throw err;
        }

        throw createError({
            statusCode: 500,
            statusMessage: err.message || 'Internal Server Error',
        });
    }
});
