<script lang="ts">
	import Hero from '$lib/components/Hero.svelte';
	import Profile from '$lib/components/Profile.svelte';
	import Projects from '$lib/components/Projects.svelte';
	import { onMount } from 'svelte';

	let scrollY = 0;
	let isMobile = false;

	const updateDevice = () => {
		isMobile = window.innerWidth < 768;

		document.documentElement.style.scrollBehavior = isMobile ? 'auto' : 'smooth';
	};

	onMount(() => {
		updateDevice();

		const handleScroll = () => {
			scrollY = window.scrollY;
		};

		window.addEventListener('scroll', handleScroll, { passive: true });
		window.addEventListener('resize', updateDevice, { passive: true });

		return () => {
			window.removeEventListener('scroll', handleScroll);
			window.removeEventListener('resize', updateDevice);
		};
	});
</script>

<svelte:head>
	<style>
		body,
		html {
			margin: 0;
			padding: 0;
			background: #0a0000;
			overflow-x: hidden;
		}

		* {
			-webkit-font-smoothing: antialiased;
			-moz-osx-font-smoothing: grayscale;
		}
	</style>
</svelte:head>

<svelte:window bind:scrollY />

<div
	class="relative min-h-screen w-full overflow-hidden bg-linear-to-b from-zinc-950 via-red-950/40 via-30% to-zinc-950"
>
	{#if !isMobile}
		<div class="pointer-events-none fixed inset-0 overflow-hidden will-change-transform">
			<div
				class="absolute h-150 w-150 rounded-full bg-red-600/50 opacity-30 blur-[150px]"
				style="top: 5%; right: 10%; transform: translateY({scrollY * 0.3}px)"
			></div>
			<div
				class="absolute h-125 w-125 rounded-full bg-rose-600/40 opacity-25 blur-[150px]"
				style="top: 50%; left: 5%; transform: translateY({scrollY * 0.5}px)"
			></div>
			<div
				class="absolute h-112.5 w-112.5 rounded-full bg-red-700/35 opacity-20 blur-[150px]"
				style="bottom: 15%; right: -5%; transform: translateY({scrollY * 0.2}px)"
			></div>
		</div>
	{:else}
		<div class="pointer-events-none fixed inset-0 overflow-hidden">
			<div
				class="absolute top-10 right-5 h-100 w-100 rounded-full bg-red-600/40 opacity-25 blur-[100px]"
			></div>
			<div
				class="absolute bottom-20 left-5 h-87.5 w-87.5 rounded-full bg-rose-600/30 opacity-20 blur-[100px]"
			></div>
		</div>
	{/if}

	<div class="relative z-10">
		<Hero {isMobile} />
		<Profile />
		<Projects {isMobile} />
	</div>
</div>
