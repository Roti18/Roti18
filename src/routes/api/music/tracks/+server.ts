import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { music } from '$lib/server/db/schema';
import { desc } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	try {
		const offset = Number(url.searchParams.get('offset')) || 0;
		const limit = Number(url.searchParams.get('limit')) || 20;

		const tracks = await db.query.music.findMany({
			orderBy: [desc(music.playedAt)],
			limit: limit,
			offset: offset
		});

		return json({ tracks });
	} catch (err) {
		console.error('Failed to fetch music tracks:', err);
		return json({ tracks: [], error: 'Failed to fetch tracks' }, { status: 500 });
	}
};
