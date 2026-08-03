import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { galleryPhoto } from '$lib/server/db/schema';
import { desc } from 'drizzle-orm';

export const load: PageServerLoad = async () => {
	const photos = await db
		.select()
		.from(galleryPhoto)
		.orderBy(desc(galleryPhoto.createdAt));

	return {
		photos
	};
};
