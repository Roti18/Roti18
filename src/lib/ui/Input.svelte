<script lang="ts">
	export let label: string | undefined;
	export let value: string = '';
	export let type: string = 'text';
	export let required: boolean = false;
	export let id = crypto.randomUUID();
	export let name: string | undefined = undefined;
</script>

<div class="space-y-1.5">
	{#if label}
		<label for={id} class="text-sm text-white/70">
			{label}{required ? ' *' : ''}
		</label>
	{/if}

	<input
		{id}
		bind:value
		{type}
		{required}
		{name}
		{...$$restProps}
		class="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white
		       focus:border-red-600/50 focus:outline-none"
	/>
</div>
