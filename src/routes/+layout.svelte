<script lang="ts">
	import "../app.css";
	import { page } from "$app/state";
	import { fade, fly } from "svelte/transition";
	import { browser } from "$app/environment";
	import { onMount } from "svelte";
	import {
		PanelRightClose,
		PanelRightOpen,
		LogOut,
		ChevronDown,
		ShieldCheck,
	} from "lucide-svelte";
	import { gsap } from "gsap";
	import { canUseBlur } from "$lib/utils/perf";
	import { base } from "$app/paths";

	import { signInWithGoogle, signOut } from "$lib/auth-client";
	import AuthModal from "$lib/components/AuthModal.svelte";

	const { children, data } = $props();
	const user = $derived(data.user);
	let showAuthModal = $state(false);
	let userDropdownOpen = $state(false);

	let menuOpen = $state(false);
	let desktopNavOpen = $state(true);
	let headerPillEl = $state<HTMLElement>();
	let desktopNavContainer = $state<HTMLElement>();
	let toggleBtnEl = $state<HTMLElement>();
	let headerHoverTimer: ReturnType<typeof setTimeout> | null = null;
	let isAnimatingNav = false;

	const navLinks = [
		{ href: "/about", label: "About" },
		{ href: "/writing", label: "Writing" },
		{ href: "/project", label: "Projects" },
		{ href: "/music", label: "Music" },
		{ href: "/gallery", label: "Gallery" },
		{ href: "/academics", label: "Academics" },
	];

	const currentPath = $derived(page.url.pathname);
	const isAdminRoute = $derived(
		currentPath.startsWith("/dash") || currentPath.startsWith("/admin"),
	);
	const isErrorPage = $derived(Boolean(page.error));
	const currentSection = $derived(() => {
		const path = currentPath;
		if (path === "/") return null;
		const segment = path.split("/")[1];
		return navLinks.find((l) => l.href === `/${segment}`) || null;
	});

	let customTooltipEl = $state<HTMLElement>();
	let tooltipText = $state("");

	onMount(() => {
		if (browser) {
			import("lenis").then(({ default: Lenis }) => {
				const lenis = new Lenis({
					duration: 1.1,
					easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
					touchMultiplier: 1.5,
					infinite: false,
				});

				function raf(time: number) {
					lenis.raf(time);
					requestAnimationFrame(raf);
				}
				requestAnimationFrame(raf);
			});

			// Markdown code-block copy + copy/check icon state now lives in
			// <MarkdownContent> (per-container, with real lucide icons).

			// Global GSAP Custom Tooltip Manager for title and data-tooltip attributes
			let activeTarget: HTMLElement | null = null;
			let originalTitle = "";

			const handleMouseOver = (e: MouseEvent) => {
				if (window.innerWidth < 1024) return;
				const target = (e.target as HTMLElement)?.closest(
					"[title], [data-tooltip]",
				) as HTMLElement;
				if (!target || target === activeTarget) return;

				const titleAttr =
					target.getAttribute("title") ||
					target.getAttribute("data-tooltip");
				if (!titleAttr) return;

				activeTarget = target;
				if (target.hasAttribute("title")) {
					originalTitle = titleAttr;
					target.setAttribute("data-tooltip", originalTitle);
					target.setAttribute("data-had-title", "true");
					target.removeAttribute("title");
				} else {
					originalTitle = target.getAttribute("data-tooltip") || "";
				}

				tooltipText = originalTitle;

				if (customTooltipEl) {
					gsap.killTweensOf(customTooltipEl);
					gsap.set(customTooltipEl, {
						x: e.clientX + 10,
						y: e.clientY + 14,
						opacity: 0,
						scale: 0.92,
					});
					gsap.to(customTooltipEl, {
						opacity: 1,
						scale: 1,
						duration: 0.18,
						ease: "power2.out",
					});
				}
			};

			const handleMouseMove = (e: MouseEvent) => {
				if (activeTarget && customTooltipEl) {
					gsap.to(customTooltipEl, {
						x: e.clientX + 10,
						y: e.clientY + 14,
						duration: 0.08,
						ease: "power1.out",
					});
				}
			};

			const handleMouseOut = (e: MouseEvent) => {
				if (!activeTarget) return;
				const related = e.relatedTarget as HTMLElement;
				if (related && activeTarget.contains(related)) return;

				if (activeTarget.hasAttribute("data-had-title")) {
					activeTarget.setAttribute("title", originalTitle);
					activeTarget.removeAttribute("data-had-title");
				}

				if (customTooltipEl) {
					gsap.killTweensOf(customTooltipEl);
					gsap.to(customTooltipEl, {
						opacity: 0,
						scale: 0.92,
						duration: 0.12,
						ease: "power2.in",
					});
				}

				activeTarget = null;
			};

			document.addEventListener("mouseover", handleMouseOver);
			document.addEventListener("mousemove", handleMouseMove);
			document.addEventListener("mouseout", handleMouseOut);

			return () => {
				document.removeEventListener("mouseover", handleMouseOver);
				document.removeEventListener("mousemove", handleMouseMove);
				document.removeEventListener("mouseout", handleMouseOut);
			};
		}
	});

	function toggleMenu() {
		menuOpen = !menuOpen;
	}

	function closeMenu() {
		menuOpen = false;
	}

	function toggleDesktopNav() {
		if (!browser || isAnimatingNav) return;
		isAnimatingNav = true;

		if (headerHoverTimer) clearTimeout(headerHoverTimer);

		// Hide hover pill immediately when toggling
		if (headerPillEl) {
			gsap.killTweensOf(headerPillEl);
			gsap.to(headerPillEl, { opacity: 0, duration: 0.15 });
		}

		if (desktopNavOpen) {
			// HIDE ANIMATION
			const links = desktopNavContainer
				? Array.from(
						desktopNavContainer.querySelectorAll(
							".desktop-nav-link",
						),
					)
				: [];

			gsap.killTweensOf([desktopNavContainer, ...links]);
			if (toggleBtnEl) gsap.killTweensOf(toggleBtnEl);

			// Spin & scale icon
			if (toggleBtnEl) {
				gsap.to(toggleBtnEl, {
					rotate: -180,
					scale: 0.8,
					duration: 0.3,
					ease: "back.in(1.7)",
				});
			}

			const tl = gsap.timeline({
				onComplete: () => {
					desktopNavOpen = false;
					isAnimatingNav = false;
					if (toggleBtnEl)
						gsap.set(toggleBtnEl, { rotate: 0, scale: 1 });
				},
			});

			// Stagger items collapsing right with blur
			if (links.length > 0) {
				tl.to(links, {
					opacity: 0,
					x: 20,
					scale: 0.85,
					...(canUseBlur() ? { filter: "blur(4px)" } : {}),
					duration: 0.18,
					stagger: { each: 0.025, from: "end" },
					ease: "power2.in",
				});
			}

			// Shrink wrapper
			if (desktopNavContainer) {
				tl.to(
					desktopNavContainer,
					{
						opacity: 0,
						scale: 0.9,
						x: 15,
						transformOrigin: "right center",
						duration: 0.22,
						ease: "power3.inOut",
					},
					"-=0.1",
				);
			}
		} else {
			// OPEN ANIMATION
			desktopNavOpen = true;

			// Spin icon back with dynamic spring
			if (toggleBtnEl) {
				gsap.fromTo(
					toggleBtnEl,
					{ rotate: 180, scale: 0.75 },
					{
						rotate: 0,
						scale: 1,
						duration: 0.45,
						ease: "back.out(2)",
					},
				);
			}

			setTimeout(() => {
				const links = desktopNavContainer
					? Array.from(
							desktopNavContainer.querySelectorAll(
								".desktop-nav-link",
							),
						)
					: [];

				gsap.killTweensOf([desktopNavContainer, ...links]);

				// Expand container with elastic snap
				if (desktopNavContainer) {
					gsap.fromTo(
						desktopNavContainer,
						{
							opacity: 0,
							scale: 0.85,
							x: 25,
							transformOrigin: "right center",
						},
						{
							opacity: 1,
							scale: 1,
							x: 0,
							duration: 0.38,
							ease: "back.out(1.3)",
						},
					);
				}

				// Stagger nav links in from right to left with warm elastic spring & motion blur
				if (links.length > 0) {
					gsap.fromTo(
						links,
						{
							opacity: 0,
							x: 28,
							scale: 0.75,
							...(canUseBlur() ? { filter: "blur(8px)" } : {}),
						},
						{
							opacity: 1,
							x: 0,
							scale: 1,
							...(canUseBlur() ? { filter: "blur(0px)" } : {}),
							duration: 0.45,
							stagger: 0.04,
							ease: "back.out(1.6)",
							clearProps: "transform,filter,opacity",
							onComplete: () => {
								isAnimatingNav = false;
							},
						},
					);
				} else {
					isAnimatingNav = false;
				}
			}, 10);
		}
	}

	function handleHeaderLinkHover(targetNode: HTMLElement) {
		if (!browser || !headerPillEl || !desktopNavOpen || isAnimatingNav)
			return;
		if (headerHoverTimer) clearTimeout(headerHoverTimer);

		const pill = headerPillEl;
		headerHoverTimer = setTimeout(() => {
			gsap.killTweensOf(pill);
			gsap.to(pill, {
				left: targetNode.offsetLeft,
				top: targetNode.offsetTop,
				width: targetNode.offsetWidth,
				height: targetNode.offsetHeight,
				opacity: 1,
				duration: 0.28,
				ease: "back.out(1.3)",
			});
		}, 30);
	}

	function handleHeaderMouseLeave() {
		if (headerHoverTimer) clearTimeout(headerHoverTimer);
		if (!browser || !headerPillEl) return;
		const pill = headerPillEl;
		gsap.killTweensOf(pill);
		gsap.to(pill, { opacity: 0, duration: 0.2, ease: "power2.out" });
	}
