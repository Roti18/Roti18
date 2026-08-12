import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

// ── AUTH (Better Auth core tables) ──────────────────────────
// Google OAuth only - no verification table needed.

export const user = sqliteTable('user', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	emailVerified: integer('email_verified', { mode: 'boolean' }).notNull().default(false),
	image: text('image'),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull()
});

export const session = sqliteTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	token: text('token').notNull().unique(),
	expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
	ipAddress: text('ip_address'),
	userAgent: text('user_agent'),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull()
});

export const account = sqliteTable('account', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	accountId: text('account_id').notNull(),
	providerId: text('provider_id').notNull(),
	accessToken: text('access_token'),
	refreshToken: text('refresh_token'),
	idToken: text('id_token'),
	accessTokenExpiresAt: integer('access_token_expires_at', { mode: 'timestamp' }),
	refreshTokenExpiresAt: integer('refresh_token_expires_at', { mode: 'timestamp' }),
	scope: text('scope'),
	password: text('password'),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull()
});

export const verification = sqliteTable('verification', {
	id: text('id').primaryKey(),
	identifier: text('identifier').notNull(),
	value: text('value').notNull(),
	expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
	createdAt: integer('created_at', { mode: 'timestamp' }),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
});

// ── AUTH RELATIONS ──────────────────────────────────────────

export const userRelations = relations(user, ({ many }) => ({
	sessions: many(session),
	accounts: many(account)
}));

export const sessionRelations = relations(session, ({ one }) => ({
	user: one(user, { fields: [session.userId], references: [user.id] })
}));

export const accountRelations = relations(account, ({ one }) => ({
	user: one(user, { fields: [account.userId], references: [user.id] })
}));

// ── WRITING ─────────────────────────────────────────────────

export const writing = sqliteTable(
	'writing',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		slug: text('slug').notNull().unique(),
		title: text('title').notNull(),
		excerpt: text('excerpt'),
		content: text('content').notNull(),
		contentHtml: text('content_html').notNull(),
		coverUrl: text('cover_url'),
		year: integer('year').notNull(),
		likes: integer('likes').notNull().default(0),
		published: integer('published', { mode: 'boolean' }).notNull().default(false),
		createdAt: integer('created_at', { mode: 'timestamp' })
			.notNull()
			.$defaultFn(() => new Date()),
		updatedAt: integer('updated_at', { mode: 'timestamp' })
			.notNull()
			.$defaultFn(() => new Date())
			.$onUpdateFn(() => new Date())
	},
	(table) => [
		index('writing_slug_idx').on(table.slug),
		index('writing_year_idx').on(table.year),
		index('writing_published_idx').on(table.published)
	]
);

// ── PROJECT ─────────────────────────────────────────────────

export const project = sqliteTable(
	'project',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		slug: text('slug').notNull().unique(),
		title: text('title').notNull(),
		shortDesc: text('short_desc').notNull(),
		content: text('content'),
		contentHtml: text('content_html'),
		thumbnailUrl: text('thumbnail_url'),
		originalUrl: text('original_url'),
		repoUrl: text('repo_url'),
		repoIsPublic: integer('repo_is_public', { mode: 'boolean' }).notNull().default(true),
		demoUrl: text('demo_url'),
		demoIsLive: integer('demo_is_live', { mode: 'boolean' }).notNull().default(true),
		featuredOnHome: integer('featured_on_home', { mode: 'boolean' }).notNull().default(false),
		sortOrder: integer('sort_order').notNull().default(0),
		createdAt: integer('created_at', { mode: 'timestamp' })
			.notNull()
			.$defaultFn(() => new Date()),
		updatedAt: integer('updated_at', { mode: 'timestamp' })
			.notNull()
			.$defaultFn(() => new Date())
			.$onUpdateFn(() => new Date())
	},
	(table) => [index('project_slug_idx').on(table.slug)]
);

// ── GALLERY ─────────────────────────────────────────────────

