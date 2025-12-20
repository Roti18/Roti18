<script>
	import { page } from '$app/stores';
</script>

<svelte:head>
	<title>{$page.status}</title>
</svelte:head>

<div class="relative min-h-screen overflow-hidden bg-black text-white">
	<!-- DESKTOP LEFT RAIL -->
	<div class="absolute top-0 left-16 hidden h-full w-px bg-red-600 lg:block"></div>

	<div
		class="
			flex min-h-screen flex-col justify-center
			px-6
			lg:pr-20 lg:pl-32
		"
	>
		<p
			class="
				text-center text-xs tracking-[0.3em]
				text-red-600
				lg:text-left
			"
		>
			SYSTEM ERROR
		</p>

		<h1
			class="
				mt-4
				text-center text-[32vw] leading-none
				font-semibold
				lg:text-left
				lg:text-[40vh]
			"
		>
			{$page.status}
		</h1>

		<p
			class="
				mt-2 max-w-md text-center
				text-sm
				text-white/60
				lg:text-left
			"
		>
			{$page.error?.message ?? 'Not Found'}
		</p>

		<div
			class="
				mt-10 flex items-center justify-center gap-6
				text-sm
				lg:justify-start
			"
		>
			<a href="/" class="text-white/70 hover:text-red-600"> Home </a>

			<span class="h-px w-8 bg-red-600"></span>

			<button on:click={() => history.back()} class="text-white/50 hover:text-red-600">
				Back
			</button>
		</div>
	</div>
</div>
