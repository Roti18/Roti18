import type { Actions } from './$types';
import { db } from '$lib/server/db';
import { user } from '$lib/server/db/schema';
import { fail } from '@sveltejs/kit';
import { nanoid } from 'nanoid';
import bcrypt from 'bcryptjs';

export const actions: Actions = {
	create: async ({ request }) => {
		const form = await request.formData();

		const email = form.get('email')?.toString();
		const password = form.get('password')?.toString();
		const name = form.get('name')?.toString() || null;
		const image = form.get('image')?.toString() || null;

		if (!email || !password) {
			return fail(400, {
				error: 'Email and password are required'
			});
		}

		const passwordHash = await bcrypt.hash(password, 10);

		await db.insert(user).values({
			id: nanoid(),
			email,
			passwordHash,
			name,
			image
		});

		return { success: true };
	}
};
