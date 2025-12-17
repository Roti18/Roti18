import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const user = sqliteTable('user', {
	id: text('id').primaryKey(),
	email: text('email').unique(),
	name: text('name'),
	image: text('image')
});

export const session = sqliteTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull()
});

export const profile = sqliteTable('profile', {
	id: integer('id').primaryKey(),
	title: text('title').notNull(),
	leftText: text('left_text').notNull(),
	rightText: text('right_text').notNull()
});

export const hero = sqliteTable('hero', {
	id: integer('id').primaryKey(),
	name: text('name').notNull(), // M. ZAMRONI FAHREZA
	role: text('role').notNull(), // DESIGNER & CREATIVE DIRECTOR
	tagline: text('tagline').notNull() // Crafting narratives...
});

export const projects = sqliteTable('projects', {
	id: integer('id').primaryKey(),
	title: text('title').notNull(),
	subtitle: text('subtitle').notNull(),
	description: text('description').notNull(),
	image: text('image').notNull(),
	url: text('url').notNull()
});

export type User = typeof user.$inferSelect;
export type Session = typeof session.$inferSelect;
export type Profile = typeof profile.$inferSelect;
export type Hero = typeof hero.$inferSelect;
export type Project = typeof projects.$inferSelect;
