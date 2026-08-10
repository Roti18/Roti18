<script lang="ts">
	import { ArrowLeft } from 'lucide-svelte';
	import SEO from '$lib/components/public/SEO.svelte';

	const { data } = $props();
</script>

<SEO 
	title={`${data.photo.title} - Gallery - M. Roni`}
	description={data.photo.shortDesc || data.photo.title}
	image={data.photo.originalUrl || data.photo.imageUrl}
/>

<div class="max-w-5xl mx-auto px-6 py-16 space-y-8">
	<article class="blur-fade-in space-y-6">
		<div class="rounded-xl overflow-hidden bg-[#141414] border border-[#1f1f1f]">
			<img
				src={data.photo.imageUrl}
				alt={data.photo.title}
				loading="lazy"
				class="w-full h-auto block"
				{...data.photo.width && data.photo.height ? { width: data.photo.width, height: data.photo.height } : {}}
			/>
		</div>

		<div class="space-y-2">
			<h1 class="text-xl font-medium text-[#ededed]">{data.photo.title}</h1>
			{#if data.photo.shortDesc}
				<p class="text-sm text-[#999999]">{data.photo.shortDesc}</p>
			{/if}
			{#if data.photo.cameraDesc}
				<p class="text-xs text-[#555555] font-mono">{data.photo.cameraDesc}</p>
			{/if}
		</div>

		<div class="pt-4 border-t border-[#1f1f1f]">
			<a
				href="/gallery"
				class="text-sm text-[#a1a1a1] hover:text-red-400 hover:no-underline transition-colors flex items-center gap-2 w-fit group"
			>
				<ArrowLeft size={14} class="transition-transform group-hover:-translate-x-1" />
				<span>Back</span>
			</a>
		</div>
	</article>
</div>
