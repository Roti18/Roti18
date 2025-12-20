import { fail, redirect, error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { user } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import type { Actions } from './$types';

export const actions: Actions = {
	update: async ({ request, params, locals }) => {
		if (!locals.user) {
			// Use throw error for authorization, which is a server error state
			throw error(401, 'Unauthorized');
		}

		const form = await request.formData();
		const password = form.get('password')?.toString().trim();
		const confirmPassword = form.get('confirmPassword')?.toString().trim();

		if (!password || !confirmPassword) {
			return fail(400, { message: 'Password wajib diisi' });
		}

		if (password.length < 8) {
			return fail(400, { message: 'Password minimal 8 karakter' });
		}

		if (password !== confirmPassword) {
			return fail(400, { message: 'Konfirmasi password tidak cocok' });
		}

		try {
			const targetUserId = params.id ?? locals.user.id;
			const newHash = await bcrypt.hash(password, 10);
			await db.update(user).set({ passwordHash: newHash }).where(eq(user.id, targetUserId));
		} catch (e) {
			console.error('Failed to update password:', e);
			throw error(500, 'Failed to update password due to a server error.');
		}

		throw redirect(303, '/dashboard/users?password=success');
	}
};
