import { db } from '$lib/server/db';
import { session } from '$lib/server/db/schema';
import { and, eq } from 'drizzle-orm';
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ params, locals }) => {
	if (!locals.user) {
		throw error(401, 'Unauthorized');
	}

	const sessionId = params.id;
	if (!sessionId) {
		throw error(400, 'Session ID is required');
	}

	try {
		// IMPORTANT: Add condition to ensure user can only delete their own session
		const deleted = await db
			.delete(session)
			.where(and(eq(session.id, sessionId), eq(session.userId, locals.user.id)))
			.returning({ id: session.id });

		if (deleted.length === 0) {
			// This can mean the session doesn't exist OR it belongs to another user.
			// In either case, for security, we return 404.
			throw error(404, 'Session not found');
		}

		return json({ success: true });
	} catch (e) {
		if (e instanceof Error && 'status' in e && typeof e.status === 'number') {
			throw e; // Re-throw SvelteKit's own errors
		}
		console.error('Failed to delete session:', e);
		throw error(500, 'Failed to delete session due to a server error.');
	}
};
