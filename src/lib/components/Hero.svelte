<!-- src/lib/components/Hero.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';

	export let isMobile = false;

	let scrollY = 0;
	let mouseX = 0;
	let mouseY = 0;

	onMount(() => {
		const handleScroll = () => {
			scrollY = window.scrollY;
		};

		const handleMouseMove = (e: MouseEvent) => {
			if (isMobile) return;

			mouseX = (e.clientX / window.innerWidth - 0.5) * 20;
			mouseY = (e.clientY / window.innerHeight - 0.5) * 20;
		};

		window.addEventListener('scroll', handleScroll, { passive: true });
		if (!isMobile) {
			window.addEventListener('mousemove', handleMouseMove, { passive: true });
		}

		return () => {
			window.removeEventListener('scroll', handleScroll);
			window.removeEventListener('mousemove', handleMouseMove);
		};
	});
</script>

<svelte:window bind:scrollY />

<section class="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
	<!-- Floating particles (desktop only) -->
	{#if !isMobile}
		<div
			class="pointer-events-none absolute inset-0 opacity-10 will-change-transform"
			style="transform: translate({mouseX}px, {mouseY}px) translateZ(0)"
		>
			<div class="animate-float absolute top-20 left-20 h-2 w-2 rounded-full bg-red-500"></div>
			<div
				class="animate-float-delay-1 absolute top-40 right-32 h-3 w-3 rounded-full bg-rose-400"
			></div>
			<div
				class="animate-float-delay-2 absolute bottom-32 left-40 h-2 w-2 rounded-full bg-red-600"
			></div>
			<div class="animate-float absolute right-24 bottom-20 h-1 w-1 rounded-full bg-rose-500"></div>
		</div>
	{/if}

	<!-- Hero content -->
	<div class="relative z-10 w-full space-y-4 px-6 text-center">
		<h1
			class="animate-fade-in-up text-5xl font-light tracking-[0.15em] text-amber-50 sm:text-6xl md:text-7xl lg:text-8xl"
			style={!isMobile ? `transform: translate(${mouseX * 0.3}px, ${mouseY * 0.3}px)` : ''}
		>
			ALEXANDRA CHEN
		</h1>

		<p
			class="animate-fade-in-up-delay-1 text-xs tracking-[0.25em] text-neutral-300 uppercase sm:text-sm md:text-base"
			style={!isMobile ? `transform: translate(${mouseX * 0.2}px, ${mouseY * 0.2}px)` : ''}
		>
			DESIGNER & CREATIVE DIRECTOR
		</p>

		<p
			class="animate-fade-in-up-delay-2 mt-6 text-lg text-neutral-400 italic sm:text-xl md:text-2xl lg:text-3xl"
			style={!isMobile ? `transform: translate(${mouseX * 0.15}px, ${mouseY * 0.15}px)` : ''}
		>
			Crafting narratives through thoughtful design
		</p>
	</div>

	<!-- Scroll indicator -->
	<div
		class="absolute bottom-12 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 transition-opacity duration-300"
		style="opacity: {1 - scrollY / 300}"
	>
		<div
			class="animate-pulse-slow h-15 w-px bg-linar-to-b from-transparent to-red-500/80"
		></div>

		<svg class="animate-bounce-slow h-6 w-6 text-red-500" viewBox="0 0 24 24" fill="none">
			<path
				d="M12 5v14M19 12l-7 7-7-7"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
			/>
		</svg>
	</div>
</section>

<style>
	@keyframes fade-in-up {
		from {
			opacity: 0;
			transform: translateY(30px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.animate-fade-in-up {
		animation: fade-in-up 1s ease-out;
	}

	.animate-fade-in-up-delay-1 {
		animation: fade-in-up 1s ease-out 0.2s backwards;
	}

	.animate-fade-in-up-delay-2 {
		animation: fade-in-up 1s ease-out 0.4s backwards;
	}

	@keyframes bounce-slow {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(10px);
		}
	}

	.animate-bounce-slow {
		animation: bounce-slow 2s infinite;
	}

	@keyframes float {
		0%,
		100% {
			transform: translateY(0) scale(1);
		}
		50% {
			transform: translateY(-20px) scale(1.1);
		}
	}

	.animate-float {
		animation: float 4s ease-in-out infinite;
	}

	.animate-float-delay-1 {
		animation: float 5s ease-in-out infinite 1s;
	}

	.animate-float-delay-2 {
		animation: float 6s ease-in-out infinite 2s;
	}

	@keyframes pulse-slow {
		0%,
		100% {
			opacity: 0.8;
		}
		50% {
			opacity: 0.3;
		}
	}

	.animate-pulse-slow {
		animation: pulse-slow 3s ease-in-out infinite;
	}
</style>
