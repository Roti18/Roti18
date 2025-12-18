import { fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { user } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import type { Actions } from './$types';

export const actions: Actions = {
	update: async ({ request, params, locals }) => {
		if (!locals.user) {
			return fail(401, { error: 'Unauthorized' });
		}

		const form = await request.formData();
		const password = form.get('password')?.toString().trim();
		const confirmPassword = form.get('confirmPassword')?.toString().trim();

		if (!password || !confirmPassword) {
			return fail(400, { error: 'Password wajib diisi' });
		}

		if (password.length < 8) {
			return fail(400, { error: 'Password minimal 8 karakter' });
		}

		if (password !== confirmPassword) {
			return fail(400, { error: 'Konfirmasi password tidak cocok' });
		}

		const targetUserId = params.id ?? locals.user.id;

		const newHash = await bcrypt.hash(password, 10);

		await db.update(user).set({ passwordHash: newHash }).where(eq(user.id, targetUserId));

		throw redirect(303, '/dashboard/users?password=success');
	}
};
