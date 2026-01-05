<script lang="ts">
	import ProjectCard from './ProjectCard.svelte';
	import type { Project as ProjectType } from '$lib/server/db/schema';
	import ImageModal from './ImageModal.svelte';

	let { projects }: { projects: ProjectType[] } = $props();

	let selectedImage = $state<string | null>(null);

	function openModal(src: string) {
		selectedImage = src;
	}
</script>

<ImageModal
	src={selectedImage ?? ''}
	show={!!selectedImage}
	onClose={() => (selectedImage = null)}
/>

<section class="px-6 py-32">
	<div class="mx-auto max-w-6xl">
		<div class="section-divider"></div>
		<h2 class="mb-8 text-2xl font-bold tracking-tight text-white md:text-3xl">Projects</h2>

		<div class="projects-masonry" id="projects-grid">
			{#each projects as project (project.id)}
				<ProjectCard {project} onImageClick={openModal} />
			{/each}
		</div>
	</div>
</section>
