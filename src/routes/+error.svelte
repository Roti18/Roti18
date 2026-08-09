<script lang="ts">
	import { page } from '$app/state';

	const status = $derived(page.status);
	const message = $derived(page.error?.message || 'An unexpected error occurred');
	const label = $derived(status === 404 ? 'Page not found' : status === 503 ? 'Under maintenance' : 'Request error');
</script>

<svelte:head>
	<title>{status} | M. Roni</title>
</svelte:head>

<div class="min-h-screen w-full bg-[#0a0a0a] text-[#ededed] font-sans antialiased flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden">
	<!-- Soft red ambient glow -->
	<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-520px h-520px rounded-full bg-red-500/[0.07] blur-[110px] pointer-events-none"></div>

	<div class="relative flex flex-col items-center text-center">
		<!-- Mono microcopy, wide tracking, red -->
		<span class="select-none text-[11px] font-mono font-semibold uppercase tracking-[0.35em] text-red-400/90 mb-8">
			{status} | {label}
		</span>

		<!-- Giant display status -->
		<h1
			class="font-['Space_Grotesk'] font-medium text-[#ededed] leading-none tracking-tight text-[clamp(6rem,20vw,12rem)] select-none"
		>
			{status}
		</h1>

		<!-- Message, muted -->
		<p class="mt-7 max-w-md text-sm text-[#a1a1a1] leading-relaxed">{message}</p>

		<!-- Quiet hairline home link -->
		<a
			href="/"
			class="group mt-12 inline-flex items-center gap-3 text-xs font-medium text-[#ededed] hover:text-red-400 transition-colors hover:no-underline"
		>
			<span class="w-8 h-px bg-[#333333]"></span>
			Back to home
			<span class="w-8 h-px bg-[#333333]"></span>
		</a>
	</div>
</div>