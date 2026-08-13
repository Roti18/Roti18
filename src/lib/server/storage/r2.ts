import type { StorageProvider, StorageObject } from './provider';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { env } from '$env/dynamic/private';

export class R2StorageProvider implements StorageProvider {
	private client: S3Client | null = null;
	private bucket: string;
	private publicDomain: string;

	constructor() {
		const accountId = env.R2_ACCOUNT_ID || process.env.R2_ACCOUNT_ID || '';
		const accessKeyId = env.R2_ACCESS_KEY_ID || process.env.R2_ACCESS_KEY_ID || '';
		const secretAccessKey = env.R2_SECRET_ACCESS_KEY || process.env.R2_SECRET_ACCESS_KEY || '';
		this.bucket = env.R2_BUCKET_NAME || process.env.R2_BUCKET_NAME || 'portfolio-assets';
		
		let rawDomain = (env.R2_PUBLIC_DOMAIN || process.env.R2_PUBLIC_DOMAIN || '').trim();
		if (rawDomain && !rawDomain.startsWith('http://') && !rawDomain.startsWith('https://')) {
			rawDomain = `https://${rawDomain}`;
		}
		this.publicDomain = rawDomain;

		if (accountId && accessKeyId && secretAccessKey) {
			this.client = new S3Client({
				region: 'auto',
				endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
				credentials: {
					accessKeyId,
					secretAccessKey
				}
			});
		}
	}

	async upload(fileBuffer: Buffer, filename: string, mimeType: string, folder?: string): Promise<StorageObject> {
		if (!this.client) {
			throw new Error('Cloudflare R2 credentials are missing in environment variables');
		}

		const key = folder ? `${folder.replace(/\/$/, '')}/${filename}` : filename;

		await this.client.send(
			new PutObjectCommand({
				Bucket: this.bucket,
				Key: key,
				Body: fileBuffer,
				ContentType: mimeType,
				CacheControl: 'public, max-age=31536000, immutable'
			})
		);

		const url = this.publicDomain
			? `${this.publicDomain.replace(/\/$/, '')}/${key}`
			: `/uploads/${key}`;

		return {
			url,
			key,
			size: fileBuffer.length
		};
	}

	async delete(key: string): Promise<boolean> {
		if (!this.client) return false;
		try {
			await this.client.send(
				new DeleteObjectCommand({
					Bucket: this.bucket,
					Key: key
				})
			);
			return true;
		} catch (err) {
			console.error('Failed to delete object from R2:', err);
			return false;
		}
	}
}
