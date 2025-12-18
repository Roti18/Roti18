<script lang="ts">
	import { goto } from '$app/navigation';
	import type { Hero } from '$lib/server/db/schema';
	import { openAlert } from '$lib/stores/alert';

	import Card from '$lib/ui/Card.svelte';
	import CrudActions from '$lib/ui/CrudActions.svelte';
	import CrudHeader from '$lib/ui/CrudHeader.svelte';
	import EmptyState from '$lib/ui/EmptyState.svelte';

	export let data: { heroes: Hero[] };
</script>

<div class="space-y-6">
	<CrudHeader hint="Manage hero section"></CrudHeader>

	{#if data.heroes.length === 0}
		<EmptyState
			title="No hero entry found"
			description="The hero entry can be edited, but not created or deleted."
		/>
	{:else}
		<div class="grid gap-4">
			{#each data.heroes as hero (hero.id)}
				<Card hover>
					<div class="flex items-center justify-between">
						<div class="flex items-center gap-4">
							<div>
								<p class="font-medium text-white">
									{hero.name}
								</p>
								<p class="text-sm text-white/60">
									{hero.role}
								</p>
								<p class="mt-1 text-xs text-white/50 italic">
									"{hero.tagline}"
								</p>
							</div>
						</div>

						<CrudActions
							onEdit={() => goto(`/dashboard/hero/${hero.id}/edit`)}
							onDelete={() =>
								openAlert({
									type: 'error',
									title: 'Denied',
									message: "Can't delete Hero"
								})}
						/>
					</div>
				</Card>
			{/each}
		</div>
	{/if}
</div>
