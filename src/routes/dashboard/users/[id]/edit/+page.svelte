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

{#if !user}
	<EmptyState title="User not found" description="This user does not exist" />
{:else}
	<div class="w-full space-y-6">
		<PageHeader back={() => goto('/dashboard/users')}>Edit user</PageHeader>

		<Card>
			<form method="POST" action="?/update" class="space-y-4">
				<Input label="Email Address" type="email" name="email" bind:value={email} required />

				<Input label="Full Name" name="name" bind:value={name} />

				<Input label="Avatar URL" name="image" bind:value={image} />

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
