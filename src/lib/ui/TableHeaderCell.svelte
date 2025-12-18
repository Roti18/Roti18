<script lang="ts">
	export let align: 'left' | 'center' | 'right' = 'left';
</script>

<th
	class={`px-4 py-3 text-xs font-medium tracking-wide text-white/60 uppercase
		text-${align}`}
>
	<slot />
</th>
