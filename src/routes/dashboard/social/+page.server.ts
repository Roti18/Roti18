import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { socialLinks } from '$lib/server/db/schema';
import { desc } from 'drizzle-orm';

export const load: PageServerLoad = async () => {
	const allSocialLinks = await db.select().from(socialLinks).orderBy(desc(socialLinks.id));

	return {
		socialLinks: allSocialLinks
	};
};
