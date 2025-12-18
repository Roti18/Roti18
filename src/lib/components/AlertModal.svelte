<script lang="ts">
	import { alertStore, closeAlert } from '$lib/stores/alert';

	const colorMap = {
		success: 'text-green-400',
		error: 'text-red-500',
		info: 'text-white'
	};
</script>

{#if $alertStore.open}
	<button
		type="button"
		class="fixed inset-0 z-40 bg-black/60"
		aria-label="Close alert"
		on:click={closeAlert}
	></button>

	<div class="fixed inset-0 z-50 flex items-center justify-center p-4">
		<div
			class="w-full max-w-sm rounded-xl border border-white/10 bg-zinc-900 p-6 shadow-xl"
			role="dialog"
			aria-modal="true"
			tabindex="0"
			on:click|stopPropagation
			on:keydown|stopPropagation
		>
			<h2 class={`text-lg font-semibold ${colorMap[$alertStore.type ?? 'info']}`}>
				{$alertStore.title ?? 'Notice'}
			</h2>

			{#if $alertStore.message}
				<p class="mt-2 text-sm text-white/70">
					{$alertStore.message}
				</p>
			{/if}

			<div class="mt-6 flex justify-end">
				<button
					type="button"
					class="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
					on:click={closeAlert}
				>
					OK
				</button>
			</div>
		</div>
	</div>
{/if}
