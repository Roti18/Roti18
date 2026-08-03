<script lang="ts">
	let { badgeLabel = "", title, description = "", icon: IconComponent = null, children = null } = $props();
</script>

<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
	<div>
		{#if badgeLabel}
			<div class="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 px-3 py-1 text-[10px] font-mono font-semibold text-red-400 border border-red-500/20 uppercase tracking-widest mb-1">
				{#if IconComponent}
					<IconComponent class="w-3 h-3" />
				{/if}
				<span>{badgeLabel}</span>
			</div>
		{/if}
		<h1 class="text-2xl font-bold text-white font-['Space_Grotesk']">{title}</h1>
		{#if description}
			<p class="text-xs text-[#888888]">{description}</p>
		{/if}
	</div>

	{#if children}
		<div class="flex items-center gap-2 self-start sm:self-auto">
			{@render children()}
		</div>
	{/if}
</div>
