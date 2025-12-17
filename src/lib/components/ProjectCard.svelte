<script lang="ts">
	export let title: string;
	export let subtitle: string;
	export let description: string;
	export let image: string;
	export let url: string;

	let isHovered = false;
	let cardRef: HTMLDivElement | undefined;
	let tiltX = 0;
	let tiltY = 0;

	function handleMouseMove(e: MouseEvent): void {
		if (!cardRef) return;

		const rect = cardRef.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;

		const centerX = rect.width / 2;
		const centerY = rect.height / 2;

		tiltX = ((y - centerY) / centerY) * -10;
		tiltY = ((x - centerX) / centerX) * 10;
	}

	function handleMouseLeave(): void {
		isHovered = false;
		tiltX = 0;
		tiltY = 0;
	}
</script>

<a href={url} class="block focus:outline-none">
	<div
		bind:this={cardRef}
		role="link"
		tabindex="0"
		aria-label={title}
		class="card-container cursor-pointer transition-all duration-500"
		class:card-hovered={isHovered}
		on:mouseenter={() => (isHovered = true)}
		on:mouseleave={handleMouseLeave}
		on:mousemove={handleMouseMove}
		on:keydown={(e) => e.key === 'Enter' && (window.location.href = url)}
		style="
      transform: perspective(1000px)
      rotateX({tiltX}deg)
      rotateY({tiltY}deg)
      translateY({isHovered ? '-12px' : '0'});
      transition: transform 0.3s ease-out;
    "
	>
		<div
			class="relative aspect-4/3 overflow-hidden rounded border border-rose-900/30 shadow-lg shadow-black/50 transition-all duration-400 hover:border-rose-700/50 hover:shadow-red-900/30"
		>
			<div
				class="absolute inset-0 bg-cover bg-center transition-transform duration-700"
				style="
					background-image: url('{image}');
					transform: scale({isHovered ? 1.1 : 1});
				"
			></div>

			<div
				class="absolute inset-0 flex flex-col justify-end bg-linear-to-b from-black/0 via-black/20 to-black/70 p-4 sm:p-6"
			>
				<h3
					class="mb-1 text-xl tracking-wider text-amber-50 transition-all duration-400 sm:mb-2 sm:text-2xl"
					style="
						transform: translateY({isHovered ? '-4px' : '0'});
						opacity: {isHovered ? 1 : 0.9};
					"
				>
					{title}
				</h3>
				<p
					class="text-[10px] tracking-widest text-rose-300 transition-all duration-400 sm:text-xs"
					style="
						opacity: {isHovered ? 1 : 0.7};
						transform: translateY({isHovered ? '0' : '4px'});
					"
				>
					{subtitle}
				</p>
			</div>

			<div
				class="pointer-events-none absolute inset-0 transition-opacity duration-500"
				style="
					background: linear-gradient(
						135deg,
						transparent 40%,
						rgba(255,255,255,0.1) 50%,
						transparent 60%
					);
					opacity: {isHovered ? 1 : 0};
				"
			></div>
		</div>

		<div class="pt-4 transition-all duration-300 sm:pt-6" style="opacity: {isHovered ? 1 : 0.8}">
			<p class="text-xs leading-relaxed text-neutral-400 sm:text-sm">
				{description}
			</p>
		</div>
	</div>
</a>

<style>
	.card-container {
		transform-style: preserve-3d;
	}
</style>
