import { db } from '$lib/server/db';
import { profile } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ params, locals }) => {
	if (!locals.user) {
		throw error(401, 'Unauthorized');
	}

	try {
		const id = Number(params.id);

		if (isNaN(id)) {
			throw error(400, 'Invalid profile ID');
		}

		const existing = await db
			.select({ id: profile.id })
			.from(profile)
			.where(eq(profile.id, id))
			.limit(1);

		if (existing.length === 0) {
			throw error(404, 'Profile not found');
		}

		await db.delete(profile).where(eq(profile.id, id));

		return json({ success: true });
	} catch (e) {
		if (e instanceof Error && 'status' in e && typeof e.status === 'number') {
			throw e; // Re-throw SvelteKit's own errors
		}
		console.error('Failed to delete profile section:', e);
		throw error(500, 'Failed to delete profile section due to a server error.');
	}
};
