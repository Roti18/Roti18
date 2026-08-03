<script lang="ts">
	import SocialIcon from '$lib/components/public/SocialIcon.svelte';

	const { data } = $props();

	const aboutData = $derived((data as any).about);

	const bioParagraphs = $derived(
		(aboutData?.bio || data.site.longDescription || '')
			.split('\n\n')
			.filter(Boolean)
	);
</script>

<svelte:head>
	<title>About - M. Roni</title>
	<meta name="description" content={data.site.description} />
</svelte:head>

<div class="max-w-5xl mx-auto px-6 py-12 space-y-12">
	<!-- Hero Section -->
	<div class="blur-fade-in flex items-center gap-6">
		{#if data.site.avatarUrl}
			<img
				src={data.site.avatarUrl}
				alt={data.site.fullName}
				class="w-20 h-20 rounded-full object-cover bg-[#181818] border border-[#2a2a2a] shrink-0"
				width="80"
				height="80"
			/>
		{/if}
		<div>
			<h1 class="text-3xl font-semibold text-[#ededed] tracking-tight">{data.site.fullName}</h1>
			<p class="text-sm font-mono text-[#777777] mt-1">{data.site.title}</p>
		</div>
	</div>

	<!-- Bio Paragraphs -->
	<div class="blur-fade-in space-y-6 max-w-[70ch]">
		{#each bioParagraphs as paragraph}
			<p class="text-base leading-relaxed text-[#ededed] font-normal">{paragraph}</p>
		{/each}
	</div>

	<!-- Social Links -->
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

	<!-- Skills / Tech Stack Section -->
	{#if aboutData?.skills && aboutData.skills.length > 0}
		<div class="blur-fade-in space-y-4 pt-6 border-t border-[#1f1f1f]">
			<div class="w-6 h-0.5 bg-[#f87171] rounded-full"></div>
			<h2 class="text-xs font-semibold text-[#888888] uppercase tracking-wider">
				Skills & Technologies
			</h2>
			<div class="flex flex-wrap gap-2">
				{#each aboutData.skills as skill}
					<span class="px-3 py-1 rounded-full bg-[#181818] border border-[#2a2a2a] text-xs font-mono text-[#ededed]">
						{skill}
					</span>
				{/each}
			</div>
		</div>
	{/if}

	<!-- Experience Section -->
	{#if aboutData?.experience && aboutData.experience.length > 0}
		<div class="blur-fade-in space-y-6 pt-6 border-t border-[#1f1f1f]">
			<div class="w-6 h-0.5 bg-[#f87171] rounded-full"></div>
			<h2 class="text-xs font-semibold text-[#888888] uppercase tracking-wider">
				Experience
			</h2>
			<div class="space-y-6">
				{#each aboutData.experience as exp}
					<div class="space-y-1">
						<div class="flex items-baseline justify-between gap-4">
							<h3 class="text-base font-medium text-[#ededed]">{exp.role}</h3>
							<span class="text-xs font-mono text-[#777777] shrink-0">{exp.period}</span>
						</div>
						<p class="text-xs font-mono text-[#a1a1a1]">{exp.company}</p>
						{#if exp.desc}
							<p class="text-sm text-[#888888] leading-relaxed pt-1">{exp.desc}</p>
						{/if}
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>
