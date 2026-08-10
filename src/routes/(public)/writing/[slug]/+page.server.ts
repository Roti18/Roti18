import type { PageServerLoad, Actions } from './$types';
import { error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { writing } from '$lib/server/db/schema';
import { eq, ne, and, desc } from 'drizzle-orm';
import { processMarkdown } from '$lib/server/markdown/processor';

export const load: PageServerLoad = async ({ params }) => {
	try {
		const post = await db.query.writing.findFirst({
			where: eq(writing.slug, params.slug)
		});

		if (!post) throw error(404, 'Writing not found');

		const readNext = await db.query.writing.findMany({
			where: and(ne(writing.slug, params.slug), eq(writing.published, true)),
			orderBy: [desc(writing.createdAt)],
			limit: 5
		});

		// Self-heal: posts saved before the copy-button renderer don't contain a
		// code-block copy button (their contentHtml was sanitized with an allowlist
		// that stripped <button>). Re-render on read when the stored HTML is stale,
		// so existing posts get the fix without an admin re-save. Marked+Shiki runs
		// once per cached page then is cached by the edge (s-maxage).
		let processedHtml = post.contentHtml;
		if (!processedHtml.includes('md-copy-icon') || processedHtml.includes('<figcaption')) {
			const cooked = await processMarkdown(post.content);
			processedHtml = cooked.html;
		}

		return {
			post: {
				...post,
				processedHtml
			},
			readNext
		};
	} catch (err: any) {
		if (err?.status === 404) throw err;
		console.error('Failed to load writing detail from DB:', err);
		throw error(404, 'Writing not found');
	}
};

export const actions: Actions = {
	like: async ({ params }) => {
		const post = await db.query.writing.findFirst({
			where: eq(writing.slug, params.slug)
		});

		if (!post) throw error(404, 'Writing not found');

		const newLikes = (post.likes || 0) + 1;
		await db
			.update(writing)
			.set({ likes: newLikes })
			.where(eq(writing.id, post.id));

		return { success: true, likes: newLikes };
	}
};
