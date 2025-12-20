<script lang="ts">
	import { goto } from '$app/navigation';

	import Input from '$lib/ui/Input.svelte';
	import Card from '$lib/ui/Card.svelte';
	import PageHeader from '$lib/ui/PageHeader.svelte';
	import FormActions from '$lib/ui/FormActions.svelte';
	import Button from '$lib/ui/Button.svelte';
</script>

<svelte:head>
	<title>Social Links | Create</title>
</svelte:head>

<div class=" space-y-6">
	<PageHeader back={() => goto('/dashboard/social')}>Create Social Link</PageHeader>

	<Card>
		<form method="POST" class="space-y-4">
			<Input label="Name" name="name" required />
			<Input label="URL" name="url" type="url" required />

			<FormActions>
				<Button type="submit">Create Social Link</Button>
				<Button variant="ghost" on:click={() => goto('/dashboard/social')}>Cancel</Button>
			</FormActions>
		</form>
	</Card>
</div>
