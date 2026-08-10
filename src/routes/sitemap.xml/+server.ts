import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { writing, project, galleryPhoto, academicSemester, academicCourse, academicMaterial } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
export const GET: RequestHandler = async ({ url: requestUrl }) => {
	const origin = requestUrl.origin;

	function buildUrl(loc: string, lastmod?: Date): string {
		return `<url><loc>${origin}${loc}</loc>${lastmod ? `<lastmod>${lastmod.toISOString().slice(0, 10)}</lastmod>` : ''}</url>`;
	}

	// Static pages
	const staticUrls = ['/', '/writing', '/project', '/gallery', '/music', '/about', '/academics']
		.map((p) => buildUrl(p))
		.join('');

	// Published writings
	const writings = await db.select({ slug: writing.slug, updatedAt: writing.updatedAt }).from(writing).where(eq(writing.published, true));
	const writingUrls = writings.map((w) => buildUrl(`/writing/${w.slug}`, w.updatedAt)).join('');

	// Projects
	const projects = await db.select({ slug: project.slug, updatedAt: project.updatedAt }).from(project);
	const projectUrls = projects.map((p) => buildUrl(`/project/${p.slug}`, p.updatedAt)).join('');

	// Gallery photos
	const photos = await db.select({ slug: galleryPhoto.slug }).from(galleryPhoto);
	const galleryUrls = photos.map((p) => buildUrl(`/gallery/${p.slug}`)).join('');

	// Academics: semesters + courses + materials
	const semesters = await db.select({ slug: academicSemester.slug }).from(academicSemester);
	const semesterUrls = semesters.map((s) => buildUrl(`/academics?open=${s.slug}`)).join('');

	const courses = await db.select({ slug: academicCourse.slug, semesterId: academicCourse.semesterId }).from(academicCourse);
	const courseUrls = courses.map((c) => buildUrl(`/academics?open=${semesters.find((s) => s.slug)?.slug},${c.slug}`)).join('');

	const materials = await db.select({ fullSlug: academicMaterial.fullSlug }).from(academicMaterial);
	const materialUrls = materials.map((m) => buildUrl(`/academics/${m.fullSlug}`)).join('');

	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticUrls}
${writingUrls}
${projectUrls}
${galleryUrls}
${semesterUrls}
${courseUrls}
${materialUrls}
</urlset>`;

	return new Response(body.trim(), {
		headers: {
			'Content-Type': 'application/xml'
		}
	});
};
