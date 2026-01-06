import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import { projects } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { redirect, fail, error } from '@sveltejs/kit';
import { put, del } from '@vercel/blob';
import sharp from 'sharp';
import { invalidatePublicLanding } from '$lib/server/cache/public';

function normalizeTitle(title: string) {
	return title
		.toLowerCase()
		.trim()
		.replace(/[^\w\s-]/g, '')
		.replace(/\s+/g, '-');
}

export const load: PageServerLoad = async ({ params }) => {
	try {
		const id = Number(params.id);
		if (isNaN(id)) throw error(404, 'Not found');

		const result = await db.select().from(projects).where(eq(projects.id, id)).limit(1);

		if (!result.length) throw error(404, 'Not found');
		return { project: result[0] };
	} catch (e) {
		if (e instanceof Error && 'status' in e && typeof e.status === 'number') {
			throw e; // Re-throw SvelteKit's own errors
		}
		console.error('Failed to load project for editing:', e);
		throw error(500, 'Failed to load project data.');
	}
};

export const actions: Actions = {
	update: async ({ request, params }) => {
		const id = Number(params.id);
		if (isNaN(id)) return fail(400, { message: 'Invalid ID' });

		try {
			const data = await request.formData();

			const title = data.get('title')?.toString().trim();
			const subtitle = data.get('subtitle')?.toString().trim();
			const description = data.get('description')?.toString().trim();
			const repoUrl = data.get('repoUrl')?.toString().trim();
			const liveUrl = data.get('liveUrl')?.toString().trim();
			const imageFile = data.get('image');

			if (!title || !subtitle || !description) {
				return fail(400, { message: 'Title, Subtitle, and Description are required' });
			}

			const existing = await db
				.select({ image: projects.image })
				.from(projects)
				.where(eq(projects.id, id))
				.limit(1);

			if (!existing.length) {
				throw error(404, 'Project not found');
			}

			let imageUrl = existing[0].image;

			if (imageFile instanceof File && imageFile.size > 0) {
				const buffer = Buffer.from(await imageFile.arrayBuffer());

				const webpBuffer = await sharp(buffer)
					.resize(1600, 900, { fit: 'inside' })
					.webp({ quality: 80 })
					.toBuffer();

				const folder = normalizeTitle(title);
				const baseName = imageFile.name.replace(/\.[^/.]+$/, '');
				const path = `projects/${folder}/${baseName}.webp`;

				const blob = await put(path, webpBuffer, {
					access: 'public',
					contentType: 'image/webp'
				});

				imageUrl = blob.url;

				if (existing[0].image && existing[0].image !== blob.url) {
					// Best-effort deletion
					await del(existing[0].image).catch((err) => {
						console.error('Failed to delete old blob, continuing anyway.', err);
					});
				}
			}

			await db
				.update(projects)
				.set({
					title,
					subtitle,
					description,
					image: imageUrl,
					repoUrl,
					liveUrl
				})
				.where(eq(projects.id, id));
		} catch (e) {
			if (e instanceof Error && 'status' in e && typeof e.status === 'number') {
				throw e; // Re-throw SvelteKit's own errors
			}
			console.error('Failed to update project:', e);
			throw error(500, 'Failed to update project due to a server error.');
		}

		invalidatePublicLanding();
		throw redirect(303, '/dashboard/projects');
	}
};