<script lang="ts">
	import { enhance } from "$app/forms";
	import { UserCheck, Plus, Trash2, Save, Check } from "lucide-svelte";
	import PageHeader from "$lib/components/admin/PageHeader.svelte";
	import FormTextarea from "$lib/components/admin/FormTextarea.svelte";
	import HeroCoverUploader from "$lib/components/admin/HeroCoverUploader.svelte";

	let { data, form } = $props();
	const user = $derived(data.user);
	const site = $derived(data.site);
	const about = $derived(data.about);

	let bio = $state('');
	let avatarUrl = $state('');
	let skillsList = $state<string[]>([]);
	let experienceList = $state<any[]>([]);
	let newSkillInput = $state('');
	let showAddExperience = $state(false);

	$effect(() => {
		bio = about?.bio || site.longDescription || '';
		avatarUrl = site.avatarUrl || user?.image || '';
		skillsList = about?.skills || site.techStack || [];
		experienceList = about?.experience || [];
	});

	let expRole = $state('');
	let expCompany = $state('');
	let expPeriod = $state('');
	let expDesc = $state('');

	function addSkill() {
		const val = newSkillInput.trim();
		if (val && !skillsList.includes(val)) {
			skillsList = [...skillsList, val];
			newSkillInput = '';
		}
	}

	function removeSkill(idx: number) {
		skillsList = skillsList.filter((_, i) => i !== idx);
	}

	function addExperienceItem() {
		if (expRole && expCompany) {
			experienceList = [
				...experienceList,
				{ role: expRole, company: expCompany, period: expPeriod, desc: expDesc }
			];
			expRole = '';
			expCompany = '';
			expPeriod = '';
			expDesc = '';
			showAddExperience = false;
		}
	}

	function removeExperienceItem(idx: number) {
		experienceList = experienceList.filter((_, i) => i !== idx);
	}
</script>

