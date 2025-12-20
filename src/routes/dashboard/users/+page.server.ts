import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { user } from '$lib/server/db/schema';
import { desc } from 'drizzle-orm';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	try {
		const users = await db.select().from(user).orderBy(desc(user.id));
		return { users };
	} catch (e) {
		console.error('Failed to load users list:', e);
		throw error(500, 'Failed to load user list.');
	}
};
