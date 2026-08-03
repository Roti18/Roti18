import type { Handle } from '@sveltejs/kit';
import { redirect, error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { user, session, appSettings } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { env } from '$env/dynamic/private';
import { auth } from '$lib/server/auth';

/**
 * Returns array of admin emails configured in ADMIN_EMAILS (.env).
 * Supports comma-separated emails for multiple admin accounts.
 */
function getAdminEmails(): string[] {
	const raw = env.ADMIN_EMAILS || process.env.ADMIN_EMAILS || '';
	return raw
		.split(',')
		.map((e) => e.trim().toLowerCase())
		.filter(Boolean);
}

// Maintenance mode is read on every non-admin request; cache the DB result briefly.
let cachedMaintenance: { value: boolean; at: number } | null = null;
const MAINTENANCE_CACHE_TTL = 30_000; // 30 seconds

async function isMaintenanceMode(): Promise<boolean> {
	if (cachedMaintenance && Date.now() - cachedMaintenance.at < MAINTENANCE_CACHE_TTL) {
		return cachedMaintenance.value;
	}
	try {
		const [setting] = await db.select().from(appSettings).where(eq(appSettings.key, 'maintenance_mode')).limit(1);
		cachedMaintenance = { value: setting?.value === 'true', at: Date.now() };
	} catch (err) {
		console.error('[hooks] Failed to read maintenance_mode:', err);
		cachedMaintenance = { value: false, at: Date.now() };
	}
	return cachedMaintenance.value;
}

export const handle: Handle = async ({ event, resolve }) => {
	// 1. Session Resolution using Better Auth API
	let currentUser = null;
	let currentSession = null;

	try {
		const sessionData = await auth.api.getSession({
			headers: event.request.headers
		});

		if (sessionData && sessionData.user) {
			const adminEmails = getAdminEmails();
			const userEmail = sessionData.user.email.toLowerCase();
			const isAdmin = adminEmails.includes(userEmail);
			const isTrunojoyo = userEmail.endsWith('@student.trunojoyo.ac.id') || userEmail.endsWith('@trunojoyo.ac.id');

			currentUser = {
				id: sessionData.user.id,
				name: sessionData.user.name,
				email: sessionData.user.email,
				image: sessionData.user.image,
				isAdmin,
				isTrunojoyo
			};

			currentSession = sessionData.session;
		}
	} catch (err) {
		console.error('[hooks] Error resolving user session via Better Auth API:', err);
	}

	event.locals.user = currentUser;
	event.locals.session = currentSession;

	const pathname = event.url.pathname.toLowerCase();

	// 2. Route Protection: /admin or /dash routes
	// Requires user to be logged in with an email listed in ADMIN_EMAILS (.env)
	if (pathname.startsWith('/admin') || pathname.startsWith('/dash')) {
		if (!currentUser) {
			throw redirect(303, `/?error=unauthorized_admin`);
		}
		if (!currentUser.isAdmin) {
			throw error(403, {
				message: 'Access Restricted: Admin pages (/dash) are restricted to authorized admin emails configured in ADMIN_EMAILS (.env).'
			});
		}
	}

	// 3. Maintenance Mode Check (with short cache)
	if (!currentUser?.isAdmin && !pathname.startsWith('/api') && !pathname.startsWith('/auth')) {
		if (await isMaintenanceMode()) {
			throw error(503, {
				message: 'System Under Maintenance: We are currently performing scheduled upgrades. Please check back shortly.'
			});
		}
	}

	const response = await resolve(event);

	// 4. CDN + browser caching for logged-out visitors on public pages.
	// Logged-in responses are never cached (session/private data).
	if (currentUser === null && !pathname.startsWith('/api') && !pathname.startsWith('/auth')) {
		response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
	}

	return response;
};
