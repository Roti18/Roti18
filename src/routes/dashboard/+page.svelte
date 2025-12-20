<script lang="ts">
	import Card from '$lib/ui/Card.svelte';
	import Button from '$lib/ui/Button.svelte';
	import { goto } from '$app/navigation';

	export let data: {
		hero: { name: string; role: string; tagline: string } | null;
		profile: { title: string; leftText: string; rightText: string } | null;
		projects: { id: number; title: string; subtitle: string }[];
	};
</script>

<svelte:head>
	<title>Dashboard</title>
</svelte:head>

<div class="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:space-y-8 sm:py-8">
	<div class="grid gap-4 sm:gap-6 lg:grid-cols-3">
		<div class="lg:col-span-2">
			<div
				class="h-full rounded-xl border border-white/10
				       bg-linear-to-br from-white/5 to-white/2
				       p-4 backdrop-blur-sm sm:p-6"
			>
				<div class="mb-4 flex items-center justify-between gap-3 sm:mb-6">
					<div class="inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-3 py-1">
						<div class="h-2 w-2 rounded-full bg-blue-400"></div>
						<span class="text-xs font-medium text-blue-300">Hero Section</span>
					</div>
					<Button variant="ghost" on:click={() => goto('/dashboard/hero')}>Edit</Button>
				</div>

				{#if data.hero}
					<div class="space-y-3 sm:space-y-4">
						<div>
							<h2 class="text-xl font-bold text-white sm:text-2xl lg:text-3xl">
								{data.hero.name}
							</h2>
							<p class="mt-1 text-sm text-white/60 sm:text-base lg:text-lg">
								{data.hero.role}
							</p>
						</div>

						<div class="rounded-lg border border-white/10 bg-white/5 p-3 sm:p-4">
							<p class="text-xs text-white/70 italic sm:text-sm">
								"{data.hero.tagline}"
							</p>
						</div>
					</div>
				{:else}
					<div class="flex h-24 items-center justify-center sm:h-28">
						<p class="text-sm text-white/40">No hero content yet</p>
					</div>
				{/if}
			</div>
		</div>

		<div class="lg:col-span-1">
			<div
				class="h-full rounded-xl border border-white/10
				       bg-linear-to-br from-white/5 to-white/2
				       p-4 backdrop-blur-sm sm:p-6"
			>
				<div class="mb-4 flex items-center justify-between gap-3 sm:mb-6">
					<div class="inline-flex items-center gap-2 rounded-full bg-purple-500/10 px-3 py-1">
						<div class="h-2 w-2 rounded-full bg-purple-400"></div>
						<span class="text-xs font-medium text-purple-300">Profile</span>
					</div>
					<Button variant="ghost" on:click={() => goto('/dashboard/profile')}>Edit</Button>
				</div>

				{#if data.profile}
					<div class="space-y-3 sm:space-y-4">
						<h3 class="text-base font-semibold text-white sm:text-lg lg:text-xl">
							{data.profile.title}
						</h3>

						<div class="space-y-3 text-xs text-white/70 sm:text-sm">
							<p class="line-clamp-3 wrap-break-word">
								{data.profile.leftText}
							</p>
							<div class="border-t border-white/10 pt-3">
								<p class="line-clamp-3 wrap-break-word">
									{data.profile.rightText}
								</p>
							</div>
						</div>
					</div>
				{:else}
					<div class="flex h-24 items-center justify-center sm:h-28">
						<p class="text-sm text-white/40">No profile content yet</p>
					</div>
				{/if}
			</div>
		</div>
	</div>

	<div
		class="rounded-xl border border-white/10
		       bg-linear-to-br from-white/5 to-white/2
		       p-4 backdrop-blur-sm sm:p-6"
	>
		<div class="mb-4 flex items-center justify-between gap-3 sm:mb-6">
			<div class="flex items-center gap-2 sm:gap-3">
				<div class="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1">
					<div class="h-2 w-2 rounded-full bg-emerald-400"></div>
					<span class="text-xs font-medium text-emerald-300">Projects</span>
				</div>
				<!-- {#if data.projects.length > 0}
					<span class="text-xs text-white/40 sm:text-sm">
						{data.projects.length}
					</span>
				{/if} -->
			</div>

			<Button variant="ghost" on:click={() => goto('/dashboard/projects')}>Manage</Button>
		</div>

		{#if data.projects.length > 0}
			<div class="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
				{#each data.projects.slice(0, 6) as project}
					<Card>
						<h4 class="mb-1.5 text-sm font-semibold text-white sm:mb-2 sm:text-base">
							{project.title}
						</h4>
						<p class="line-clamp-2 text-xs text-white/50 sm:text-sm">
							{project.subtitle}
						</p>
					</Card>
				{/each}
			</div>
		{:else}
			<div class="py-8 text-center text-sm text-white/40 sm:py-12">No projects yet</div>
		{/if}
	</div>
</div>
