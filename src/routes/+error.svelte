<script lang="ts">
	import { page } from '$app/state';
	import { Wrench, ShieldAlert, ArrowLeft, Lock, RefreshCw } from 'lucide-svelte';
	import { signInWithGoogle } from '$lib/auth-client';

	const status = $derived(page.status);
	const message = $derived(page.error?.message || 'An unexpected error occurred');
	const isMaintenance = $derived(status === 503);
</script>

<svelte:head>
	<title>{isMaintenance ? 'System Under Maintenance — M. Roni' : `${status} Error — M. Roni`}</title>
</svelte:head>

<div class="min-h-screen w-full bg-[#0a0a0a] text-[#ededed] font-sans antialiased flex items-center justify-center p-6 relative overflow-hidden">
	<!-- Ambient Background Glow -->
	<div class="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-red-500/10 blur-[120px] pointer-events-none"></div>
	<div class="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-amber-500/10 blur-[120px] pointer-events-none"></div>

	<div class="relative max-w-lg w-full rounded-3xl border border-[#222222] bg-[#121212]/90 backdrop-blur-xl p-8 shadow-2xl space-y-6 text-center">
		{#if isMaintenance}
			<!-- Maintenance Mode Banner -->
			<div class="mx-auto w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/5">
				<Wrench class="w-8 h-8 animate-pulse" />
			</div>

			<div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono font-bold uppercase tracking-wider">
				<span class="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
				<span>MAINTENANCE MODE ACTIVE</span>
			</div>

			<div class="space-y-2">
				<h1 class="text-2xl sm:text-3xl font-bold text-white font-['Space_Grotesk'] tracking-tight">
					System Under Maintenance
				</h1>
				<p class="text-xs text-[#a1a1a1] leading-relaxed">
					{message}
				</p>
			</div>

			<div class="rounded-2xl bg-[#161616] border border-[#262626] p-4 text-xs font-mono text-[#888888] space-y-1">
				<div>Status: <span class="text-amber-400 font-bold">503 SERVICE UNAVAILABLE</span></div>
				<div>Public Access: <span class="text-red-400 font-bold">TEMPORARILY LOCKED</span></div>
			</div>

			<!-- Actions -->
			<div class="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
				<button
					onclick={() => window.location.reload()}
					class="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-[#2a2a2a] bg-[#181818] hover:bg-[#222222] px-5 py-2.5 text-xs font-semibold text-white transition-colors cursor-pointer"
				>
					<RefreshCw class="w-4 h-4" />
					<span>Check Status Again</span>
				</button>

				<button
					onclick={() => signInWithGoogle()}
					class="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-red-500 hover:bg-red-600 px-5 py-2.5 text-xs font-semibold text-white transition-all cursor-pointer shadow-lg active:scale-95"
				>
					<Lock class="w-4 h-4" />
					<span>Admin Login (/dash)</span>
				</button>
			</div>
		{:else}
			<!-- General Error Banner -->
			<div class="mx-auto w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
				<ShieldAlert class="w-8 h-8" />
			</div>

			<div class="space-y-2">
				<h1 class="text-4xl font-bold text-white font-mono tracking-tight">{status}</h1>
				<p class="text-xs text-[#a1a1a1] leading-relaxed">{message}</p>
			</div>

			<div class="pt-2">
				<a
					href="/"
					class="inline-flex items-center gap-2 rounded-xl bg-red-500 hover:bg-red-600 px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:no-underline"
				>
					<ArrowLeft class="w-4 h-4" />
					<span>Return to Homepage</span>
				</a>
			</div>
		{/if}
	</div>
</div>
