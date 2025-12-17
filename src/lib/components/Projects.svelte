<script lang="ts">
	import ProjectCard from './ProjectCard.svelte';
	import type { Project } from '$lib/server/db/schema';

	export let isMobile: boolean = false;
	export let projects: Project[] = [];
	let scrollY = 0;
</script>

<svelte:window bind:scrollY />

<section class="relative mx-auto max-w-6xl px-4 py-12 pb-24 sm:px-6 sm:py-16 sm:pb-32">
	<h2
		class="mb-8 text-2xl font-light tracking-[0.15em] text-amber-50 sm:mb-12 sm:text-3xl sm:tracking-[0.2em] md:text-4xl"
	>
		SELECTED PROJECTS
	</h2>

	<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
		{#each projects as project}
			<ProjectCard {...project} />
		{/each}
	</div>

	{#if !isMobile}
		<div
			class="animate-rotate-slow pointer-events-none fixed right-8 bottom-8 hidden text-rose-400/40 opacity-30 transition-opacity duration-500 sm:right-12 sm:bottom-12 md:block"
			style="opacity: {Math.min(scrollY / 500, 0.3)}"
		>
			<svg width="60" height="60" viewBox="0 0 60 60">
				<path d="M30 0 L32 28 L60 30 L32 32 L30 60 L28 32 L0 30 L28 28 Z" fill="currentColor" />
			</svg>
		</div>
	{/if}
</section>

<style>
	@keyframes rotate-slow {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	.animate-rotate-slow {
		animation: rotate-slow 20s linear infinite;
	}
</style>
