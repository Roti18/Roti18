<script lang="ts">
	import './layout.css';
	let { children } = $props();
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { startLenis } from '$lib/scroll/lenis';

	onMount(() => {
		const unsubscribe = page.subscribe(($page) => {
			const isDashboard = $page.url.pathname.startsWith('/dashboard');

			if (!isDashboard) {
				startLenis();
			}
		});

		return unsubscribe;
	});
</script>

<svelte:head>
	<link rel="icon" href="/favicon.svg" />
</svelte:head>
<div class="min-h-screen bg-black text-white">
	{@render children()}
</div>
