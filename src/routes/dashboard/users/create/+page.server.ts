import type { Actions } from './$types';
import { db } from '$lib/server/db';
import { user } from '$lib/server/db/schema';
import { fail } from '@sveltejs/kit';
import { nanoid } from 'nanoid';
import bcrypt from 'bcryptjs';
import { put } from '@vercel/blob';

export const actions: Actions = {
	create: async ({ request }) => {
		const form = await request.formData();

		const email = form.get('email')?.toString();
		const password = form.get('password')?.toString();
		const name = form.get('name')?.toString() || null;
		const imageFile = form.get('image');

		if (!email || !password) {
			return fail(400, {
				error: 'Email and password are required'
			});
		}

		const passwordHash = await bcrypt.hash(password, 10);

		let imageUrl: string | null = null;

		if (imageFile instanceof File && imageFile.size > 0) {
			const filename = `avatars/${nanoid()}-${imageFile.name}`;

			const blob = await put(filename, imageFile, {
				access: 'public'
			});

			imageUrl = blob.url;
		}

		await db.insert(user).values({
			id: nanoid(),
			email,
			passwordHash,
			name,
			image: imageUrl
		});

		return { success: true };
	}
};
