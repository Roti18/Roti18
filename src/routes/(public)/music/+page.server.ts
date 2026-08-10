import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { music } from '$lib/server/db/schema';
import { desc } from 'drizzle-orm';

export const load: PageServerLoad = async ({ url }) => {
	try {
		const limitParam = url.searchParams.get('limit');
		const limit = limitParam ? parseInt(limitParam) : 20;

		const tracks = await db.query.music.findMany({
			orderBy: [desc(music.playedAt)],
			limit: limit
		});

		return { tracks, limit };
	} catch (err) {
		console.error('Failed to load music tracks from DB:', err);
		return { tracks: [] };
	}
};
