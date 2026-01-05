<script lang="ts">
	import Topbar from '$lib/components/Topbar.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import DashboardLoader from '$lib/components/DashboardLoader.svelte';
	import { navigating } from '$app/state';

	import ConfirmModal from '$lib/components/ConfirmModal.svelte';

	let { children } = $props();

	let isLoading = $derived(!!navigating.to?.url.pathname.startsWith('/dashboard'));
</script>

<div class="min-h-screen bg-black text-white selection:bg-white/10">
	<Topbar />

	<div class="flex">
		<Sidebar />

		<main class="relative min-h-[calc(100vh-64px)] flex-1 overflow-hidden">
			<DashboardLoader loading={isLoading} />
			<div class="p-6">
				{@render children()}
			</div>
		</main>
	</div>

	<ConfirmModal />
</div>
