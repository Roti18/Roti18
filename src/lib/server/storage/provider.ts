export interface StorageObject {
	url: string;
	key: string;
	size: number;
}

export interface StorageProvider {
	upload(fileBuffer: Buffer, filename: string, mimeType: string, folder?: string): Promise<StorageObject>;
	delete(key: string): Promise<boolean>;
}