<div class="space-y-6 max-w-5xl mx-auto">
	<!-- Reusable Page Header -->
	<PageHeader
		badgeLabel="Public About Page Manager"
		title="About Page Biography & Tech Stack"
		description="Edit the exact biography text and tech stack displayed on the public /about page"
		icon={UserCheck}
	/>

	{#if form?.message}
		<div class="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs font-mono text-emerald-400 flex items-center gap-2">
			<Check class="w-4 h-4" />
			<span>{form.message}</span>
		</div>
	{/if}

	<form method="POST" action="?/saveAbout" use:enhance class="space-y-6">
		<input type="hidden" name="skills" value={JSON.stringify(skillsList)} />
		<input type="hidden" name="experience" value={JSON.stringify(experienceList)} />

		<!-- Card 1: Public About Biography & Avatar -->
		<div class="rounded-2xl border border-[#222222] bg-[#121212] p-6 space-y-4 shadow-xl">
			<input type="hidden" name="avatarUrl" value={avatarUrl} />

			<div class="flex items-center justify-between border-b border-[#222222] pb-3">
				<div class="flex items-center gap-3">
					{#if avatarUrl}
						<img src={avatarUrl} alt={site.fullName} class="w-12 h-12 rounded-xl object-cover border border-[#262626]" />
					{:else}
						<div class="w-12 h-12 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center font-mono text-lg font-bold">
							{site.name ? site.name[0].toUpperCase() : 'B'}
						</div>
					{/if}

					<div>
						<h2 class="text-base font-bold text-white font-['Space_Grotesk']">{site.fullName}</h2>
						<p class="text-xs font-mono text-[#777777]">{site.title}</p>
					</div>
				</div>

				<button
					type="submit"
					class="flex items-center gap-2 rounded-xl bg-red-500 hover:bg-red-600 px-4 py-2 text-xs font-semibold text-white shadow-lg transition-all cursor-pointer active:scale-95"
				>
					<Save class="w-4 h-4" />
					<span>Save Public About</span>
				</button>
			</div>

			<!-- Dedicated Profile Avatar Picture Uploader (WebP R2) -->
			<HeroCoverUploader bind:coverUrl={avatarUrl} articleSlug="avatar" />

			<FormTextarea
				id="about-bio"
				name="bio"
				label="Public About Biography Paragraphs (longDescription)"
				required={true}
				rows={7}
				value={bio}
				placeholder="Write full about biography paragraphs..."
			/>
		</div>

		<!-- Card 2: Tech Stack Badges Editor -->
		<div class="rounded-2xl border border-[#222222] bg-[#121212] p-6 space-y-4 shadow-xl">
			<div class="font-bold text-white font-['Space_Grotesk'] text-base border-b border-[#222222] pb-3">
				Public Tech Stack Badges
			</div>

			<div class="flex items-center gap-2">
				<input
					type="text"
					bind:value={newSkillInput}
					placeholder="Add new skill badge (e.g. SvelteKit)..."
					onkeydown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
					class="flex-1 rounded-xl bg-[#181818] border border-[#262626] px-3 py-2 text-xs text-[#ededed] placeholder-[#555555] focus:outline-none focus:border-blue-500/50"
				/>
				<button
					type="button"
					onclick={addSkill}
					class="flex items-center gap-1.5 rounded-xl border border-[#262626] bg-[#1c1c1c] hover:bg-[#252525] px-3.5 py-2 text-xs font-medium text-white transition-colors cursor-pointer"
				>
					<Plus class="w-3.5 h-3.5" />
					<span>Add Tag</span>
				</button>
			</div>

			<div class="flex flex-wrap gap-2 pt-2">
				{#each skillsList as skill, idx}
					<div class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#181818] border border-[#262626] text-xs font-mono text-[#ededed]">
						<span>{skill}</span>
						<button
							type="button"
							onclick={() => removeSkill(idx)}
							class="text-[#666666] hover:text-red-400 transition-colors ml-1 cursor-pointer"
							title="Remove tag"
						>
							×
						</button>
					</div>
				{/each}
			</div>
		</div>

		<!-- Card 3: Experience Timeline Editor -->
		<div class="rounded-2xl border border-[#222222] bg-[#121212] p-6 space-y-4 shadow-xl">
			<div class="flex items-center justify-between border-b border-[#222222] pb-3">
				<div class="font-bold text-white font-['Space_Grotesk'] text-base">
					Career & Academic Experience Timeline
				</div>
				<button
					type="button"
					onclick={() => (showAddExperience = !showAddExperience)}
					class="flex items-center gap-1.5 rounded-xl border border-[#262626] bg-[#181818] px-3 py-1.5 text-xs text-[#ededed] hover:text-white transition-colors cursor-pointer"
				>
					<Plus class="w-3.5 h-3.5" />
					<span>Add Experience</span>
				</button>
			</div>

			{#if showAddExperience}
				<div class="rounded-xl border border-[#262626] bg-[#161616] p-4 space-y-3 text-xs">
					<div class="grid grid-cols-3 gap-3">
						<div class="space-y-1">
							<label for="exp-role" class="text-[#a1a1a1] font-medium">Role / Title *</label>
							<input id="exp-role" type="text" bind:value={expRole} placeholder="e.g. Lead Web Developer" class="w-full rounded-lg bg-[#111111] border border-[#2a2a2a] px-3 py-1.5 text-white" />
						</div>
						<div class="space-y-1">
							<label for="exp-company" class="text-[#a1a1a1] font-medium">Company / Org *</label>
							<input id="exp-company" type="text" bind:value={expCompany} placeholder="e.g. Acme Corp" class="w-full rounded-lg bg-[#111111] border border-[#2a2a2a] px-3 py-1.5 text-white" />
						</div>
						<div class="space-y-1">
							<label for="exp-period" class="text-[#a1a1a1] font-medium">Period</label>
							<input id="exp-period" type="text" bind:value={expPeriod} placeholder="e.g. 2023 - Present" class="w-full rounded-lg bg-[#111111] border border-[#2a2a2a] px-3 py-1.5 text-white font-mono" />
						</div>
					</div>
					<div class="space-y-1">
						<label for="exp-desc" class="text-[#a1a1a1] font-medium">Description</label>
						<input id="exp-desc" type="text" bind:value={expDesc} placeholder="Brief summary of duties..." class="w-full rounded-lg bg-[#111111] border border-[#2a2a2a] px-3 py-1.5 text-white" />
					</div>
					<div class="flex justify-end gap-2 pt-1">
						<button type="button" onclick={() => (showAddExperience = false)} class="px-3 py-1 rounded-lg text-[#888888]">Cancel</button>
						<button type="button" onclick={addExperienceItem} class="px-3 py-1 rounded-lg bg-blue-500 text-white font-semibold">Save Entry</button>
					</div>
				</div>
			{/if}

			<div class="space-y-3">
				{#each experienceList as item, idx}
					<div class="rounded-xl border border-[#222222] bg-[#161616] p-4 flex items-start justify-between gap-4 text-xs">
						<div class="space-y-1">
							<div class="font-bold text-white text-sm font-['Space_Grotesk']">{item.role}</div>
							<div class="text-[#a1a1a1] font-medium">{item.company} • <span class="font-mono text-[#777777]">{item.period}</span></div>
							<p class="text-[#777777] text-[11px] pt-1">{item.desc}</p>
						</div>
						<button
							type="button"
							onclick={() => removeExperienceItem(idx)}
							class="p-1.5 rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
							title="Delete Experience"
						>
							<Trash2 class="w-3.5 h-3.5" />
						</button>
					</div>
				{:else}
					<div class="text-center py-6 text-xs text-[#666666]">
						No experience items added yet. Click "Add Experience" to create entries.
					</div>
				{/each}
			</div>
		</div>
	</form>
</div>
