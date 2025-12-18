<script lang="ts">
	export let variant: 'default' | 'ghost' | 'danger' = 'default';
	export let size: 'default' | 'icon' = 'default';
	export let type: 'button' | 'submit' | 'reset' = 'button';
	export let disabled = false;
</script>

<button
	{type}
	{disabled}
	on:click
	{...$$restProps}
	class="
		inline-flex items-center justify-center gap-2
		rounded-lg font-medium transition
		disabled:pointer-events-none disabled:opacity-50

		{variant === 'default' && 'bg-red-600 text-white hover:bg-red-700'}
		{variant === 'ghost' && 'bg-transparent text-white/70 hover:bg-white/10'}
		{variant === 'danger' && 'bg-red-600/10 text-red-400 hover:bg-red-600/20'}

		{size === 'default' && 'px-4 py-2'}
		{size === 'icon' && 'p-2'}
	"
>
	<slot />
</button>
