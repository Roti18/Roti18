<script lang="ts">
	import { ChevronRight } from 'lucide-svelte';
	import SocialIcon from '$lib/components/public/SocialIcon.svelte';
	import SEO from '$lib/components/public/SEO.svelte';

	const { data } = $props();
</script>

<SEO 
	title={`${data.site.fullName} - ${data.site.title}`}
	description={data.site.description}
/>

<div class="max-w-5xl mx-auto px-6 py-12 md:py-20 space-y-16">
	<!-- Hero Section -->
	<header class="blur-fade-in space-y-4">
		{#if data.site.avatarUrl}
			<div class="mb-6">
				<img
					src={data.site.avatarUrl}
					alt={data.site.fullName}
					class="w-16 h-16 rounded-full object-cover bg-[#181818]"
					width="64"
					height="64"
					loading="eager"
					fetchpriority="high"
					decoding="async"
				/>
			</div>
		{/if}
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
					<SocialIcon icon={link.icon || link.platform} size={20} />
				</a>
			{/each}
		</div>
	</header>

	<div class="space-y-12 pt-4 border-t border-[#1f1f1f]">
		<!-- Writing Section -->
		{#if data.recentWritings && data.recentWritings.length > 0}
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
		{/if}

		<!-- Projects Section -->
		{#if data.projects && data.projects.length > 0}
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
		{/if}

		<!-- Music Section -->
		{#if data.recentMusic && data.recentMusic.length > 0}
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
		{/if}
	</div>
</div>