</script>

<svelte:head>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html `<script type="application/ld+json">${JSON.stringify({
		"@context": "https://schema.org",
		"@type": "WebSite",
		"name": "M. Roni",
		"url": page.url.origin
	}).replace(/</g, '\\x3C')}</` + `script>`}
</svelte:head>

{#if !isAdminRoute && !isErrorPage}
	<!-- Sticky Header Navigation Bar (Smooth Ultra-Blur Frosted Glass Constant at Top) -->
	<nav
		class="sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-xl transition-all duration-300"
	>
		<div
			class="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between"
		>
			<!-- Left: Brand / Title -->
			<div class="flex items-center gap-3">
				<!-- Mobile Morphing Hamburger / X Toggle Button -->
				<button
					class="md:hidden relative w-8 h-8 flex flex-col items-center justify-center gap-1.5 text-[#ededed] hover:text-white transition-colors cursor-pointer z-50"
					onclick={toggleMenu}
					aria-label="Toggle menu"
					aria-expanded={menuOpen}
					id="menu-toggle-btn"
				>
					<span
						class="w-5 h-0.5 bg-current rounded-full transition-transform duration-300 ease-out {menuOpen
							? 'rotate-45 translate-y-2'
							: ''}"
					></span>
					<span
						class="w-5 h-0.5 bg-current rounded-full transition-opacity duration-200 {menuOpen
							? 'opacity-0'
							: 'opacity-100'}"
					></span>
					<span
						class="w-5 h-0.5 bg-current rounded-full transition-transform duration-300 ease-out {menuOpen
							? '-rotate-45 -translate-y-2'
							: ''}"
					></span>
				</button>

				<a
					href="/"
					class="text-base font-semibold text-[#ededed] hover:no-underline hover:text-white"
					onclick={closeMenu}
				>
					M. Roni
				</a>
			</div>

			<!-- Right: Navigation Links & User Profile -->
			<div class="flex items-center gap-2">
				<!-- Desktop Navbar Links (Hidden on mobile) -->
				<div class="hidden md:flex items-center gap-2">
					<!-- Desktop Navbar Links with GSAP Sliding Hover Pill -->
					<!-- svelte-ignore a11y_no_static_element_interactions -->
					<div
						bind:this={desktopNavContainer}
						class="flex items-center gap-1 relative py-1 origin-right {desktopNavOpen
							? 'pointer-events-auto'
							: 'pointer-events-none opacity-0'}"
						onmouseleave={handleHeaderMouseLeave}
					>
						<!-- Smooth Sliding Background Pill -->
						<div
							class="absolute pointer-events-none rounded-lg bg-[#181818] border border-[#262626] transition-opacity duration-200"
							bind:this={headerPillEl}
							style="opacity: 0; top: 0; left: 0; width: 0; height: 0;"
						></div>

						{#each navLinks as link}
							<a
								href={link.href}
								class="desktop-nav-link relative z-10 px-3 py-1.5 rounded-lg text-sm transition-colors hover:no-underline {currentPath.startsWith(
									link.href,
								)
									? 'text-[#ededed] font-medium'
									: 'text-[#a1a1a1] hover:text-[#ededed]'}"
								onmouseenter={(e) =>
									handleHeaderLinkHover(
										e.currentTarget as HTMLElement,
									)}
							>
								{link.label}
							</a>
						{/each}
					</div>

					<!-- Sleek Toggle Icon Button with GSAP rotation -->
					<button
						bind:this={toggleBtnEl}
						class="p-2 rounded-full border border-[#222222] bg-[#141414]/80 text-[#a1a1a1] hover:text-white hover:border-[#333333] hover:bg-[#1a1a1a] transition-colors cursor-pointer select-none flex items-center justify-center shadow-sm shrink-0 active:scale-95"
						onclick={toggleDesktopNav}
						aria-label="Toggle desktop navigation"
						title={desktopNavOpen
							? "Hide Navigation"
							: "Show Navigation"}
					>
						{#if desktopNavOpen}
							<PanelRightClose
								size={16}
								class="text-red-400/90 hover:text-red-400 transition-colors"
							/>
						{:else}
							<PanelRightOpen
								size={16}
								class="text-[#a1a1a1] hover:text-white transition-colors"
							/>
						{/if}
					</button>
				</div>

				<!-- User Auth Status / Quiet Premium Minimalist Avatar & Dropdown (Visible on Mobile & Desktop) -->
				{#if user}
					<!-- svelte-ignore a11y_no_static_element_interactions -->
					<!-- svelte-ignore a11y_click_events_have_key_events -->
					<div class="relative pl-2.5 border-l border-[#222222]">
						<!-- Trigger Avatar Button -->
						<button
							onclick={() =>
								(userDropdownOpen = !userDropdownOpen)}
							class="flex items-center gap-1.5 rounded-full p-0.5 hover:opacity-80 transition-opacity cursor-pointer select-none"
							title={user.name || user.email}
						>
							{#if user.image}
								<img
									src={user.image}
									alt={user.name}
									class="w-6 h-6 rounded-full object-cover border border-white/10"
								/>
							{:else}
								<div
									class="flex h-6 w-6 items-center justify-center rounded-full bg-[#222222] text-[10px] font-semibold text-[#ededed]"
								>
									{user.name
										? user.name[0].toUpperCase()
										: "U"}
								</div>
							{/if}
						</button>

						<!-- Minimalist Dropdown -->
						{#if userDropdownOpen}
							<!-- Fullscreen Backdrop to close when clicking ANYWHERE on screen -->
							<div
								class="fixed inset-0 z-40"
								onclick={() => (userDropdownOpen = false)}
							></div>

							<div
								transition:fly={{ y: 4, duration: 150 }}
								class="absolute right-0 top-full mt-2 z-50 w-48 rounded-xl border border-[#222222] bg-[#121212] p-1.5 shadow-xl text-left"
							>
								<div class="px-2.5 py-2">
									<div
										class="text-xs font-medium text-[#ededed] truncate"
									>
										{user.name || "User"}
									</div>
									<div
										class="text-[11px] text-[#666666] truncate font-normal"
									>
										{user.email}
									</div>
								</div>

								<div
									class="border-t border-[#1f1f1f] my-1"
								></div>

								<button
									onclick={() => {
										userDropdownOpen = false;
										signOut();
									}}
									class="flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs text-[#a1a1a1] hover:text-red-400 hover:bg-white/5 transition-colors cursor-pointer"
								>
									<span>Sign Out</span>
									<LogOut class="w-3.5 h-3.5" />
								</button>
							</div>
						{/if}
					</div>
				{:else}
					<!-- Typography-driven Sign In Button -->
					<button
						onclick={() => (showAuthModal = true)}
						class="group relative flex items-center gap-2 pl-2.5 border-l border-[#222222] text-xs font-semibold text-[#a1a1a1] hover:text-white transition-colors cursor-pointer select-none"
						title="Sign in to access private features"
					>
						<span class="relative">
							Sign In
							<span
								class="absolute -bottom-0.5 left-0 w-0 h-px bg-red-400 transition-all duration-300 group-hover:w-full"
							></span>
						</span>
						<span
							class="h-1.5 w-1.5 rounded-full bg-red-400/80 animate-pulse"
						></span>
					</button>
				{/if}
			</div>
		</div>
	</nav>

	<!-- Full-Page Overlay Menu (Mobile) -->
	{#if menuOpen}
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class="fixed inset-0 z-40 bg-[#0a0a0a] flex flex-col items-center justify-center p-8 md:hidden"
			transition:fade={{ duration: 250 }}
			onclick={closeMenu}
			onkeydown={(e) => e.key === "Escape" && closeMenu()}
		>
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<nav
				class="relative flex flex-col items-center gap-5 w-full max-w-md"
				id="nav-menu"
				onclick={(e) => e.stopPropagation()}
			>
				{#each navLinks as link, i}
					<div
						transition:fly={{ y: 16, duration: 250, delay: i * 30 }}
						class="relative z-10 w-full text-center"
					>
						<a
							href={link.href}
							class="inline-block py-2 px-6 text-3xl font-medium tracking-tight text-[#a1a1a1] hover:text-white hover:no-underline transition-colors {currentPath.startsWith(
								link.href,
							)
								? 'text-white font-semibold'
								: ''}"
							onclick={closeMenu}
						>
							{link.label}
						</a>
					</div>
				{/each}
			</nav>
		</div>
	{/if}

	<main
		class="min-h-[calc(100vh-56px)] transition-all duration-300 {menuOpen
			? 'blur-lg opacity-20 pointer-events-none'
			: ''}"
	>
		{@render children()}
	</main>
{:else}
	<main class="min-h-screen">
		{@render children()}
	</main>
{/if}

{#if showAuthModal}
	<AuthModal
		open={true}
		title="Login to Portfolio"
		description="Masuk dengan akun Google Anda untuk mengakses fitur dan halaman khusus."
		requireTrunojoyo={false}
		onClose={() => (showAuthModal = false)}
	/>
{/if}

<!-- Global GSAP Custom Floating Tooltip -->
<div
	bind:this={customTooltipEl}
	class="hidden lg:block fixed top-0 left-0 z-9999 pointer-events-none opacity-0 scale-90 rounded-lg bg-[#181818]/95 px-2.5 py-1 text-[11px] font-medium text-[#ededed] shadow-2xl border border-[#2a2a2a] backdrop-blur-md font-sans tracking-tight"
>
	{tooltipText}
</div>
