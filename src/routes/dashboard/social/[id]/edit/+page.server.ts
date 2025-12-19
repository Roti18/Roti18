import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import { socialLinks } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { redirect, fail, error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	const id = Number(params.id);
	if (!id || Number.isNaN(id)) throw error(404, 'Not found');

	const result = await db.select().from(socialLinks).where(eq(socialLinks.id, id)).limit(1);

	if (!result.length) throw error(404, 'Not found');
	return { socialLink: result[0] };
};

export const actions: Actions = {
	default: async ({ request, params }) => {
		const id = Number(params.id);
		if (!id || Number.isNaN(id)) return fail(400, { message: 'Invalid ID' });

		const data = await request.formData();

		const name = data.get('name')?.toString().trim();
		const url = data.get('url')?.toString().trim();

		if (!name || !url) {
			return fail(400, { message: 'Name and URL are required' });
		}

		await db
			.update(socialLinks)
			.set({
				name,
				url
			})
			.where(eq(socialLinks.id, id));

		throw redirect(303, '/dashboard/social');
	}
};
