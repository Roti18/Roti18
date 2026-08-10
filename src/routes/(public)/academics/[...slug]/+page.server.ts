import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { academicMaterial } from '$lib/server/db/schema';
import { eq, ne, and, asc } from 'drizzle-orm';
import { processMarkdown } from '$lib/server/markdown/processor';

export const load: PageServerLoad = async ({ params }) => {
	try {
		const found = await db.query.academicMaterial.findFirst({
			where: eq(academicMaterial.fullSlug, params.slug),
			with: {
				course: {
					with: {
						semester: true
					}
				}
			}
		});

		if (!found || !found.course) throw error(404, 'Material not found');

		// Self-heal stale stored HTML (same as writing/project) so code-block
		// copy buttons appear on materials saved before the renderer change.
		let contentHtml = found.contentHtml;
		if (!contentHtml?.includes('md-copy-icon') || contentHtml?.includes('<figcaption')) {
			const cooked = await processMarkdown(found.content);
			contentHtml = cooked.html;
		}
		found.contentHtml = contentHtml;

		const course = found.course;
		const semester = course.semester;

		const readNext = await db.query.academicMaterial.findMany({
			where: and(
				eq(academicMaterial.courseId, course.id),
				ne(academicMaterial.id, found.id)
			),
			orderBy: [asc(academicMaterial.sortOrder), asc(academicMaterial.createdAt)]
		});

		return {
			material: found,
			course,
			semester,
			readNext,
			breadcrumb: [
				{ label: semester.title, href: `/academics?open=${semester.slug}` },
				{
					label: `${course.title} (${course.dosenName})`,
					href: `/academics?open=${semester.slug},${course.slug}`
				}
			]
		};
	} catch (err: any) {
		if (err?.status === 404) throw err;
		console.error('Failed to load academic material detail from DB:', err);
		throw error(404, 'Material not found');
	}
};
