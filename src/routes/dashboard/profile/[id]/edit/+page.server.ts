import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import { profile } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { redirect, fail, error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	try {
		const profileId = parseInt(params.id, 10);
		if (isNaN(profileId)) {
			throw error(404, 'Not found');
		}

		const result = await db.select().from(profile).where(eq(profile.id, profileId)).limit(1);

		if (result.length === 0) {
			throw error(404, 'Not found');
		}

		return {
			profile: result[0]
		};
	} catch (e) {
		if (e instanceof Error && 'status' in e && typeof e.status === 'number') {
			throw e; // Re-throw SvelteKit's own errors
		}
		console.error('Failed to load profile for editing:', e);
		throw error(500, 'Failed to load profile data.');
	}
};

export const actions: Actions = {
	update: async ({ request, params }) => {
		const profileId = parseInt(params.id!, 10);
		if (isNaN(profileId)) {
			return fail(400, { message: 'Invalid profile ID' });
		}

		const data = await request.formData();
		const title = data.get('title')?.toString();
		const leftText = data.get('leftContent')?.toString();
		const rightText = data.get('rightContent')?.toString();

		if (!title || !leftText || !rightText) {
			return fail(400, { message: 'Semua field wajib diisi' });
		}

		try {
			const updated = await db
				.update(profile)
				.set({
					title,
					leftText,
					rightText
				})
				.where(eq(profile.id, profileId))
				.returning({ id: profile.id });

			if (updated.length === 0) {
				throw error(404, 'Profile not found to update.');
			}
		} catch (e) {
			if (e instanceof Error && 'status' in e && typeof e.status === 'number') {
				throw e; // Re-throw SvelteKit's own errors
			}
			console.error('Failed to update profile:', e);
			throw error(500, 'Failed to update profile due to a server error.');
		}

		throw redirect(303, '/dashboard/profile');
	}
};
