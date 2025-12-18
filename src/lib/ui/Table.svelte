<script lang="ts">
	export let dense = false;
</script>

<div class="relative w-full overflow-x-auto rounded-xl border border-white/10">
	<table class={`w-full border-collapse text-sm ${dense ? 'text-xs' : ''}`}>
		<slot />
	</table>
</div>
