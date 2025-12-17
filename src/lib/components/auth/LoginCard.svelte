<script>
	import { Eye, EyeOff, Mail, Lock } from '@lucide/svelte';

	let email = '';
	let password = '';
	let showPassword = false;
	let rememberMe = false;

	function handleSubmit() {
		console.log('Login attempt:', { email, password, rememberMe });
	}

	function togglePassword() {
		showPassword = !showPassword;
	}
</script>

<div
	class="relative overflow-hidden rounded-xl border border-gray-800/50 bg-linear-to-br from-black/40 via-black/30 to-red-950/10 p-6 shadow-2xl backdrop-blur-sm sm:p-8"
>
	<!-- Decorative elements -->
	<div
		class="pointer-events-none absolute -top-20 -right-20 h-40 w-40 rounded-full bg-red-900/10 blur-3xl"
	></div>
	<div
		class="pointer-events-none absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-red-900/5 blur-2xl"
	></div>

	<div class="relative mb-6 sm:mb-8">
		<h2 class="mb-2 text-2xl font-light tracking-wide text-white sm:text-3xl">Welcome Back</h2>
		<p class="text-xs text-gray-400 sm:text-sm">Sign in to continue your creative journey</p>
		<div class="mt-4 h-0.5 w-16 bg-linear-to-r from-red-900 to-transparent"></div>
	</div>

	<div class="relative space-y-4 sm:space-y-5">
		<div>
			<label for="email" class="mb-2 block text-xs tracking-wide text-gray-300 sm:text-sm">
				Email Address
			</label>
			<div class="relative">
				<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 sm:pl-4">
					<Mail size={16} class="text-gray-500 sm:h-4.5 sm:w-4.5" />
				</div>
				<input
					id="email"
					type="email"
					bind:value={email}
					class="w-full rounded-lg border border-gray-700/50 bg-black/50 py-2.5 pr-3 pl-9 text-sm text-white placeholder-gray-500 transition-colors focus:border-red-900/60 focus:outline-none sm:py-3 sm:pr-4 sm:pl-11"
					placeholder="your@email.com"
				/>
			</div>
		</div>

		<div>
			<label for="password" class="mb-2 block text-xs tracking-wide text-gray-300 sm:text-sm">
				Password
			</label>
			<div class="relative">
				<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 sm:pl-4">
					<Lock size={16} class="text-gray-500 sm:h-4.5 sm:w-4.5" />
				</div>
				<input
					id="password"
					type={showPassword ? 'text' : 'password'}
					bind:value={password}
					class="w-full rounded-lg border border-gray-700/50 bg-black/50 py-2.5 pr-10 pl-9 text-sm text-white placeholder-gray-500 transition-colors focus:border-red-900/60 focus:outline-none sm:py-3 sm:pr-12 sm:pl-11"
					placeholder="••••••••"
				/>
				<button
					type="button"
					on:click={togglePassword}
					class="absolute inset-y-0 right-0 flex items-center pr-2.5 text-gray-400 transition-colors hover:text-white sm:pr-3"
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
			<label class="group flex cursor-pointer items-center text-gray-300">
				<div class="relative">
					<input
						type="checkbox"
						bind:checked={rememberMe}
						class="peer h-3.5 w-3.5 cursor-pointer appearance-none rounded border border-gray-700 bg-black/40 transition-colors checked:border-red-900 checked:bg-red-900 focus:ring-2 focus:ring-red-900/40 focus:ring-offset-0 sm:h-4 sm:w-4"
					/>
					<svg
						class="pointer-events-none absolute top-1/2 left-1/2 hidden h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 text-white peer-checked:block sm:h-3 sm:w-3"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						stroke-width="4"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
					</svg>
				</div>
				<span class="ml-2 select-none sm:ml-2.5">Remember me</span>
			</label>
			<a href="/forgot-password" class="text-gray-400 transition-colors hover:text-white">
				Forgot password?
			</a>
		</div>

		<button
			on:click={handleSubmit}
			class="group relative w-full overflow-hidden rounded-lg bg-linear-to-r from-red-900 to-red-800 py-3 font-light tracking-wider text-white uppercase shadow-lg transition-all hover:from-red-800 hover:to-red-700 sm:py-3.5"
		>
			<span class="relative z-10">Sign In</span>
			<div
				class="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full"
			></div>
		</button>
	</div>

	<!-- Bottom decoration -->
	<div class="relative mt-6 text-center text-xs text-gray-500 sm:mt-8 sm:text-sm">
		<p>
			Don't have an account?
			<a href="/signup" class="text-white transition-colors hover:text-gray-300">Sign up</a>
		</p>
	</div>
</div>
