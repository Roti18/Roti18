<script lang="ts">
	import { onMount } from "svelte";
	import { browser } from "$app/environment";
	import { signInWithGoogle } from "$lib/auth-client";
	import { X, ArrowRight, Lock } from "lucide-svelte";

	interface Props {
		open?: boolean;
		title?: string;
		description?: string;
		requireTrunojoyo?: boolean;
		onClose?: () => void;
	}

	let {
		open = true,
		title = "Restricted Access",
		requireTrunojoyo = true,
		onClose,
	}: Props = $props();

	let backdropEl = $state<HTMLElement>();
	let modalCardEl = $state<HTMLElement>();
	let loading = $state(false);

	onMount(() => {
		if (browser && open) {
			import("gsap").then(({ gsap }) => {
				if (backdropEl) {
					gsap.fromTo(
						backdropEl,
						{ opacity: 0 },
						{ opacity: 1, duration: 0.35, ease: "power2.out" },
					);
				}
				if (modalCardEl) {
					gsap.fromTo(
						modalCardEl,
						{ opacity: 0, scale: 0.95, y: 16, filter: "blur(8px)" },
						{
							opacity: 1,
							scale: 1,
							y: 0,
							filter: "blur(0px)",
							duration: 0.45,
							ease: "power3.out",
						},
					);
				}
			});
		}
	});

	function handleClose() {
		if (browser && onClose) {
			import("gsap").then(({ gsap }) => {
				if (modalCardEl) {
					gsap.to(modalCardEl, {
						opacity: 0,
						scale: 0.96,
						y: -10,
						filter: "blur(6px)",
						duration: 0.28,
						ease: "power2.in",
						onComplete: () => onClose?.(),
					});
				} else {
					onClose?.();
				}
				if (backdropEl) {
					gsap.to(backdropEl, {
						opacity: 0,
						duration: 0.28,
						ease: "power2.in",
					});
				}
			});
		} else if (onClose) {
			onClose();
		}
	}

	async function handleGoogleSignIn() {
		try {
			loading = true;
			await signInWithGoogle();
		} catch (err) {
			console.error("Google Sign In Error:", err);
		} finally {
			loading = false;
		}
	}
</script>

{#if open}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
		role="dialog"
		aria-modal="true"
	>
		<!-- Backdrop Overlay (Smooth GSAP exit on click) -->
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			bind:this={backdropEl}
			class="absolute inset-0 bg-[#0a0a0a]/80 backdrop-blur-md cursor-pointer"
			onclick={handleClose}
		></div>

		<!-- Left-Aligned Minimalist Auth Modal Card -->
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			bind:this={modalCardEl}
			class="relative w-full max-w-sm overflow-hidden rounded-2xl border border-[#222222] bg-[#121212] p-6 shadow-2xl z-10 text-left"
			onclick={(e) => e.stopPropagation()}
		>
			<!-- Top Bar: Badge & Close Icon -->
			<div class="flex items-center justify-between mb-5">
				<div
					class="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 px-2.5 py-1 text-[10px] font-semibold tracking-wider text-red-400 border border-red-500/20 uppercase"
				>
					<Lock class="w-3 h-3" />
					<span>Academics</span>
				</div>

				{#if onClose}
					<button
						onclick={handleClose}
						class="p-1 rounded-md text-[#666666] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
						aria-label="Close"
						title="Close modal"
					>
						<X class="w-4 h-4" />
					</button>
				{/if}
			</div>

			<!-- Title & Subtitle (Left-aligned) -->
			<div class="space-y-1.5 mb-6">
				<h2
					class="text-xl font-bold tracking-tight text-[#ededed] font-['Space_Grotesk']"
				>
					{title}
				</h2>
				<p class="text-xs text-[#a1a1a1] font-normal leading-relaxed">
					{requireTrunojoyo
						? "Exclusively for Trunojoyo University students (@student.trunojoyo.ac.id)"
						: "Please sign in to continue"}
				</p>
			</div>

			<!-- Google Sign In Button -->
			<button
				onclick={handleGoogleSignIn}
				disabled={loading}
				class="group flex w-full items-center justify-between rounded-xl bg-white px-4 py-3 text-xs font-semibold text-black transition-all cursor-pointer hover:bg-neutral-200 active:scale-[0.98] disabled:opacity-50"
			>
				<div class="flex items-center gap-2.5">
					<svg class="h-4 w-4 shrink-0" viewBox="0 0 24 24">
						<path
							fill="#4285F4"
							d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
						/>
						<path
							fill="#34A853"
							d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
						/>
						<path
							fill="#FBBC05"
							d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
						/>
						<path
							fill="#EA4335"
							d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
						/>
					</svg>
					<span class="font-semibold tracking-tight text-black"
						>Sign in with Google</span
					>
				</div>

				{#if loading}
					<div
						class="h-3.5 w-3.5 animate-spin rounded-full border-2 border-black border-t-transparent"
					></div>
				{:else}
					<ArrowRight
						class="w-4 h-4 text-black/60 transition-transform group-hover:translate-x-0.5"
					/>
				{/if}
			</button>
		</div>
	</div>
{/if}
