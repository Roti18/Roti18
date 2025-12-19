import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { db } from '$lib/server/db';
import { socialLinks } from '$lib/server/db/schema';

export const actions: Actions = {
	default: async ({ request }) => {
		const data = await request.formData();

		const name = data.get('name')?.toString().trim();
		const url = data.get('url')?.toString().trim();

		if (!name || !url) {
			return fail(400, { message: 'Name and URL are required' });
		}

		await db.insert(socialLinks).values({
			name,
			url
		});

		throw redirect(303, '/dashboard/social');
	}
};
