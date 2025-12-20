<script lang="ts">
	import { onMount } from 'svelte';
	import type { Hero, SocialLinks } from '$lib/server/db/schema';
	import { Github, Twitter, Linkedin, Instagram, Mail, Globe, ChevronDown } from '@lucide/svelte';

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

	let ready = false;

	onMount(() => {
		requestAnimationFrame(() => {
			ready = true;
		});
	});
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
	<!-- background wash -->
	<div
		class="pointer-events-none absolute inset-0
		       bg-linear-to-b from-transparent via-red-950/5 to-transparent"
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
		<!-- divider -->
		<div
			class="section-divider mx-auto mb-8 transition-all duration-300 ease-out"
			class:opacity-0={!ready}
			class:-translate-y-2={!ready}
		></div>

		<!-- name -->
		<h1
			class="
				mb-6
				text-4xl
				font-bold
				tracking-tight
				transition-all
				delay-75
				duration-300
				ease-out
				sm:text-5xl
				md:text-6xl
			"
			style="line-height: 1.05"
			class:opacity-0={!ready}
			class:-translate-y-2={!ready}
		>
			{hero.name}
		</h1>

		<!-- role -->
		<p
			class="
				mb-6
				text-xs
				tracking-[0.12em]
				text-neutral-500
				uppercase
				transition-all
				delay-100
				duration-300
				ease-out
				sm:text-sm
				md:text-base
			"
			class:opacity-0={!ready}
			class:-translate-y-2={!ready}
		>
			{hero.role}
		</p>

		<!-- tagline -->
		<p
			class="
				mx-auto
				max-w-xl
				text-base
				font-light
				text-neutral-400
				transition-all
				delay-150
				duration-300
				ease-out
				sm:max-w-2xl
				sm:text-lg
				md:text-xl
			"
			class:opacity-0={!ready}
			class:-translate-y-2={!ready}
		>
			{hero.tagline}
		</p>

		<!-- socials -->
		<div
			class="
				mt-10
				flex
				flex-wrap
				items-center
				justify-center
				gap-4
				transition-all
				delay-200
				duration-300
				ease-out
				sm:gap-6
				md:gap-8
			"
			class:opacity-0={!ready}
			class:-translate-y-2={!ready}
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
						></svelte:component>
					{/if}
					<span class="minimal-link">{link.name}</span>
				</a>
			{/each}
		</div>
	</div>

	<!-- scroll hint -->
	<div
		class="
		pointer-events-none
		absolute
		bottom-6
		left-1/2
		z-0
		flex
		-translate-x-1/2
		flex-col
		items-center
		gap-2
		text-neutral-400
	"
	>
		<span
			class="
			text-[10px]
			tracking-[0.25em]
			uppercase
			opacity-60
		"
		>
			Scroll
		</span>

		<div
			class="
			flex
			animate-[scrollStack_2.2s_ease-in-out_infinite]
			flex-col
			items-center
		"
		>
			<ChevronDown size={18} class="text-red-600 opacity-40"></ChevronDown>
			<ChevronDown size={18} class="-mt-2 text-red-600 opacity-70"></ChevronDown>
			<ChevronDown size={18} class="-mt-2 text-red-600 opacity-100"></ChevronDown>
		</div>
	</div>
</section>

<style>
	@keyframes scrollStack {
		0% {
			transform: translateY(0);
			opacity: 0.4;
		}
		40% {
			transform: translateY(6px);
			opacity: 1;
		}
		70% {
			transform: translateY(6px);
			opacity: 1;
		}
		100% {
			transform: translateY(0);
			opacity: 0.4;
		}
	}
</style>
