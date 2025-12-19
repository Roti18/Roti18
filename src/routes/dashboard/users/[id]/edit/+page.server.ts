import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import { user } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { redirect, fail } from '@sveltejs/kit';
import { put, del } from '@vercel/blob';

export const load: PageServerLoad = async ({ params }) => {
	const userId = params.id;

	const result = await db.select().from(user).where(eq(user.id, userId)).limit(1);

	if (result.length === 0) {
		return {
			user: null
		};
	}

	return {
		user: result[0]
	};
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

		// ambil user lama
		const existing = await db
			.select({ image: user.image })
			.from(user)
			.where(eq(user.id, params.id!))
			.limit(1);

		if (existing.length === 0) {
			return fail(404, { message: 'User not found' });
		}

		let imageUrl = existing[0].image;

		// kalau upload avatar baru
		if (imageFile instanceof File && imageFile.size > 0) {
			const filename = `avatars/${crypto.randomUUID()}-${imageFile.name}`;

			const blob = await put(filename, imageFile, {
				access: 'public'
			});

			imageUrl = blob.url;

			// hapus avatar lama
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
