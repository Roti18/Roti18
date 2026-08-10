<script lang="ts">
	import { browser } from "$app/environment";
	import { canUseBlur } from "$lib/utils/perf";
	import SEO from '$lib/components/public/SEO.svelte';

	const { data } = $props();

</script>

<SEO 
	title="Projects - M. Roni"
	description="Things I've built and worked on."
/>

<div class="max-w-5xl mx-auto px-6 py-12 space-y-12">
	<div class="flex flex-col gap-1 -mx-3">
		{#each data.projects as project}
			<a
				href="/project/{project.slug}"
				class="blur-fade-in group flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-6 py-3 px-3 rounded-xl transition-colors hover:bg-white/5"
				id="project-{project.slug}"
			>
				<span
					class="text-base font-medium text-[#ededed] group-hover:text-white shrink-0"
				>
					{project.title}
				</span>
				<span
					class="text-sm text-[#a1a1a1] flex-1 font-normal no-underline decoration-transparent"
				>
					{project.shortDesc}
				</span>
			</a>
		{/each}
	</div>
</div>
