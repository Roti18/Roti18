import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { hero } from '$lib/server/db/schema';

export const load: PageServerLoad = async () => {
	const heroes = await db.select().from(hero);
	return {
		heroes
	};
};
