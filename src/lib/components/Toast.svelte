<script lang="ts">
	import { toastService, type Toast } from '$lib/stores/toast.svelte';
	import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from '@lucide/svelte';
	import { fade, fly } from 'svelte/transition';
	import { backOut } from 'svelte/easing';

	let { toast }: { toast: Toast } = $props();

	const icons = {
		success: CheckCircle2,
		error: AlertCircle,
		warning: AlertTriangle,
		info: Info
	};

	const styles = {
		success:
			'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800',
		error:
			'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-800',
		warning:
			'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800',
		info: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-800'
	};

	let Icon = $derived(icons[toast.type]);
</script>

<div
	in:fly={{ y: 20, duration: 400, easing: backOut }}
	out:fade={{ duration: 200 }}
	class="pointer-events-auto flex max-w-md min-w-[300px] items-center gap-3 rounded-xl border px-4 py-3 shadow-lg backdrop-blur-md {styles[
		toast.type
	]}"
	role="alert"
>
	<Icon size={20} class="shrink-0" />
	<p class="flex-1 text-sm font-medium">{toast.message}</p>
	<button
		onclick={() => toastService.remove(toast.id)}
		class="rounded-md p-1 transition-colors hover:bg-black/5 dark:hover:bg-white/5"
		aria-label="Close"
	>
		<X size={16} />
	</button>
</div>
