<script lang="ts">
	import { browser } from "$app/environment";
	import { env } from "$env/dynamic/public";
	import SEO from "$lib/components/public/SEO.svelte";
	import { formatDate } from "$lib/utils/format";
	import { Disc, Loader2 } from "lucide-svelte";
	import { canUseBlur } from "$lib/utils/perf";
	import { onMount } from "svelte";

	const { data } = $props();

	let loadedTracks = $state(data.tracks || []);
	let loadingMore = $state(false);
	let hasMore = $state((data.tracks || []).length === 20);
	let loadMoreEl = $state<HTMLElement>();

	$effect(() => {
		loadedTracks = data.tracks || [];
		hasMore = (data.tracks || []).length === 20;
	});

	onMount(() => {
		if (!browser) return;
		// Wait a tick for the element to bind
		setTimeout(() => {
			if (!loadMoreEl) return;
			const observer = new IntersectionObserver(
				async (entries) => {
					// Only load more if we haven't exhausted the DB
					if (
						entries[0].isIntersecting &&
						!loadingMore &&
						hasMore
					) {
						loadingMore = true;
						try {
							const res = await fetch(`/api/music/tracks?offset=${loadedTracks.length}&limit=20`);
							if (res.ok) {
								const json = await res.json();
								if (json.tracks && json.tracks.length > 0) {
									loadedTracks = [...loadedTracks, ...json.tracks];
									if (json.tracks.length < 20) {
										hasMore = false;
									}
								} else {
									hasMore = false;
								}
							} else {
								hasMore = false;
							}
						} catch (e) {
							console.error(e);
							hasMore = false;
						} finally {
							loadingMore = false;
						}
					}
				},
				{ rootMargin: "300px" },
			);

			observer.observe(loadMoreEl);
			return () => observer.disconnect();
		}, 100);
	});

	function getTrackUrl(track: any): string {
		const lamentUrl = env.PUBLIC_LAMENT_URL as string;
		return (
			track.musicUrl ||
			`${lamentUrl}/?search=${encodeURIComponent(track.title + " " + track.artist)}`
		);
	}

	let previewEl: HTMLElement;
	let currentTrack: (typeof data.tracks)[0] | null = $state(null);

	function calculateElementPosition(node: HTMLElement, e: MouseEvent) {
		const rect = node.getBoundingClientRect();
		const previewWidth = 200;
		const previewHeight = 200;
		const headerHeight = 64; // Sticky header (56px) + safety buffer

		// Position it near the mouse pointer (20px to the right)
		let x = e.clientX + 20;
		let y = rect.top - previewHeight - 14;

		if (y < headerHeight) {
			y = rect.bottom + 14;
		}

		x = Math.max(16, Math.min(x, window.innerWidth - previewWidth - 16));

		return { x, y };
	}

	function handleRowMouseEnter(
		track: (typeof data.tracks)[0],
		targetNode: HTMLElement,
		e: MouseEvent,
	) {
		currentTrack = track;

		if (browser) {
			if (
				!window.matchMedia("(hover: hover) and (pointer: fine)").matches
			)
				return;
			import("gsap").then(({ gsap }) => {
				// GSAP Staggered Letter Build Animation on Song Title Hover
				const titleChars = targetNode.querySelectorAll(".title-char");
				if (titleChars.length > 0) {
					gsap.fromTo(
						titleChars,
						{ y: "35%", opacity: 0.2 },
						{
							y: "0%",
							opacity: 1,
							duration: 0.3,
							stagger: 0.02,
							ease: "power2.out",
						},
					);
				}

				// GSAP Song Cover Ink Bleed Reveal (Clean borderless image card)
				if (previewEl && targetNode) {
					const pos = calculateElementPosition(targetNode, e);
					gsap.killTweensOf(previewEl);

					gsap.set(previewEl, {
						x: pos.x,
						y: pos.y,
					});

					gsap.fromTo(
						previewEl,
						{
							opacity: 0,
							scale: 0.85,
							...(canUseBlur()
								? { filter: "blur(16px) brightness(1.2)" }
								: {}),
						},
						{
							opacity: 1,
							scale: 1,
							...(canUseBlur()
								? { filter: "blur(0px) brightness(1)" }
								: {}),
							duration: 0.35,
							delay: 0.12,
							ease: "power3.out",
						},
					);
				}
			});
		}
	}

	function handleRowMouseLeave() {
		if (browser && previewEl) {
			import("gsap").then(({ gsap }) => {
				gsap.killTweensOf(previewEl);
				gsap.to(previewEl, {
					opacity: 0,
					scale: 0.9,
					...(canUseBlur() ? { filter: "blur(12px)" } : {}),
					duration: 0.2,
					ease: "power2.in",
					onComplete: () => {
						currentTrack = null;
					},
				});
			});
		} else {
			currentTrack = null;
		}
	}
</script>

<SEO
	title="Music - M. Roni"
	description="Music I've been listening to recently."
/>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class="max-w-5xl mx-auto px-6 py-12 space-y-8"
	onmouseleave={handleRowMouseLeave}
