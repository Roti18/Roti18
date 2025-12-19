import { put } from '@vercel/blob';

import { json } from '@sveltejs/kit';

export async function POST({ request, locals }) {
	if (!locals.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const formData = await request.formData();
	const file = formData.get('file') as File;

	if (!file) {
		return json({ error: 'File kosong' }, { status: 400 });
	}

	if (file.size > 5_000_000) {
		return json({ error: 'Max 5MB' }, { status: 400 });
	}

	const filename = `${crypto.randomUUID()}-${file.name}`;

	const blob = await put(filename, file, {
		access: 'public'
	});

	return json({
		url: blob.url
	});
}
