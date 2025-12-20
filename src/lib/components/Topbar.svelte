<script lang="ts">
	import { page } from '$app/stores';
	import { sidebarOpen } from '$lib/stores/navigation';

	import { Menu, LogOut } from '@lucide/svelte';
	import Avatar from '$lib/ui/Avatar.svelte';

	let showUserMenu = false;

	function toggleSidebar() {
		sidebarOpen.update((v) => !v);
	}

	function clickOutside(node: HTMLElement) {
		const handleClick = (event: MouseEvent) => {
			if (!node.contains(event.target as Node)) {
				showUserMenu = false;
			}
		};
		document.addEventListener('click', handleClick, true);
		return {
			destroy() {
				document.removeEventListener('click', handleClick, true);
			}
		};
	}
</script>

<header
	class="
		sticky top-0 z-40
		border-b border-white/10
		bg-black/60 backdrop-blur-xl
	"
>
	<div class="flex h-14 items-center justify-between px-4 md:px-6">
		<div class="flex items-center gap-4">
			<button
				on:click={toggleSidebar}
				class="
					text-white/60 transition
					hover:text-white
					lg:hidden
				"
				aria-label="Toggle sidebar"
			>
				<Menu size={22} />
			</button>

			<a href="/" class="text-sm font-bold tracking-wide text-white/80 transition hover:text-white">
				Workspace
			</a>
		</div>

		<div class="relative flex items-center">
			<button
				on:click={() => (showUserMenu = !showUserMenu)}
				class="
					flex items-center gap-2
					rounded-full
					p-1
					transition
					hover:bg-white/5
				"
			>
				<Avatar
					name={$page.data.user?.name ?? $page.data.user?.email}
					src={$page.data.user?.image}
				/>
			</button>

			{#if showUserMenu}
				<div
					class="
						absolute top-12 right-0 w-56
						rounded-xl
						border border-white/10
						bg-zinc-900/95 shadow-2xl
						backdrop-blur-xl
					"
					use:clickOutside
				>
					<div class="border-b border-white/10 px-4 py-3">
						<p class="text-sm font-medium text-white">
							{$page.data.user?.name}
						</p>
						<p class="text-xs text-white/60">
							{$page.data.user?.email}
						</p>
					</div>

					<div class="p-2">
						<form method="POST" action="/logout">
							<button
								type="submit"
								class="
									flex w-full cursor-pointer items-center
									gap-2 rounded-lg px-3
									py-2 text-sm
									text-red-400
									transition hover:bg-white/5
								"
							>
								<LogOut size={16} />
								Logout
							</button>
						</form>
					</div>
				</div>
			{/if}
		</div>
	</div>
</header>
