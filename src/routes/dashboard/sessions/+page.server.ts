import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { session, user } from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ depends }) => {
	depends('app:sessions');

	try {
		const sessionList = await db
			.select({
				id: session.id,
				expiresAt: session.expiresAt,
				userId: user.id,
				userEmail: user.email,
				userName: user.name
			})
			.from(session)
			.leftJoin(user, eq(session.userId, user.id))
			.orderBy(desc(session.expiresAt));

		return {
			sessions: sessionList
		};
	} catch (e) {
		console.error('Failed to load session list:', e);
		throw error(500, 'Failed to load session data.');
	}
};
