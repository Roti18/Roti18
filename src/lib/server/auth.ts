import type { RequestEvent, Cookies } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { sha256 } from '@oslojs/crypto/sha2';
import { encodeBase64url, encodeHexLowerCase } from '@oslojs/encoding';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';

const DAY_IN_MS = 1000 * 60 * 60 * 24;
export const sessionCookieName = 'auth-session';

export function generateSessionToken() {
	const bytes = crypto.getRandomValues(new Uint8Array(18));
	return encodeBase64url(bytes);
}

export async function createSession(token: string, userId: string) {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

	const expiresAt = new Date(Date.now() + DAY_IN_MS * 30);

	await db.insert(table.session).values({
		id: sessionId,
		userId,
		expiresAt
	});

	return { id: sessionId, expiresAt };
}

export async function validateSessionToken(token: string) {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

	const [result] = await db
		.select({
			session: table.session,
			user: table.user
		})
		.from(table.session)
		.innerJoin(table.user, eq(table.session.userId, table.user.id))
		.where(eq(table.session.id, sessionId));

	if (!result) return { session: null, user: null };

	if (Date.now() >= result.session.expiresAt.getTime()) {
		await invalidateSession(sessionId);
		return { session: null, user: null };
	}

	return result;
}

export function setSessionTokenCookie(event: RequestEvent, token: string, expiresAt: Date) {
	event.cookies.set(sessionCookieName, token, {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		secure: process.env.NODE_ENV === 'production',
		expires: expiresAt
	});
}

export async function invalidateSession(sessionId: string) {
	await db.delete(table.session).where(eq(table.session.id, sessionId));
}

export function deleteSessionTokenCookie(cookies: Cookies) {
	cookies.delete(sessionCookieName, { path: '/' });
}
