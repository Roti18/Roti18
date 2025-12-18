<script>
	import { Search } from '@lucide/svelte';
	export let value = '';
	export let placeholder = 'Search...';
</script>

<div class="relative">
	<Search size={18} class="absolute top-1/2 left-3 -translate-y-1/2 text-white/40" />
	<input
		bind:value
		{placeholder}
		class="w-full rounded-lg border border-white/10 bg-white/5 py-2 pr-4 pl-10 text-white
		       focus:border-red-600/50 focus:outline-none"
	/>
</div>
