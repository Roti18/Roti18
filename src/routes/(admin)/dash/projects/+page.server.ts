import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import { project } from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	const projects = await db
		.select()
		.from(project)
		.orderBy(desc(project.createdAt));

	return {
		projects
	};
};

export const actions: Actions = {
	createProject: async ({ request }) => {
		const formData = await request.formData();
		const title = formData.get('title')?.toString().trim();
		const slug = formData.get('slug')?.toString().trim() || title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
		const shortDesc = formData.get('shortDesc')?.toString().trim();
		const content = formData.get('content')?.toString().trim() || null;
		const thumbnailUrl = formData.get('thumbnailUrl')?.toString().trim() || null;
		const repoUrl = formData.get('repoUrl')?.toString().trim() || null;
		const repoIsPublic = formData.get('repoIsPublic') === 'true' || formData.get('repoIsPublic') === 'on';
		const demoUrl = formData.get('demoUrl')?.toString().trim() || null;
		const demoIsLive = formData.get('demoIsLive') === 'true' || formData.get('demoIsLive') === 'on';
		const featuredOnHome = formData.get('featuredOnHome') === 'true' || formData.get('featuredOnHome') === 'on';

		if (!title || !shortDesc) {
			return fail(400, { error: 'Title and Short Description are required' });
		}

		await db.insert(project).values({
			id: crypto.randomUUID(),
			slug: slug || `project-${Date.now()}`,
			title,
			shortDesc,
			content,
			contentHtml: content,
			thumbnailUrl,
			repoUrl,
			repoIsPublic,
			demoUrl,
			demoIsLive,
			featuredOnHome,
			createdAt: new Date(),
			updatedAt: new Date()
		});

		return { success: true, message: 'Project created successfully' };
	},

	updateProject: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id')?.toString();
		const title = formData.get('title')?.toString().trim();
		const slug = formData.get('slug')?.toString().trim();
		const shortDesc = formData.get('shortDesc')?.toString().trim();
		const content = formData.get('content')?.toString().trim() || null;
		const thumbnailUrl = formData.get('thumbnailUrl')?.toString().trim() || null;
		const repoUrl = formData.get('repoUrl')?.toString().trim() || null;
		const repoIsPublic = formData.get('repoIsPublic') === 'true' || formData.get('repoIsPublic') === 'on';
		const demoUrl = formData.get('demoUrl')?.toString().trim() || null;
		const demoIsLive = formData.get('demoIsLive') === 'true' || formData.get('demoIsLive') === 'on';
		const featuredOnHome = formData.get('featuredOnHome') === 'true' || formData.get('featuredOnHome') === 'on';

		if (!id || !title || !shortDesc) {
			return fail(400, { error: 'ID, Title and Short Description are required' });
		}

		await db
			.update(project)
			.set({
				title,
				slug: slug || undefined,
				shortDesc,
				content,
				contentHtml: content,
				thumbnailUrl,
				repoUrl,
				repoIsPublic,
				demoUrl,
				demoIsLive,
				featuredOnHome,
				updatedAt: new Date()
			})
			.where(eq(project.id, id));

		return { success: true, message: 'Project updated successfully' };
	},

	deleteProject: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id')?.toString();

		if (!id) {
			return fail(400, { error: 'Missing project ID' });
		}

		await db.delete(project).where(eq(project.id, id));

		return { success: true, message: 'Project deleted successfully' };
	}
};
