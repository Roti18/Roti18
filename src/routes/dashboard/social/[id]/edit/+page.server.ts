import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import { socialLinks } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { redirect, fail, error } from '@sveltejs/kit';
import { invalidatePublicLanding } from '$lib/server/cache/public';

export const load: PageServerLoad = async ({ params }) => {
	try {
		const id = Number(params.id);
		if (isNaN(id)) throw error(404, 'Not found');

		const result = await db.select().from(socialLinks).where(eq(socialLinks.id, id)).limit(1);

		if (!result.length) throw error(404, 'Not found');
		return { socialLink: result[0] };
	} catch (e) {
		if (e instanceof Error && 'status' in e && typeof e.status === 'number') {
			throw e; // Re-throw SvelteKit's own errors
		}
		console.error('Failed to load social link for editing:', e);
		throw error(500, 'Failed to load social link data.');
	}
};

export const actions: Actions = {
	default: async ({ request, params }) => {
		const id = Number(params.id);
		if (isNaN(id)) return fail(400, { message: 'Invalid ID' });

		const data = await request.formData();
		const name = data.get('name')?.toString().trim();
		const url = data.get('url')?.toString().trim();

		if (!name || !url) {
			return fail(400, { message: 'Name and URL are required' });
		}

		try {
			const updated = await db
				.update(socialLinks)
				.set({
					name,
					url
				})
				.where(eq(socialLinks.id, id))
				.returning({ id: socialLinks.id });

			if (updated.length === 0) {
				throw error(404, 'Social link not found to update.');
			}
		} catch (e) {
			if (e instanceof Error && 'status' in e && typeof e.status === 'number') {
				throw e; // Re-throw SvelteKit's own errors
			}
			throw error(500, 'Failed to update social link due to a server error.');
		}

		invalidatePublicLanding();
		throw redirect(303, '/dashboard/social');
	}
};
