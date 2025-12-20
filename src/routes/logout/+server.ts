import { redirect, error } from '@sveltejs/kit';
import { invalidateSession, deleteSessionTokenCookie } from '$lib/server/auth';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async (event) => {
	const token = event.cookies.get('auth-session');

	try {
		if (token && event.locals.session) {
			await invalidateSession(event.locals.session.id);
		}
	} catch (e) {
		console.error('Failed to invalidate session during logout:', e);
		// Even if session invalidation fails, we must try to log the user out on the client
		// But for consistency with the request, we will throw an error.
		throw error(500, 'Logout failed due to a server error.');
	}

	deleteSessionTokenCookie(event.cookies);
	throw redirect(302, '/login');
};
