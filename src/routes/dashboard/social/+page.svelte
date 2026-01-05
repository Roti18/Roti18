<script lang="ts">
	import { goto } from '$app/navigation';
	import type { SocialLinks } from '$lib/server/db/schema';
	import { confirmService } from '$lib/stores/confirm.svelte';
	import { toastService } from '$lib/stores/toast.svelte';

	import Card from '$lib/ui/Card.svelte';
	import CrudHeader from '$lib/ui/CrudHeader.svelte';
	import CrudActions from '$lib/ui/CrudActions.svelte';
	import SearchInput from '$lib/ui/SearchInput.svelte';
	import EmptyState from '$lib/ui/EmptyState.svelte';

	let { data } = $props();

	let searchTerm = $state('');

	let filteredSocialLinks = $derived(
		data.socialLinks?.filter(
			(p: SocialLinks) =>
				p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				p.url.toLowerCase().includes(searchTerm.toLowerCase())
		) ?? []
	);

	async function deleteSocialLink(id: number, name: string) {
		confirmService.open({
			title: 'Delete Social Link?',
			description: `Are you sure you want to delete ${name}? This action cannot be undone.`,
			confirmText: 'Delete Link',
			onConfirm: async () => {
				try {
					const res = await fetch(`/dashboard/social/${id}/delete`, {
						method: 'POST'
					});

					if (res.ok) {
						toastService.success('Social link deleted successfully');
						location.href = '/dashboard/social';
					} else {
						toastService.error('Failed to delete social link');
					}
				} catch (err) {
					toastService.error('Network error. Please try again.');
				}
			}
		});
	}
</script>

<svelte:head>
	<title>Social Links</title>
</svelte:head>

<div class="space-y-6">
	<CrudHeader hint="Manage social links">
		<button
			onclick={() => goto('/dashboard/social/create')}
			class="cursor-pointer font-medium text-red-500 transition hover:text-red-400"
		>
			+ Create New Social Link
		</button>
	</CrudHeader>

	<SearchInput placeholder="Search social links by name or URL..." bind:value={searchTerm} />

	{#if filteredSocialLinks.length === 0}
		<EmptyState
			title="No social links found"
			description="Try adjusting your search or create a new social link."
		/>
	{:else}
		<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
			{#each filteredSocialLinks as socialLink (socialLink.id)}
				<Card>
					<h3 class="mb-1 text-lg font-bold text-white">
						{socialLink.name}
					</h3>

					<p class="mb-4 line-clamp-2 text-sm tracking-tight text-white/50">
						{socialLink.url}
					</p>

					<CrudActions
						onEdit={() => goto(`/dashboard/social/${socialLink.id}/edit`)}
						onDelete={() => deleteSocialLink(socialLink.id, socialLink.name)}
					/>
				</Card>
			{/each}
		</div>
	{/if}
</div>
