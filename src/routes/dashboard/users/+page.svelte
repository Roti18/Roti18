<script lang="ts">
	import { goto } from '$app/navigation';
	import type { User } from '$lib/server/db/schema';
	import { confirmService } from '$lib/stores/confirm.svelte';
	import { toastService } from '$lib/stores/toast.svelte';

	import Card from '$lib/ui/Card.svelte';
	import Avatar from '$lib/ui/Avatar.svelte';
	import SearchInput from '$lib/ui/SearchInput.svelte';
	import CrudHeader from '$lib/ui/CrudHeader.svelte';
	import CrudActions from '$lib/ui/CrudActions.svelte';
	import EmptyState from '$lib/ui/EmptyState.svelte';
	import { onMount, onDestroy } from 'svelte';

	let isMobile = $state(false);

	const updateIsMobile = () => {
		isMobile = window.innerWidth < 768;
	};

	onMount(() => {
		updateIsMobile();
		window.addEventListener('resize', updateIsMobile);
	});

	onDestroy(() => {
		if (typeof window !== 'undefined') {
			window.removeEventListener('resize', updateIsMobile);
		}
	});

	let { data } = $props();
	let searchTerm = $state('');

	let filteredUsers = $derived(
		data.users.filter(
			(u: User) =>
				u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
				u.name?.toLowerCase().includes(searchTerm.toLowerCase())
		)
	);
</script>

<svelte:head>
	<title>Users</title>
</svelte:head>

<div class="space-y-6">
	<CrudHeader hint="Manage account">
		<button
			onclick={() => goto('/dashboard/users/create')}
			class="cursor-pointer font-medium text-red-500 transition hover:text-red-400"
		>
			+ Create New User
		</button>
	</CrudHeader>

	<SearchInput bind:value={searchTerm} placeholder="Search users by name or email..." />

	{#if filteredUsers.length === 0}
		<EmptyState title="No users found" description="Try adjusting your search" />
	{:else}
		<div class="grid gap-4">
			{#each filteredUsers as user (user.id)}
				<Card hover>
					<div class="flex items-center justify-between">
						<div class="flex items-center gap-4">
							{#if !isMobile}
								<Avatar src={user.image} name={user.name || user.email} />
							{/if}

							<div>
								<p class="truncate font-bold text-white">
									{user.name || 'Unnamed User'}
								</p>
								<p class="truncate text-sm tracking-tight text-white/50">
									{user.email}
								</p>
							</div>
						</div>

						<CrudActions
							onEdit={() => goto(`/dashboard/users/${user.id}/edit`)}
							onDelete={() =>
								confirmService.open({
									title: 'Delete user?',
									description: `Are you sure you want to delete ${user.name || user.email}? This action cannot be undone.`,
									confirmText: 'Delete User',
									onConfirm: async () => {
										try {
											const res = await fetch(`/dashboard/users/${user.id}/delete`, {
												method: 'POST'
											});

											if (res.ok) {
												toastService.success('User deleted successfully');
												location.href = '/dashboard/users';
											} else {
												toastService.error('Failed to delete user');
											}
										} catch (err) {
											toastService.error('Network error. Please try again.');
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
