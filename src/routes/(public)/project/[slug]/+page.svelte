<script lang="ts">
	import { ExternalLink, ArrowLeft } from 'lucide-svelte';
	import MarkdownContent from '$lib/components/public/MarkdownContent.svelte';

	const { data } = $props();
</script>

<svelte:head>
	<title>{data.project.title} - M. Roni</title>
	<meta name="description" content={data.project.shortDesc} />
</svelte:head>

<div class="max-w-5xl mx-auto px-6 py-12 space-y-10">
	<article class="blur-fade-in space-y-8">
		<header class="space-y-4">
			<h1 class="text-4xl font-semibold text-[#ededed] leading-tight tracking-tight">{data.project.title}</h1>
			<p class="text-base text-[#999999] leading-relaxed max-w-[70ch]">{data.project.shortDesc}</p>

			<div class="flex items-center gap-3 pt-2">
				{#if data.project.repoUrl && data.project.repoIsPublic}
					<a
						href={data.project.repoUrl}
						target="_blank"
						rel="noopener noreferrer"
						class="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-[#262626] text-xs text-[#999999] hover:border-[#444444] hover:text-[#ededed] transition-colors hover:no-underline"
						id="repo-link"
					>
						<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
							<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
						</svg>
						<span>Source code</span>
					</a>
				{/if}
				{#if data.project.demoUrl && data.project.demoIsLive}
					<a
						href={data.project.demoUrl}
						target="_blank"
						rel="noopener noreferrer"
						class="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-[#262626] text-xs text-[#999999] hover:border-[#444444] hover:text-[#ededed] transition-colors hover:no-underline"
						id="demo-link"
					>
						<ExternalLink size={14} />
						<span>Live demo</span>
					</a>
				{/if}
			</div>
		</header>

		{#if data.project.thumbnailUrl || data.project.originalUrl}
			<div class="rounded-xl overflow-hidden border border-[#1f1f1f]">
				<img src={data.project.originalUrl || data.project.thumbnailUrl} alt={data.project.title} class="w-full h-auto block" />
			</div>
		{/if}

		{#if data.project.contentHtml}
			<div class="prose-p:max-w-[70ch] prose-headings:max-w-[70ch] prose-hr:border-[#1f1f1f] text-sm leading-relaxed text-[#999999]">
				<MarkdownContent html={data.project.contentHtml} containerId="project-content" />
			</div>
		{/if}
	</article>

	{#if data.readNext.length > 0}
		<footer class="blur-fade-in pt-10 border-t border-[#1f1f1f] space-y-4">
			<div class="w-6 h-0.5 bg-[#f87171] rounded-full"></div>
			<h2 class="text-xs font-semibold text-[#888888] uppercase tracking-wider">
				Other Projects
			</h2>
			<div class="flex flex-col gap-2">
				{#each data.readNext as next}
					<a
						href="/project/{next.slug}"
						class="text-base text-[#ededed] hover:underline underline-offset-4 w-fit py-1 font-['Space_Grotesk']"
					>
						{next.title}
					</a>
				{/each}
			</div>
		</footer>
	{/if}

	<!-- Bottom Back Button -->
	<div class="blur-fade-in pt-6 border-t border-[#1f1f1f]">
		<a
			href="/project"
			class="inline-flex items-center gap-2 text-sm text-[#a1a1a1] hover:text-white transition-colors hover:no-underline group w-fit"
		>
			<ArrowLeft size={14} class="transition-transform group-hover:-translate-x-1" />
			<span>Back to Projects</span>
		</a>
	</div>
</div>
