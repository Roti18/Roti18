import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { db } from '$lib/server/db';
import { projects } from '$lib/server/db/schema';
import { put } from '@vercel/blob';

export const actions: Actions = {
	default: async ({ request }) => {
		const data = await request.formData();

		const title = data.get('title')?.toString();
		const subtitle = data.get('subtitle')?.toString();
		const description = data.get('description')?.toString();
		const url = data.get('url')?.toString();
		const imageFile = data.get('image');

		if (!title || !subtitle || !description || !url) {
			return fail(400, { message: 'All fields are required' });
		}

		if (!(imageFile instanceof File)) {
			return fail(400, { message: 'Image is required' });
		}

		const filename = `${crypto.randomUUID()}-${imageFile.name}`;

		const blob = await put(filename, imageFile, {
			access: 'public'
		});

		await db.insert(projects).values({
			title,
			subtitle,
			description,
			image: blob.url,
			url
		});

		throw redirect(303, '/dashboard/projects');
	}
};
