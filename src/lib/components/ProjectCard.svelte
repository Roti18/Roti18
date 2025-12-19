<script lang="ts">
	import type { Project as ProjectType } from '$lib/server/db/schema';

	export let project: ProjectType;
</script>

<article
	class="project-item fade-in flex h-full flex-col overflow-hidden rounded-lg border border-[#1A1A1A] bg-[#0F0F0F]"
>
	<div class="relative aspect-video overflow-hidden bg-black">
		<img
			src={project.image}
			alt={project.title}
			class="project-image h-full w-full object-cover opacity-80 transition-transform duration-500 ease-in-out"
		/>
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
                <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" class="minimal-link text-neutral-400 hover:text-white">
                    Repository
                </a>
            {:else}
                <span class="minimal-link text-neutral-400 cursor-not-allowed opacity-50">
                    Repository
                </span>
            {/if}
            
            {#if project.liveUrl}
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" class="minimal-link text-red-500 hover:text-red-400">
                    Live Demo
                </a>
            {:else}
                <span class="minimal-link text-neutral-400 cursor-not-allowed opacity-50">
                    Live Demo
                </span>
            {/if}
		</div>
	</div>
</article>
