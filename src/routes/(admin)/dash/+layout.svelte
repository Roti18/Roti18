<script lang="ts">
	import { page } from "$app/state";
	import { fly, fade } from "svelte/transition";
	import { signOut } from "$lib/auth-client";
	import {
		LayoutDashboard,
		FileText,
		FolderGit2,
		UserCheck,
		Image,
		GraduationCap,
		Music,
		Settings,
		Home,
		LogOut,
		Menu,
		X,
		ChevronRight,
		ExternalLink
	} from "lucide-svelte";

	let { children, data } = $props();
	const user = $derived(data.user);

	let sidebarOpen = $state(true);
	let mobileSidebarOpen = $state(false);

	const currentPath = $derived(page.url.pathname);

	const navGroups = [
		{
			label: "Overview",
			items: [
				{ href: "/dash", label: "Dashboard", icon: LayoutDashboard }
			]
		},
		{
			label: "Content Management",
			items: [
				{ href: "/dash/home", label: "Home Featured", icon: Home },
				{ href: "/dash/writings", label: "Writings", icon: FileText },
				{ href: "/dash/projects", label: "Projects", icon: FolderGit2 },
				{ href: "/dash/about", label: "About", icon: UserCheck },
				{ href: "/dash/gallery", label: "Gallery", icon: Image },
				{ href: "/dash/academics", label: "Academics", icon: GraduationCap }
			]
		},
		{
			label: "Media & Webhooks",
			items: [
				{ href: "/dash/music", label: "Music Tracker", icon: Music }
			]
		},
		{
			label: "System",
			items: [
				{ href: "/dash/settings", label: "Settings", icon: Settings }
			]
		}
	];

	function getBreadcrumbs() {
		const path = currentPath;
		if (path === "/dash") return [{ label: "Dashboard", href: "/dash" }];

		const parts = path.replace("/dash", "").split("/").filter(Boolean);
		const breadcrumbs = [{ label: "Dashboard", href: "/dash" }];

		let accumulated = "/dash";
		for (const part of parts) {
			accumulated += `/${part}`;
			breadcrumbs.push({
				label: part.charAt(0).toUpperCase() + part.slice(1),
				href: accumulated
			});
		}

		return breadcrumbs;
	}
</script>

<svelte:head>
	<title>Admin Portal — M. Roni</title>
</svelte:head>

