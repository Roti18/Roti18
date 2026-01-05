<script lang="ts">
	import { goto } from '$app/navigation';
	import type { Project } from '$lib/server/db/schema';
	import { confirmService } from '$lib/stores/confirm.svelte';
	import { toastService } from '$lib/stores/toast.svelte';
	import ImageModal from '$lib/components/ImageModal.svelte';

	import Card from '$lib/ui/Card.svelte';
	import CrudHeader from '$lib/ui/CrudHeader.svelte';
	import CrudActions from '$lib/ui/CrudActions.svelte';
	import SearchInput from '$lib/ui/SearchInput.svelte';
	import EmptyState from '$lib/ui/EmptyState.svelte';

	let { data } = $props();

	let searchTerm = $state('');
	let selectedImage = $state<string | null>(null);

	let filteredProjects = $derived(
		data.projects?.filter(
			(p: Project) =>
				p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
				p.subtitle.toLowerCase().includes(searchTerm.toLowerCase())
		) ?? []
	);

	async function deleteProject(id: number) {
		confirmService.open({
			title: 'Delete Project?',
			description: 'This action cannot be undone.',
			confirmText: 'Delete',
			onConfirm: async () => {
				try {
					const res = await fetch(`/dashboard/projects/${id}/delete`, {
						method: 'POST'
					});

					if (res.ok) {
						toastService.success('Project deleted successfully');
						location.href = '/dashboard/projects';
					} else {
						toastService.error('Failed to delete project');
					}
				} catch (err) {
					toastService.error('Network error. Please try again.');
				}
			}
		});
	}
</script>

<svelte:head>
	<title>Projects</title>
</svelte:head>

<ImageModal
	src={selectedImage ?? ''}
	show={!!selectedImage}
	onClose={() => (selectedImage = null)}
/>

<div class="space-y-6">
	<CrudHeader hint="Manage projects">
		<button
			onclick={() => goto('/dashboard/projects/create')}
			class="cursor-pointer font-medium text-red-500 transition hover:text-red-400"
		>
			+ Create New Project
		</button>
	</CrudHeader>

	<SearchInput placeholder="Search projects by title or subtitle..." bind:value={searchTerm} />

	{#if filteredProjects.length === 0}
		<EmptyState
			title="No projects found"
			description="Try adjusting your search or create a new project."
		/>
	{:else}
		<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
			{#each filteredProjects as project (project.id)}
				<Card>
					<button
						class="group relative mb-3 block cursor-zoom-in overflow-hidden rounded-lg"
						onclick={() => (selectedImage = project.image)}
					>
						<img
							src={project.image}
							alt={project.title}
							class="aspect-video w-full object-cover transition-transform duration-500 group-hover:scale-110"
						/>
						<div
							class="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100"
						>
							<span class="text-xs font-semibold tracking-wider text-white uppercase"
								>Preview Image</span
							>
						</div>
					</button>

					<h3 class="mb-1 text-lg font-bold text-white">
						{project.title}
					</h3>

					<p class="mb-2 text-sm font-medium text-red-400">
						{project.subtitle}
					</p>

					<p class="mb-4 line-clamp-2 text-sm leading-relaxed text-white/50">
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
