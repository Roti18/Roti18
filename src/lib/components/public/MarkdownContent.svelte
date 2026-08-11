<script lang="ts">
	import { mount, unmount } from 'svelte';
	import { Copy, Check } from 'lucide-svelte';

	let { html, containerId }: { html: string; containerId: string } = $props();

	let containerEl = $state<HTMLElement>();

	$effect(() => {
		html; // Track html dependency so this re-runs on navigation
		const root = containerEl;
		if (!root) return;

		const mounted: unknown[] = [];

		// Copy buttons: mount lucide Copy + Check, then flip them with inline
		// styles - no CSS class/selector coupling that can silently break.
		root.querySelectorAll('button[data-copy]').forEach((btn) => {
			const holder = btn.querySelector('.md-copy-icon');
			if (!holder) return;
			mounted.push(
				mount(Copy, { target: holder as HTMLElement, props: { size: 12, 'aria-hidden': true, class: 'md-svg-copy' } })
			);
			mounted.push(
				mount(Check, { target: holder as HTMLElement, props: { size: 12, 'aria-hidden': true, class: 'md-svg-check' } })
			);
			
			// Try to hide check immediately, but don't fail if not found yet
			const tryHideCheck = () => {
				const checkIcon = holder.querySelector('.md-svg-check') as SVGElement | null;
				if (checkIcon) checkIcon.style.display = 'none';
			};
			tryHideCheck();
			// Also run after a microtask in case mount was deferred
			Promise.resolve().then(tryHideCheck);

			const button = btn as HTMLButtonElement;
			const label = btn.querySelector('.copy-label');
			const setState = (state: 'copy' | 'check' | 'failed') => {
				const copyIcon = holder.querySelector('.md-svg-copy') as SVGElement | null;
				const checkIcon = holder.querySelector('.md-svg-check') as SVGElement | null;

				if (state === 'check') {
					if (copyIcon) copyIcon.style.display = 'none';
					if (checkIcon) {
						checkIcon.style.display = 'block';
						checkIcon.style.animation = 'mdIconSwap 0.2s cubic-bezier(0.4, 0, 0.2, 1)';
					}
				} else {
					if (copyIcon) copyIcon.style.display = 'block';
					if (checkIcon) checkIcon.style.display = 'none';
				}
				if (label) {
					label.textContent =
						state === 'copy' ? 'Copy' : state === 'check' ? 'Copied' : 'Failed';
				}
			};

			button.addEventListener('click', async () => {
				const pre = btn.closest('div.relative')?.querySelector('pre');
				if (!pre) return;
				try {
					await navigator.clipboard.writeText(pre.innerText);
					setState('check');
				} catch {
					setState('failed');
				}
				setTimeout(() => setState('copy'), 1500);
			});
		});

		// Setup Image Lazy Loading & Skeletons
		root.querySelectorAll('img').forEach((img) => {
			if (img.dataset.skeletonProcessed) return;
			img.dataset.skeletonProcessed = 'true';

			// Ensure proper lazy loading
			img.setAttribute('loading', 'lazy');
			img.setAttribute('decoding', 'async');

			// Create a wrapper for the relative positioning
			const wrapper = document.createElement('div');
			wrapper.className = 'relative w-full rounded-xl overflow-hidden bg-[#141414] my-6 border border-[#1f1f1f]';

			// Insert wrapper before img, then move img into wrapper
			img.parentNode?.insertBefore(wrapper, img);
			wrapper.appendChild(img);

			// Create the skeleton pulse element
			const skeleton = document.createElement('div');
			skeleton.className = 'absolute inset-0 bg-[#1f1f1f] animate-pulse z-0';
			wrapper.appendChild(skeleton);

			// Ensure image is above skeleton and starts transparent
			img.style.position = 'relative';
			img.style.zIndex = '10';
			img.style.opacity = '0';
			img.style.transition = 'opacity 0.7s ease';
			img.style.width = '100%';
			img.style.height = 'auto';
			img.style.display = 'block';

			// Handle load event
			const handleLoad = () => {
				img.style.opacity = '1';
				// Remove skeleton after transition
				setTimeout(() => skeleton.remove(), 700);
			};

			if (img.complete) {
				handleLoad();
			} else {
				img.addEventListener('load', handleLoad);
			}
		});

		return () => mounted.forEach((m) => m && unmount(m));
	});
</script>

<div
	id={containerId}
	class="prose prose-invert max-w-none space-y-6"
	bind:this={containerEl}
>
	{@html html}
</div>