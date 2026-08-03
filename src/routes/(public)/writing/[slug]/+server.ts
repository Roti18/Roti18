import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { writing } from '$lib/server/db/schema';
import { eq, sql } from 'drizzle-orm';

export const POST: RequestHandler = async ({ params }) => {
	try {
		await db
			.update(writing)
			.set({ likes: sql`${writing.likes} + 1` })
			.where(eq(writing.slug, params.slug));

		const [post] = await db.select({ likes: writing.likes }).from(writing).where(eq(writing.slug, params.slug)).limit(1);

		return json({ success: true, likes: post?.likes ?? 0 });
	} catch (err) {
		console.error('[Writing like] Error:', err);
		return json({ success: false, message: 'Failed to register like' }, { status: 500 });
	}
};
