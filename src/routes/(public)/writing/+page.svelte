<script lang="ts">
	const { data } = $props();
</script>

<svelte:head>
	<title>Writing - M. Roni</title>
	<meta name="description" content="Thoughts on software engineering, design, and building things." />
</svelte:head>

<div class="max-w-5xl mx-auto px-6 py-12 space-y-12">
	<div class="space-y-12">
		{#each data.groups as group}
			<section class="blur-fade-in space-y-4" id="year-{group.year}">
				<div class="flex items-center gap-4 pb-2 border-b border-[#1f1f1f]">
					<h2 class="text-xs font-semibold text-[#888888] uppercase tracking-wider">{group.year}</h2>
					<div class="flex-1 h-px bg-[#1a1a1a]"></div>
				</div>
				<div class="flex flex-col divide-y divide-[#141414]">
					{#each group.items as post}
						<a
							href="/writing/{post.slug}"
							class="group flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-3.5 px-3 -mx-3 hover:bg-[#141414] rounded-xl transition-colors"
							id="writing-{post.slug}"
						>
							<div class="space-y-1 max-w-2xl">
								<span class="text-base font-medium text-[#ededed] group-hover:text-white group-hover:underline underline-offset-4 block">
									{post.title}
								</span>
								{#if post.excerpt}
									<p class="text-sm text-[#a1a1a1] line-clamp-1 font-normal">{post.excerpt}</p>
								{/if}
							</div>
						</a>
					{/each}
				</div>
			</section>
		{/each}
	</div>
</div>
