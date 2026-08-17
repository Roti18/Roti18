<script lang="ts">
	import { onMount, tick, untrack } from "svelte";
	import { browser } from "$app/environment";
	import { pushState } from "$app/navigation";
	import { page } from "$app/state";
	import { canUseBlur } from "$lib/utils/perf";
	import { formatDate } from "$lib/utils/format";
	import { Camera, Calendar, MapPin, X } from "lucide-svelte";

	import SEO from "$lib/components/public/SEO.svelte";

	const { data } = $props();

	let gridEl = $state<HTMLElement>();
	let modalEl = $state<HTMLElement>();
	let modalImageEl = $state<HTMLElement>();
	let metaContainer = $state<HTMLElement>();
	let selectedPhoto: (typeof data.photos)[number] | null = $state(null);
	let imgWidth = $state(0);
	let imgHeight = $state(0);
	let isPortrait = $derived(
		(selectedPhoto as any)?.width && (selectedPhoto as any)?.height
			? (selectedPhoto as any).height >= (selectedPhoto as any).width
			: imgWidth > 0 && imgHeight > 0
				? imgHeight >= imgWidth
				: false,
	);
	let isClosing = false;

	const statePhoto = $derived(
		(page.state as any)?.photo as (typeof data.photos)[number] | undefined,
	);

	let loadedPhotos = $state(untrack(() => data.photos || []));
	let loadingMore = $state(false);
	let hasMore = $state(untrack(() => (data.photos || []).length === 20));
	let loadMoreEl = $state<HTMLElement>();

	$effect(() => {
		if (statePhoto) {
			selectedPhoto = statePhoto;
			isClosing = false;
			tick().then(() => showModal());
		} else {
			selectedPhoto = null;
		}
	});

	$effect(() => {
		loadedPhotos = data.photos || [];
		hasMore = (data.photos || []).length === 20;
	});

	onMount(async () => {
		if (browser && gridEl) {
			if (window.innerWidth >= 1024) {
				const { gsap } = await import("gsap");
				const items = gridEl.querySelectorAll(".gallery-item");
				gsap.fromTo(
					items,
					{
						opacity: 0,
						...(canUseBlur() ? { filter: "blur(12px)" } : {}),
					},
					{
						opacity: 1,
						...(canUseBlur() ? { filter: "blur(0px)" } : {}),
						duration: 0.7,
						ease: "power2.out",
						stagger: { amount: 0.35 },
						clearProps: canUseBlur() ? "filter" : "",
					},
				);
			}
		}

		if (!browser) return;
		setTimeout(() => {
			if (!loadMoreEl) return;
			const observer = new IntersectionObserver(
				async (entries) => {
					if (entries[0].isIntersecting && !loadingMore && hasMore) {
						loadingMore = true;
						try {
							const res = await fetch(
								`/api/gallery/photos?offset=${loadedPhotos.length}&limit=20`,
							);
							if (res.ok) {
								const json = await res.json();
								if (json.photos && json.photos.length > 0) {
									const previousLength = loadedPhotos.length;
									loadedPhotos = [
										...loadedPhotos,
										...json.photos,
									];
									if (json.photos.length < 20)
										hasMore = false;

									tick().then(async () => {
										if (gridEl) {
											const items =
												gridEl.querySelectorAll(
													".gallery-item",
												);
											const newItems =
												Array.from(items).slice(
													previousLength,
												);
											if (newItems.length > 0) {
												if (window.innerWidth >= 1024) {
													const { gsap } =
														await import("gsap");
													gsap.fromTo(
														newItems,
														{
															opacity: 0,
															...(canUseBlur()
																? {
																		filter: "blur(12px)",
																	}
																: {}),
														},
														{
															opacity: 1,
															...(canUseBlur()
																? {
																		filter: "blur(0px)",
																	}
																: {}),
															duration: 0.7,
															ease: "power2.out",
															stagger: {
																amount: 0.35,
															},
															clearProps:
																canUseBlur()
																	? "filter"
																	: "",
														},
													);
												}
											}
										}
									});
								} else {
									hasMore = false;
								}
								``;
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

	function openPhoto(photo: (typeof data.photos)[number]) {
		const plainPhoto = $state.snapshot(photo);
		pushState("", { photo: plainPhoto });
	}

	async function showModal() {
		if (!browser) return;
		await tick();
		if (!modalEl || !modalImageEl) return;

		if (window.innerWidth < 1024) {
			return;
		}

		const { gsap } = await import("gsap");
		gsap.killTweensOf([modalEl, modalImageEl]);

		gsap.fromTo(
			modalEl,
			{ opacity: 0 },
			{ opacity: 1, duration: 0.35, ease: "power2.out" },
		);

		gsap.fromTo(
			modalImageEl,
			{
				scale: 0.7,
				opacity: 0,
				y: 40,
				...(canUseBlur() ? { filter: "blur(16px)" } : {}),
			},
			{
				scale: 1,
				opacity: 1,
				y: 0,
				...(canUseBlur() ? { filter: "blur(0px)" } : {}),
				duration: 0.55,
				ease: "power3.out",
				clearProps: canUseBlur() ? "filter" : "",
			},
		);
	}

	async function closeModal() {
		if (!browser || !modalEl || isClosing) return;
		isClosing = true;

		if (window.innerWidth < 1024) {
			isClosing = false;
			history.back();
			return;
		}

		const { gsap } = await import("gsap");

		gsap.to(modalEl, { opacity: 0, duration: 0.3, ease: "power2.inOut" });

		if (modalImageEl) {
			gsap.to(modalImageEl, {
				scale: 0.8,
				opacity: 0,
				y: 25,
				...(canUseBlur() ? { filter: "blur(10px)" } : {}),
				duration: 0.3,
				ease: "power2.inOut",
				onComplete: () => {
					isClosing = false;
					history.back();
				},
			});
		} else {
			isClosing = false;
			history.back();
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === "Escape" && selectedPhoto) {
			closeModal();
		}
	}

	function handleMouseMove(e: MouseEvent) {
		if (!browser || !metaContainer) return;
		if (
			window.innerWidth < 1024 ||
			window.matchMedia("(hover: none)").matches
		)
			return;
		const rect = metaContainer.getBoundingClientRect();

		// Optional: only show flashlight if cursor is somewhat near the metadata
		// But allowing it from everywhere gives a cool effect as the light approaches

		import("gsap").then(({ gsap }) => {
			if (!metaContainer) return;
			gsap.to(metaContainer, {
				"--mouse-x": `${e.clientX - rect.left}px`,
				"--mouse-y": `${e.clientY - rect.top}px`,
				duration: 0.4,
				ease: "power3.out",
				overwrite: "auto",
			});
		});
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<SEO title="Gallery - M. Roni" description="A collection of photographs." />

<div class="max-w-5xl mx-auto px-6 py-12 space-y-8">
	<div
		class="flex flex-col gap-24 md:gap-40"
		bind:this={gridEl}
		id="gallery-grid"
	>
		{#each loadedPhotos as photo, i (photo.id)}
			{@const isPortrait = photo.width && photo.height && photo.height > photo.width}
			{@const pattern = i % 4}
			
			{#if pattern === 0}
				<!-- Image Left (Large), Text Right (Centered) -->
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<div class="gallery-item flex flex-col md:flex-row items-center gap-8 md:gap-16 group cursor-pointer" onclick={() => openPhoto(photo)}>
					<div class="w-full md:w-3/5 overflow-hidden rounded-xl bg-[#141414] shadow-2xl relative">
						<img draggable="false" oncontextmenu={(e) => e.preventDefault()} src={photo.originalUrl || photo.imageUrl} alt={photo.title} class="select-none w-full h-auto object-cover opacity-0 scale-[1.03] group-hover:scale-100 transition-all duration-700 ease-out" onload={(e) => e.currentTarget.classList.remove('opacity-0', 'scale-[1.03]')}/>
					</div>
					<div class="w-full md:w-2/5 space-y-4 md:pr-8">
						<div class="flex items-center gap-3 text-[#888888] text-[10px] font-mono uppercase tracking-widest mb-2">
							{#if photo.locationName}<span>{photo.locationName}</span>{/if}
							<div class="w-8 h-px bg-[#333]"></div>
							<span class="text-[#ededed]">{(i+1).toString().padStart(2, '0')}</span>
						</div>
						<h2 class="text-4xl md:text-5xl font-bold text-[#ededed] font-['Space_Grotesk'] tracking-tighter leading-[1.1] group-hover:text-white transition-colors">
							{photo.title}
						</h2>
						{#if photo.shortDesc}
							<p class="text-base text-[#a1a1a1] leading-relaxed pt-2">{photo.shortDesc}</p>
						{/if}
						{#if photo.cameraDesc || photo.createdAt}
							<div class="flex items-center gap-3 pt-4 text-[10px] text-[#666] font-mono uppercase tracking-wider whitespace-nowrap overflow-x-auto w-full [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
								{#if photo.cameraDesc}<span>{photo.cameraDesc}</span>{/if}
								{#if photo.cameraDesc && photo.createdAt}<span class="opacity-40">|</span>{/if}
								{#if photo.createdAt}<span>{formatDate(new Date(photo.createdAt))}</span>{/if}
							</div>
						{/if}
					</div>
				</div>
			
			{:else if pattern === 1}
				<!-- Text Left, Image Right (Portrait-ish or offset) -->
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<div class="gallery-item flex flex-col md:flex-row items-center gap-8 md:gap-16 group cursor-pointer" onclick={() => openPhoto(photo)}>
					<div class="w-full md:w-2/5 space-y-4 md:pl-8 order-2 md:order-1 text-left md:text-right flex flex-col md:items-end">
						<div class="flex items-center justify-start md:justify-end gap-3 text-[#888888] text-[10px] font-mono uppercase tracking-widest mb-2">
							{#if photo.locationName}<span>{photo.locationName}</span>{/if}
							<div class="w-8 h-px bg-[#333]"></div>
							<span class="text-[#ededed]">{(i+1).toString().padStart(2, '0')}</span>
						</div>
						<h2 class="text-4xl md:text-5xl font-bold text-[#ededed] font-['Space_Grotesk'] tracking-tighter leading-[1.1] group-hover:text-white transition-colors">
							{photo.title}
						</h2>
						{#if photo.shortDesc}
							<p class="text-base text-[#a1a1a1] leading-relaxed pt-2">{photo.shortDesc}</p>
						{/if}
						{#if photo.cameraDesc || photo.createdAt}
							<div class="flex items-center md:justify-end gap-3 pt-4 text-[10px] text-[#666] font-mono uppercase tracking-wider whitespace-nowrap overflow-x-auto w-full [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
								{#if photo.cameraDesc}<span>{photo.cameraDesc}</span>{/if}
								{#if photo.cameraDesc && photo.createdAt}<span class="opacity-40">|</span>{/if}
								{#if photo.createdAt}<span>{formatDate(new Date(photo.createdAt))}</span>{/if}
							</div>
						{/if}
					</div>
					<div class="w-full md:w-3/5 overflow-hidden rounded-xl bg-[#141414] shadow-2xl relative order-1 md:order-2 md:ml-auto">
						<img draggable="false" oncontextmenu={(e) => e.preventDefault()} src={photo.originalUrl || photo.imageUrl} alt={photo.title} class="select-none w-full h-auto object-cover opacity-0 scale-[1.03] group-hover:scale-100 transition-all duration-700 ease-out" onload={(e) => e.currentTarget.classList.remove('opacity-0', 'scale-[1.03]')}/>
					</div>
				</div>

			{:else if pattern === 2}
				<!-- Wide Image Center, Text Below Split -->
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<div class="gallery-item flex flex-col gap-6 group cursor-pointer w-full md:w-[95%] mx-auto" onclick={() => openPhoto(photo)}>
					<div class="w-full overflow-hidden rounded-xl bg-[#141414] shadow-2xl relative flex justify-center">
						<img draggable="false" oncontextmenu={(e) => e.preventDefault()} src={photo.originalUrl || photo.imageUrl} alt={photo.title} class="select-none w-full h-auto {isPortrait ? '' : 'max-h-[70vh]'} object-cover opacity-0 scale-[1.03] group-hover:scale-100 transition-all duration-700 ease-out" onload={(e) => e.currentTarget.classList.remove('opacity-0', 'scale-[1.03]')}/>
					</div>
					<div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
						<div class="space-y-2 md:w-1/2">
							<div class="flex items-center gap-3 text-[#888888] text-[10px] font-mono uppercase tracking-widest mb-1">
								{#if photo.locationName}<span>{photo.locationName}</span>{/if}
								<div class="w-8 h-px bg-[#333]"></div>
								<span class="text-[#ededed]">{(i+1).toString().padStart(2, '0')}</span>
							</div>
							<h2 class="text-4xl md:text-5xl font-bold text-[#ededed] font-['Space_Grotesk'] tracking-tighter leading-[1.1] group-hover:text-white transition-colors">
								{photo.title}
							</h2>
						</div>
						<div class="md:w-1/2 flex flex-col md:items-end gap-2 text-left md:text-right">
							{#if photo.shortDesc}
								<p class="text-base text-[#a1a1a1] leading-relaxed max-w-sm">{photo.shortDesc}</p>
							{/if}
							{#if photo.cameraDesc || photo.createdAt}
								<div class="flex items-center md:justify-end gap-3 pt-2 text-[10px] text-[#666] font-mono uppercase tracking-wider whitespace-nowrap overflow-x-auto w-full [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
									{#if photo.cameraDesc}<span>{photo.cameraDesc}</span>{/if}
									{#if photo.cameraDesc && photo.createdAt}<span class="opacity-40">|</span>{/if}
									{#if photo.createdAt}<span>{formatDate(new Date(photo.createdAt))}</span>{/if}
								</div>
							{/if}
						</div>
					</div>
				</div>

			{:else}
				<!-- Image Right (Small), Text Left (Massive) -->
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<div class="gallery-item flex flex-col md:flex-row items-center gap-8 md:gap-12 group cursor-pointer w-full md:w-[90%] mx-auto" onclick={() => openPhoto(photo)}>
					<div class="w-full md:w-1/2 space-y-5 order-2 md:order-1 md:pr-12">
						<div class="flex items-center gap-3 text-[#888888] text-[10px] font-mono uppercase tracking-widest">
							{#if photo.locationName}<span>{photo.locationName}</span>{/if}
							<div class="w-8 h-px bg-[#333]"></div>
							<span class="text-[#ededed]">{(i+1).toString().padStart(2, '0')}</span>
						</div>
						<h2 class="text-5xl md:text-7xl font-bold text-[#ededed] font-['Space_Grotesk'] tracking-tighter leading-[0.95] group-hover:text-white transition-colors">
							{photo.title}
						</h2>
						{#if photo.shortDesc}
							<p class="text-lg text-[#a1a1a1] leading-relaxed pt-2">{photo.shortDesc}</p>
						{/if}
						{#if photo.cameraDesc || photo.createdAt}
							<div class="flex items-center gap-3 pt-2 text-[10px] text-[#666] font-mono uppercase tracking-wider whitespace-nowrap overflow-x-auto w-full [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
								{#if photo.cameraDesc}<span>{photo.cameraDesc}</span>{/if}
								{#if photo.cameraDesc && photo.createdAt}<span class="opacity-40">|</span>{/if}
								{#if photo.createdAt}<span>{formatDate(new Date(photo.createdAt))}</span>{/if}
							</div>
						{/if}
					</div>
					<div class="w-full md:w-1/2 overflow-hidden rounded-xl bg-[#141414] shadow-2xl relative order-1 md:order-2">
						<img draggable="false" oncontextmenu={(e) => e.preventDefault()} src={photo.originalUrl || photo.imageUrl} alt={photo.title} class="select-none w-full h-auto object-cover opacity-0 scale-[1.03] group-hover:scale-100 transition-all duration-700 ease-out" onload={(e) => e.currentTarget.classList.remove('opacity-0', 'scale-[1.03]')}/>
					</div>
				</div>
			{/if}
		{/each}
	</div>
	<div
		bind:this={loadMoreEl}
		class="h-10 w-full flex items-center justify-center"
	>
		{#if loadingMore}
			<div
				class="w-5 h-5 rounded-full border-2 border-[#333333] border-t-white animate-spin"
			></div>
		{/if}
	</div>
</div>

<!-- Shallow Routing Modal (Centered Photo Details) -->
{#if selectedPhoto}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div
		class="fixed inset-0 z-50 bg-black/98 md:bg-black/80 md:backdrop-blur-2xl flex items-center justify-center p-6 cursor-pointer transform-gpu"
		bind:this={modalEl}
		onclick={closeModal}
		onmousemove={handleMouseMove}
	>
		<div
			class="relative max-w-6xl max-h-[90vh] w-full flex {isPortrait
				? 'flex-col md:flex-row md:items-center'
				: 'flex-col items-center'} justify-center gap-6 md:gap-8 cursor-default mx-auto transform-gpu"
			onclick={(e) => e.stopPropagation()}
			bind:this={modalImageEl}
		>
			<div class="relative w-fit h-fit flex-shrink-0">
				<img
					draggable="false"
					oncontextmenu={(e) => e.preventDefault()}
					src={selectedPhoto.originalUrl || selectedPhoto.imageUrl}
					alt={selectedPhoto.title}
					decoding="async"
					class="select-none max-h-[75vh] w-auto max-w-full object-contain rounded-2xl shadow-2xl border border-[#2a2a2a]"
					bind:clientWidth={imgWidth}
					bind:clientHeight={imgHeight}
				/>
				<!-- Close Button -->
				<button
					class="absolute top-3 right-3 md:top-4 md:right-4 z-[60] p-2 rounded-full bg-[#111]/80 hover:bg-[#222] border border-[#333] text-[#ededed] backdrop-blur-md cursor-pointer flex items-center justify-center transition-colors shadow-lg"
					onclick={(e) => {
						e.stopPropagation();
						closeModal();
					}}
					onmouseenter={(e) => {
						const icon = e.currentTarget.querySelector('svg');
						if(icon) {
							import('gsap').then(({ gsap }) => {
								gsap.to(icon, { rotation: 90, scale: 1.2, duration: 0.4, ease: 'back.out(2)' });
							});
						}
					}}
					onmouseleave={(e) => {
						const icon = e.currentTarget.querySelector('svg');
						if(icon) {
							import('gsap').then(({ gsap }) => {
								gsap.to(icon, { rotation: 0, scale: 1, duration: 0.3, ease: 'power2.out' });
							});
						}
					}}
					onmousedown={(e) => {
						const icon = e.currentTarget.querySelector('svg');
						if(icon) {
							import('gsap').then(({ gsap }) => {
								gsap.to(icon, { scale: 0.8, duration: 0.1 });
							});
						}
					}}
					onmouseup={(e) => {
						const icon = e.currentTarget.querySelector('svg');
						if(icon) {
							import('gsap').then(({ gsap }) => {
								gsap.to(icon, { scale: 1.2, duration: 0.2, ease: 'back.out(2)' });
							});
						}
					}}
					aria-label="Close modal"
				>
					<X class="w-4 h-4 md:w-5 md:h-5" />
				</button>
			</div>

			<div
				class="text-left flex flex-col {isPortrait
					? 'justify-center w-full md:w-[260px] lg:w-[300px] shrink-0'
					: 'md:flex-row md:items-start'} justify-between gap-6 spotlight-mask {isPortrait
					? 'mx-0'
					: 'mx-auto'}"
				bind:this={metaContainer}
				style:width={isPortrait
					? null
					: imgWidth
						? imgWidth + "px"
						: "100%"}
				style:min-width={isPortrait ? null : "min(100%, 560px)"}
			>
				<div class="space-y-1.5 flex-1">
					<h2
						class="text-base md:text-xl font-bold text-white font-['Space_Grotesk'] tracking-tight leading-tight"
					>
						{selectedPhoto.title}
					</h2>
					{#if selectedPhoto.shortDesc}
						<p
							class="text-xs md:text-sm text-[#a1a1a1] max-w-xl leading-relaxed"
						>
							{selectedPhoto.shortDesc}
						</p>
					{/if}
				</div>

				<div
					class="flex flex-col items-stretch shrink-0 pt-2 gap-2 {isPortrait ? '' : 'md:ml-auto'}"
				>
					{#if selectedPhoto.cameraDesc}
						<div
							class="flex items-center gap-1.5 md:gap-2 font-mono text-[10px] md:text-xs text-[#ededed] px-3 md:px-4 py-1.5 md:py-2 bg-[#222222]/80 backdrop-blur-md rounded-xl"
						>
							<Camera class="w-3.5 h-3.5 md:w-4 md:h-4 text-[#a1a1a1] shrink-0" />
							<span>{selectedPhoto.cameraDesc}</span>
						</div>
					{/if}
					{#if selectedPhoto.locationName || selectedPhoto.createdAt}
						<div
							class="flex items-center flex-wrap gap-2 md:gap-3 px-3 md:px-4 py-1.5 md:py-2 bg-[#222222]/80 backdrop-blur-md rounded-xl"
						>
							{#if selectedPhoto.locationName}
								<div
									class="flex items-center gap-1.5 md:gap-2 font-mono text-[9px] md:text-xs text-[#ededed]"
								>
									<MapPin
										class="w-3.5 h-3.5 md:w-4 md:h-4 text-[#a1a1a1] shrink-0"
									/>
									<span>{selectedPhoto.locationName}</span>
								</div>
							{/if}

							{#if selectedPhoto.locationName && selectedPhoto.createdAt}
								<span class="text-[#444444] text-[10px]">|</span
								>
							{/if}

							{#if selectedPhoto.createdAt}
								<div
									class="flex items-center gap-1.5 md:gap-2 font-mono text-[8px] md:text-[10px] text-[#888888] uppercase tracking-wider"
								>
									<Calendar
										class="w-3.5 h-3.5 md:w-4 md:h-4 text-[#555555] shrink-0"
									/>
									<span
										>{formatDate(
											new Date(selectedPhoto.createdAt),
										)}</span
									>
								</div>
							{/if}
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	.gallery-item {
		--base-height: 120px;
	}
	@media (min-width: 640px) {
		.gallery-item {
			--base-height: 180px;
		}
	}
	@media (min-width: 1024px) {
		.gallery-item {
			--base-height: 240px;
		}
	}



	/* Flashlight Spotlight Effect - Disabled on Mobile/Tablet devices and small viewports */
	@media (hover: hover) and (pointer: fine) and (min-width: 1024px) {
		.spotlight-mask {
			--mouse-x: -1000px;
			--mouse-y: -1000px;
			/* The radial gradient acts as a light source. Everything outside the circle is hidden. */
			mask-image: radial-gradient(
				circle 180px at var(--mouse-x) var(--mouse-y),
				black 0%,
				rgba(0, 0, 0, 0.5) 40%,
				transparent 100%
			);
			-webkit-mask-image: radial-gradient(
				circle 180px at var(--mouse-x) var(--mouse-y),
				black 0%,
				rgba(0, 0, 0, 0.5) 40%,
				transparent 100%
			);
			/* Optional: Add a subtle base opacity so they know text is there? 
			   No, user asked to "ilangin bakal muncul kalo ke hover", so completely hidden outside spotlight. */
		}
	}
</style>
