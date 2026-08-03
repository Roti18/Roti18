import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';
import { env } from '$env/dynamic/private';

const rawUrl = env.DATABASE_URL || process.env.DATABASE_URL || '';
const rawToken = env.DATABASE_AUTH_TOKEN || process.env.DATABASE_AUTH_TOKEN || '';

if (!rawUrl) throw new Error('DATABASE_URL is not set in environment');
if (!rawToken) throw new Error('DATABASE_AUTH_TOKEN is not set in environment');

// Convert libsql:// to https:// for HTTP REST protocol reliability on Vercel Serverless
const httpUrl = rawUrl.replace(/^libsql:\/\//, 'https://');

const client = createClient({
	url: httpUrl,
	authToken: rawToken
});

export const db = drizzle(client, { schema });
