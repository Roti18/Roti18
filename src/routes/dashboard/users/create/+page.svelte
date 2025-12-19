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
			enctype="multipart/form-data"
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

			<div class="space-y-1">
				<label for="avatar" class="text-sm text-white/60">Avatar</label>
				<input
					id="avatar"
					type="file"
					name="image"
					accept="image/*"
					class="block w-full text-sm text-white file:mr-4 file:rounded-md
					       file:border-0 file:bg-white/10 file:px-4 file:py-2
					       file:text-white hover:file:bg-white/20"
				/>
				<p class="text-xs text-white/40">Optional profile picture</p>
			</div>

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
