<script lang="ts">
	import { goto } from '$app/navigation';

	import Input from '$lib/ui/Input.svelte';
	import Textarea from '$lib/ui/Textarea.svelte';
	import Card from '$lib/ui/Card.svelte';
	import PageHeader from '$lib/ui/PageHeader.svelte';
	import FormActions from '$lib/ui/FormActions.svelte';
	import Button from '$lib/ui/Button.svelte';
</script>

<div class="max-w-2xl space-y-6">
	<PageHeader back={() => goto('/dashboard/projects')}>Create Project</PageHeader>

	<Card>
		<form method="POST" class="space-y-4">
			<Input label="Project Title" name="title" required />
			<Input label="Subtitle" name="subtitle" required />
			<Textarea label="Description" name="description" rows={6} required />
			<Input label="Image URL" name="image" required />
			<Input label="Project URL" name="url" type="url" required />

			<FormActions>
				<Button type="submit">Create Project</Button>
				<Button variant="ghost" on:click={() => goto('/dashboard/projects')}>Cancel</Button>
			</FormActions>
		</form>
	</Card>
</div>
