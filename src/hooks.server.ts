import type { Handle } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import {
	sessionCookieName,
	validateSessionToken,
	deleteSessionTokenCookie
} from '$lib/server/auth';

export const handle: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get(sessionCookieName);

	if (!token) {
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}

	const { session, user } = await validateSessionToken(token);

	if (!session || !user) {
		event.locals.user = null;
		event.locals.session = null;

		deleteSessionTokenCookie(event.cookies);

		if (event.url.pathname.startsWith('/dashboard')) {
			throw redirect(302, '/login');
		}

		return resolve(event);
	}

	event.locals.user = user;
	event.locals.session = session;

	return resolve(event);
};
