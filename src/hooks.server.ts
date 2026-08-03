import type { Handle } from '@sveltejs/kit';
import { redirect, error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { appSettings } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { env } from '$env/dynamic/private';
import { auth } from '$lib/server/auth';

/**
 * Returns array of admin emails configured in ADMIN_EMAILS (.env / Vercel env).
 * Supports comma-separated emails for multiple admin accounts.
 */
function getAdminEmails(): string[] {
	const raw = env.ADMIN_EMAILS || process.env.ADMIN_EMAILS || '';
	return raw
		.split(',')
		.map((e) => e.trim().toLowerCase())
		.filter(Boolean);
}

/**
 * Check if maintenance mode is enabled in DB (fresh lookup per request).
 */
async function isMaintenanceMode(): Promise<boolean> {
	try {
		const [setting] = await db.select().from(appSettings).where(eq(appSettings.key, 'maintenance_mode')).limit(1);
		return setting?.value === 'true';
	} catch (err) {
		console.error('[hooks] Failed to read maintenance_mode from DB:', err);
		return false;
	}
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

	// 3. Maintenance Mode Check
	let activeMaintenance = false;
	if (!currentUser?.isAdmin && !pathname.startsWith('/api') && !pathname.startsWith('/auth')) {
		activeMaintenance = await isMaintenanceMode();
		if (activeMaintenance) {
			throw error(503, {
				message: 'System Under Maintenance: We are currently performing scheduled upgrades. Please check back shortly.'
			});
		}
	}

	const response = await resolve(event);

	// 4. Cache-Control: Only cache public pages when NOT in maintenance mode
	if (!activeMaintenance && currentUser === null && !pathname.startsWith('/api') && !pathname.startsWith('/auth') && !pathname.startsWith('/dash')) {
		response.headers.set('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59');
	} else {
		response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
	}

	return response;
};
