<script lang="ts">
	import { fade } from 'svelte/transition';

	let { loading = false, text = 'Loading.....' }: { loading: boolean; text?: string } = $props();
</script>

{#if loading}
	<div
		class="absolute inset-0 z-50 flex flex-col items-center justify-center bg-zinc-950/60 backdrop-blur-md transition-all"
		in:fade={{ duration: 200 }}
		out:fade={{ duration: 300 }}
	>
		<div class="relative flex items-center justify-center">
			<div
				class="h-16 w-16 animate-spin rounded-full border-4 border-red-500/10 border-t-red-600 shadow-[0_0_20px_rgba(239,68,68,0.2)]"
			></div>
			<div
				class="animate-spin-slow absolute h-8 w-8 rounded-full border-4 border-red-500/5 border-b-red-400/60"
			></div>
		</div>

		{#if text}
			<p class="mt-4 animate-pulse text-sm font-bold tracking-[0.2em] text-white/90 uppercase">
				{text}
			</p>
		{/if}
	</div>
{/if}

<style>
	@keyframes spin-slow {
		from {
			transform: rotate(360deg);
		}
		to {
			transform: rotate(0deg);
		}
	}
	.animate-spin-slow {
		animation: spin-slow 2s linear infinite;
	}
</style>
