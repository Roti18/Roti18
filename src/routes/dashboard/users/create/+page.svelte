<script lang="ts">
	import { goto } from '$app/navigation';
	import { enhance } from '$app/forms';

	import Input from '$lib/ui/Input.svelte';
	import Button from '$lib/ui/Button.svelte';
	import Card from '$lib/ui/Card.svelte';
	import PageHeader from '$lib/ui/PageHeader.svelte';
</script>

<div class="w-full">
	<PageHeader back={() => goto('/dashboard/users')}>Create user</PageHeader>

	<Card>
		<form
			method="POST"
			action="?/create"
			class="space-y-4"
			use:enhance={() => {
				return async ({ result }) => {
					if (result.type === 'success') {
						goto('/dashboard/users');
					}
				};
			}}
		>
			<Input label="Email Address" type="email" name="email" required />

			<Input label="Password" type="password" name="password" required />

			<Input label="Full Name" name="name" />

			<Input label="Avatar URL" name="image" />

			<div class="flex gap-3 pt-6">
				<Button type="submit" class="flex-1">Create User</Button>

				<Button
					type="button"
					variant="ghost"
					class="flex-1"
					on:click={() => goto('/dashboard/users')}
				>
					Cancel
				</Button>
			</div>
		</form>
	</Card>
</div>
