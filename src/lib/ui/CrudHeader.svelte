<script lang="ts">
	export let hint: string | null = null;
</script>

<div class="mb-6 flex items-center justify-between">
	{#if hint}
		<p class="text-red-400">
			{hint}
		</p>
	{:else}
		<div></div>
	{/if}

	<div class="flex gap-2">
		<slot />
	</div>
</div>
