import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { socialLinks } from '$lib/server/db/schema';
import { desc } from 'drizzle-orm';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	try {
		const allSocialLinks = await db.select().from(socialLinks).orderBy(desc(socialLinks.id));

		return {
			socialLinks: allSocialLinks
		};
	} catch (e) {
		console.error('Failed to load social links:', e);
		throw error(500, 'Failed to load social link data.');
	}
};
