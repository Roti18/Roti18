<script lang="ts">
	import { goto } from '$app/navigation';
	import type { SocialLinks } from '$lib/server/db/schema';
	import { openConfirm } from '$lib/stores/confirm';

	import Card from '$lib/ui/Card.svelte';
	import CrudHeader from '$lib/ui/CrudHeader.svelte';
	import CrudActions from '$lib/ui/CrudActions.svelte';
	import SearchInput from '$lib/ui/SearchInput.svelte';
	import EmptyState from '$lib/ui/EmptyState.svelte';

	export let data: { socialLinks: SocialLinks[] };

	let searchTerm = '';

	$: filteredSocialLinks =
		data.socialLinks?.filter(
			(p) =>
				p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				p.url.toLowerCase().includes(searchTerm.toLowerCase())
		) ?? [];

	async function deleteSocialLink(id: number) {
		openConfirm({
			title: 'Delete Social Link?',
			description: 'This action cannot be undone.',
			confirmText: 'Delete',
			onConfirm: async () => {
				const res = await fetch(`/dashboard/social/${id}/delete`, {
					method: 'POST'
				});

				if (res.ok) {
					location.href = '/dashboard/social';
				}
			}
		});
	}
</script>

<div class="space-y-6">
	<CrudHeader hint="Manage social links">
		<button
			on:click={() => goto('/dashboard/social/create')}
			class="text-red-400 transition hover:text-red-300"
		>
			Create
		</button>
	</CrudHeader>

	<SearchInput placeholder="Search social links..." bind:value={searchTerm} />

	{#if filteredSocialLinks.length === 0}
		<EmptyState
			title="No social links found"
			description="Try adjusting your search or create a new social link."
		/>
	{:else}
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {#each filteredSocialLinks as socialLink (socialLink.id)}
                <Card>
                    <h3 class="mb-1 font-semibold text-white">
                        {socialLink.name}
                    </h3>

                    <p class="mb-4 line-clamp-2 text-sm text-white/60">
                        {socialLink.url}
                    </p>

                    <CrudActions
                        onEdit={() => goto(`/dashboard/social/${socialLink.id}/edit`)}
                        onDelete={() => deleteSocialLink(socialLink.id)}
                    />
                </Card>
            {/each}
        </div>
	{/if}
</div>
