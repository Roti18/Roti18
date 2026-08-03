import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { galleryPhoto } from '$lib/server/db/schema';
import { asc } from 'drizzle-orm';

export const load: PageServerLoad = async () => {
	try {
		const photos = await db.query.galleryPhoto.findMany({
			orderBy: [asc(galleryPhoto.sortOrder)]
		});

		return { photos };
	} catch (err) {
		console.error('Failed to load gallery photos from DB:', err);
		return { photos: [] };
	}
};
