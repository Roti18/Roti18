import { db } from '$lib/server/db';
import { session } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ params }) => {
	const sessionId = params.id;

	if (!sessionId) {
		throw error(400, 'Session ID is required');
	}

	const deleted = await db
		.delete(session)
		.where(eq(session.id, sessionId))
		.returning({ id: session.id });

	if (deleted.length === 0) {
		throw error(404, 'Session not found');
	}

	return json({ success: true });
};
