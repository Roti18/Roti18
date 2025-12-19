import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { db } from '$lib/server/db';
import { projects } from '$lib/server/db/schema';
import { put } from '@vercel/blob';
import sharp from 'sharp';

function normalizeTitle(title: string) {
	return title
		.toLowerCase()
		.trim()
		.replace(/[^\w\s-]/g, '')
		.replace(/\s+/g, '-');
}

export const actions: Actions = {
	default: async ({ request }) => {
		const data = await request.formData();

		const title = data.get('title')?.toString().trim();
		const subtitle = data.get('subtitle')?.toString().trim();
		const description = data.get('description')?.toString().trim();
		const url = data.get('url')?.toString().trim();
		const imageFile = data.get('image');

		if (!title || !subtitle || !description || !url) {
			return fail(400, { message: 'All fields are required' });
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
			url
		});

		throw redirect(303, '/dashboard/projects');
	}
};
