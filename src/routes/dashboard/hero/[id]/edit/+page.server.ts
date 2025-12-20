import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import { hero } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { redirect, fail, error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	try {
		const id = parseInt(params.id, 10);
		if (isNaN(id)) {
			throw error(404, 'Not found');
		}

		const result = await db.select().from(hero).where(eq(hero.id, id)).limit(1);

		if (result.length === 0) {
			throw error(404, 'Not found');
		}

		return {
			hero: result[0]
		};
	} catch (e) {
		if (e instanceof Error && 'status' in e && typeof e.status === 'number') {
			throw e; // Re-throw SvelteKit's own errors
		}
		console.error('Failed to load hero data for editing:', e);
		throw error(500, 'Failed to load hero data.');
	}
};

export const actions: Actions = {
	default: async ({ request, params }) => {
		const id = parseInt(params.id, 10);
		if (isNaN(id)) {
			return fail(400, { message: 'Invalid ID' });
		}

		const data = await request.formData();
		const name = data.get('name')?.toString();
		const role = data.get('role')?.toString();
		const tagline = data.get('tagline')?.toString();

		if (!name || !role || !tagline) {
			return fail(400, { message: 'All fields are required' });
		}

		try {
			await db
				.update(hero)
				.set({
					name,
					role,
					tagline
				})
				.where(eq(hero.id, id));
		} catch (e) {
			console.error('Failed to update hero section:', e);
			throw error(500, 'Failed to update hero data due to a server error.');
		}

		throw redirect(303, '/dashboard/hero');
	}
};
