import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getStorageProvider } from '$lib/server/storage';
import sharp from 'sharp';
import path from 'node:path';

const ALLOWED_MIMES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml', 'image/avif'];
const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15 MB

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) {
		return json({ success: false, message: 'Unauthorized access' }, { status: 401 });
	}

	try {
		const formData = await request.formData();
		const files = formData.getAll('file') as File[];
		const folderParam = formData.get('folder')?.toString() || 'writing/general';

		if (!files || files.length === 0) {
			return json({ success: false, message: 'No files uploaded' }, { status: 400 });
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

			const uuid = crypto.randomUUID().slice(0, 8);
			const baseName = path.parse(file.name).name.toLowerCase().replace(/[^\w-]/g, '-');
			const ext = path.extname(file.name) || '.png';

			const rawFilename = `${baseName}-${uuid}-original${ext}`;
			const webpFilename = `${baseName}-${uuid}.webp`;

			let width = 0;
			let height = 0;
			let webpBuffer: Buffer = buffer;

			if (file.type !== 'image/svg+xml') {
				try {
					const image = sharp(buffer);
					const metadata = await image.metadata();
					width = metadata.width || 0;
					height = metadata.height || 0;

					// Compress to WebP ~82% quality
					webpBuffer = await image.webp({ quality: 82 }).toBuffer();
				} catch (e) {
					console.warn('[Sharp] Image metadata processing error:', e);
				}
			}

			// Upload Original File
			const originalObj = await storage.upload(buffer, rawFilename, file.type, folderParam);

			// Upload Optimized WebP File
			const optimizedObj = await storage.upload(webpBuffer, webpFilename, 'image/webp', folderParam);

			results.push({
				originalUrl: originalObj.url,
				optimizedUrl: optimizedObj.url,
				width,
				height,
				mime: file.type,
				size: optimizedObj.size,
				filename: webpFilename
			});
		}

		return json({
			success: true,
			message: `${results.length} image(s) uploaded & optimized to WebP`,
			files: results
		});
	} catch (err: any) {
		console.error('[Upload API] Server Error:', err);
		return json({ success: false, message: err?.message || 'Server error processing file upload' }, { status: 500 });
	}
};
