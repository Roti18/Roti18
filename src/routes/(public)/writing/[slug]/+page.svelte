<script lang="ts">
	import { onMount } from 'svelte';
	import { Heart, ArrowLeft } from 'lucide-svelte';
	import LightboxImage from '$lib/components/public/LightboxImage.svelte';

	const { data } = $props();

	let likes = $state(0);
	let liked = $state(false);

	onMount(() => {
		likes = data.post.likes;
	});

	async function handleLike() {
		if (liked) return;
		liked = true;
		likes += 1;
	}
</script>

<svelte:head>
	<title>{data.post.title} - M. Roni</title>
	<meta name="description" content={data.post.excerpt || data.post.title} />
	<script type="application/ld+json">
		{JSON.stringify({
			"@context": "https://schema.org",
			"@type": "Article",
			"headline": data.post.title,
			"description": data.post.excerpt || data.post.title,
			"datePublished": data.post.createdAt,
			"dateModified": data.post.updatedAt,
			"author": { "@type": "Person", "name": "M. Roni" },
			"mainEntityOfPage": `https://rynds.my.id/writing/${data.post.slug}`
		})}
	</script>
</svelte:head>

<!-- Lightbox PhotoSwipe Integration -->
<LightboxImage containerId="article-content" />

<div class="max-w-5xl mx-auto px-6 py-12 space-y-12">
	<article class="blur-fade-in space-y-8">
		<header class="space-y-4 mb-10 pb-6 border-b border-[#1f1f1f]">
			<h1 class="text-3xl font-semibold text-[#ededed] leading-tight tracking-tight">
				{data.post.title}
			</h1>

			<!-- Like Button on the LEFT -->
			<div class="flex items-center gap-3">
				<button
					class="select-none inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#2a2a2a] text-xs text-[#ededed] hover:border-[#444444] transition-colors cursor-pointer {liked ? 'text-red-400 border-red-900 bg-red-950/30' : ''}"
					onclick={handleLike}
					aria-label="Like this post"
					id="like-button"
				>
					<Heart size={14} fill={liked ? 'currentColor' : 'none'} />
					<span class="tabular-nums">{likes}</span>
				</button>
			</div>
		</header>

		<!-- Article Body Content with PhotoSwipe WebP Lightbox -->
		<div id="article-content" class="prose prose-invert max-w-none prose-p:max-w-[75ch] prose-headings:max-w-[75ch] prose-hr:border-[#1f1f1f] prose-hr:my-8 text-base leading-relaxed text-[#ededed] space-y-6">
			{@html data.post.processedHtml}
		</div>
	</article>

	{#if data.readNext.length > 0}
		<footer class="blur-fade-in pt-10 border-t border-[#1f1f1f] space-y-4">
			<div class="w-6 h-0.5 bg-[#f87171] rounded-full"></div>
			<h2 class="text-xs font-semibold text-[#888888] uppercase tracking-wider">
				Read next
			</h2>
			<div class="flex flex-col gap-2">
				{#each data.readNext as next}
					<a
						href="/writing/{next.slug}"
						class="text-base text-[#ededed] hover:underline underline-offset-4 w-fit py-1 font-['Space_Grotesk']"
					>
						{next.title}
					</a>
				{/each}
			</div>
		</footer>
	{/if}

	<div class="blur-fade-in pt-6 border-t border-[#1f1f1f]">
		<a
			href="/writing"
			class="inline-flex items-center gap-2 text-sm text-[#a1a1a1] hover:text-white transition-colors hover:no-underline group w-fit"
		>
			<ArrowLeft size={14} class="transition-transform group-hover:-translate-x-1" />
			<span>Back to Writing</span>
		</a>
	</div>
</div>
