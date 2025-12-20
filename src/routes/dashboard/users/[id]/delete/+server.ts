import { db } from '$lib/server/db';
import { user } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { redirect, error } from '@sveltejs/kit';
import { del } from '@vercel/blob';

export async function POST({ params, locals }) {
	if (!locals.user) {
		throw error(401, 'Unauthorized');
	}

	const userId = params.id;
	if (!userId) {
		throw error(400, 'Bad Request: Missing user ID');
	}

	try {
		const existing = await db
			.select({ image: user.image })
			.from(user)
			.where(eq(user.id, userId))
			.limit(1);

		if (existing.length === 0) {
			throw error(404, 'User not found');
		}

		if (existing[0].image) {
			// Best-effort deletion. If this fails, we still proceed with user deletion.
			await del(existing[0].image).catch((err) => {
				console.error('Failed to delete avatar blob, continuing with user deletion.', err);
			});
		}

		await db.delete(user).where(eq(user.id, userId));
	} catch (e) {
		if (e instanceof Error && 'status' in e && typeof e.status === 'number') {
			throw e; // Re-throw SvelteKit's own errors (like the 401/404 we throw)
		}
		console.error('Failed to delete user:', e);
		throw error(500, 'Failed to delete user due to a server error.');
	}

	throw redirect(303, '/dashboard/users');
}
