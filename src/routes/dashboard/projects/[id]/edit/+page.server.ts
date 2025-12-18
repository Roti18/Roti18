import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import { projects } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { redirect, fail, error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	const id = Number(params.id);

	if (!id || Number.isNaN(id)) {
		throw error(404, 'Not found');
	}

	const result = await db.select().from(projects).where(eq(projects.id, id)).limit(1);

	if (result.length === 0) {
		throw error(404, 'Not found');
	}

	return {
		project: result[0]
	};
};

export const actions: Actions = {
	update: async ({ request, params }) => {
		const id = Number(params.id);

		if (!id || Number.isNaN(id)) {
			return fail(400, { message: 'Invalid ID' });
		}

		const data = await request.formData();

		const title = data.get('title')?.toString().trim();
		const subtitle = data.get('subtitle')?.toString().trim();
		const description = data.get('description')?.toString().trim();
		const image = data.get('image')?.toString().trim();
		const url = data.get('url')?.toString().trim();

		if (!title || !subtitle || !description || !image || !url) {
			return fail(400, {
				message: 'All fields are required'
			});
		}

		await db
			.update(projects)
			.set({
				title,
				subtitle,
				description,
				image,
				url
			})
			.where(eq(projects.id, id));

		throw redirect(303, '/dashboard/projects');
	}
};
