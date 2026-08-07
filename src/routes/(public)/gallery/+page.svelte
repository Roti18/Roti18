<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { browser } from '$app/environment';
	import { pushState } from '$app/navigation';
	import { page } from '$app/state';
	import { canUseBlur } from '$lib/utils/perf';

	const { data } = $props();

	let gridEl = $state<HTMLElement>();
	let modalEl = $state<HTMLElement>();
	let modalImageEl = $state<HTMLElement>();
	let selectedPhoto: typeof data.photos[0] | null = $state(null);

	const statePhoto = $derived((page.state as any)?.photo as typeof data.photos[0] | undefined);

	$effect(() => {
		if (statePhoto) {
			selectedPhoto = statePhoto;
			tick().then(() => showModal());
		} else {
			selectedPhoto = null;
		}
	});

	onMount(async () => {
		if (browser && gridEl) {
			const { gsap } = await import('gsap');
			const items = gridEl.querySelectorAll('.gallery-item');
			gsap.fromTo(
				items,
				{ opacity: 0, ...(canUseBlur() ? { filter: 'blur(12px)' } : {}) },
				{
					opacity: 1,
					...(canUseBlur() ? { filter: 'blur(0px)' } : {}),
					duration: 0.7,
					ease: 'power2.out',
					stagger: { amount: 0.35 },
					clearProps: canUseBlur() ? 'filter' : ''
				}
			);
		}
	});

	function openPhoto(photo: typeof data.photos[0]) {
		pushState(`/gallery/${photo.slug}`, { photo });
	}

	async function showModal() {
		if (!browser) return;
		await tick();
		if (!modalEl || !modalImageEl) return;

		const { gsap } = await import('gsap');
		gsap.killTweensOf([modalEl, modalImageEl]);

		gsap.fromTo(
			modalEl,
			{ opacity: 0 },
			{ opacity: 1, duration: 0.35, ease: 'power2.out' }
		);

		gsap.fromTo(
			modalImageEl,
			{ scale: 0.7, opacity: 0, y: 40, ...(canUseBlur() ? { filter: 'blur(16px)' } : {}) },
			{ scale: 1, opacity: 1, y: 0, ...(canUseBlur() ? { filter: 'blur(0px)' } : {}), duration: 0.55, ease: 'power3.out' }
		);
	}

	async function closeModal() {
		if (!browser || !modalEl) return;
		const { gsap } = await import('gsap');
		gsap.to(modalEl, { opacity: 0, duration: 0.3, ease: 'power2.inOut' });
		if (modalImageEl) {
			gsap.to(modalImageEl, {
				scale: 0.8,
				opacity: 0,
				y: 25,
				...(canUseBlur() ? { filter: 'blur(10px)' } : {}),
				duration: 0.3,
				ease: 'power2.inOut',
				onComplete: () => {
					history.back();
				}
			});
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape' && selectedPhoto) {
			closeModal();
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<svelte:head>
	<title>Gallery - M. Roni</title>
	<meta name="description" content="A collection of photographs." />
</svelte:head>

<div class="max-w-5xl mx-auto px-6 py-12 space-y-8">
	<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6" bind:this={gridEl} id="gallery-grid">
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
					{...photo.width && photo.height ? { width: photo.width, height: photo.height } : {}}
					class="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
				/>
				<div class="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
					<span class="text-sm font-medium text-white font-['Space_Grotesk']">{photo.title}</span>
				</div>
			</button>
		{/each}
	</div>
</div>

<!-- Shallow Routing Modal (Centered Photo Details) -->
{#if selectedPhoto}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-6 cursor-pointer"
		bind:this={modalEl}
		onclick={closeModal}
		onkeydown={(e) => e.key === 'Escape' && closeModal()}
	>
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<div
			class="relative max-w-4xl max-h-[90vh] w-full flex flex-col items-center justify-center cursor-default mx-auto text-center"
			onclick={(e) => e.stopPropagation()}
			bind:this={modalImageEl}
		>
			<img
				src={selectedPhoto.imageUrl}
				alt={selectedPhoto.title}
				class="max-h-[75vh] w-auto max-w-full object-contain rounded-2xl shadow-2xl border border-[#2a2a2a] mx-auto"
			/>
			<div class="mt-4 w-full text-center space-y-1">
				<h2 class="text-base font-semibold text-[#ededed] font-['Space_Grotesk']">{selectedPhoto.title}</h2>
				{#if selectedPhoto.shortDesc}
					<p class="text-sm text-[#a1a1a1] max-w-[60ch] mx-auto">{selectedPhoto.shortDesc}</p>
				{/if}
				{#if selectedPhoto.cameraDesc}
					<p class="text-xs text-[#666666] font-mono">{selectedPhoto.cameraDesc}</p>
				{/if}
			</div>
		</div>
	</div>
{/if}
