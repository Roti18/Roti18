import { put } from '@vercel/blob';
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) {
		throw error(401, 'Unauthorized');
	}

	const formData = await request.formData();
	const file = formData.get('file');

	if (!(file instanceof File)) {
		throw error(400, 'File is required');
	}

	if (file.size > 5_000_000) {
		// 5MB
		throw error(413, 'File size cannot exceed 5MB');
	}

	try {
		const filename = `${crypto.randomUUID()}-${file.name}`;
		const blob = await put(filename, file, {
			access: 'public'
		});

		return json({
			url: blob.url
		});
	} catch (e) {
		console.error('File upload failed:', e);
		throw error(500, 'Failed to upload file due to a server error.');
	}
};
