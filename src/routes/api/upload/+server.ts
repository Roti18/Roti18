import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getStorageProvider } from '$lib/server/storage';
import sharp from 'sharp';
import path from 'node:path';

const ALLOWED_MIMES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];
const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15 MB
const MAX_FILES_PER_REQUEST = 10;

export const POST: RequestHandler = async ({ request, locals }) => {
	// Admin-only: prevent any logged-in user from writing to your storage.
	if (!locals.user?.isAdmin) {
		return json({ success: false, message: 'Unauthorized access' }, { status: 401 });
	}

	try {
		const formData = await request.formData();
		const files = formData.getAll('file') as File[];
		const folderParam = formData.get('folder')?.toString() || 'writing/general';

		if (!files || files.length === 0) {
			return json({ success: false, message: 'No files uploaded' }, { status: 400 });
		}

		if (files.length > MAX_FILES_PER_REQUEST) {
			return json({ success: false, message: `Too many files (max ${MAX_FILES_PER_REQUEST} per request)` }, { status: 400 });
		}

		const storage = getStorageProvider();
		const results = [];

		for (const file of files) {
			if (typeof file === 'string' || !file.name) continue;

			if (file.size > MAX_FILE_SIZE) {
				return json({ success: false, message: `File ${file.name} exceeds max size limit of 15MB` }, { status: 400 });
			}

			if (!ALLOWED_MIMES.includes(file.type)) {
				return json({ success: false, message: `Invalid MIME type ${file.type}` }, { status: 400 });
			}

			const arrayBuffer = await file.arrayBuffer();
			const buffer = Buffer.from(arrayBuffer);

			const isAvatar = folderParam === 'avatar';
			const uuid = isAvatar ? '' : `-${crypto.randomUUID().slice(0, 8)}`;
			const baseName = path.parse(file.name).name.toLowerCase().replace(/[^\w-]/g, '-').slice(0, 60) || 'image';
			const ext = path.extname(file.name).toLowerCase() || '.png';

			let width = 0;
			let height = 0;
			let originalObj;
			let optimizedObj;

			if (file.type === 'image/gif') {
				// GIFs are animated; re-encoding kills the animation. Keep the original.
				const gifFilename = isAvatar ? `avatar.gif` : `${baseName}${uuid}${ext}`;
				originalObj = await storage.upload(buffer, gifFilename, file.type, folderParam);
				optimizedObj = originalObj;
			} else {
				// Raster images: compress to WebP (~82% quality) + keep the original.
				const rawFilename = isAvatar ? `avatar-original${ext}` : `${baseName}${uuid}-original${ext}`;
				const webpFilename = isAvatar ? `avatar.webp` : `${baseName}${uuid}.webp`;

				try {
					const image = sharp(buffer);
					const metadata = await image.metadata();
					width = metadata.width || 0;
					height = metadata.height || 0;

					const webpBuffer = await image.webp({ quality: 82 }).toBuffer();

					originalObj = await storage.upload(buffer, rawFilename, file.type, folderParam);
					optimizedObj = await storage.upload(webpBuffer, webpFilename, 'image/webp', folderParam);
				} catch (e) {
					console.warn('[Sharp] Image processing error, storing original instead:', e);
					const fallbackFilename = isAvatar ? `avatar${ext}` : `${baseName}${uuid}${ext}`;
					originalObj = await storage.upload(buffer, fallbackFilename, file.type, folderParam);
					optimizedObj = originalObj;
				}
			}

			results.push({
				originalUrl: originalObj.url,
				optimizedUrl: optimizedObj.url,
				width,
				height,
				mime: file.type,
				size: optimizedObj.size,
				filename: optimizedObj.url.split('/').pop()
			});
		}

		return json({
			success: true,
			message: `${results.length} image(s) uploaded${results.length > 0 && results[0].mime !== 'image/gif' ? ' & optimized to WebP' : ''}`,
			files: results
		});
	} catch (err) {
		console.error('[Upload API] Server Error:', err);
		return json({ success: false, message: 'Upload failed. Please try again.' }, { status: 500 });
	}
};
