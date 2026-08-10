import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { project } from '$lib/server/db/schema';
import { eq, ne, asc, desc } from 'drizzle-orm';
import { processMarkdown } from '$lib/server/markdown/processor';

export const load: PageServerLoad = async ({ params }) => {
	try {
		const found = await db.query.project.findFirst({
			where: eq(project.slug, params.slug)
		});

		if (!found) throw error(404, 'Project not found');

		const readNext = await db.query.project.findMany({
			where: ne(project.slug, params.slug),
			orderBy: [asc(project.sortOrder), desc(project.createdAt)],
			limit: 4
		});

		// Self-heal stale stored HTML (same as writing detail) so code-block
		// copy buttons appear on projects saved before the renderer change.
		if (found.content && found.contentHtml && (!found.contentHtml.includes('md-copy-icon') || found.contentHtml.includes('<figcaption'))) {
			const cooked = await processMarkdown(found.content);
			found.contentHtml = cooked.html;
		}

		return { project: found, readNext };
	} catch (err: any) {
		if (err?.status === 404) throw err;
		console.error('Failed to load project detail from DB:', err);
		throw error(404, 'Project not found');
	}
};
