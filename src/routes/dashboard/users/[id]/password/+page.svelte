<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { Eye, EyeOff } from '@lucide/svelte';

	import Input from '$lib/ui/Input.svelte';
	import Button from '$lib/ui/Button.svelte';
	import Card from '$lib/ui/Card.svelte';
	import PageHeader from '$lib/ui/PageHeader.svelte';

	let showPassword = false;

	$: success = $page.url.searchParams.get('password') === 'success';

	if (success) {
		alert('Password berhasil diubah');
		goto('/dashboard/users');
	}
</script>

<PageHeader back={() => goto('/dashboard/users')}>Change password</PageHeader>

<Card>
	<form method="POST" action="?/update" class="space-y-4">
		<div class="relative">
			<Input
				label="New Password"
				type={showPassword ? 'text' : 'password'}
				name="password"
				required
			/>

			<button
				type="button"
				class="
					absolute top-9.5 right-3
					text-white/50 transition
					hover:text-white
				"
				on:click={() => (showPassword = !showPassword)}
				aria-label="Toggle password visibility"
			>
				{#if showPassword}
					<EyeOff size={18} />
				{:else}
					<Eye size={18} />
				{/if}
			</button>
		</div>

		<div class="relative">
			<Input
				label="Confirm Password"
				type={showPassword ? 'text' : 'password'}
				name="confirmPassword"
				required
			/>

			<button
				type="button"
				class="
					absolute top-9.5 right-3
					text-white/50 transition
					hover:text-white
				"
				on:click={() => (showPassword = !showPassword)}
				aria-label="Toggle password visibility"
			>
				{#if showPassword}
					<EyeOff size={18} />
				{:else}
					<Eye size={18} />
				{/if}
			</button>
		</div>

		{#if $page.form?.error}
			<p class="text-sm text-red-400">
				{$page.form.error}
			</p>
		{/if}

		<Button type="submit">Update Password</Button>
	</form>
</Card>
