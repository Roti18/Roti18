<script lang="ts">
	import Button from '$lib/ui/Button.svelte';
	import { confirmService } from '$lib/stores/confirm.svelte';
	import { fade, scale } from 'svelte/transition';

	async function handleConfirm() {
		try {
			await confirmService.state.onConfirm?.();
		} finally {
			confirmService.close();
		}
	}
</script>

{#if confirmService.state.open}
	<div
		class="fixed inset-0 z-[9998] flex items-center justify-center p-4"
		in:fade={{ duration: 200 }}
		out:fade={{ duration: 150 }}
	>
		<button
			type="button"
			class="absolute inset-0 bg-black/80 backdrop-blur-sm"
			aria-label="Close confirmation"
			onclick={() => confirmService.close()}
		></button>

		<div
			class="relative w-full max-w-md rounded-2xl border border-white/10 bg-zinc-900 p-6 shadow-2xl"
			role="dialog"
			aria-modal="true"
			in:scale={{ duration: 300, start: 0.95 }}
		>
			<h2 class="text-xl font-bold text-white">
				{confirmService.state.title}
			</h2>

			{#if confirmService.state.description}
				<p class="mt-3 text-sm leading-relaxed text-white/60">
					{confirmService.state.description}
				</p>
			{/if}

			<div class="mt-8 flex justify-end gap-3">
				<Button type="button" variant="ghost" onclick={() => confirmService.close()}>
					{confirmService.state.cancelText ?? 'Cancel'}
				</Button>

				<Button type="button" onclick={handleConfirm}>
					{confirmService.state.confirmText ?? 'Confirm'}
				</Button>
			</div>
		</div>
	</div>
{/if}
