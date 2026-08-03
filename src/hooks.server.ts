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
	if (!currentUser?.isAdmin && !pathname.startsWith('/api') && !pathname.startsWith('/auth')) {
		try {
			const [setting] = await db.select().from(appSettings).where(eq(appSettings.key, 'maintenance_mode')).limit(1);
			if (setting && setting.value === 'true') {
				throw error(503, {
					message: 'System Under Maintenance: We are currently performing scheduled upgrades. Please check back shortly.'
				});
			}
		} catch (e: any) {
			if (e?.status === 503) throw e;
		}
	}

	return resolve(event);
};
