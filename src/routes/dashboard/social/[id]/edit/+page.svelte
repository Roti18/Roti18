<script lang="ts">
	import { goto } from '$app/navigation';
	import PageHeader from '$lib/ui/PageHeader.svelte';
	import Card from '$lib/ui/Card.svelte';
	import Input from '$lib/ui/Input.svelte';
	import FormActions from '$lib/ui/FormActions.svelte';
	import Button from '$lib/ui/Button.svelte';
	import type { SocialLinks } from '$lib/server/db/schema';

	export let data: { socialLink: SocialLinks };
	const { socialLink } = data;

	let name = socialLink.name ?? '';
	let url = socialLink.url ?? '';
</script>

<div class="mx-auto w-full space-y-8">
	<PageHeader back={() => goto('/dashboard/social')}>Edit Social Link</PageHeader>

	<Card>
		<form method="POST" class="space-y-6">
			<div class="space-y-4">
				<Input label="Name" name="name" bind:value={name} />
				<Input label="URL" name="url" bind:value={url} />
			</div>

			<FormActions>
				<Button type="submit">Update Social Link</Button>
				<Button type="button" variant="ghost" on:click={() => goto('/dashboard/social')}>
					Cancel
				</Button>
			</FormActions>
		</form>
	</Card>
</div>
