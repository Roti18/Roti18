import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import { user } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { redirect, fail } from '@sveltejs/kit';
import { put, del } from '@vercel/blob';
import sharp from 'sharp';

function normalizeName(name: string) {
	return name
		.toLowerCase()
		.trim()
		.replace(/[^\w\s-]/g, '')
		.replace(/\s+/g, '-');
}

export const load: PageServerLoad = async ({ params }) => {
	const result = await db.select().from(user).where(eq(user.id, params.id!)).limit(1);

	return { user: result[0] ?? null };
};

export const actions: Actions = {
	update: async ({ request, params }) => {
		const data = await request.formData();

		const email = data.get('email')?.toString();
		const name = data.get('name')?.toString() || null;
		const imageFile = data.get('image');

		if (!email) {
			return fail(400, { message: 'Email is required' });
		}

		const existing = await db
			.select({ image: user.image })
			.from(user)
			.where(eq(user.id, params.id!))
			.limit(1);

		if (!existing.length) {
			return fail(404, { message: 'User not found' });
		}

		let imageUrl = existing[0].image;

		if (imageFile instanceof File && imageFile.size > 0 && name) {
			const buffer = Buffer.from(await imageFile.arrayBuffer());

			const webpBuffer = await sharp(buffer)
				.resize(512, 512, { fit: 'cover' })
				.webp({ quality: 80 })
				.toBuffer();

			const folder = normalizeName(name);
			const path = `avatars/${folder}/avatar.webp`;

			const blob = await put(path, webpBuffer, {
				access: 'public',
				contentType: 'image/webp'
			});

			imageUrl = blob.url;

			if (existing[0].image) {
				try {
					await del(existing[0].image);
				} catch (err) {
					console.error('Failed to delete old avatar', err);
				}
			}
		}

		await db
			.update(user)
			.set({
				email,
				name,
				image: imageUrl
			})
			.where(eq(user.id, params.id!));

		throw redirect(303, '/dashboard/users');
	}
};
