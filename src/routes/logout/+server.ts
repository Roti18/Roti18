import { redirect } from '@sveltejs/kit';
import { invalidateSession, deleteSessionTokenCookie } from '$lib/server/auth';

export async function POST(event) {
	const token = event.cookies.get('auth-session');

	if (token && event.locals.session) {
		await invalidateSession(event.locals.session.id);
	}

	deleteSessionTokenCookie(event.cookies);
	throw redirect(302, '/login');
}
