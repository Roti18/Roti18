<script lang="ts">
	import { toastService } from '$lib/stores/toast.svelte';
	import Toast from './Toast.svelte';
</script>

<div
	class="pointer-events-none fixed right-6 bottom-6 z-[9999] flex flex-col gap-3"
	aria-live="polite"
>
	{#each toastService.toasts as toast (toast.id)}
		<Toast {toast} />
	{/each}
</div>
