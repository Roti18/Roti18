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
