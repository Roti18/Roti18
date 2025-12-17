import type { Handle } from '@sveltejs/kit';
import * as auth from '$lib/server/auth';

export const handle: Handle = async ({ event, resolve }) => {
	const sessionToken = event.cookies.get(auth.sessionCookieName);

	if (sessionToken) {
		const { session, user } = await auth.validateSessionToken(sessionToken);

		if (session) {
			auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
		} else {
			auth.deleteSessionTokenCookie(event.cookies);
		}

		event.locals.user = user;
		event.locals.session = session;
	} else {
		event.locals.user = null;
		event.locals.session = null;
	}

	if (event.url.pathname.startsWith('/dashboard')) {
		if (!event.locals.user) {
			return Response.redirect(new URL('/login', event.url), 302);
		}
	}

	return resolve(event);
};
