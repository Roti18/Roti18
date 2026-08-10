import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import { galleryPhoto } from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';
import { deleteStorageFile } from '$lib/server/storage';

export const load: PageServerLoad = async () => {
	const photosList = await db
		.select()
		.from(galleryPhoto)
		.orderBy(desc(galleryPhoto.createdAt));

	return {
		photos: photosList
	};
};

export const actions: Actions = {
	createPhoto: async ({ request }) => {
		const formData = await request.formData();
		const title = formData.get('title')?.toString().trim();
		const slug = formData.get('slug')?.toString().trim() || title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
		const imageUrl = formData.get('imageUrl')?.toString().trim();
		const originalUrl = formData.get('originalUrl')?.toString().trim() || null;
		const shortDesc = formData.get('shortDesc')?.toString().trim() || null;
		const cameraDesc = formData.get('cameraDesc')?.toString().trim() || null;
		const createdAtStr = formData.get('createdAt')?.toString().trim();

		let createdAt = new Date();
		if (createdAtStr) {
			const parsed = new Date(createdAtStr);
			if (!isNaN(parsed.getTime())) {
				createdAt = parsed;
			}
		}

		if (!title || !imageUrl) {
			return fail(400, { error: 'Title and Image URL are required' });
		}

		await db.insert(galleryPhoto).values({
			id: crypto.randomUUID(),
			slug: slug || `photo-${Date.now()}`,
			title,
			imageUrl,
			originalUrl,
			shortDesc,
			cameraDesc,
			createdAt
		});

		return { success: true, message: 'Gallery photo added successfully' };
	},

	updatePhoto: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id')?.toString();
		const title = formData.get('title')?.toString().trim();
		const slug = formData.get('slug')?.toString().trim();
		const imageUrl = formData.get('imageUrl')?.toString().trim();
		const originalUrl = formData.get('originalUrl')?.toString().trim() || null;
		const shortDesc = formData.get('shortDesc')?.toString().trim() || null;
		const cameraDesc = formData.get('cameraDesc')?.toString().trim() || null;
		const createdAtStr = formData.get('createdAt')?.toString().trim();

		let createdAt: Date | undefined = undefined;
		if (createdAtStr) {
			const parsed = new Date(createdAtStr);
			if (!isNaN(parsed.getTime())) {
				createdAt = parsed;
			}
		}

		if (!id || !title || !imageUrl) {
			return fail(400, { error: 'ID, Title, and Image URL are required' });
		}

		const existing = await db.query.galleryPhoto.findFirst({
			where: eq(galleryPhoto.id, id)
		});

		if (existing) {
			if (existing.imageUrl && existing.imageUrl !== imageUrl) {
				await deleteStorageFile(existing.imageUrl);
			}
			if (existing.originalUrl && existing.originalUrl !== originalUrl) {
				await deleteStorageFile(existing.originalUrl);
			}
		}

		await db
			.update(galleryPhoto)
			.set({
				title,
				slug: slug || undefined,
				imageUrl,
				originalUrl,
				shortDesc,
				cameraDesc,
				createdAt: createdAt || undefined
			})
			.where(eq(galleryPhoto.id, id));

		return { success: true, message: 'Gallery photo updated successfully' };
	},

	deletePhoto: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id')?.toString();

		if (!id) {
			return fail(400, { error: 'Missing photo ID' });
		}

		const existing = await db.query.galleryPhoto.findFirst({
			where: eq(galleryPhoto.id, id)
		});

		if (existing?.imageUrl) {
			await deleteStorageFile(existing.imageUrl);
		}
		if (existing?.originalUrl) {
			await deleteStorageFile(existing.originalUrl);
		}

		await db.delete(galleryPhoto).where(eq(galleryPhoto.id, id));

		return { success: true, message: 'Gallery photo deleted successfully' };
	}
};
