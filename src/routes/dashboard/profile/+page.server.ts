import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { profile } from '$lib/server/db/schema';

export const load: PageServerLoad = async () => {
	const profiles = await db.select().from(profile);
	return { profiles };
};
