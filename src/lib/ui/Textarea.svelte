<script lang="ts">
	export let label = '';
	export let value = '';
	export let rows = 5;
	export let id = crypto.randomUUID();
	export let name: string | undefined = undefined;
	export let required: boolean = false;
</script>

<div class="space-y-1.5">
	{#if label}
		<label for={id} class="text-sm font-medium text-white/70">
			{label}{required ? ' *' : ''}
		</label>
	{/if}

	<textarea
		{id}
		bind:value
		{rows}
		{name}
		{required}
		class="w-full resize-none rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white focus:border-red-600/50 focus:outline-none"
	></textarea>
</div>
