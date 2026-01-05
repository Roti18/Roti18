<script lang="ts">
	import { Eye, EyeOff, Mail, Lock } from '@lucide/svelte';
	import Card from '$lib/ui/Card.svelte';
	import Button from '$lib/ui/Button.svelte';
	import { enhance } from '$app/forms';
	import { page } from '$app/state';
	import { toastService } from '$lib/stores/toast.svelte';

	let email = $state('');
	let password = $state('');
	let showPassword = $state(false);
	let emailError = $state('');
	let passwordError = $state('');

	function validateEmail(value: string) {
		if (!value) {
			emailError = 'Email is required';
			return false;
		}
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(value)) {
			emailError = 'Please enter a valid email address';
			return false;
		}
		emailError = '';
		return true;
	}

	function validatePassword(value: string) {
		if (!value) {
			passwordError = 'Password is required';
			return false;
		}
		if (value.length < 6) {
			passwordError = 'Password must be at least 6 characters';
			return false;
		}
		passwordError = '';
		return true;
	}

	function handleEmailBlur() {
		validateEmail(email);
	}

	function handlePasswordBlur() {
		validatePassword(password);
	}

	function togglePassword() {
		showPassword = !showPassword;
	}
</script>

<Card hover={false}>
	<form
		method="POST"
		action="?/login"
		use:enhance={({ cancel }) => {
			const isEmailValid = validateEmail(email);
			const isPasswordValid = validatePassword(password);

			if (!isEmailValid || !isPasswordValid) {
				toastService.warning('Please fix the errors in the form');
				cancel();
				return;
			}

			return async ({ result }) => {
				if (result.type === 'failure') {
					const message = (result.data as { message?: string })?.message || 'Login failed';
					toastService.error(message);
				} else if (result.type === 'error') {
					toastService.error('An unexpected error occurred');
				} else if (result.type === 'success' || result.type === 'redirect') {
					toastService.success('Welcome back!');
				}
			};
		}}
		class="space-y-6"
	>
		<div class="space-y-2">
			<h2 class="text-3xl font-light tracking-wide text-white">Welcome Back</h2>
			<p class="text-sm text-white/50">Log in to continue your creative journey</p>
			<div class="h-0.5 w-16 bg-linear-to-r from-red-600 to-transparent"></div>
		</div>

		{#if page.form?.error && !page.form?.emailError && !page.form?.passwordError}
			<p class="text-sm text-red-400">{page.form.error}</p>
		{/if}

		<div class="space-y-2">
			<label for="email" class="block text-sm text-white/70"> Email Address </label>
			<div class="relative">
				<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
					<Mail size={18} class="text-white/40" />
				</div>
				<input
					id="email"
					name="email"
					type="email"
					required
					bind:value={email}
					onblur={handleEmailBlur}
					placeholder="your@email.com"
					class="w-full rounded-lg border bg-white/5
						       py-2.5 pr-4 pl-11 text-white transition
						       placeholder:text-white/30 focus:outline-none
						       {emailError ? 'border-red-500' : 'border-white/10 focus:border-red-600/50'}"
				/>
			</div>
			{#if page.form?.emailError}
				<p class="text-xs text-red-400">{page.form.emailError}</p>
			{:else if emailError}
				<p class="text-xs text-red-400">{emailError}</p>
			{/if}
		</div>

		<div class="space-y-2">
			<label for="password" class="block text-sm text-white/70"> Password </label>
			<div class="relative">
				<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
					<Lock size={18} class="text-white/40" />
				</div>
				<input
					id="password"
					name="password"
					type={showPassword ? 'text' : 'password'}
					required
					bind:value={password}
					onblur={handlePasswordBlur}
					placeholder="••••••••"
					class="w-full rounded-lg border bg-white/5
						       py-2.5 pr-11 pl-11 text-white transition
						       placeholder:text-white/30 focus:outline-none
						       {passwordError ? 'border-red-500' : 'border-white/10 focus:border-red-600/50'}"
				/>
				<button
					type="button"
					onclick={togglePassword}
					class="absolute inset-y-0 right-0 flex items-center pr-4
						       text-white/40 transition hover:text-white/70"
				>
					{#if showPassword}
						<EyeOff size={18} />
					{:else}
						<Eye size={18} />
					{/if}
				</button>
			</div>
			{#if page.form?.passwordError}
				<p class="text-xs text-red-400">{page.form.passwordError}</p>
			{:else if passwordError}
				<p class="text-xs text-red-400">{passwordError}</p>
			{/if}
		</div>

		<Button type="submit" variant="default" class="w-full">Log In</Button>
	</form>
</Card>
