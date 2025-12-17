import { redirect } from '@sveltejs/kit';
import { invalidateSession, deleteSessionTokenCookie } from '$lib/server/auth';

export async function POST({ locals, cookies }) {
	if (!locals.session) {
		throw redirect(302, '/');
	}

	await invalidateSession(locals.session.id);

	deleteSessionTokenCookie(cookies);

	throw redirect(302, '/login');
}
