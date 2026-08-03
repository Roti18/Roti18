<script lang="ts">
	import SocialIcon from '$lib/components/public/SocialIcon.svelte';

	const { data } = $props();

	const bioText = $derived((data.site.longDescription || data.site.description || '').split('\n\n').filter(Boolean));
</script>

<svelte:head>
	<title>About - M. Roni</title>
	<meta name="description" content={data.site.description} />
</svelte:head>

<div class="max-w-5xl mx-auto px-6 py-12 space-y-12">
	{#if data.site.avatarUrl}
		<div class="blur-fade-in mb-6">
			<img
				src={data.site.avatarUrl}
				alt={data.site.fullName}
				class="w-20 h-20 rounded-full object-cover bg-[#181818]"
				width="80"
				height="80"
			/>
		</div>
	{/if}

	<div class="blur-fade-in space-y-6 max-w-[70ch]">
		{#each bioText as paragraph}
			<p class="text-base leading-relaxed text-[#ededed] font-normal">{paragraph}</p>
		{/each}
	</div>

	<div class="blur-fade-in flex items-center gap-5 pt-2">
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

	<!-- Stack Section -->
	{#if data.site.techStack && data.site.techStack.length > 0}
		<section class="blur-fade-in space-y-4 pt-4 border-t border-[#1f1f1f]">
			<h2 class="text-xs font-semibold text-[#888888] uppercase tracking-wider">Stack</h2>
			<div class="flex flex-wrap gap-2.5">
				{#each data.site.techStack as tech}
					<span class="px-3 py-1.5 text-xs text-[#ededed] bg-[#141414] border border-[#222222] rounded-md font-medium">
						{tech}
					</span>
				{/each}
			</div>
		</section>
	{/if}

	<!-- Explore Links Section -->
	<section class="blur-fade-in space-y-4 pt-4 border-t border-[#1f1f1f]">
		<h2 class="text-xs font-semibold text-[#888888] uppercase tracking-wider">Explore</h2>
		<div class="flex flex-col gap-3">
			<a href="/writing" class="group flex items-baseline gap-4 py-1">
				<span class="text-base text-[#ededed] group-hover:underline underline-offset-4 font-medium">Writing</span>
				<span class="text-sm text-[#a1a1a1]">Thoughts and articles</span>
			</a>
			<a href="/project" class="group flex items-baseline gap-4 py-1">
				<span class="text-base text-[#ededed] group-hover:underline underline-offset-4 font-medium">Projects</span>
				<span class="text-sm text-[#a1a1a1]">Things I've built</span>
			</a>
			<a href="/gallery" class="group flex items-baseline gap-4 py-1">
				<span class="text-base text-[#ededed] group-hover:underline underline-offset-4 font-medium">Gallery</span>
				<span class="text-sm text-[#a1a1a1]">Photography</span>
			</a>
			<a href="/music" class="group flex items-baseline gap-4 py-1">
				<span class="text-base text-[#ededed] group-hover:underline underline-offset-4 font-medium">Music</span>
				<span class="text-sm text-[#a1a1a1]">What I'm listening to</span>
			</a>
			<a href="/academics" class="group flex items-baseline gap-4 py-1">
				<span class="text-base text-[#ededed] group-hover:underline underline-offset-4 font-medium">Academics</span>
				<span class="text-sm text-[#a1a1a1]">University archive</span>
			</a>
		</div>
	</section>
</div>
