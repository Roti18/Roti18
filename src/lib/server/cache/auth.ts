import { db } from '$lib/server/db';
import { user, session } from '$lib/server/db/schema';
import { eq, and, gt } from 'drizzle-orm';
import { randomUUID } from 'crypto';
import type { RequestEvent } from '@sveltejs/kit';

export const sessionCookieName = 'session';

/* CREATE SESSION */
export async function createSession(userId: string) {
	const id = randomUUID();
	const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

	await db.insert(session).values({
		id,
		userId,
		expiresAt
	});

	return { id, expiresAt };
}

/* SET COOKIE */
export function setSessionTokenCookie(
	event: RequestEvent,
	token: string,
	expiresAt: Date
) {
	event.cookies.set(sessionCookieName, token, {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		secure: process.env.NODE_ENV === 'production',
		expires: expiresAt
	});
}

/* DELETE COOKIE */
export function deleteSessionTokenCookie(event: RequestEvent) {
	event.cookies.delete(sessionCookieName, { path: '/' });
}

/* VALIDATE SESSION — WAJIB QUERY DB */
export async function validateSessionToken(token: string) {
	const now = new Date();

	const result = await db
		.select({ session, user })
		.from(session)
		.innerJoin(user, eq(session.userId, user.id))
		.where(
			and(
				eq(session.id, token),
				gt(session.expiresAt, now)
			)
		)
		.limit(1);

	if (result.length === 0) {
		return { session: null, user: null };
	}

	return {
		session: result[0].session,
		user: result[0].user
	};
}

export async function logout(event: RequestEvent) {
	const token = event.cookies.get(sessionCookieName);

	if (token) {
		await db.delete(session).where(eq(session.id, token));
	}

	deleteSessionTokenCookie(event);
}
