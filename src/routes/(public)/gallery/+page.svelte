<script lang="ts">
	import { onMount, tick } from "svelte";
	import { browser } from "$app/environment";
	import { pushState } from "$app/navigation";
	import { page } from "$app/state";
	import { canUseBlur } from "$lib/utils/perf";
	import { formatDate } from "$lib/utils/format";
	import { Camera, Calendar } from "lucide-svelte";

	import SEO from '$lib/components/public/SEO.svelte';

	const { data } = $props();

	let gridEl = $state<HTMLElement>();
	let modalEl = $state<HTMLElement>();
	let modalImageEl = $state<HTMLElement>();
	let metaContainer = $state<HTMLElement>();
	let selectedPhoto: (typeof data.photos)[0] | null = $state(null);
	let imgWidth = $state(0);
	let isClosing = false;

	const statePhoto = $derived(
		(page.state as any)?.photo as (typeof data.photos)[0] | undefined,
	);

	$effect(() => {
		if (statePhoto) {
			selectedPhoto = statePhoto;
			isClosing = false;
			tick().then(() => showModal());
		} else {
			selectedPhoto = null;
		}
	});

	onMount(async () => {
		if (browser && gridEl) {
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
	});

	function openPhoto(photo: (typeof data.photos)[0]) {
		pushState(`/gallery/${photo.slug}`, { photo });
	}

	async function showModal() {
		if (!browser) return;
		await tick();
		if (!modalEl || !modalImageEl) return;

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
				}
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
		if (window.innerWidth < 1024 || window.matchMedia("(hover: none)").matches) return;
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
				overwrite: "auto"
			});
		});
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<SEO 
	title="Gallery - M. Roni"
	description="A collection of photographs."
/>

<div class="max-w-5xl mx-auto px-6 py-12 space-y-8">
	<div
		class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
		bind:this={gridEl}
		id="gallery-grid"
	>
		{#each data.photos as photo}
			<button
				class="gallery-item group relative aspect-4/3 overflow-hidden rounded-2xl bg-[#141414] cursor-pointer text-left border border-[#1f1f1f] shadow-lg flex items-center justify-center"
				onclick={() => openPhoto(photo)}
				id="gallery-{photo.slug}"
			>
				<img
					src={photo.imageUrl}
					alt={photo.title}
					loading="lazy"
					{...photo.width && photo.height
						? { width: photo.width, height: photo.height }
						: {}}
					class="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
				/>
				<div
					class="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4"
				>
					<span
						class="text-sm font-medium text-white font-['Space_Grotesk']"
						>{photo.title}</span
					>
				</div>
			</button>
		{/each}
	</div>
</div>

<!-- Shallow Routing Modal (Centered Photo Details) -->
{#if selectedPhoto}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div
		class="fixed inset-0 z-50 bg-black/98 backdrop-blur-2xl flex items-center justify-center p-6 cursor-pointer"
		bind:this={modalEl}
		onclick={closeModal}
		onmousemove={handleMouseMove}
	>
		<div
			class="relative max-w-4xl max-h-[90vh] w-full flex flex-col items-center justify-center cursor-default mx-auto"
			onclick={(e) => e.stopPropagation()}
			bind:this={modalImageEl}
		>
			<img
				src={selectedPhoto.originalUrl || selectedPhoto.imageUrl}
				alt={selectedPhoto.title}
				class="max-h-[75vh] w-auto max-w-full object-contain rounded-2xl shadow-2xl border border-[#2a2a2a]"
				bind:clientWidth={imgWidth}
			/>
			
			<div 
				class="mt-5 text-left flex flex-col md:flex-row md:items-start justify-between gap-4 md:gap-4 spotlight-mask mx-auto"
				bind:this={metaContainer}
				style="width: {imgWidth ? `${imgWidth}px` : '100%'}; min-width: min(100%, 280px);"
			>
				<div class="space-y-1.5 flex-1">
					<h2 class="text-base md:text-xl font-bold text-white font-['Space_Grotesk'] tracking-tight leading-tight">
						{selectedPhoto.title}
					</h2>
					{#if selectedPhoto.shortDesc}
						<p class="text-xs md:text-sm text-[#a1a1a1] max-w-xl leading-relaxed">
							{selectedPhoto.shortDesc}
						</p>
					{/if}
				</div>

				<div class="flex flex-col items-start md:items-end shrink-0 pt-2 md:pt-1">
					{#if selectedPhoto.cameraDesc}
						<div class="flex items-center gap-1.5 md:gap-2 font-mono text-[9px] md:text-xs text-[#ededed] px-2.5 md:px-3 py-1.5 bg-[#222222]/80 backdrop-blur-md w-fit rounded-none rounded-br-xl md:rounded-none md:rounded-bl-xl">
							<Camera class="w-3.5 h-3.5 text-[#a1a1a1]" />
							<span>{selectedPhoto.cameraDesc}</span>
						</div>
					{/if}
					{#if selectedPhoto.createdAt}
						<div class="flex items-center gap-1.5 md:gap-2 font-mono text-[8px] md:text-[10px] text-[#888888] uppercase tracking-wider px-2.5 md:px-3 py-1.5 bg-[#222222]/80 backdrop-blur-md w-fit rounded-none rounded-br-xl md:rounded-none md:rounded-bl-xl mt-[2px]">
							<Calendar class="w-3.5 h-3.5 text-[#555555]" />
							<span>{formatDate(new Date(selectedPhoto.createdAt))}</span>
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
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
