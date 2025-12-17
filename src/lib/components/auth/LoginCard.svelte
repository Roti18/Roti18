<script>
	import { Eye, EyeOff } from '@lucide/svelte';

	let email = '';
	let password = '';
	let showPassword = false;
	let rememberMe = false;

	function handleSubmit() {
		console.log('Login attempt:', { email, password, rememberMe });
	}

	function handleGoogleLogin() {
		console.log('Google login clicked');
	}

	function togglePassword() {
		showPassword = !showPassword;
	}
</script>

<div
	class="relative rounded-xl border border-gray-800/50 bg-linear-to-br from-black/40 via-black/30 to-red-950/10 p-6 shadow-2xl backdrop-blur-sm sm:p-8"
>
	<div class="mb-6 sm:mb-8">
		<h2 class="mb-2 text-2xl font-light tracking-wide text-white sm:text-3xl">Welcome Back</h2>
		<p class="text-xs text-gray-400 sm:text-sm">Sign in to continue your creative journey</p>
	</div>

	<div class="space-y-4 sm:space-y-5">
		<div>
			<label for="email" class="mb-2 block text-xs tracking-wide text-gray-300 sm:text-sm">
				Email Address
			</label>
			<input
				id="email"
				type="email"
				bind:value={email}
				class="w-full rounded-lg border border-gray-700/50 bg-black/50 px-3 py-2.5 text-sm text-white placeholder-gray-500 transition-colors focus:border-red-900/60 focus:outline-none sm:px-4 sm:py-3"
				placeholder="your@email.com"
			/>
		</div>

		<div>
			<label for="password" class="mb-2 block text-xs tracking-wide text-gray-300 sm:text-sm">
				Password
			</label>
			<div class="relative">
				<input
					id="password"
					type={showPassword ? 'text' : 'password'}
					bind:value={password}
					class="w-full rounded-lg border border-gray-700/50 bg-black/50 px-3 py-2.5 pr-10 text-sm text-white placeholder-gray-500 transition-colors focus:border-red-900/60 focus:outline-none sm:px-4 sm:py-3 sm:pr-12"
					placeholder="••••••••"
				/>
				<button
					type="button"
					on:click={togglePassword}
					class="absolute top-1/2 right-2.5 -translate-y-1/2 text-gray-400 transition-colors hover:text-white sm:right-3"
				>
					{#if showPassword}
						<EyeOff size={18} class="sm:h-5 sm:w-5" />
					{:else}
						<Eye size={18} class="sm:h-5 sm:w-5" />
					{/if}
				</button>
			</div>
		</div>

		<div class="flex items-center justify-between text-xs sm:text-sm">
			<label class="flex cursor-pointer items-center text-gray-300">
				<input
					type="checkbox"
					bind:checked={rememberMe}
					class="mr-2 h-3.5 w-3.5 cursor-pointer rounded border-gray-700 bg-black/40 text-red-900 transition-colors focus:ring-2 focus:ring-red-900/40 focus:ring-offset-0 sm:mr-2.5 sm:h-4 sm:w-4"
				/>
				<span class="select-none">Remember me</span>
			</label>
			<a href="/forgot-password" class="text-gray-400 transition-colors hover:text-white">
				Forgot password?
			</a>
		</div>

		<button
			on:click={handleSubmit}
			class="w-full rounded-lg bg-linear-to-r from-red-900 to-red-800 py-3 font-light tracking-wider text-white uppercase shadow-lg transition-all hover:from-red-800 hover:to-red-700 sm:py-3.5"
		>
			Sign In
		</button>
	</div>

	<div class="relative my-6 sm:my-8">
		<div class="absolute inset-0 flex items-center">
			<div class="w-full border-t border-gray-800"></div>
		</div>
		<div class="relative flex justify-center text-xs sm:text-sm">
			<span
				class="bg-linear-to-br from-black/40 via-black/30 to-red-950/10 px-3 text-gray-400 sm:px-4"
				>Or continue with</span
			>
		</div>
	</div>

	<button
		on:click={handleGoogleLogin}
		class="flex w-full items-center justify-center gap-2.5 rounded-lg border border-gray-700/50 bg-white/5 py-3 text-sm font-light tracking-wide text-white transition-all hover:bg-white/10 sm:gap-3 sm:py-3.5"
	>
		<svg class="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24" fill="none">
			<path
				d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
				fill="#4285F4"
			/>
			<path
				d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
				fill="#34A853"
			/>
			<path
				d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
				fill="#FBBC05"
			/>
			<path
				d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
				fill="#EA4335"
			/>
		</svg>
		<span>Continue with Google</span>
	</button>
</div>
