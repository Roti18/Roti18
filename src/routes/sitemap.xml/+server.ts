import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { writing, project, galleryPhoto, academicSemester, academicCourse, academicMaterial } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

const BASE_URL = 'https://rynds.my.id';

function url(loc: string, lastmod?: Date): string {
	return `<url><loc>${BASE_URL}${loc}</loc>${lastmod ? `<lastmod>${lastmod.toISOString().slice(0, 10)}</lastmod>` : ''}</url>`;
}

export const GET: RequestHandler = async () => {
	// Static pages
	const staticUrls = ['/', '/writing', '/project', '/gallery', '/music', '/about', '/academics']
		.map((p) => url(p))
		.join('');

	// Published writings
	const writings = await db.select({ slug: writing.slug, updatedAt: writing.updatedAt }).from(writing).where(eq(writing.published, true));
	const writingUrls = writings.map((w) => url(`/writing/${w.slug}`, w.updatedAt)).join('');

	// Projects
	const projects = await db.select({ slug: project.slug, updatedAt: project.updatedAt }).from(project);
	const projectUrls = projects.map((p) => url(`/project/${p.slug}`, p.updatedAt)).join('');

	// Gallery photos
	const photos = await db.select({ slug: galleryPhoto.slug }).from(galleryPhoto);
	const galleryUrls = photos.map((p) => url(`/gallery/${p.slug}`)).join('');

	// Academics: semesters + courses + materials
	const semesters = await db.select({ slug: academicSemester.slug }).from(academicSemester);
	const semesterUrls = semesters.map((s) => url(`/academics?open=${s.slug}`)).join('');

	const courses = await db.select({ slug: academicCourse.slug, semesterId: academicCourse.semesterId }).from(academicCourse);
	const courseUrls = courses.map((c) => url(`/academics?open=${semesters.find((s) => s.slug)?.slug},${c.slug}`)).join('');

	const materials = await db.select({ fullSlug: academicMaterial.fullSlug }).from(academicMaterial);
	const materialUrls = materials.map((m) => url(`/academics/${m.fullSlug}`)).join('');

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
