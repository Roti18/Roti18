import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { env } from '$env/dynamic/private';

export const auth = betterAuth({
	baseURL: env.BETTER_AUTH_URL || process.env.BETTER_AUTH_URL || '',
	// No hardcoded fallback: BETTER_AUTH_SECRET must be set in Vercel env.
	// A missing value would silently mint insecure sessions, so fail loudly instead.
	secret: env.BETTER_AUTH_SECRET || process.env.BETTER_AUTH_SECRET || '',
	database: drizzleAdapter(db, {
		provider: 'sqlite',
		schema: {
			user: schema.user,
			session: schema.session,
			account: schema.account,
			verification: schema.verification
		}
	}),
	socialProviders: {
		google: {
			clientId: env.GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID || '',
			clientSecret: env.GOOGLE_CLIENT_SECRET || process.env.GOOGLE_CLIENT_SECRET || ''
		}
	}
});
