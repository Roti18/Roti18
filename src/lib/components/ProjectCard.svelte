<script lang="ts">
	import type { Project as ProjectType } from '$lib/server/db/schema';

	let { project, onImageClick }: { project: ProjectType; onImageClick: (src: string) => void } =
		$props();
</script>

<article
	class="project-item fade-in flex h-full flex-col overflow-hidden rounded-lg border border-[#1A1A1A] bg-[#0F0F0F]"
>
	<div class="relative aspect-video overflow-hidden bg-black">
		<button
			onclick={() => onImageClick(project.image)}
			class="h-full w-full cursor-zoom-in overflow-hidden"
			aria-label="Preview image"
		>
			<img
				src={project.image}
				alt={project.title}
				loading="lazy"
				decoding="async"
				width="800"
				height="450"
				class="project-image h-full w-full object-cover opacity-80 transition-all duration-500 ease-in-out hover:scale-105 hover:opacity-100"
			/>
		</button>
	</div>

	<div class="flex grow flex-col p-4">
		<div>
			<h3 class="mb-1 text-base font-semibold text-white">{project.title}</h3>
			<p class="text-xs tracking-wider text-neutral-600 uppercase">{project.subtitle}</p>
		</div>

		<p class="my-3 grow text-xs leading-relaxed text-neutral-500">
			{project.description}
		</p>

		<div class="mt-auto flex gap-4 text-xs">
			{#if project.repoUrl}
				<a
					href={project.repoUrl}
					target="_blank"
					rel="noopener noreferrer"
					class="minimal-link text-neutral-400 hover:text-white"
				>
					Repository
				</a>
			{:else}
				<span class="minimal-link cursor-not-allowed text-neutral-400 opacity-50">
					Repository
				</span>
			{/if}

			{#if project.liveUrl}
				<a
					href={project.liveUrl}
					target="_blank"
					rel="noopener noreferrer"
					class="minimal-link text-red-500 hover:text-red-400"
				>
					Live Demo
				</a>
			{:else}
				<span class="minimal-link cursor-not-allowed text-neutral-400 opacity-50"> Live Demo </span>
			{/if}
		</div>
	</div>
</article>