export const galleryPhoto = sqliteTable(
	'gallery_photo',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		slug: text('slug').notNull().unique(),
		title: text('title').notNull(),
		imageUrl: text('image_url').notNull(),
		originalUrl: text('original_url'),
		shortDesc: text('short_desc'),
		cameraDesc: text('camera_desc'),
		locationName: text('location_name'),
		width: integer('width'),
		height: integer('height'),
		sortOrder: integer('sort_order').notNull().default(0),
		createdAt: integer('created_at', { mode: 'timestamp' })
			.notNull()
			.$defaultFn(() => new Date())
	},
	(table) => [index('gallery_slug_idx').on(table.slug)]
);

// ── MUSIC ───────────────────────────────────────────────────

export const music = sqliteTable('music', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	title: text('title').notNull(),
	artist: text('artist').notNull(),
	album: text('album'),
	coverUrl: text('cover_url'),
	musicUrl: text('music_url'),
	playedAt: integer('played_at', { mode: 'timestamp' })
		.$defaultFn(() => new Date()),
	sortOrder: integer('sort_order').notNull().default(0)
});

// ── ACADEMICS ───────────────────────────────────────────────

export const academicSemester = sqliteTable('academic_semester', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	slug: text('slug').notNull().unique(),
	title: text('title').notNull(),
	sortOrder: integer('sort_order').notNull().default(0)
});

export const academicCourse = sqliteTable(
	'academic_course',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		semesterId: text('semester_id')
			.notNull()
			.references(() => academicSemester.id, { onDelete: 'cascade' }),
		slug: text('slug').notNull(),
		title: text('title').notNull(),
		dosenName: text('dosen_name').notNull(),
		hasPraktikum: integer('has_praktikum', { mode: 'boolean' }).notNull().default(false),
		asprakName: text('asprak_name'),
		sortOrder: integer('sort_order').notNull().default(0)
	},
	(table) => [index('course_semester_idx').on(table.semesterId)]
);

export const academicMaterial = sqliteTable(
	'academic_material',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		courseId: text('course_id')
			.notNull()
			.references(() => academicCourse.id, { onDelete: 'cascade' }),
		slug: text('slug').notNull(),
		fullSlug: text('full_slug').notNull().unique(),
		title: text('title').notNull(),
		type: text('type', { enum: ['materi', 'tugas', 'praktikum'] }).notNull(),
		content: text('content').notNull(),
		contentHtml: text('content_html').notNull(),
		attachments: text('attachments', { mode: 'json' }).$type<{ name: string; url: string }[]>(),
		sortOrder: integer('sort_order').notNull().default(0),
		createdAt: integer('created_at', { mode: 'timestamp' })
			.notNull()
			.$defaultFn(() => new Date()),
		updatedAt: integer('updated_at', { mode: 'timestamp' })
			.notNull()
			.$defaultFn(() => new Date())
			.$onUpdateFn(() => new Date())
	},
	(table) => [
		index('material_course_idx').on(table.courseId),
		index('material_fullslug_idx').on(table.fullSlug)
	]
);

// ── SYSTEM & ABOUT ──────────────────────────────────────────

export const appSettings = sqliteTable('app_settings', {
	key: text('key').primaryKey(),
	value: text('value').notNull(),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
});

export const aboutInfo = sqliteTable('about_info', {
	id: text('id').primaryKey().$defaultFn(() => 'default'),
	bio: text('bio').notNull(),
	skills: text('skills', { mode: 'json' }).$type<string[]>(),
	experience: text('experience', { mode: 'json' }).$type<{ role: string; company: string; period: string; desc: string }[]>(),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
});

// ── ACADEMIC RELATIONS ──────────────────────────────────────

export const academicSemesterRelations = relations(academicSemester, ({ many }) => ({
	courses: many(academicCourse)
}));

export const academicCourseRelations = relations(academicCourse, ({ one, many }) => ({
	semester: one(academicSemester, {
		fields: [academicCourse.semesterId],
		references: [academicSemester.id]
	}),
	materials: many(academicMaterial)
}));

export const academicMaterialRelations = relations(academicMaterial, ({ one }) => ({
	course: one(academicCourse, {
		fields: [academicMaterial.courseId],
		references: [academicCourse.id]
	})
}));
