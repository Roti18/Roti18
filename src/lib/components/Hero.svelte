<script lang="ts">
	import type { Hero } from '$lib/server/db/schema';
	import { ArrowDown } from '@lucide/svelte';

	export let isMobile: boolean = false;
	export let hero: Hero;

	let scrollY = 0;
</script>

<svelte:window bind:scrollY />

{#if hero}
	<section class="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
		<div class="z-10 w-full space-y-4 px-6 text-center">
			<h1
				class="animate-fade-in-up text-5xl leading-tight font-light tracking-[0.15em] text-amber-50 sm:text-6xl md:text-7xl lg:text-8xl"
			>
				{hero.name}
			</h1>

			<p
				class="animate-fade-in-up-delay-1 text-xs font-normal tracking-[0.2em] text-neutral-300 uppercase sm:text-sm sm:tracking-[0.3em] md:text-base"
			>
				{hero.role}
			</p>

			<p
				class="animate-fade-in-up-delay-2 mt-6 text-lg font-light text-neutral-400 italic sm:mt-8 sm:text-xl md:text-2xl lg:text-3xl"
			>
				{hero.tagline}
			</p>
		</div>

		<div
			class="absolute bottom-12 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 transition-opacity duration-300"
			style="opacity: {isMobile ? 0.4 : 1 - scrollY / 300}"
		>
			<div class="h-15 w-px bg-linear-to-b from-transparent to-red-500/80"></div>
			<ArrowDown class="animate-bounce-slow h-6 w-6 text-red-500" />
		</div>
	</section>
{/if}

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
</style>
