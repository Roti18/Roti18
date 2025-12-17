import type { RequestEvent } from '@sveltejs/kit';
import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

import { db } from '$lib/server/db';
import { user } from '$lib/server/db/schema';
import { generateSessionToken, createSession, setSessionTokenCookie } from '$lib/server/auth';

export const load = async ({ locals }) => {
	return {
		user: locals.user
	};
};

export const actions = {
	login: async (event: RequestEvent) => {
		const form = await event.request.formData();

		const email = form.get('email')?.toString();
		const password = form.get('password')?.toString();

		if (!email || !password) {
			return fail(400, { error: 'Missing credentials' });
		}

		const [u] = await db.select().from(user).where(eq(user.email, email));

		if (!u) {
			return fail(401, { error: 'Invalid email or password' });
		}

		const valid = await bcrypt.compare(password, u.passwordHash);
		if (!valid) {
			return fail(401, { error: 'Invalid email or password' });
		}

		const token = generateSessionToken();
		const session = await createSession(token, u.id);

		setSessionTokenCookie(event, token, session.expiresAt);

		throw redirect(302, '/dashboard');
	}
};
