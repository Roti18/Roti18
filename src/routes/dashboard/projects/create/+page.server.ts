import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { db } from '$lib/server/db';
import { projects } from '$lib/server/db/schema';

export const actions: Actions = {
	default: async ({ request }) => {
		const data = await request.formData();

		const title = data.get('title')?.toString();
		const subtitle = data.get('subtitle')?.toString();
		const description = data.get('description')?.toString();
		const image = data.get('image')?.toString();
		const url = data.get('url')?.toString();

		if (!title || !subtitle || !description || !image || !url) {
			return fail(400, { message: 'All fields are required' });
		}

		await db.insert(projects).values({
			title,
			subtitle,
			description,
			image,
			url
		});

		throw redirect(303, '/dashboard/projects');
	}
};
