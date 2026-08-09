import type { StorageProvider } from './provider';
import { LocalStorageProvider } from './local';
import { R2StorageProvider } from './r2';
import { env } from '$env/dynamic/private';

export function getStorageProvider(): StorageProvider {
	const providerType = (env.STORAGE_PROVIDER || process.env.STORAGE_PROVIDER || 'local').toLowerCase();

	if (providerType === 'r2') {
		try {
			return new R2StorageProvider();
		} catch (err) {
			console.warn('[Storage] Fallback to LocalStorageProvider due to R2 init error:', err);
			return new LocalStorageProvider();
		}
	}

	return new LocalStorageProvider();
}

/**
 * Attempts to parse the storage key from a public URL and delete it from the active storage provider.
 */
export async function deleteStorageFile(url: string | null | undefined): Promise<boolean> {
	if (!url) return false;

	try {
		const provider = getStorageProvider();
		let key = url;

		if (url.startsWith('http://') || url.startsWith('https://')) {
			const parsed = new URL(url);
			key = parsed.pathname.substring(1); // Remove leading slash
		} else if (url.startsWith('/uploads/')) {
			key = url.substring('/uploads/'.length); // For local storage
		}

		if (key) {
			const deleted = await provider.delete(key);

			// Clean up orphaned original files that were uploaded alongside the webp version
			if (key.endsWith('.webp')) {
				const baseKey = key.substring(0, key.length - 5); // remove .webp
				const exts = ['.png', '.jpg', '.jpeg', '.gif'];
				for (const ext of exts) {
					provider.delete(`${baseKey}-original${ext}`).catch(() => {});
				}
			}

			return deleted;
		}
	} catch (err) {
		console.error('[Storage] Error deleting file:', err);
	}
	return false;
}
