import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import { academicSemester, academicCourse, academicMaterial } from '$lib/server/db/schema';
import { eq, asc, desc } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	const semesters = await db
		.select()
		.from(academicSemester)
		.orderBy(asc(academicSemester.sortOrder));

	const courses = await db
		.select()
		.from(academicCourse)
		.orderBy(asc(academicCourse.sortOrder));

	const materials = await db
		.select()
		.from(academicMaterial)
		.orderBy(asc(academicMaterial.sortOrder), desc(academicMaterial.createdAt));

	return {
		semesters,
		courses,
		materials
	};
};

export const actions: Actions = {
	createSemester: async ({ request }) => {
		const formData = await request.formData();
		const title = formData.get('title')?.toString().trim();
		const slug = formData.get('slug')?.toString().trim() || title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
		const sortOrderStr = formData.get('sortOrder')?.toString().trim();

		if (!title) {
			return fail(400, { error: 'Semester Title is required' });
		}

		await db.insert(academicSemester).values({
			id: crypto.randomUUID(),
			slug: slug || `semester-${Date.now()}`,
			title,
			sortOrder: sortOrderStr ? parseInt(sortOrderStr, 10) : 0
		});

		return { success: true, message: 'Semester created successfully' };
	},

	deleteSemester: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id')?.toString();
		if (!id) return fail(400, { error: 'Missing ID' });

		await db.delete(academicSemester).where(eq(academicSemester.id, id));
		return { success: true, message: 'Semester deleted' };
	},

	createCourse: async ({ request }) => {
		const formData = await request.formData();
		const semesterId = formData.get('semesterId')?.toString();
		const title = formData.get('title')?.toString().trim();
		const slug = formData.get('slug')?.toString().trim() || title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
		const dosenName = formData.get('dosenName')?.toString().trim();
		const asprakName = formData.get('asprakName')?.toString().trim() || null;
		const hasPraktikum = formData.get('hasPraktikum') === 'true' || formData.get('hasPraktikum') === 'on';

		if (!semesterId || !title || !dosenName) {
			return fail(400, { error: 'Semester, Course Title, and Dosen Name are required' });
		}

		await db.insert(academicCourse).values({
			id: crypto.randomUUID(),
			semesterId,
			slug: slug || `course-${Date.now()}`,
			title,
			dosenName,
			asprakName,
			hasPraktikum,
			sortOrder: 0
		});

		return { success: true, message: 'Course created successfully' };
	},

	deleteCourse: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id')?.toString();
		if (!id) return fail(400, { error: 'Missing ID' });

		await db.delete(academicCourse).where(eq(academicCourse.id, id));
		return { success: true, message: 'Course deleted' };
	},

	createMaterial: async ({ request }) => {
		const formData = await request.formData();
		const courseId = formData.get('courseId')?.toString();
		const title = formData.get('title')?.toString().trim();
		const type = formData.get('type')?.toString().trim() as 'materi' | 'tugas' | 'praktikum';
		const content = formData.get('content')?.toString().trim();
		const attachmentsRaw = formData.get('attachments')?.toString().trim();

		if (!courseId || !title || !type || !content) {
			return fail(400, { error: 'Course, Title, Type, and Content are required' });
		}

		const [targetCourse] = await db.select().from(academicCourse).where(eq(academicCourse.id, courseId)).limit(1);
		if (!targetCourse) return fail(400, { error: 'Invalid Course' });

		const [targetSemester] = await db.select().from(academicSemester).where(eq(academicSemester.id, targetCourse.semesterId)).limit(1);
		if (!targetSemester) return fail(400, { error: 'Invalid Semester' });

		const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || `mat-${Date.now()}`;
		const fullSlug = `${targetSemester.slug}/${targetCourse.slug}/${slug}`;
		const contentHtml = content.split('\n\n').map((p) => `<p>${p.replace(/\n/g, '<br/>')}</p>`).join('');

		let attachments: { name: string; url: string }[] = [];
		if (attachmentsRaw) {
			try {
				attachments = JSON.parse(attachmentsRaw);
			} catch (e) {
				console.error('[academics/createMaterial] JSON parse attachments error:', e);
			}
		}

		await db.insert(academicMaterial).values({
			id: crypto.randomUUID(),
			courseId,
			slug,
			fullSlug,
			title,
			type,
			content,
			contentHtml,
			attachments,
			sortOrder: 0,
			createdAt: new Date(),
			updatedAt: new Date()
		});

		return { success: true, message: 'Academic material created' };
	},

	updateMaterial: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id')?.toString();
		const title = formData.get('title')?.toString().trim();
		const type = formData.get('type')?.toString().trim() as 'materi' | 'tugas' | 'praktikum';
		const content = formData.get('content')?.toString().trim();
		const attachmentsRaw = formData.get('attachments')?.toString().trim();

		if (!id || !title || !type || !content) {
			return fail(400, { error: 'ID, Title, Type, and Content are required' });
		}

		const contentHtml = content.split('\n\n').map((p) => `<p>${p.replace(/\n/g, '<br/>')}</p>`).join('');

		let attachments: { name: string; url: string }[] = [];
		if (attachmentsRaw) {
			try {
				attachments = JSON.parse(attachmentsRaw);
			} catch (e) {
				console.error('[academics/updateMaterial] JSON parse attachments error:', e);
			}
		}

		await db
			.update(academicMaterial)
			.set({
				title,
				type,
				content,
				contentHtml,
				attachments,
				updatedAt: new Date()
			})
			.where(eq(academicMaterial.id, id));

		return { success: true, message: 'Academic material updated' };
	},

	deleteMaterial: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id')?.toString();

		if (!id) return fail(400, { error: 'Missing ID' });

		await db.delete(academicMaterial).where(eq(academicMaterial.id, id));

		return { success: true, message: 'Academic material deleted' };
	}
};
