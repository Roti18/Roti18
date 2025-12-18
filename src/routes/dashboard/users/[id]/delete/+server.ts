import { db } from '$lib/server/db';
import { user } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';

export async function POST({ params, locals }) {
	if (!locals.user) {
		return new Response('Unauthorized', { status: 401 });
	}

	const userId = params.id;

	if (!userId) {
		return new Response('Bad Request', { status: 400 });
	}

	await db.delete(user).where(eq(user.id, userId));

	throw redirect(303, '/dashboard/users');
}
