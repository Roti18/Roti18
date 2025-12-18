<script lang="ts">
	export let back: (() => void) | undefined;
</script>

<div class="mb-6 flex items-center gap-4">
	{#if back}
		<button on:click={back} class="text-white/60 transition hover:text-white" aria-label="Back">
			←
		</button>
	{/if}

	<h1 class="text-xl font-semibold text-white">
		<slot />
	</h1>
</div>
