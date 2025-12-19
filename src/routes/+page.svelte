<script lang="ts">
	import Hero from '$lib/components/Hero.svelte';
	import About from '$lib/components/About.svelte';
	import Projects from '$lib/components/Projects.svelte';

	import type {
		Hero as HeroType,
		Profile as ProfileType,
		Project as ProjectType,
		SocialLinks as SocialLinksType
	} from '$lib/server/db/schema';

	export let data: {
		hero: HeroType;
		profile: ProfileType;
		projects: ProjectType[];
		socialLinks: SocialLinksType[];
	};
</script>

<svelte:head>
	<title>M. Zamroni Fahreza - Portfolio</title>
</svelte:head>

<div class="min-h-screen">
	<Hero hero={data.hero} socialLinks={data.socialLinks} />
	<About profile={data.profile} />
	<Projects projects={data.projects} />
</div>
