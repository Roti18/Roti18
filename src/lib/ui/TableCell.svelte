<script lang="ts">
	export let align: 'left' | 'center' | 'right' = 'left';
</script>

<td class={`px-4 py-3 text-white text-${align}`}>
	<slot />
</td>
