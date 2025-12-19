<script lang="ts">
	import { goto } from '$app/navigation';
	import PageHeader from '$lib/ui/PageHeader.svelte';
	import Card from '$lib/ui/Card.svelte';
	import Input from '$lib/ui/Input.svelte';
	import Textarea from '$lib/ui/Textarea.svelte';
	import FormActions from '$lib/ui/FormActions.svelte';
	import Button from '$lib/ui/Button.svelte';
	import type { Project } from '$lib/server/db/schema';

	export let data: { project: Project };
	const { project } = data;

	let title = project.title;
	let subtitle = project.subtitle;
	let description = project.description;
	let image = project.image;
	let url = project.url;
</script>

<div class="mx-auto max-w-3xl space-y-8">
	<PageHeader back={() => goto('/dashboard/projects')}>Edit Project</PageHeader>

	<Card>
		<form method="POST" action="?/update" enctype="multipart/form-data" class="space-y-6">
			<div class="space-y-4">
				<h3 class="text-sm font-semibold tracking-wider text-white/60 uppercase">
					Basic Information
				</h3>

				<Input label="Project Title" name="title" bind:value={title} required />
				<Input label="Subtitle" name="subtitle" bind:value={subtitle} required />
			</div>

			<div class="space-y-4">
				<h3 class="text-sm font-semibold tracking-wider text-white/60 uppercase">Description</h3>

				<Textarea
					label="Project Description"
					name="description"
					rows={6}
					bind:value={description}
				/>
			</div>

			<div class="grid gap-4 sm:grid-cols-2">
				<div class="space-y-1">
					<label for="project" class="text-sm text-white/60">Project Image</label>
					<input
						id="project"
						type="file"
						name="image"
						accept="image/*"
						class="block w-full text-sm text-white file:mr-4 file:rounded-md
						       file:border-0 file:bg-white/10 file:px-4 file:py-2
						       file:text-white hover:file:bg-white/20"
					/>
					<p class="text-xs text-white/40">
						Optional. Upload new image to replace the current one.
					</p>
				</div>

				<div class="space-y-1">
					<Input label="Project URL" name="url" bind:value={url} required />
					<p class="text-xs text-white/40">Live demo, repository, or external link</p>
				</div>
			</div>

			{#if image}
				<div class="space-y-2">
					<p class="text-sm text-white/60">Current Image</p>
					<img
						src={image}
						alt="Project preview"
						class="max-h-48 w-full rounded-lg border border-white/10 object-cover"
					/>
				</div>
			{/if}

			<FormActions>
				<Button type="submit">Update Project</Button>
				<Button type="button" variant="ghost" on:click={() => goto('/dashboard/projects')}>
					Cancel
				</Button>
			</FormActions>
		</form>
	</Card>
</div>
