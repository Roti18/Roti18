import type { StorageProvider, StorageObject } from './provider';
import fs from 'node:fs/promises';
import path from 'node:path';

export class LocalStorageProvider implements StorageProvider {
	private uploadDir: string;

	constructor() {
		this.uploadDir = path.join(process.cwd(), 'static', 'uploads');
	}

	private async ensureDir(targetDir: string) {
		try {
			await fs.mkdir(targetDir, { recursive: true });
		} catch (err) {
			console.error('Failed to create upload dir:', err);
		}
	}

	async upload(fileBuffer: Buffer, filename: string, _mimeType: string, folder?: string): Promise<StorageObject> {
		const targetDir = folder ? path.join(this.uploadDir, folder) : this.uploadDir;
		await this.ensureDir(targetDir);

		const filePath = path.join(targetDir, filename);
		await fs.writeFile(filePath, fileBuffer);

		const relativeUrl = folder ? `/uploads/${folder}/${filename}` : `/uploads/${filename}`;
		const key = folder ? `${folder}/${filename}` : filename;

		return {
			url: relativeUrl,
			key,
			size: fileBuffer.length
		};
	}

	async delete(key: string): Promise<boolean> {
		try {
			const filePath = path.join(this.uploadDir, key);
			await fs.unlink(filePath);
			return true;
		} catch (err) {
			console.error('Failed to delete local file:', err);
			return false;
		}
	}
}
