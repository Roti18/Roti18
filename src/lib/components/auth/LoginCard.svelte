<script>
	import { Eye, EyeOff, Mail, Lock } from '@lucide/svelte';

	let email = '';
	let password = '';
	let showPassword = false;
	let rememberMe = false;

	function togglePassword() {
		showPassword = !showPassword;
	}
</script>

<form
	method="POST"
	action="?/login"
	class="relative overflow-hidden rounded-xl border border-gray-800/50
	       bg-linear-to-br from-black/40 via-black/30 to-red-950/10
	       p-6 shadow-2xl backdrop-blur-sm sm:p-8"
>
	<div
		class="pointer-events-none absolute -top-20 -right-20 h-40 w-40 rounded-full bg-red-900/10 blur-3xl"
	></div>
	<div
		class="pointer-events-none absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-red-900/5 blur-2xl"
	></div>

	<div class="relative mb-6 sm:mb-8">
		<h2 class="mb-2 text-2xl font-light tracking-wide text-white sm:text-3xl">Welcome Back</h2>
		<p class="text-xs text-gray-400 sm:text-sm">Log In to continue your creative journey</p>
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
					name="email"
					type="email"
					required
					bind:value={email}
					class="w-full rounded-lg border border-gray-700/50 bg-black/50
					       py-2.5 pr-3 pl-9 text-sm text-white placeholder-gray-500
					       transition-colors focus:border-red-900/60 focus:outline-none
					       sm:py-3 sm:pr-4 sm:pl-11"
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
					name="password"
					type={showPassword ? 'text' : 'password'}
					required
					bind:value={password}
					class="w-full rounded-lg border border-gray-700/50 bg-black/50
					       py-2.5 pr-10 pl-9 text-sm text-white placeholder-gray-500
					       transition-colors focus:border-red-900/60 focus:outline-none
					       sm:py-3 sm:pr-12 sm:pl-11"
					placeholder="••••••••"
				/>
				<button
					type="button"
					on:click={togglePassword}
					class="absolute inset-y-0 right-0 flex items-center pr-2.5
					       text-gray-400 transition-colors hover:text-white sm:pr-3"
				>
					{#if showPassword}
						<EyeOff size={18} class="sm:h-5 sm:w-5" />
					{:else}
						<Eye size={18} class="sm:h-5 sm:w-5" />
					{/if}
				</button>
			</div>
		</div>

		<button
			type="submit"
			class="group relative w-full overflow-hidden rounded-lg
			       bg-linear-to-r from-red-900 to-red-800
			       py-3 font-light tracking-wider text-white uppercase
			       shadow-lg transition-all hover:from-red-800 hover:to-red-700
			       sm:py-3.5"
		>
			<span class="relative z-10">Log In</span>
			<div
				class="absolute inset-0 -translate-x-full
				       bg-linear-to-r from-transparent via-white/10 to-transparent
				       transition-transform duration-700 group-hover:translate-x-full"
			></div>
		</button>
	</div>
</form>
