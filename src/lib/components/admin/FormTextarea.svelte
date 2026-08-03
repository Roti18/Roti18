<script lang="ts">
	let { id, name, label = "", value = "", placeholder = "", rows = 4, required = false } = $props();
</script>

<div class="space-y-1">
	{#if label}
		<label for={id} class="text-[#a1a1a1] font-medium text-xs">
			{label} {#if required}<span class="text-red-400">*</span>{/if}
		</label>
	{/if}
	<textarea
		{id}
		{name}
		{required}
		{rows}
		{placeholder}
		class="w-full rounded-xl bg-[#181818] border border-[#262626] p-3 text-xs text-[#ededed] placeholder-[#555555] focus:outline-none focus:border-red-500/50 font-sans transition-colors"
	>{value}</textarea>
</div>
