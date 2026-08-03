import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import { writing } from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';
import { processMarkdown } from '$lib/server/markdown/processor';

function extractFirstImage(content: string): string | null {
	const match = content.match(/!\[.*?\]\((https?:\/\/[^\s)]+|\/uploads\/[^\s)]+)\)/);
	return match ? match[1] : null;
}

export const load: PageServerLoad = async () => {
	const writingsList = await db
		.select()
		.from(writing)
		.orderBy(desc(writing.createdAt));

	return {
		writings: writingsList
	};
};

export const actions: Actions = {
	createWriting: async ({ request }) => {
		const formData = await request.formData();
		const title = formData.get('title')?.toString().trim();
		const slug = formData.get('slug')?.toString().trim() || title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
		const excerpt = formData.get('excerpt')?.toString().trim() || null;
		let coverUrl = formData.get('coverUrl')?.toString().trim() || null;
		const content = formData.get('content')?.toString().trim();
		const yearStr = formData.get('year')?.toString().trim();
		const published = formData.get('published') === 'true' || formData.get('published') === 'on';

		if (!title || !content || !yearStr) {
			return fail(400, { error: 'Title, Content, and Year are required' });
		}

		if (!coverUrl) {
			coverUrl = extractFirstImage(content);
		}

		const year = parseInt(yearStr, 10);
		const rendered = await processMarkdown(content);

		await db.insert(writing).values({
			id: crypto.randomUUID(),
			slug: slug || `post-${Date.now()}`,
			title,
			excerpt,
			content,
			contentHtml: rendered.html,
			coverUrl,
			year,
			likes: 0,
			published,
			createdAt: new Date(),
			updatedAt: new Date()
		});

		return { success: true, message: 'Article created successfully' };
	},

	updateWriting: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id')?.toString();
		const title = formData.get('title')?.toString().trim();
		const slug = formData.get('slug')?.toString().trim();
		const excerpt = formData.get('excerpt')?.toString().trim() || null;
		let coverUrl = formData.get('coverUrl')?.toString().trim() || null;
		const content = formData.get('content')?.toString().trim();
		const yearStr = formData.get('year')?.toString().trim();
		const published = formData.get('published') === 'true' || formData.get('published') === 'on';

		if (!id || !title || !content || !yearStr) {
			return fail(400, { error: 'ID, Title, Content, and Year are required' });
		}

		if (!coverUrl) {
			coverUrl = extractFirstImage(content);
		}

		const year = parseInt(yearStr, 10);
		const rendered = await processMarkdown(content);

		await db
			.update(writing)
			.set({
				title,
				slug: slug || undefined,
				excerpt,
				content,
				contentHtml: rendered.html,
				coverUrl,
				year,
				published,
				updatedAt: new Date()
			})
			.where(eq(writing.id, id));

		return { success: true, message: 'Article updated successfully' };
	},

	deleteWriting: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id')?.toString();

		if (!id) {
			return fail(400, { error: 'Missing article ID' });
		}

		await db.delete(writing).where(eq(writing.id, id));

		return { success: true, message: 'Article deleted successfully' };
	},

	togglePublish: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id')?.toString();
		const currentStatus = formData.get('published') === 'true';

		if (!id) {
			return fail(400, { error: 'Missing article ID' });
		}

		await db
			.update(writing)
			.set({ published: !currentStatus, updatedAt: new Date() })
			.where(eq(writing.id, id));

		return { success: true, message: 'Publish status updated' };
	}
};