<div class="min-h-screen bg-[#0a0a0a] text-[#ededed] font-sans antialiased flex flex-col">
	<!-- Top Sticky Header Bar -->
	<header class="sticky top-0 z-30 h-14 bg-[#0d0d0d] border-b border-[#1f1f1f] px-4 flex items-center justify-between">
		<div class="flex items-center gap-3">
			<!-- Sidebar Toggle Button -->
			<button
				onclick={() => {
					if (window.innerWidth < 1024) {
						mobileSidebarOpen = !mobileSidebarOpen;
					} else {
						sidebarOpen = !sidebarOpen;
					}
				}}
				class="p-2 rounded-xl border border-[#222222] bg-[#141414] text-[#a1a1a1] hover:text-white hover:border-[#333333] transition-colors cursor-pointer"
				title="Toggle Sidebar"
			>
				<Menu class="w-4 h-4" />
			</button>

			<!-- Header Title -->
			<a
				href="/dash"
				class="text-sm font-bold text-white font-['Space_Grotesk'] tracking-tight hover:no-underline"
			>
				Dashboard
			</a>

			<div class="h-4 w-[1px] bg-[#222222] mx-1"></div>

			<!-- Dynamic Breadcrumbs -->
			<nav class="hidden md:flex items-center gap-1 text-xs text-[#888888]">
				{#each getBreadcrumbs() as crumb, i}
					{#if i > 0}
						<ChevronRight class="w-3 h-3 text-[#444444]" />
					{/if}
					{#if i === getBreadcrumbs().length - 1}
						<span class="text-[#ededed] font-medium">{crumb.label}</span>
					{:else}
						<a href={crumb.href} class="text-[#888888] hover:text-[#ededed] transition-colors hover:no-underline">
							{crumb.label}
						</a>
					{/if}
				{/each}
			</nav>
		</div>

		<!-- Right Action Items -->
		<div class="flex items-center gap-2">
			<a
				href="/"
				target="_blank"
				class="hidden sm:flex items-center gap-1.5 rounded-xl border border-[#222222] bg-[#121212] px-3 py-1.5 text-xs text-[#a1a1a1] hover:text-white hover:border-[#333333] transition-colors hover:no-underline"
			>
				<span>Public Website</span>
				<ExternalLink class="w-3.5 h-3.5 text-[#666666]" />
			</a>

			<!-- Admin User Status Tag -->
			<div class="flex items-center gap-2 pl-2 border-l border-[#222222]">
				{#if user}
					<div class="flex items-center gap-2 rounded-xl bg-[#121212] px-2.5 py-1 border border-[#222222]">
						{#if user.image}
							<img src={user.image} alt={user.name} class="w-5 h-5 rounded-full object-cover" />
						{:else}
							<div class="w-5 h-5 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center text-[10px] font-bold">
								{user.name ? user.name[0].toUpperCase() : 'A'}
							</div>
						{/if}
						<span class="text-xs font-medium text-[#ededed] hidden sm:inline max-w-[100px] truncate">
							{user.name || user.email}
						</span>
						<span class="text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30 uppercase">
							ADMIN
						</span>
					</div>

					<button
						onclick={() => signOut()}
						class="p-1.5 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors cursor-pointer"
						title="Sign Out"
					>
						<LogOut class="w-4 h-4" />
					</button>
				{/if}
			</div>
		</div>
	</header>

	<!-- Main Body Layout Container (Sidebar Fixed at Top + Natural Scroll Viewport) -->
	<div class="flex-1 flex relative">
		<!-- Desktop Sidebar (Fixed position relative to viewport header) -->
		<aside
			class="hidden lg:flex flex-col border-r border-[#1f1f1f] bg-[#0d0d0d] transition-all duration-300 ease-in-out shrink-0 sticky top-14 h-[calc(100vh-56px)] overflow-y-auto {sidebarOpen
				? 'w-64'
				: 'w-16'}"
		>
			<div class="flex-1 overflow-y-auto p-3 space-y-6 scrollbar-none">
				{#each navGroups as group}
					<div class="space-y-1">
						{#if sidebarOpen}
							<div class="px-3 text-[10px] font-mono tracking-wider text-[#555555] uppercase font-semibold">
								{group.label}
							</div>
						{/if}

						{#each group.items as item}
							{@const active = currentPath === item.href || (item.href !== '/dash' && currentPath.startsWith(item.href))}
							<a
								href={item.href}
								class="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all hover:no-underline group {active
									? 'bg-red-500/15 text-red-400 border border-red-500/30 shadow-sm font-semibold'
									: 'text-[#a1a1a1] hover:text-white hover:bg-white/5 border border-transparent'}"
								title={!sidebarOpen ? item.label : undefined}
							>
								<item.icon class="w-4 h-4 shrink-0 transition-transform group-hover:scale-110 {active ? 'text-red-400' : 'text-[#777777] group-hover:text-white'}" />
								{#if sidebarOpen}
									<span class="truncate">{item.label}</span>
								{/if}
							</a>
						{/each}
					</div>
				{/each}
			</div>

			{#if sidebarOpen}
				<div class="p-3 border-t border-[#1f1f1f] bg-[#111111]/50 text-[10px] text-[#666666] font-mono flex items-center justify-between shrink-0">
					<span>Admin Portal</span>
					<span class="inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
				</div>
			{/if}
		</aside>

		<!-- Mobile Overlay Drawer Sidebar -->
		{#if mobileSidebarOpen}
			<!-- Backdrop -->
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div
				class="lg:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
				onclick={() => (mobileSidebarOpen = false)}
				transition:fade={{ duration: 150 }}
			></div>

			<div
				class="lg:hidden fixed inset-y-0 left-0 z-50 w-72 bg-[#0d0d0d] border-r border-[#1f1f1f] p-4 flex flex-col justify-between"
				transition:fly={{ x: -280, duration: 250 }}
			>
				<div class="space-y-6 overflow-y-auto">
					<div class="flex items-center justify-between">
						<div class="font-bold text-white font-['Space_Grotesk'] text-sm">
							Dashboard
						</div>
						<button
							onclick={() => (mobileSidebarOpen = false)}
							class="p-1.5 rounded-lg text-[#666666] hover:text-white transition-colors"
						>
							<X class="w-5 h-5" />
						</button>
					</div>

					{#each navGroups as group}
						<div class="space-y-1">
							<div class="px-3 text-[10px] font-mono tracking-wider text-[#555555] uppercase font-semibold">
								{group.label}
							</div>

							{#each group.items as item}
								{@const active = currentPath === item.href || (item.href !== '/dash' && currentPath.startsWith(item.href))}
								<a
									href={item.href}
									onclick={() => (mobileSidebarOpen = false)}
									class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all hover:no-underline {active
										? 'bg-red-500/15 text-red-400 border border-red-500/30 font-semibold'
										: 'text-[#a1a1a1] hover:text-white hover:bg-white/5'}"
								>
									<item.icon class="w-4 h-4 shrink-0 {active ? 'text-red-400' : 'text-[#777777]'}" />
									<span>{item.label}</span>
								</a>
							{/each}
						</div>
					{/each}
				</div>

				<div class="pt-4 border-t border-[#1f1f1f] text-xs text-[#666666] flex items-center justify-between">
					<span>Admin Portal</span>
					<span class="text-red-400 font-mono text-[10px]">ADMIN ACTIVE</span>
				</div>
			</div>
		{/if}

		<!-- Main Content Area (Natural Scrollable Viewport) -->
		<main class="flex-1 min-h-[calc(100vh-56px)] p-4 md:p-6 lg:p-8 bg-[#0a0a0a]">
			{@render children()}
		</main>
	</div>
</div>
