import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { music } from '$lib/server/db/schema';
import { asc } from 'drizzle-orm';

export const load: PageServerLoad = async () => {
	try {
		const tracks = await db.query.music.findMany({
			orderBy: [asc(music.sortOrder)]
		});

		return { tracks };
	} catch (err) {
		console.error('Failed to load music tracks from DB:', err);
		return { tracks: [] };
	}
};
