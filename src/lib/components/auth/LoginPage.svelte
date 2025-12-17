<script>
	import LoginCard from './LoginCard.svelte';
</script>

<div
	class="flex min-h-screen items-center justify-center p-4"
	style="background: linear-gradient(135deg, #000000 0%, #1a0000 50%, #2d0a0a 100%);"
>
	<div class="w-full max-w-md">
		<LoginCard />
	</div>
</div>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
	}
</style>
