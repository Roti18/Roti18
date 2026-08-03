import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { academicMaterial } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

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

		const course = found.course;
		const semester = course.semester;

		return {
			material: found,
			course,
			semester,
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
