<script lang="ts">
	import type { Hero, SocialLinks } from '$lib/server/db/schema';
	import { Github, Twitter, Linkedin, Instagram, Mail, Globe } from '@lucide/svelte';

	export let hero: Hero;
	export let socialLinks: SocialLinks[];

	const iconMap = {
		github: Github,
		twitter: Twitter,
		linkedin: Linkedin,
		instagram: Instagram,
		email: Mail,
		website: Globe
	} as const;

	type IconName = keyof typeof iconMap;

	function getIcon(name: string) {
		return iconMap[name.toLowerCase() as IconName];
	}
</script>

<section
	class="
		relative
		flex
		min-h-screen
		items-center
		justify-center
		overflow-hidden
		px-5
		sm:px-6
		md:px-8
	"
>
	<!-- subtle background gradient -->
	<div
		class="pointer-events-none absolute inset-0 bg-linear-to-b from-transparent via-red-950/5 to-transparent"
	></div>

	<div
		class="
			relative
			z-10
			mx-auto
			w-full
			max-w-4xl
			py-20
			text-center
			sm:py-24
			md:py-32
		"
	>
		<div class="section-divider mx-auto mb-8"></div>

		<h1
			class="
				mb-6
				text-4xl
				font-bold
				tracking-tight
				sm:text-5xl
				md:text-6xl
			"
			style="line-height: 1.05"
		>
			{hero.name}
		</h1>

		<p
			class="
				mb-6
				text-xs
				tracking-[0.12em]
				text-neutral-500
				uppercase
				sm:text-sm
				md:text-base
			"
		>
			{hero.role}
		</p>

		<p
			class="
				mx-auto
				max-w-xl
				text-base
				font-light
				text-neutral-400
				sm:max-w-2xl
				sm:text-lg
				md:text-xl
			"
		>
			{hero.tagline}
		</p>

		<div
			class="
				mt-10
				flex
				flex-wrap
				items-center
				justify-center
				gap-4
				sm:gap-6
				md:gap-8
			"
		>
			{#each socialLinks as link (link.id)}
				{@const icon = getIcon(link.name)}
				<a
					href={link.name.toLowerCase() === 'email' ? `mailto:${link.url}` : link.url}
					target="_blank"
					rel="noopener noreferrer"
					class="
						group
						flex
						items-center
						gap-2
						text-xs
						text-neutral-400
						transition
						hover:text-white
						sm:text-sm
					"
				>
					{#if icon}
						<svelte:component
							this={icon}
							size={18}
							class="transition-transform group-hover:scale-110"
						/>
					{/if}
					<span class="minimal-link">{link.name}</span>
				</a>
			{/each}
		</div>
	</div>
</section>
