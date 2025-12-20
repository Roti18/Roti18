<script lang="ts">
	import { goto } from '$app/navigation';
	import PageHeader from '$lib/ui/PageHeader.svelte';
	import Card from '$lib/ui/Card.svelte';
	import Input from '$lib/ui/Input.svelte';
	import FormActions from '$lib/ui/FormActions.svelte';
	import Button from '$lib/ui/Button.svelte';

	export let data;
	const { hero } = data;
</script>

<svelte:head>
	<title>Hero | Edit</title>
</svelte:head>

<div class="space-y-6">
	<PageHeader back={() => goto('/dashboard/hero')}>Edit Hero</PageHeader>

	<Card>
		<form method="POST" class="space-y-4">
			<Input label="Name" name="name" value={hero.name} required />
			<Input label="Role" name="role" value={hero.role} required />
			<Input label="Tagline" name="tagline" value={hero.tagline} required />

			<FormActions>
				<Button type="submit" variant="default">Update Hero</Button>
				<Button on:click={() => goto('/dashboard/hero')} variant="ghost">Cancel</Button>
			</FormActions>
		</form>
	</Card>
</div>
