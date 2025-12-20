import type { Actions } from './$types';
import { db } from '$lib/server/db';
import { user } from '$lib/server/db/schema';
import { fail, redirect, error } from '@sveltejs/kit';
import { nanoid } from 'nanoid';
import bcrypt from 'bcryptjs';
import { put } from '@vercel/blob';
import sharp from 'sharp';

function normalizeName(name: string) {
	return name
		.toLowerCase()
		.trim()
		.replace(/[^\w\s-]/g, '')
		.replace(/\s+/g, '-');
}

export const actions: Actions = {
	create: async ({ request }) => {
		try {
			const form = await request.formData();

			const email = form.get('email')?.toString();
			const password = form.get('password')?.toString();
			const name = form.get('name')?.toString() || null;
			const imageFile = form.get('image');

			if (!email || !password) {
				return fail(400, { message: 'Email and password are required' });
			}

			const passwordHash = await bcrypt.hash(password, 10);
			let imageUrl: string | null = null;

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
			}

			await db.insert(user).values({
				id: nanoid(),
				email,
				passwordHash,
				name,
				image: imageUrl
			});
		} catch (e: any) {
			// Check for unique constraint error (specific message may vary by DB)
			if (e.message?.includes('UNIQUE constraint') || e.message?.includes('violates unique constraint')) {
				return fail(409, { message: 'This email is already registered.' });
			}
			console.error('Failed to create user:', e);
			throw error(500, 'Failed to create user due to a server error.');
		}

		throw redirect(303, '/dashboard/users');
	}
};
