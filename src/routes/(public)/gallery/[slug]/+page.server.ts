import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { galleryPhoto } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ params }) => {
	try {
		const photo = await db.query.galleryPhoto.findFirst({
			where: eq(galleryPhoto.slug, params.slug)
		});

		if (!photo) throw error(404, 'Photo not found');

		return { photo };
	} catch (err: any) {
		if (err?.status === 404) throw err;
		console.error('Failed to load gallery photo from DB:', err);
		throw error(404, 'Photo not found');
	}
};
