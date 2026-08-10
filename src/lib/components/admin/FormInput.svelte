<script lang="ts">
	let { id, name, label = "", type = "text", value = $bindable(""), placeholder = "", required = false, mono = false, class: className = "" } = $props();
</script>

<div class="space-y-1">
	{#if label}
		<label for={id} class="text-[#a1a1a1] font-medium text-xs">
			{label} {#if required}<span class="text-red-400">*</span>{/if}
		</label>
	{/if}
	<input
		{id}
		{type}
		{name}
		{required}
		bind:value
		{placeholder}
		class="w-full rounded-xl bg-[#181818] border border-[#262626] px-3 py-2 text-xs text-[#ededed] placeholder-[#555555] focus:outline-none focus:border-red-500/50 transition-colors {mono ? 'font-mono' : ''} {className}"
	/>
</div>
