import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { galleryPhoto } from '$lib/server/db/schema';
import { desc } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	try {
		const offset = Number(url.searchParams.get('offset')) || 0;
		const limit = Number(url.searchParams.get('limit')) || 20;

		const photos = await db
			.select()
			.from(galleryPhoto)
			.orderBy(desc(galleryPhoto.createdAt))
			.limit(limit)
			.offset(offset);

		return json({ photos });
	} catch (err) {
		console.error('Failed to fetch gallery photos:', err);
		return json({ photos: [], error: 'Failed to fetch photos' }, { status: 500 });
	}
};
