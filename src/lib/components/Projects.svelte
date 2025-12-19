<script lang="ts">
	import ProjectCard from './ProjectCard.svelte';
	import type { Project } from '$lib/server/db/schema';

	export let projects: Project[] = [];
	export let isMobile: boolean;
</script>

<section class="relative mx-auto max-w-6xl px-4 py-12 sm:py-16">
	<h2
		class="mb-8 text-2xl font-light tracking-[0.15em] text-amber-50
		       sm:mb-12 sm:text-3xl sm:tracking-[0.2em] md:text-4xl"
	>
		PROJECTS
	</h2>

	<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
		{#each projects as project (project.id)}
			<ProjectCard {...project} {isMobile} />
		{/each}
	</div>
</section>
