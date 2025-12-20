<script lang="ts">
	import { Edit, Trash } from '@lucide/svelte';

	export let onEdit: (() => void) | undefined;
	export let onDelete: (() => void) | undefined;
</script>

<div class="flex gap-2">
	{#if onEdit}
		<button class="cursor-pointer rounded p-2 hover:bg-white/10" on:click={onEdit}>
			<Edit size={16} />
		</button>
	{/if}

	{#if onDelete}
		<button class="cursor-pointer rounded p-2 text-red-400 hover:bg-red-500/20" on:click={onDelete}>
			<Trash size={16} />
		</button>
	{/if}
</div>
