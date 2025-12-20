<script lang="ts">
	import { goto } from '$app/navigation';
	import type { User } from '$lib/server/db/schema';

	import Input from '$lib/ui/Input.svelte';
	import Button from '$lib/ui/Button.svelte';
	import Card from '$lib/ui/Card.svelte';
	import PageHeader from '$lib/ui/PageHeader.svelte';
	import EmptyState from '$lib/ui/EmptyState.svelte';

	export let data: {
		user: User | null;
	};

	const user = data.user;

	let email = user?.email ?? '';
	let name = user?.name ?? '';
	let image = user?.image ?? '';
</script>

<svelte:head>
	<title>Users | Edit</title>
</svelte:head>

{#if !user}
	<EmptyState title="User not found" description="This user does not exist" />
{:else}
	<div class="w-full space-y-6">
		<PageHeader back={() => goto('/dashboard/users')}>Edit user</PageHeader>

		<Card>
			<form method="POST" action="?/update" enctype="multipart/form-data" class="space-y-4">
				<Input label="Email Address" type="email" name="email" bind:value={email} required />

				<Input label="Full Name" name="name" bind:value={name} />

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
					<p class="text-xs text-white/40">
						Optional. Upload new avatar to replace the current one.
					</p>
				</div>

				{#if image}
					<div class="space-y-2">
						<p class="text-sm text-white/60">Current Avatar</p>
						<img
							src={image}
							alt="Avatar preview"
							class="h-24 w-24 rounded-full border border-white/10 object-cover"
						/>
					</div>
				{/if}

				<div class="flex gap-3 pt-6">
					<Button type="submit" class="flex-1">Update User</Button>
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

		<Card>
			<div class="flex items-center justify-between">
				<div>
					<p class="font-medium text-white">Security</p>
					<p class="text-sm text-white/60">Change this user's password</p>
				</div>

				<Button variant="danger" on:click={() => goto(`/dashboard/users/${user.id}/password`)}>
					Change Password
				</Button>
			</div>
		</Card>
	</div>
{/if}
