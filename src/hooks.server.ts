import { getCachedSession } from '$lib/server/cache/auth';
import type { Handle } from '@sveltejs/kit';
import * as auth from '$lib/server/auth';

export const handle: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get(auth.sessionCookieName);

	if (!token) {
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}

	const { user, session } = await getCachedSession(token);

	event.locals.user = user;
	event.locals.session = session;

	return resolve(event);
};
