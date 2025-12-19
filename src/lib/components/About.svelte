<script lang="ts">
	import type { Profile } from '$lib/server/db/schema';
	export let profile: Profile;
</script>

<section class="px-6 py-80">
	<div class="mx-auto max-w-6xl">
		<div class="section-divider"></div>
		<h2 class="mb-8 text-2xl font-bold tracking-tight text-white md:text-3xl">
			{profile.title}
		</h2>

		<div class="about-grid">
			<div class="space-y-6">
				<p class="text-base leading-relaxed text-neutral-400">
					{profile.leftText}
				</p>
			</div>

			<div class="space-y-6">
				<p class="text-base leading-relaxed text-neutral-400">
					{profile.rightText}
				</p>
			</div>
		</div>
	</div>
</section>