>
	<div class="blur-fade-in overflow-x-auto -mx-3">
		<table
			class="w-full text-left text-base text-[#ededed] border-collapse table-fixed"
			id="music-table"
		>
			<thead>
				<tr
					class="border-b border-[#1f1f1f] text-xs uppercase tracking-wider text-[#666666]"
				>
					<th class="py-3.5 px-3 font-semibold w-[45%] sm:w-[35%]">Song</th>
					<th class="py-3.5 px-3 font-semibold w-[30%] sm:w-[25%]">Artist</th>
					<th
						class="py-3.5 px-3 font-semibold text-right hidden sm:table-cell sm:w-[25%]"
						>Album</th
					>
					<th
						class="py-3.5 px-3 font-semibold text-left sm:text-right w-[25%] sm:w-[15%]"
						>Played</th
					>
				</tr>
			</thead>
			<tbody class="divide-y divide-[#141414]">
				{#each loadedTracks as track}
					<!-- svelte-ignore a11y_click_events_have_key_events -->
					<tr
						class="group hover:bg-[#141414] transition-colors cursor-pointer"
						id="track-{track.id}"
						onmouseenter={(e) =>
							handleRowMouseEnter(
								track,
								e.currentTarget as HTMLElement,
								e,
							)}
						onclick={() =>
							window.open(getTrackUrl(track), "_blank")}
						data-tooltip="Listen on Lament"
					>
						<td class="py-3.5 px-3 font-medium text-[#ededed] overflow-hidden whitespace-nowrap">
							<div class="flex items-center gap-3">
								<div
									class="w-9 h-9 rounded-md bg-[#181818] border border-[#222222] overflow-hidden shrink-0 flex items-center justify-center"
								>
									{#if track.coverUrl}
										<img
											src={track.coverUrl}
											alt={track.title}
											loading="lazy"
											decoding="async"
											referrerpolicy="no-referrer"
											class="w-full h-full object-cover"
										/>
									{:else}
										<Disc
											size={14}
											class="text-[#555555]"
										/>
									{/if}
								</div>
								<span
									class="inline-flex overflow-hidden font-medium text-[#ededed] group-hover:underline underline-offset-4"
								>
									{#each track.title.split("") as char}
										<span class="title-char inline-block"
											>{char === " "
												? "\u00A0"
												: char}</span
										>
									{/each}
								</span>
							</div>
						</td>
						<td
							class="py-3.5 px-3 text-[#a1a1a1] font-normal no-underline truncate"
							data-tooltip={track.artist}
						>
							{track.artist}
						</td>
						<td
							class="py-3.5 px-3 text-[#888888] font-normal no-underline text-right hidden sm:table-cell truncate"
							data-tooltip={track.album}
						>
							{track.album || "-"}
						</td>
						<td
							class="py-3.5 px-3 text-[#737373] text-left sm:text-right whitespace-nowrap font-normal no-underline"
							>{formatDate(track.playedAt!)}</td
						>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<!-- Infinite Scroll Trigger Element -->
	<div
		bind:this={loadMoreEl}
		class="w-full h-20 flex items-center justify-center pt-8"
	>
		{#if loadingMore}
			<Loader2 class="w-5 h-5 text-[#666] animate-spin" />
		{/if}
	</div>

	<!-- Vinyl Grooves "Picture Disc" in a Frosted Glass Sleeve -->
	<div
		class="fixed top-0 left-0 z-50 pointer-events-none w-52 rounded-2xl overflow-hidden shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_24px_48px_rgba(0,0,0,0.8)] bg-white/10 backdrop-blur-2xl p-4 flex-col items-center gap-4 ring-1 ring-black/50 hidden md:flex"
		bind:this={previewEl}
		style="opacity: 0; transform: scale(0.85);"
	>
		{#if currentTrack}
			<!-- Spinning Picture Disc Vinyl -->
			<div
				class="relative w-40 h-40 rounded-full overflow-hidden border-[4px] border-[#0a0a0a] shadow-[0_8px_16px_rgba(0,0,0,0.6)] shrink-0 animate-[spin_5s_linear_infinite]"
			>
				<!-- Cover Art (The Picture) -->
				{#if currentTrack.coverUrl}
					<img
						src={currentTrack.coverUrl}
						alt="Cover"
						class="w-full h-full object-cover saturate-[1.2]"
					/>
				{:else}
					<div
						class="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-700"
					></div>
				{/if}

				<!-- Vinyl Grooves Overlay (repeating radial gradient to mask pixelation) -->
				<div
					class="absolute inset-0 pointer-events-none"
					style="background: repeating-radial-gradient(circle at center, transparent 0, transparent 1.5px, rgba(0,0,0,0.65) 1.5px, rgba(0,0,0,0.65) 3px);"
				></div>

				<!-- Vinyl Plastic Shine (conic gradient) -->
				<div
					class="absolute inset-0 pointer-events-none mix-blend-screen opacity-50"
					style="background: conic-gradient(from 45deg, transparent 0deg, rgba(255,255,255,0.5) 20deg, transparent 50deg, transparent 180deg, rgba(255,255,255,0.5) 200deg, transparent 230deg);"
				></div>

				<!-- Center Spindle Hole & Label -->
				<div
					class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#111] border border-[#222] flex items-center justify-center shadow-2xl"
				>
					<!-- Center Hole -->
					<div
						class="w-2.5 h-2.5 rounded-full bg-[#050505] shadow-inner"
					></div>
				</div>
			</div>

			<!-- Typography -->
			<div class="relative z-10 w-full text-center space-y-0.5 px-1">
				<div
					class="text-[13px] font-bold text-white truncate drop-shadow-md tracking-tight leading-tight font-['Space_Grotesk']"
				>
					{currentTrack.title}
				</div>
				<div
					class="text-[11px] text-[#a1a1a1] truncate drop-shadow-sm font-medium"
				>
					{currentTrack.artist}
				</div>
			</div>
		{/if}
	</div>
</div>
