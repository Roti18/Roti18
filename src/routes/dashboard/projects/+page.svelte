<script lang="ts">
	import { goto } from '$app/navigation';
	import type { Project } from '$lib/server/db/schema';
	import { openConfirm } from '$lib/stores/confirm';

	import Card from '$lib/ui/Card.svelte';
	import CrudHeader from '$lib/ui/CrudHeader.svelte';
	import CrudActions from '$lib/ui/CrudActions.svelte';
	import SearchInput from '$lib/ui/SearchInput.svelte';
	import EmptyState from '$lib/ui/EmptyState.svelte';

	export let data: { projects: Project[] };

	let searchTerm = '';

	$: filteredProjects =
		data.projects?.filter(
			(p) =>
				p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
				p.subtitle.toLowerCase().includes(searchTerm.toLowerCase())
		) ?? [];

	async function deleteProject(id: number) {
		openConfirm({
			title: 'Delete Project?',
			description: 'This action cannot be undone.',
			confirmText: 'Delete',
			onConfirm: async () => {
				const res = await fetch(`/dashboard/projects/${id}/delete`, {
					method: 'POST'
				});

				if (res.ok) {
					location.href = '/dashboard/projects';
				}
			}
		});
	}
</script>

<svelte:head>
	<title>Projects</title>
</svelte:head>

<div class="space-y-6">
	<CrudHeader hint="Manage projects">
		<button
			on:click={() => goto('/dashboard/projects/create')}
			class="cursor-pointer text-red-400 transition hover:text-red-300"
		>
			Create
		</button>
	</CrudHeader>

	<SearchInput placeholder="Search projects..." bind:value={searchTerm} />

	{#if filteredProjects.length === 0}
		<EmptyState
			title="No projects found"
			description="Try adjusting your search or create a new project."
		/>
	{:else}
		<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
			{#each filteredProjects as project (project.id)}
				<Card>
					<div class="mb-3 block overflow-hidden rounded">
						<img src={project.image} alt={project.title} class="aspect-video w-full object-cover" />
					</div>
					<h3 class="mb-1 font-semibold text-white">
						{project.title}
					</h3>

					<p class="mb-2 text-sm text-red-400">
						{project.subtitle}
					</p>

					<p class="mb-4 line-clamp-2 text-sm text-white/60">
						{project.description}
					</p>

					<CrudActions
						onEdit={() => goto(`/dashboard/projects/${project.id}/edit`)}
						onDelete={() => deleteProject(project.id)}
					/>
				</Card>
			{/each}
		</div>
	{/if}
</div>
