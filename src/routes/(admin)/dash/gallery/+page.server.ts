import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import { galleryPhoto } from '$lib/server/db/schema';
import { eq, asc, desc } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	const photos = await db
		.select()
		.from(galleryPhoto)
		.orderBy(asc(galleryPhoto.sortOrder), desc(galleryPhoto.createdAt));

	return {
		photos
	};
};

export const actions: Actions = {
	createPhoto: async ({ request }) => {
		const formData = await request.formData();
		const title = formData.get('title')?.toString().trim();
		const slug = formData.get('slug')?.toString().trim() || title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
		const imageUrl = formData.get('imageUrl')?.toString().trim();
		const shortDesc = formData.get('shortDesc')?.toString().trim() || null;
		const cameraDesc = formData.get('cameraDesc')?.toString().trim() || null;
		const sortOrderStr = formData.get('sortOrder')?.toString().trim();
		const sortOrder = sortOrderStr ? parseInt(sortOrderStr, 10) : 0;

		if (!title || !imageUrl) {
			return fail(400, { error: 'Title and Image URL are required' });
		}

		await db.insert(galleryPhoto).values({
			id: crypto.randomUUID(),
			slug: slug || `photo-${Date.now()}`,
			title,
			imageUrl,
			shortDesc,
			cameraDesc,
			sortOrder,
			createdAt: new Date()
		});

		return { success: true, message: 'Photo created successfully' };
	},

	updatePhoto: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id')?.toString();
		const title = formData.get('title')?.toString().trim();
		const slug = formData.get('slug')?.toString().trim();
		const imageUrl = formData.get('imageUrl')?.toString().trim();
		const shortDesc = formData.get('shortDesc')?.toString().trim() || null;
		const cameraDesc = formData.get('cameraDesc')?.toString().trim() || null;
		const sortOrderStr = formData.get('sortOrder')?.toString().trim();
		const sortOrder = sortOrderStr ? parseInt(sortOrderStr, 10) : 0;

		if (!id || !title || !imageUrl) {
			return fail(400, { error: 'ID, Title and Image URL are required' });
		}

		await db
			.update(galleryPhoto)
			.set({
				title,
				slug: slug || undefined,
				imageUrl,
				shortDesc,
				cameraDesc,
				sortOrder
			})
			.where(eq(galleryPhoto.id, id));

		return { success: true, message: 'Photo updated successfully' };
	},

	deletePhoto: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id')?.toString();

		if (!id) {
			return fail(400, { error: 'Missing photo ID' });
		}

		await db.delete(galleryPhoto).where(eq(galleryPhoto.id, id));

		return { success: true, message: 'Photo deleted successfully' };
	}
};
