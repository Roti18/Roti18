<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { sidebarOpen } from '$lib/stores/navigation';

	import { Users, User, Briefcase, Folder, Clock, LayoutDashboard, Link } from '@lucide/svelte';

	const navItems = [
		{ path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
		{ path: '/dashboard/users', label: 'Users', icon: Users },
		{ path: '/dashboard/profile', label: 'Profile', icon: User },
		{ path: '/dashboard/hero', label: 'Hero', icon: Briefcase },
		{ path: '/dashboard/projects', label: 'Projects', icon: Folder },
        { path: '/dashboard/social', label: 'Social', icon: Link },
		{ path: '/dashboard/sessions', label: 'Sessions', icon: Clock }
	];

	function isActive(itemPath: string, currentPath: string): boolean {
		if (itemPath === '/dashboard') {
			return currentPath === '/dashboard';
		}
		return currentPath.startsWith(itemPath);
	}

	function navigate(path: string) {
		goto(path);
		sidebarOpen.set(false);
	}
</script>

<aside
	class="
		fixed top-16 left-0 z-30
		h-[calc(100vh-4rem)] w-64
		border-r border-white/10 bg-black
		transition-transform duration-300 ease-in-out
		lg:sticky lg:translate-x-0
	"
	class:-translate-x-full={!$sidebarOpen}
>
	<nav class="space-y-1 p-4">
		{#each navItems as item}
			{@const active = isActive(item.path, $page.url.pathname)}
			<button
				on:click={() => navigate(item.path)}
				class="
					group relative flex w-full items-center gap-3 rounded-lg
					px-4 py-2.5 text-left
					transition-all duration-200
					{active ? 'bg-red-600/10 text-red-400' : 'text-white/60 hover:bg-white/5 hover:text-white'}
				"
			>
				{#if active}
					<div class="absolute top-1/2 left-0 h-6 w-1 -translate-y-1/2 rounded-r bg-red-500"></div>
				{/if}

				<svelte:component
					this={item.icon}
					size={20}
					class="transition-transform duration-200 {active ? '' : 'group-hover:scale-110'}"
				/>
				<span class="text-sm font-medium">{item.label}</span>
			</button>
		{/each}
	</nav>
</aside>

{#if $sidebarOpen}
	<button
		type="button"
		aria-label="Close sidebar"
		class="fixed inset-0 z-20 bg-black/50 backdrop-blur-sm lg:hidden"
		on:click={() => sidebarOpen.set(false)}
	></button>
{/if}
