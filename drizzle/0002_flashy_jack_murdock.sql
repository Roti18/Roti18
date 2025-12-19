ALTER TABLE `social_links` ADD `name` text NOT NULL;--> statement-breakpoint
ALTER TABLE `social_links` ADD `url` text NOT NULL;--> statement-breakpoint
ALTER TABLE `social_links` DROP COLUMN `github`;--> statement-breakpoint
ALTER TABLE `social_links` DROP COLUMN `linkedin`;--> statement-breakpoint
ALTER TABLE `social_links` DROP COLUMN `twitter`;--> statement-breakpoint
ALTER TABLE `social_links` DROP COLUMN `instagram`;--> statement-breakpoint
ALTER TABLE `social_links` DROP COLUMN `email`;--> statement-breakpoint
ALTER TABLE `social_links` DROP COLUMN `website`;