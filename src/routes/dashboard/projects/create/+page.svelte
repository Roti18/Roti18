<script lang="ts">
	import { goto } from '$app/navigation';

	import Input from '$lib/ui/Input.svelte';
	import Textarea from '$lib/ui/Textarea.svelte';
	import Card from '$lib/ui/Card.svelte';
	import PageHeader from '$lib/ui/PageHeader.svelte';
	import FormActions from '$lib/ui/FormActions.svelte';
	import Button from '$lib/ui/Button.svelte';
</script>

<svelte:head>
	<title>Projects | Create</title>
</svelte:head>

<div class=" space-y-6">
	<PageHeader back={() => goto('/dashboard/projects')}>Create Project</PageHeader>

	<Card>
		<form method="POST" enctype="multipart/form-data" class="space-y-4">
			<Input label="Project Title" name="title" required />
			<Input label="Subtitle" name="subtitle" required />
			<Textarea label="Description" name="description" rows={6} required />

			<div class="space-y-1">
				<label for="project" class="text-sm text-white/60">Project Image</label>
				<input
					id="project"
					type="file"
					name="image"
					accept="image/*"
					required
					class="block w-full text-sm text-white file:mr-4 file:rounded-md
					       file:border-0 file:bg-white/10 file:px-4 file:py-2
					       file:text-white hover:file:bg-white/20"
				/>
				<p class="text-xs text-white/40">Used as project thumbnail / cover</p>
			</div>

			<Input label="Repository URL" name="repoUrl" type="url" />
			<Input label="Live Demo URL" name="liveUrl" type="url" />

			<FormActions>
				<Button type="submit">Create Project</Button>
				<Button variant="ghost" on:click={() => goto('/dashboard/projects')}>Cancel</Button>
			</FormActions>
		</form>
	</Card>
</div>