<script lang="ts">
	import { goto } from '$app/navigation';
	import type { Profile } from '$lib/server/db/schema';

	import Input from '$lib/ui/Input.svelte';
	import Button from '$lib/ui/Button.svelte';
	import Card from '$lib/ui/Card.svelte';
	import PageHeader from '$lib/ui/PageHeader.svelte';
	import EmptyState from '$lib/ui/EmptyState.svelte';

	export let data: {
		profile: Profile | null;
	};

	const profile = data.profile;

	let title = profile?.title ?? '';
	let leftContent = profile?.leftText ?? '';
	let rightContent = profile?.rightText ?? '';
</script>

{#if !profile}
	<EmptyState title="Profile not found" description="Profile ini tidak ditemukan" />
{:else}
	<div class="w-full space-y-6">
		<PageHeader back={() => goto('/dashboard/profile')}>Edit Profile</PageHeader>

		<Card>
			<form method="POST" action="?/update" class="space-y-4">
				<Input label="Title" name="title" bind:value={title} required />

				<div>
					<label for="leftContent" class="mb-1 block text-sm text-white/70"> Left Content </label>

					<textarea
						id="leftContent"
						name="leftContent"
						bind:value={leftContent}
						rows="6"
						required
						class="w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-sm text-white focus:border-red-500 focus:outline-none"
					></textarea>
				</div>

				<div>
					<label for="rightContent" class="mb-1 block text-sm text-white/70"> Right Content </label>
					<textarea
						id="rightContent"
						name="rightContent"
						bind:value={rightContent}
						rows="6"
						required
						class="w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-sm text-white focus:border-red-500 focus:outline-none"
					></textarea>
				</div>

				<div class="flex gap-3 pt-6">
					<Button type="submit" class="flex-1">Update Profile</Button>

					<Button
						type="button"
						variant="ghost"
						class="flex-1"
						on:click={() => goto('/dashboard/profile')}
					>
						Cancel
					</Button>
				</div>
			</form>
		</Card>
	</div>
{/if}
