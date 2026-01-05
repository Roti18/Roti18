<script lang="ts">
	import { confirmService } from '$lib/stores/confirm.svelte';
	import { toastService } from '$lib/stores/toast.svelte';
	import SearchInput from '$lib/ui/SearchInput.svelte';
	import Card from '$lib/ui/Card.svelte';
	import CrudHeader from '$lib/ui/CrudHeader.svelte';
	import EmptyState from '$lib/ui/EmptyState.svelte';
	import Button from '$lib/ui/Button.svelte';

	let { data } = $props();

	let searchTerm = $state('');

	let filtered = $derived(
		data.sessions?.filter(
			(s: any) =>
				(s.id && s.id.toLowerCase().includes(searchTerm.toLowerCase())) ||
				(s.userEmail && s.userEmail.toLowerCase().includes(searchTerm.toLowerCase())) ||
				(s.userName && s.userName.toLowerCase().includes(searchTerm.toLowerCase()))
		) ?? []
	);

	async function deleteSession(id: string) {
		confirmService.open({
			title: 'Delete Session?',
			description: 'This will log the user out. This action cannot be undone.',
			confirmText: 'Terminate Session',
			onConfirm: async () => {
				try {
					const res = await fetch(`/dashboard/sessions/${id}/delete`, {
						method: 'POST'
					});
					if (res.ok) {
						toastService.success('Session terminated successfully');
						location.href = '/dashboard/sessions';
					} else {
						toastService.error('Failed to terminate session');
					}
				} catch (err) {
					toastService.error('Network error. Please try again.');
				}
			}
		});
	}
</script>

<svelte:head>
	<title>Sessions</title>
</svelte:head>

<!-- ROOT WRAPPER (ANTI OVERFLOW) -->
<div class="w-full space-y-4 overflow-x-hidden sm:space-y-6">
	<CrudHeader hint="View Active Sessions">
		<div class="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-1.5 text-xs sm:text-sm">
			<div class="h-2 w-2 animate-pulse rounded-full bg-emerald-400"></div>
			<span class="text-white/60">{data.sessions?.length ?? 0} Active</span>
		</div>
	</CrudHeader>

	<SearchInput bind:value={searchTerm} placeholder="Search sessions by ID, email, or name..." />

	{#if filtered.length === 0}
		<EmptyState
			title="No sessions found"
			description={searchTerm ? 'Try adjusting your search' : 'No active sessions'}
		/>
	{:else}
		<div class="w-full space-y-3 sm:space-y-4">
			{#each filtered as session}
				<Card>
					<div
						class="flex w-full min-w-0 flex-col gap-4
						       sm:flex-row sm:items-center sm:justify-between sm:gap-6"
					>
						<!-- LEFT -->
						<div class="min-w-0 flex-1 space-y-2">
							<p class="text-xs font-medium break-all sm:text-sm" title={session.id}>
								<span class="text-white/50">Session ID:</span>
								<span class="ml-1 font-mono text-white/80">
									{session.id}
								</span>
							</p>

							<p class="text-xs text-white/60 sm:text-sm">
								{session.userName ?? 'Unknown User'}
								<span class="mx-1.5 text-white/30">·</span>
								{session.userEmail ?? 'No Email'}
							</p>
						</div>

						<!-- RIGHT -->
						<div
							class="flex w-full flex-col gap-3
							       sm:w-auto sm:flex-row sm:items-center sm:gap-4 lg:gap-6"
						>
							<div
								class="flex w-full items-center justify-between rounded-lg
								       bg-white/5 px-3 py-2
								       sm:w-auto sm:flex-col sm:items-end sm:bg-transparent sm:p-0"
							>
								<span class="text-xs text-white/50 sm:mb-1"> Expires </span>
								<span class="text-xs font-medium text-white/80 sm:text-sm">
									{new Date(session.expiresAt).toLocaleDateString()}
								</span>
							</div>

							<Button
								variant="danger"
								class="w-full sm:w-auto"
								onclick={() => deleteSession(session.id)}
							>
								Terminate
							</Button>
						</div>
					</div>
				</Card>
			{/each}
		</div>
	{/if}
</div>
