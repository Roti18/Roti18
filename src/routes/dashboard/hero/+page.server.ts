import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { hero } from '$lib/server/db/schema';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	try {
		const heroes = await db.select().from(hero);
		return {
			heroes
		};
	} catch (e) {
		console.error('Failed to load hero section data:', e);
		throw error(500, 'Failed to load hero section data.');
	}
};
