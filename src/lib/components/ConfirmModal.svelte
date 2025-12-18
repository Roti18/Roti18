<script lang="ts">
	import { confirmStore, closeConfirm } from '$lib/stores/confirm';

	async function handleConfirm() {
		try {
			await $confirmStore.onConfirm?.(); // ✅ SEKARANG VALID
		} finally {
			closeConfirm();
		}
	}
</script>

{#if $confirmStore.open}
	<!-- Overlay -->
	<button
		type="button"
		class="fixed inset-0 z-40 bg-black/60"
		aria-label="Close confirmation"
		on:click={closeConfirm}
	></button>

	<!-- Modal -->
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4">
		<div
			class="w-full max-w-md rounded-xl border border-white/10 bg-zinc-900 p-6 shadow-xl"
			role="dialog"
			aria-modal="true"
			tabindex="0"
			on:click|stopPropagation
			on:keydown|stopPropagation
		>
			<h2 class="text-lg font-semibold text-white">
				{$confirmStore.title}
			</h2>

			{#if $confirmStore.description}
				<p class="mt-2 text-sm text-white/60">
					{$confirmStore.description}
				</p>
			{/if}

			<div class="mt-6 flex justify-end gap-3">
				<button
					type="button"
					class="rounded-lg px-4 py-2 text-sm text-white/70 hover:bg-white/10"
					on:click={closeConfirm}
				>
					{$confirmStore.cancelText ?? 'Cancel'}
				</button>

				<button
					type="button"
					class="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
					on:click={handleConfirm}
				>
					{$confirmStore.confirmText ?? 'Confirm'}
				</button>
			</div>
		</div>
	</div>
{/if}
