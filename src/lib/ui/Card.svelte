<script lang="ts">
	export let hover: boolean = true;
</script>

<div
	class={`w-full rounded-xl bg-white/5 p-4 sm:p-5 ${hover ? 'transition hover:bg-white/10' : ''}`}
>
	<slot />
</div>
