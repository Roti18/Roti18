import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { writing } from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';
import { groupWritingsByYear } from '$lib/utils/format';

export const load: PageServerLoad = async () => {
	try {
		const published = await db.query.writing.findMany({
			where: eq(writing.published, true),
			orderBy: [desc(writing.createdAt)]
		});

		return {
			groups: groupWritingsByYear(published)
		};
	} catch (err) {
		console.error('Failed to load writings from DB:', err);
		return { groups: [] };
	}
};
