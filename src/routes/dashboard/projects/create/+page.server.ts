import { fail, redirect, error } from '@sveltejs/kit';
import type { Actions } from './$types';
import { db } from '$lib/server/db';
import { projects } from '$lib/server/db/schema';
import { put } from '@vercel/blob';
import sharp from 'sharp';
import { invalidatePublicLanding } from '$lib/server/cache/public';

function normalizeTitle(title: string) {
	return title
		.toLowerCase()
		.trim()
		.replace(/[^\w\s-]/g, '')
		.replace(/\s+/g, '-');
}

export const actions: Actions = {
	default: async ({ request }) => {
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

			if (!(imageFile instanceof File) || imageFile.size === 0) {
				return fail(400, { message: 'Image is required' });
			}

			const folder = normalizeTitle(title);

			const buffer = Buffer.from(await imageFile.arrayBuffer());
			const webpBuffer = await sharp(buffer)
				.resize(1600, 900, { fit: 'inside' })
				.webp({ quality: 80 })
				.toBuffer();

			const baseName = imageFile.name.replace(/\.[^/.]+$/, '');
			const path = `projects/${folder}/${baseName}.webp`;

			const blob = await put(path, webpBuffer, {
				access: 'public',
				contentType: 'image/webp'
			});

			await db.insert(projects).values({
				title,
				subtitle,
				description,
				image: blob.url,
				repoUrl,
				liveUrl
			});

			invalidatePublicLanding();
		} catch (e) {
			console.error('Failed to create project:', e);
			throw error(500, 'Failed to create new project due to a server error.');
		}

		throw redirect(303, '/dashboard/projects');
	}
};