<script lang="ts">
	import { fade, scale } from 'svelte/transition';
	import { X, ZoomIn, ZoomOut, Maximize, Minimize } from '@lucide/svelte';
	import { browser } from '$app/environment';

	let {
		src,
		alt = '',
		show = false,
		onClose
	}: { src: string; alt?: string; show: boolean; onClose: () => void } = $props();

	let zoomed = $state(false);
	let isFullscreen = $state(false);

	function toggleZoom() {
		zoomed = !zoomed;
	}

	function toggleFullscreen() {
		if (!browser) return;
		if (!document.fullscreenElement) {
			document.documentElement.requestFullscreen();
			isFullscreen = true;
		} else {
			if (document.exitFullscreen) {
				document.exitFullscreen();
				isFullscreen = false;
			}
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape' && show) {
			onClose();
		}
	}

	$effect(() => {
		if (!browser) return;

		if (show) {
			document.body.style.overflow = 'hidden';
			window.addEventListener('keydown', handleKeydown);
		} else {
			document.body.style.overflow = '';
			window.removeEventListener('keydown', handleKeydown);
			zoomed = false;
		}

		return () => {
			document.body.style.overflow = '';
			window.removeEventListener('keydown', handleKeydown);
		};
	});
</script>

{#if show}
	<div
		class="fixed inset-0 z-[10000] flex items-center justify-center bg-black/90 p-4 transition-all"
		in:fade={{ duration: 300 }}
		out:fade={{ duration: 200 }}
	>
		<button class="absolute inset-0 cursor-default" onclick={onClose} aria-label="Close modal"
		></button>

		<div class="absolute top-6 right-6 z-10 flex items-center gap-2" in:fade={{ delay: 200 }}>
			<button
				onclick={toggleZoom}
				class="rounded-full bg-white/10 p-2 text-white backdrop-blur transition-colors hover:bg-white/20"
				title={zoomed ? 'Zoom Out' : 'Zoom In'}
			>
				{#if zoomed}
					<ZoomOut size={20} />
				{:else}
					<ZoomIn size={20} />
				{/if}
			</button>
			<button
				onclick={toggleFullscreen}
				class="rounded-full bg-white/10 p-2 text-white backdrop-blur transition-colors hover:bg-white/20"
				title="Fullscreen"
			>
				{#if isFullscreen}
					<Minimize size={20} />
				{:else}
					<Maximize size={20} />
				{/if}
			</button>
			<button
				onclick={onClose}
				class="rounded-full bg-white/10 p-2 text-white backdrop-blur transition-colors hover:bg-white/20"
				title="Close"
			>
				<X size={20} />
			</button>
		</div>

		<div
			class="scrollbar-hide relative flex max-h-full max-w-full items-center justify-center overflow-auto"
			in:scale={{ duration: 400, start: 0.9, opacity: 0 }}
		>
			<button
				onclick={toggleZoom}
				class="relative transition-transform duration-300 ease-out {zoomed ? 'scale-150' : ''}"
				aria-label={zoomed ? 'Zoom Out' : 'Zoom In'}
			>
				<img
					{src}
					{alt}
					class="max-w-full rounded-lg shadow-2xl {zoomed
						? 'cursor-zoom-out'
						: 'max-h-[85vh] cursor-zoom-in object-contain'}"
				/>
			</button>
		</div>
	</div>
{/if}

<style>
	.scrollbar-hide::-webkit-scrollbar {
		display: none;
	}
	.scrollbar-hide {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}
</style>
