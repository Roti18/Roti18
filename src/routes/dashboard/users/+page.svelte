<script lang="ts">
	import { goto } from '$app/navigation';
	import type { User } from '$lib/server/db/schema';
	import { openConfirm } from '$lib/stores/confirm';

	import Card from '$lib/ui/Card.svelte';
	import Avatar from '$lib/ui/Avatar.svelte';
	import SearchInput from '$lib/ui/SearchInput.svelte';
	import CrudHeader from '$lib/ui/CrudHeader.svelte';
	import CrudActions from '$lib/ui/CrudActions.svelte';
	import EmptyState from '$lib/ui/EmptyState.svelte';

	export let data: { users: User[] };
	let searchTerm = '';

	$: filteredUsers = data.users.filter(
		(u) =>
			u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
			u.name?.toLowerCase().includes(searchTerm.toLowerCase())
	);
</script>

<div class="space-y-6">
	<CrudHeader hint="Manage account">
		<button
			on:click={() => goto('/dashboard/users/create')}
			class="text-red-400 transition hover:text-red-300"
		>
			Create
		</button>
	</CrudHeader>

	<SearchInput bind:value={searchTerm} placeholder="Search users by name or email..." />

	{#if filteredUsers.length === 0}
		<EmptyState title="No users found" description="Try adjusting your search" />
	{:else}
		<div class="grid gap-4">
			{#each filteredUsers as user}
				<Card hover>
					<div class="flex items-center justify-between">
						<div class="flex items-center gap-4">
							<Avatar src={user.image} name={user.name || user.email} />
							<div>
								<p class="truncate font-medium text-white">
									{user.name || 'Unnamed User'}
								</p>
								<p class="truncate text-sm text-white/60">
									{user.email}
								</p>
							</div>
						</div>

						<CrudActions
							onEdit={() => goto(`/dashboard/users/${user.id}/edit`)}
							onDelete={() =>
								openConfirm({
									title: 'Delete user?',
									description: 'This action cannot be undone.',
									confirmText: 'Delete',
									cancelText: 'Cancel',
									onConfirm: async () => {
										const res = await fetch(`/dashboard/users/${user.id}/delete`, {
											method: 'POST'
										});

										if (res.ok) {
											location.href = '/dashboard/users';
										}
									}
								})}
						/>
					</div>
				</Card>
			{/each}
		</div>
	{/if}
</div>
