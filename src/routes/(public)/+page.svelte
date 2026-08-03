<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import SocialIcon from '$lib/components/public/SocialIcon.svelte';

	const { data } = $props();

	onMount(async () => {
		if (browser) {
			const { gsap } = await import('gsap');
			gsap.fromTo(
				'.fade-element',
				{ opacity: 0, y: 15 },
				{ opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', stagger: 0.1 }
			);
		}
	});
</script>

<svelte:head>
	<title>{data.site.fullName} — Software Engineer</title>
	<meta name="description" content={data.site.description} />
</svelte:head>

<div class="max-w-5xl mx-auto px-6 py-12 space-y-16">
	<!-- Hero Section -->
	<section class="space-y-6 pt-4">
		{#if data.site.avatarUrl}
			<div class="fade-element mb-6">
				<img
					src={data.site.avatarUrl}
					alt={data.site.fullName}
					class="w-16 h-16 rounded-full object-cover bg-[#181818] border border-[#2a2a2a]"
					width="64"
					height="64"
				/>
			</div>
		{/if}
		<h1 class="fade-element text-2xl font-semibold text-[#ededed] tracking-tight">{data.site.fullName}</h1>
		<p class="fade-element text-base leading-relaxed text-[#ededed] max-w-[70ch]">{data.site.description}</p>

		<div class="fade-element flex items-center gap-5 pt-3">
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
	</section>

	<!-- Featured Writing Section -->
	{#if data.recentWritings && data.recentWritings.length > 0}
		<section class="fade-element space-y-6">
			<div class="w-6 h-0.5 bg-[#f87171] rounded-full"></div>
			<h2 class="text-xs font-semibold text-[#888888] uppercase tracking-wider">
				Writing
			</h2>
			<div class="flex flex-col gap-4">
				{#each data.recentWritings as writing}
					<a
						href="/writing/{writing.slug}"
						class="group flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-4 py-1 hover:no-underline"
					>
						<span class="text-base text-[#ededed] group-hover:underline underline-offset-4 font-['Space_Grotesk'] font-medium">
							{writing.title}
						</span>
						<span class="text-xs text-[#666666] font-mono shrink-0">
							{writing.year}
						</span>
					</a>
				{/each}
			</div>
		</section>
	{/if}

	<!-- Featured Projects Section -->
	{#if data.projects && data.projects.length > 0}
		<section class="fade-element space-y-6">
			<div class="w-6 h-0.5 bg-[#f87171] rounded-full"></div>
			<h2 class="text-xs font-semibold text-[#888888] uppercase tracking-wider">
				Projects
			</h2>
			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				{#each data.projects as project}
					<a
						href="/project/{project.slug}"
						class="group p-5 rounded-2xl bg-[#121212] border border-[#222222] hover:border-[#333333] transition-colors space-y-2 hover:no-underline"
					>
						<h3 class="text-base font-semibold text-[#ededed] group-hover:text-white font-['Space_Grotesk']">
							{project.title}
						</h3>
						<p class="text-xs text-[#a1a1a1] line-clamp-2 leading-relaxed">
							{project.shortDesc}
						</p>
					</a>
				{/each}
			</div>
		</section>
	{/if}

	<!-- Music Now Playing Banner -->
	{#if data.recentMusic && data.recentMusic.length > 0}
		<section class="fade-element pt-4 border-t border-[#1f1f1f]">
			<div class="flex items-center gap-3 text-xs font-mono text-[#888888]">
				<span class="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
				<span>Listening to: <strong class="text-white">{data.recentMusic[0].title}</strong> by <strong class="text-white">{data.recentMusic[0].artist}</strong></span>
			</div>
		</section>
	{/if}
</div>
