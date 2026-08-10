<script lang="ts">
	import { onMount } from 'svelte';
	import { mount, unmount } from 'svelte';
	import { Copy, Check } from 'lucide-svelte';

	let { html, containerId }: { html: string; containerId: string } = $props();

	let containerEl = $state<HTMLElement>();

	onMount(() => {
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