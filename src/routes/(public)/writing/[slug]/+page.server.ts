import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { writing } from '$lib/server/db/schema';
import { eq, ne, and, desc } from 'drizzle-orm';

export const load: PageServerLoad = async ({ params }) => {
	try {
		const post = await db.query.writing.findFirst({
			where: eq(writing.slug, params.slug)
		});

		if (!post) throw error(404, 'Writing not found');

		// contentHtml is rendered + sanitized once at save time (admin).
		// Render that stored HTML here; no per-request markdown processing.
		const readNext = await db.query.writing.findMany({
			where: and(ne(writing.slug, params.slug), eq(writing.published, true)),
			orderBy: [desc(writing.createdAt)],
			limit: 5
		});

		return {
			post: {
				...post,
				processedHtml: post.contentHtml
			},
			readNext
		};
	} catch (err: any) {
		if (err?.status === 404) throw err;
		console.error('Failed to load writing detail from DB:', err);
		throw error(404, 'Writing not found');
	}
};
