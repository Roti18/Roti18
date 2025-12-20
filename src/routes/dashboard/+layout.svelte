<script lang="ts">
	import Topbar from '$lib/components/Topbar.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import ConfirmModal from '$lib/components/ConfirmModal.svelte';
	import AlertModal from '$lib/components/AlertModal.svelte';
</script>

<div class="min-h-screen bg-black text-white">
	<Topbar />

	<div class="flex">
		<Sidebar />

		<main class="relative flex-1 p-6">
			<slot />
		</main>
	</div>

	<AlertModal />
	<ConfirmModal />
</div>
