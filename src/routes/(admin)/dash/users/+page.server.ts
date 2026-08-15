import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { user, session } from '$lib/server/db/schema';
import { desc, sql, eq } from 'drizzle-orm';

export const load: PageServerLoad = async () => {
	try {
		// Fetch all users
		const users = await db
			.select()
			.from(user)
			.orderBy(desc(user.createdAt));

		// Fetch all active sessions
		const sessions = await db
			.select()
			.from(session)
			.orderBy(desc(session.updatedAt));

		// Map sessions to users
		const usersWithSessions = users.map((u) => {
			const userSessions = sessions.filter((s) => s.userId === u.id);
			return {
				...u,
				sessions: userSessions,
				lastActive: userSessions.length > 0 ? userSessions[0].updatedAt : u.updatedAt
			};
		});
		
		// Sort by last active
		usersWithSessions.sort((a, b) => b.lastActive.getTime() - a.lastActive.getTime());

		return {
			users: usersWithSessions
		};
	} catch (err) {
		console.error('[dash/users/+page.server.ts] Error loading users:', err);
		return {
			users: []
		};
	}
};
