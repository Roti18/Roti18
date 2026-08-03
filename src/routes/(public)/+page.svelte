<script lang="ts">
	import { ChevronRight } from 'lucide-svelte';

	const { data } = $props();
</script>

<svelte:head>
	<title>{data.site.fullName} - {data.site.title}</title>
	<meta name="description" content={data.site.description} />
</svelte:head>

<div class="max-w-5xl mx-auto px-6 py-12 md:py-20 space-y-16">
	<!-- Hero Section -->
	<header class="blur-fade-in space-y-4">
		<div class="mb-6">
			<img
				src={data.site.avatarUrl}
				alt={data.site.fullName}
				class="w-16 h-16 rounded-full object-cover bg-[#181818]"
				width="64"
				height="64"
			/>
		</div>
		<h1 class="text-2xl font-semibold text-[#ededed] tracking-tight">{data.site.fullName}</h1>
		<p class="text-base leading-relaxed text-[#ededed] max-w-[70ch]">{data.site.description}</p>

		<div class="flex items-center gap-5 pt-3">
			{#each data.site.socialLinks as link}
				<a
					href={link.url}
					target="_blank"
					rel="noopener noreferrer"
					class="text-[#a1a1a1] hover:text-[#ededed] transition-colors"
					aria-label={link.platform}
				>
					{#if link.icon === 'github'}
						<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
					{:else if link.icon === 'x'}
						<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
					{:else if link.icon === 'youtube'}
						<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
					{:else if link.icon === 'linkedin'}
						<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.762-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
					{:else if link.icon === 'instagram'}
						<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
					{:else}
						<span class="text-xs font-mono font-bold hover:underline">{link.platform}</span>
					{/if}
				</a>
			{/each}
		</div>
	</header>

	<div class="space-y-12 pt-4 border-t border-[#1f1f1f]">
		<!-- Writing Section -->
		<section class="blur-fade-in space-y-4" id="writing-section">
			<h2 class="text-xs font-semibold text-[#888888] tracking-wider uppercase">
				<a href="/writing" class="inline-flex items-center gap-1 text-[#888888] hover:text-[#ededed] hover:no-underline">
					<span>Writing</span>
					<ChevronRight size={12} />
				</a>
			</h2>
			<div class="flex flex-col gap-2">
				{#each data.recentWritings as post}
					<a
						href="/writing/{post.slug}"
						class="text-base font-normal text-[#ededed] hover:underline underline-offset-4 w-fit py-1"
						id="writing-{post.slug}"
					>
						<span>{post.title}</span>
					</a>
				{/each}
			</div>
		</section>

		<!-- Projects Section -->
		<section class="blur-fade-in space-y-4 pt-4 border-t border-[#1f1f1f]" id="projects-section">
			<h2 class="text-xs font-semibold text-[#888888] tracking-wider uppercase">
				<a href="/project" class="inline-flex items-center gap-1 text-[#888888] hover:text-[#ededed] hover:no-underline">
					<span>Projects</span>
					<ChevronRight size={12} />
				</a>
			</h2>
			<div class="flex flex-col gap-3">
				{#each data.projects as proj}
					<a
						href="/project/{proj.slug}"
						class="group flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4 py-1"
						id="project-{proj.slug}"
					>
						<span class="text-base text-[#ededed] group-hover:underline underline-offset-4 font-medium">{proj.title}</span>
						<span class="text-sm text-[#a1a1a1] no-underline font-normal">{proj.shortDesc}</span>
					</a>
				{/each}
			</div>
		</section>

		<!-- Music Section -->
		<section class="blur-fade-in space-y-4 pt-4 border-t border-[#1f1f1f]" id="music-section">
			<h2 class="text-xs font-semibold text-[#888888] tracking-wider uppercase">
				<a href="/music" class="inline-flex items-center gap-1 text-[#888888] hover:text-[#ededed] hover:no-underline">
					<span>Music</span>
					<ChevronRight size={12} />
				</a>
			</h2>
			<div class="flex flex-col gap-3">
				{#each data.recentMusic as track}
					<div class="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4 py-1">
						<span class="text-base text-[#ededed] font-medium">{track.title}</span>
						<span class="text-sm text-[#a1a1a1]">{track.artist}</span>
					</div>
				{/each}
			</div>
		</section>
	</div>
</div>
