import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import { projects } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { redirect, fail, error } from '@sveltejs/kit';
import { put, del } from '@vercel/blob';

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
		const url = data.get('url')?.toString().trim();
		const imageFile = data.get('image');

		if (!title || !subtitle || !description || !url) {
			return fail(400, { message: 'All fields are required' });
		}

		const existing = await db
			.select({ image: projects.image })
			.from(projects)
			.where(eq(projects.id, id))
			.limit(1);

		if (existing.length === 0) {
			return fail(404, { message: 'Project not found' });
		}

		let imageUrl = existing[0].image;

		if (imageFile instanceof File && imageFile.size > 0) {
			const filename = `${crypto.randomUUID()}-${imageFile.name}`;

			const blob = await put(filename, imageFile, {
				access: 'public'
			});

			imageUrl = blob.url;

			if (existing[0].image) {
				try {
					await del(existing[0].image);
				} catch (err) {
					console.error('Failed to delete old blob', err);
				}
			}
		}

		await db
			.update(projects)
			.set({
				title,
				subtitle,
				description,
				image: imageUrl,
				url
			})
			.where(eq(projects.id, id));

		throw redirect(303, '/dashboard/projects');
	}
};
