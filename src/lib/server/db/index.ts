import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';
import { env } from '$env/dynamic/private';

let _db: ReturnType<typeof drizzle>;

function initDb() {
	if (_db) return _db;

	const client = createClient({
		url: env.DATABASE_URL!,
		authToken: env.DATABASE_AUTH_TOKEN
	});

	_db = drizzle(client, { schema });
	return _db;
}

export const db = new Proxy({} as ReturnType<typeof drizzle>, {
	get(_target, prop) {
		return initDb()[prop as keyof ReturnType<typeof drizzle>];
	}
});
