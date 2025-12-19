<script lang="ts">
  import ProjectCard from './ProjectCard.svelte';
  import type { Project as ProjectType } from '$lib/server/db/schema';

  export let projects: ProjectType[];
</script>

<section class="py-32 px-6">
    <div class="max-w-6xl mx-auto">
        <div class="section-divider"></div>
        <h2 class="text-2xl md:text-3xl font-bold tracking-tight text-white mb-8">
            Selected Work
        </h2>
        
        <div class="projects-masonry" id="projects-grid">
            {#each projects as project (project.id)}
                <ProjectCard {project} />
            {/each}
        </div>
    </div>
</section>
