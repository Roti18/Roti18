<script lang="ts">
	import { browser } from '$app/environment';
	import { ArrowUpRight } from 'lucide-svelte';
	import { canUseBlur } from '$lib/utils/perf';

	const { data } = $props();

	let previewEl: HTMLElement;
	let pillEl: HTMLElement;
	let currentProject: (typeof data.projects)[0] | null = $state(null);
	let hoverTimer: ReturnType<typeof setTimeout> | null = null;

	/**
	 * Calculate position right-aligned to the hovered DOM element relative to (0,0) viewport
	 */
	function calculateElementPosition(node: HTMLElement) {
		const rect = node.getBoundingClientRect();
		const previewWidth = 320;
		const previewHeight = 180;
		const headerHeight = 64; // Sticky header (56px) + safety buffer

		let x = rect.right - previewWidth;
		let y = rect.top - previewHeight - 14;

		if (y < headerHeight) {
			y = rect.bottom + 14;
		}

		x = Math.max(16, Math.min(x, window.innerWidth - previewWidth - 16));

		return { x, y };
	}

	function handleMouseEnter(
		project: (typeof data.projects)[0],
		targetNode: HTMLElement,
	) {
		if (hoverTimer) clearTimeout(hoverTimer);
		currentProject = project;

		if (browser) {
			import('gsap').then(({ gsap }) => {
				// Smooth sliding hover pill background transition between rows
				if (pillEl && targetNode) {
					const rect = targetNode.getBoundingClientRect();
					gsap.to(pillEl, {
						top: targetNode.offsetTop,
						left: targetNode.offsetLeft,
						width: rect.width,
						height: rect.height,
						opacity: 1,
						duration: 0.25,
						ease: 'power2.out',
					});
				}

				// Smooth image preview reveal with slight delay (delay: 0.12s)
				if (previewEl && targetNode) {
					const pos = calculateElementPosition(targetNode);
					gsap.killTweensOf(previewEl);

					gsap.set(previewEl, {
						x: pos.x,
						y: pos.y
					});

					gsap.fromTo(
						previewEl,
						{
							opacity: 0,
							scale: 0.88,
							...(canUseBlur() ? { filter: 'blur(16px) brightness(1.2)' } : {}),
						},
						{
							opacity: 1,
							scale: 1,
							...(canUseBlur() ? { filter: 'blur(0px) brightness(1)' } : {}),
							duration: 0.35,
							delay: 0.12,
							ease: 'power3.out',
						},
					);
				}
			});
		}
	}

	function handleContainerMouseLeave() {
		if (hoverTimer) clearTimeout(hoverTimer);
		currentProject = null;
		if (browser) {
			import('gsap').then(({ gsap }) => {
				if (pillEl) {
					gsap.to(pillEl, { opacity: 0, duration: 0.2 });
				}
				if (previewEl) {
					gsap.to(previewEl, {
						opacity: 0,
						scale: 0.9,
						...(canUseBlur() ? { filter: 'blur(12px)' } : {}),
						duration: 0.2,
						ease: 'power2.in',
					});
				}
			});
		}
	}
</script>

<svelte:head>
	<title>Projects - M. Roni</title>
	<meta name="description" content="Things I've built and worked on." />
</svelte:head>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class="max-w-5xl mx-auto px-6 py-12 space-y-12"
	onmouseleave={handleContainerMouseLeave}
>
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="relative flex flex-col gap-1 -mx-3">
		<!-- Smooth Sliding Hover Pill Highlight Indicator -->
		<div
			class="absolute pointer-events-none rounded-xl bg-[#141414] border border-[#222222] transition-opacity duration-200"
			bind:this={pillEl}
			style="opacity: 0; top: 0; left: 0; width: 0; height: 0;"
		></div>

		{#each data.projects as project}
			<a
				href="/project/{project.slug}"
				class="blur-fade-in group relative z-10 flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-6 py-3 px-3 rounded-xl transition-colors"
				id="project-{project.slug}"
				onmouseenter={(e) =>
					handleMouseEnter(
						project,
						e.currentTarget as HTMLElement,
					)}
			>
				<span
					class="text-base font-medium text-[#ededed] group-hover:text-white shrink-0"
				>
					{project.title}
				</span>
				<span
					class="text-sm text-[#a1a1a1] flex-1 font-normal no-underline decoration-transparent"
				>
					{project.shortDesc}
				</span>
				<ArrowUpRight
					size={14}
					class="text-[#666666] group-hover:text-[#ededed] transition-colors shrink-0"
				/>
			</a>
		{/each}
	</div>

	<!-- Apple-Style Ink Bleed Floating Image Preview (Pure Borderless Floating Image) -->
	<div
		class="fixed top-0 left-0 z-50 pointer-events-none w-80 h-48 rounded-xl overflow-hidden shadow-2xl bg-transparent"
		bind:this={previewEl}
		style="opacity: 0; transform: scale(0.85);"
	>
		{#if currentProject?.thumbnailUrl}
			<img
				src={currentProject.thumbnailUrl}
				alt={currentProject.title}
				loading="lazy"
				decoding="async"
				class="w-full h-full object-cover block"
			/>
		{/if}
	</div>
</div>
