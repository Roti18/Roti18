<script lang="ts">
	export let title: string;
	export let subtitle: string;
	export let description: string;
	export let image: string;
	export let url: string;
	export let isMobile: boolean;
</script>

<a href={url} class="block w-full focus:outline-none">
	<article
		class="
				relative
				min-h-[500px]
				w-full overflow-hidden rounded-sm border border-gray-600/20
			bg-black
			transition-all duration-300
			hover:border-red-400/40
		"
	>
		<div class="relative aspect-video overflow-hidden bg-black">
			<img src={image} alt={title} class="h-full w-full object-cover" loading="lazy" />
			<div
				class="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent"
			></div>
		</div>

		<div class={isMobile ? 'p-3' : 'p-5'}>
			<div class="mb-2 h-px w-10 bg-red-500"></div>

			<h3
				class={`mb-1.5 font-light tracking-wider text-white ${isMobile ? 'text-sm' : 'text-base'}`}
			>
				{title}
			</h3>

			<p
				class={`mb-2 font-light tracking-[0.2em] text-red-500 uppercase ${isMobile ? 'text-[10px]' : 'text-[11px]'}`}
			>
				{subtitle}
			</p>

			<p
				class={`line-clamp-2 leading-relaxed text-neutral-500 ${
					isMobile ? 'text-[11px]' : 'text-xs'
				}`}
			>
				{description}
			</p>
		</div>
	</article>
</a>

<style>
	.line-clamp-2 {
		overflow: hidden;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 4;
	}
</style>
