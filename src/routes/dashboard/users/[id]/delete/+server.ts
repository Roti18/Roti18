import { db } from '$lib/server/db';
import { user } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';
import { del } from '@vercel/blob';

export async function POST({ params, locals }) {
	if (!locals.user) {
		return new Response('Unauthorized', { status: 401 });
	}

	const userId = params.id;

	if (!userId) {
		return new Response('Bad Request', { status: 400 });
	}

	const existing = await db
		.select({ image: user.image })
		.from(user)
		.where(eq(user.id, userId))
		.limit(1);

	if (existing.length === 0) {
		return new Response('User not found', { status: 404 });
	}

	if (existing[0].image) {
		try {
			await del(existing[0].image);
		} catch (err) {
			console.error('Failed to delete avatar blob', err);
		}
	}

	await db.delete(user).where(eq(user.id, userId));

	throw redirect(303, '/dashboard/users');
}
