import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { music } from '$lib/server/db/schema';
import { desc } from 'drizzle-orm';

export const load: PageServerLoad = async () => {
	try {
		const tracks = await db.query.music.findMany({
			orderBy: [desc(music.playedAt)],
			limit: 20
		});

		return { tracks, limit: 20 };
	} catch (err) {
		console.error('Failed to load music tracks from DB:', err);
		return { tracks: [] };
	}
};
