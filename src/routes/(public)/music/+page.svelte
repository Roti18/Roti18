<script lang="ts">
	import { browser } from '$app/environment';
	import { formatDate } from '$lib/utils/format';
	import { Disc } from 'lucide-svelte';
	import { canUseBlur } from '$lib/utils/perf';

	const { data } = $props();

	function getTrackUrl(track: any): string {
		return track.musicUrl || `https://lament.rynds.my.id/?search=${encodeURIComponent(track.title + ' ' + track.artist)}`;
	}

	let previewEl: HTMLElement;
	let currentTrack: typeof data.tracks[0] | null = $state(null);

	function calculateElementPosition(node: HTMLElement) {
		const rect = node.getBoundingClientRect();
		const previewWidth = 200;
		const previewHeight = 200;
		const headerHeight = 64; // Sticky header (56px) + safety buffer

		let x = rect.right - previewWidth;
		let y = rect.top - previewHeight - 14;

		if (y < headerHeight) {
			y = rect.bottom + 14;
		}

		x = Math.max(16, Math.min(x, window.innerWidth - previewWidth - 16));

		return { x, y };
	}

	function handleRowMouseEnter(track: typeof data.tracks[0], targetNode: HTMLElement) {
		currentTrack = track;

		if (browser) {
			import('gsap').then(({ gsap }) => {
				// GSAP Staggered Letter Build Animation on Song Title Hover
				const titleChars = targetNode.querySelectorAll('.title-char');
				if (titleChars.length > 0) {
					gsap.fromTo(
						titleChars,
						{ y: '35%', opacity: 0.2 },
						{ y: '0%', opacity: 1, duration: 0.3, stagger: 0.02, ease: 'power2.out' }
					);
				}

				// GSAP Song Cover Ink Bleed Reveal (Clean borderless image card)
				if (previewEl && targetNode) {
					const pos = calculateElementPosition(targetNode);
					gsap.killTweensOf(previewEl);

					gsap.set(previewEl, {
						x: pos.x,
						y: pos.y
					});

					gsap.fromTo(
						previewEl,
						{ opacity: 0, scale: 0.85, ...(canUseBlur() ? { filter: 'blur(16px) brightness(1.2)' } : {}) },
						{ opacity: 1, scale: 1, ...(canUseBlur() ? { filter: 'blur(0px) brightness(1)' } : {}), duration: 0.35, delay: 0.12, ease: 'power3.out' }
					);
				}
			});
		}
	}

	function handleRowMouseLeave() {
		currentTrack = null;
		if (browser && previewEl) {
			import('gsap').then(({ gsap }) => {
				gsap.to(previewEl, {
					opacity: 0,
					scale: 0.9,
					...(canUseBlur() ? { filter: 'blur(12px)' } : {}),
					duration: 0.2,
					ease: 'power2.in'
				});
			});
	}
	}
</script>

<svelte:head>
	<title>Music - M. Roni</title>
	<meta name="description" content="Music I've been listening to recently." />
</svelte:head>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="max-w-5xl mx-auto px-6 py-12 space-y-8" onmouseleave={handleRowMouseLeave}>
	<div class="blur-fade-in overflow-x-auto -mx-3">
		<table class="w-full text-left text-base text-[#ededed] border-collapse" id="music-table">
			<thead>
				<tr class="border-b border-[#1f1f1f] text-xs uppercase tracking-wider text-[#666666]">
					<th class="py-3.5 px-3 font-semibold">Song</th>
					<th class="py-3.5 px-3 font-semibold">Artist</th>
					<th class="py-3.5 px-3 font-semibold hidden sm:table-cell">Album</th>
					<th class="py-3.5 px-3 font-semibold text-right">Played</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-[#141414]">
				{#each data.tracks as track}
					<!-- svelte-ignore a11y_click_events_have_key_events -->
					<tr
						class="group hover:bg-[#141414] transition-colors cursor-pointer"
						id="track-{track.id}"
						onmouseenter={(e) => handleRowMouseEnter(track, e.currentTarget as HTMLElement)}
						onclick={() => window.open(getTrackUrl(track), '_blank')}
						title="Listen on Lament"
					>
						<td class="py-3.5 px-3 font-medium text-[#ededed]">
							<div class="flex items-center gap-3">
								<div class="w-9 h-9 rounded-md bg-[#181818] border border-[#222222] overflow-hidden shrink-0 flex items-center justify-center">
									{#if track.coverUrl}
										<img src={track.coverUrl} alt={track.title} loading="lazy" decoding="async" class="w-full h-full object-cover" />
									{:else}
										<Disc size={14} class="text-[#555555]" />
									{/if}
								</div>
								<span class="inline-flex overflow-hidden font-medium text-[#ededed] group-hover:underline underline-offset-4">
									{#each track.title.split('') as char}
										<span class="title-char inline-block">{char === ' ' ? '\u00A0' : char}</span>
									{/each}
								</span>
							</div>
						</td>
						<td class="py-3.5 px-3 text-[#a1a1a1] font-normal no-underline">{track.artist}</td>
						<td class="py-3.5 px-3 text-[#888888] hidden sm:table-cell font-normal no-underline">{track.album || '-'}</td>
						<td class="py-3.5 px-3 text-[#737373] text-right whitespace-nowrap font-normal no-underline">{formatDate(track.playedAt!)}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<!-- Pure Borderless Floating Song Cover Preview with Sleek Gradient Song Info -->
	<div
		class="fixed top-0 left-0 z-50 pointer-events-none w-52 rounded-xl overflow-hidden shadow-2xl bg-transparent"
		bind:this={previewEl}
		style="opacity: 0; transform: scale(0.85);"
	>
		{#if currentTrack}
			<div class="relative w-full aspect-square overflow-hidden rounded-xl bg-[#141414]">
				{#if currentTrack.coverUrl}
					<img src={currentTrack.coverUrl} alt={currentTrack.title} loading="lazy" decoding="async" class="w-full h-full object-cover block rounded-xl" />
				{:else}
					<div class="w-full h-full flex items-center justify-center bg-[#141414] text-[#555555] rounded-xl">
						<Disc size={32} />
					</div>
				{/if}
				<!-- Gradient Overlay for Title & Artist (No harsh outer border) -->
				<div class="absolute inset-x-0 bottom-0 p-3 bg-linear-to-t from-black/90 via-black/60 to-transparent flex flex-col justify-end">
					<div class="text-xs font-semibold text-white truncate drop-shadow-sm">{currentTrack.title}</div>
					<div class="text-[11px] text-[#a1a1a1] truncate font-normal">{currentTrack.artist}</div>
				</div>
			</div>
		{/if}
	</div>
</div>
