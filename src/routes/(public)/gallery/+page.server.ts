import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { galleryPhoto } from '$lib/server/db/schema';
import { desc } from 'drizzle-orm';

export const load: PageServerLoad = async ({ setHeaders }) => {
	setHeaders({
		'cache-control': 'public, max-age=60, s-maxage=60'
	});

	const photos = await db
		.select()
		.from(galleryPhoto)
		.orderBy(desc(galleryPhoto.createdAt))
		.limit(20);

	return {
		photos
	};
};
