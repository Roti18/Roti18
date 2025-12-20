import { fail, redirect, error } from '@sveltejs/kit';
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

		try {
			await db.insert(socialLinks).values({
				name,
				url
			});
		} catch (e) {
			console.error('Failed to create social link:', e);
			throw error(500, 'Failed to save social link due to a server error.');
		}

		throw redirect(303, '/dashboard/social');
	}
};
