<script lang="ts">
	import type { Profile } from '$lib/server/db/schema';
	export let profile: Profile;
</script>

<section class="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-32">
	<h2
		class="mb-12 text-2xl font-light tracking-[0.15em] text-amber-50 sm:mb-16 sm:text-3xl sm:tracking-[0.2em] md:text-4xl"
	>
		{profile.title}
	</h2>

	<div class="grid grid-cols-1 gap-8 sm:gap-12 md:grid-cols-2">
		<div>
			<p class="text-sm leading-relaxed font-light text-neutral-300 sm:text-base">
				{profile.leftText}
			</p>
		</div>

		<div>
			<p class="text-sm leading-relaxed font-light text-neutral-300 sm:text-base">
				{profile.rightText}
			</p>
		</div>
	</div>
</section>
