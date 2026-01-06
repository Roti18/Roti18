import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { profile } from '$lib/server/db/schema';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ depends }) => {
	depends('app:profile');

	try {
		const profiles = await db.select().from(profile);
		return { profiles };
	} catch (e) {
		console.error('Failed to load profile data:', e);
		throw error(500, 'Failed to load profile data.');
	}
};
