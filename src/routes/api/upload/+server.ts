import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getStorageProvider } from '$lib/server/storage';
import sharp from 'sharp';
import path from 'node:path';

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB
const MAX_FILES_PER_REQUEST = 10;

export const POST: RequestHandler = async ({ request, locals }) => {
	// Admin-only: prevent unauthorized writes
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
				return json({ success: false, message: `File ${file.name} exceeds max size limit of 50MB` }, { status: 400 });
			}

			const arrayBuffer = await file.arrayBuffer();
			const buffer = Buffer.from(arrayBuffer);

			const isAvatar = folderParam === 'avatar';
			const uuid = isAvatar ? '' : `-${crypto.randomUUID().slice(0, 8)}`;
			const baseName = path.parse(file.name).name.toLowerCase().replace(/[^\w-]/g, '-').slice(0, 60) || 'file';
			const ext = path.extname(file.name).toLowerCase() || (file.type?.startsWith('image/') ? '.png' : '.bin');
			const mimeType = file.type || 'application/octet-stream';

			let width = 0;
			let height = 0;
			let originalObj;
			let optimizedObj;

			const isRasterImage = mimeType.startsWith('image/') && mimeType !== 'image/gif' && mimeType !== 'image/svg+xml';

			if (!isRasterImage) {
				// Non-raster files (PDFs, DOCX, ZIPs, RARs, GIFs, SVGs): Upload directly without Sharp processing
				const docFilename = isAvatar ? `avatar${ext}` : `${baseName}${uuid}${ext}`;
				originalObj = await storage.upload(buffer, docFilename, mimeType, folderParam);
				optimizedObj = originalObj;
			} else {
				// Raster images: compress to WebP (~82% quality) + keep the original.
				const rawFilename = isAvatar ? `avatar-original${ext}` : `${baseName}${uuid}-original${ext}`;
				const webpFilename = isAvatar ? `avatar.webp` : `${baseName}${uuid}.webp`;

				try {
					// .rotate() without arguments automatically applies EXIF orientation and removes the tag
					const image = sharp(buffer).rotate();
					const metadata = await image.metadata();
					width = metadata.width || 0;
					height = metadata.height || 0;

					// 1. Raw Backup: Store the untouched original just in case, but don't return it for UI
					await storage.upload(buffer, rawFilename, mimeType, folderParam);

					// 2. Modal Image: High Quality WebP (90%) for full screen viewing
					const modalImage = sharp(buffer).rotate();
					if (width > 2560) {
						modalImage.resize({ width: 2560, withoutEnlargement: true });
					}
					const modalBuffer = await modalImage.webp({ quality: 90 }).toBuffer();
					const modalFilename = isAvatar ? `avatar-modal.webp` : `${baseName}${uuid}-modal.webp`;
					originalObj = await storage.upload(modalBuffer, modalFilename, 'image/webp', folderParam);

					// 3. Grid Image: Smaller WebP (80%) for fast grid loading
					const gridImage = sharp(buffer).rotate();
					if (width > 800) {
						gridImage.resize({ width: 800, withoutEnlargement: true });
					}
					const gridBuffer = await gridImage.webp({ quality: 80 }).toBuffer();
					const gridFilename = isAvatar ? `avatar-grid.webp` : `${baseName}${uuid}-grid.webp`;
					optimizedObj = await storage.upload(gridBuffer, gridFilename, 'image/webp', folderParam);

				} catch (e) {
					console.warn('[Sharp] Image processing error, storing original instead:', e);
					const fallbackFilename = isAvatar ? `avatar${ext}` : `${baseName}${uuid}${ext}`;
					originalObj = await storage.upload(buffer, fallbackFilename, mimeType, folderParam);
					optimizedObj = originalObj;
				}
			}

			results.push({
				originalUrl: originalObj.url,
				optimizedUrl: optimizedObj.url,
				width,
				height,
				mime: mimeType,
				size: optimizedObj.size,
				filename: optimizedObj.url.split('/').pop()
			});
		}

		return json({
			success: true,
			message: `${results.length} file(s) uploaded successfully`,
			files: results
		});
	} catch (err) {
		console.error('[Upload API] Server Error:', err);
		return json({ success: false, message: 'Upload failed. Please try again.' }, { status: 500 });
	}
};
