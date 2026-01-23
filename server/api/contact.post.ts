import { Resend } from 'resend';
import { defineEventHandler, readBody, createError } from 'h3';

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    const body = await readBody(event);

    const { firstName, lastName, email, phone, message } = body;

    // Validate required fields
    if (!firstName || !email || !message) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Missing required fields (First Name, Email, and Message are required)',
        });
    }

    if (!config.resendApiKey) {
        console.error('RESEND_API_KEY is not configured');
        throw createError({
            statusCode: 500,
            statusMessage: 'Email service is not configured correctly',
        });
    }

    const resend = new Resend(config.resendApiKey);

    try {
        const { data, error } = await resend.emails.send({
            from: config.resendFromEmail || 'onboarding@resend.dev',
            to: config.contactReceiverEmail || 'cnaallotey@gmail.com', // Fallback for debugging if needed
            subject: `New Contact Form Submission from ${firstName} ${lastName}`,
            html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
        });

        if (error) {
            console.error('Resend error:', error);
            throw createError({
                statusCode: 500,
                statusMessage: `Failed to send email: ${error.message}`,
            });
        }

        return { success: true, id: data?.id };
    } catch (err: any) {
        console.error('Submission error:', err);
        throw createError({
            statusCode: 500,
            statusMessage: err.statusMessage || 'Internal Server Error',
        });
    }
});
