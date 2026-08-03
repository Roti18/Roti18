<script lang="ts">
	import { enhance } from "$app/forms";
	import { Home, Save, Check, Link, User, Plus, Trash2 } from "lucide-svelte";
	import PageHeader from "$lib/components/admin/PageHeader.svelte";
	import FormInput from "$lib/components/admin/FormInput.svelte";
	import FormTextarea from "$lib/components/admin/FormTextarea.svelte";

	let { data, form } = $props();
	const site = $derived(data.site);

	let socialList = $state<{ platform: string; url: string; icon: string }[]>([]);
	let newPlatform = $state('GitHub');
	let newUrl = $state('');

	$effect(() => {
		if (site.socialLinks) {
			socialList = site.socialLinks;
		}
	});

	const platformOptions = [
		{ label: 'GitHub', icon: 'github' },
		{ label: 'X (Twitter)', icon: 'x' },
		{ label: 'YouTube', icon: 'youtube' },
		{ label: 'LinkedIn', icon: 'linkedin' },
		{ label: 'Instagram', icon: 'instagram' },
		{ label: 'TikTok', icon: 'tiktok' },
		{ label: 'Discord', icon: 'discord' },
		{ label: 'Personal Website', icon: 'website' },
		{ label: 'Email', icon: 'email' }
	];

	function addSocialLink() {
		const url = newUrl.trim();
		if (url) {
			const foundOpt = platformOptions.find((p) => p.label === newPlatform) || { label: newPlatform, icon: newPlatform.toLowerCase() };
			socialList = [
				...socialList,
				{ platform: foundOpt.label, url, icon: foundOpt.icon }
			];
			newUrl = '';
		}
	}

	function removeSocialLink(idx: number) {
		socialList = socialList.filter((_, i) => i !== idx);
	}
</script>

<div class="space-y-6 max-w-5xl mx-auto">
	<!-- Page Header -->
	<PageHeader
		badgeLabel="Landing Page Manager"
		title="Home Hero & Profile Settings"
		description="Edit full name, short bio description, avatar, and dynamic social media links"
		icon={Home}
	/>

	{#if form?.message}
		<div class="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs font-mono text-emerald-400 flex items-center gap-2">
			<Check class="w-4 h-4" />
			<span>{form.message}</span>
		</div>
	{/if}

	<!-- Form: Home Hero & Profile Information -->
	<form method="POST" action="?/updateHomeProfile" use:enhance class="space-y-6">
		<input type="hidden" name="socialLinks" value={JSON.stringify(socialList)} />

		<div class="rounded-2xl border border-[#222222] bg-[#121212] p-6 space-y-4 shadow-xl">
			<div class="flex items-center justify-between border-b border-[#222222] pb-3">
				<div class="font-bold text-white font-['Space_Grotesk'] text-base flex items-center gap-2">
					<User class="w-4 h-4 text-red-400" />
					<span>Public Home Hero & Bio Info</span>
				</div>
				<button
					type="submit"
					class="flex items-center gap-2 rounded-xl bg-red-500 hover:bg-red-600 px-4 py-2 text-xs font-semibold text-white shadow-lg transition-all cursor-pointer active:scale-95"
				>
					<Save class="w-4 h-4" />
					<span>Save Profile</span>
				</button>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				<FormInput
					id="home-fullname"
					name="fullName"
					label="Full Name (Nama Panjang)"
					required={true}
					value={site.fullName}
					placeholder="e.g. M. Roni"
				/>
				<FormInput
					id="home-name"
					name="name"
					label="Display Short Name"
					required={true}
					value={site.name}
					placeholder="e.g. M. Roni"
				/>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				<FormInput
					id="home-title"
					name="title"
					label="Professional Title / Role"
					required={true}
					value={site.title}
					placeholder="e.g. Software Engineer"
				/>
				<FormInput
					id="home-avatar"
					name="avatarUrl"
					type="url"
					label="Avatar Picture URL"
					mono={true}
					value={site.avatarUrl}
					placeholder="https://..."
				/>
			</div>

			<FormTextarea
				id="home-description"
				name="description"
				label="Short Bio Description (Landing Page Hero Text)"
				required={true}
				rows={3}
				value={site.description}
				placeholder="I'm a software engineer based in Indonesia..."
			/>
		</div>

		<!-- Dynamic Social Links Manager Card -->
		<div class="rounded-2xl border border-[#222222] bg-[#121212] p-6 space-y-4 shadow-xl">
			<div class="flex items-center justify-between border-b border-[#222222] pb-3">
				<div class="font-bold text-white font-['Space_Grotesk'] text-base flex items-center gap-2">
					<Link class="w-4 h-4 text-blue-400" />
					<span>Dynamic Social Media Links Manager</span>
				</div>
				<span class="text-xs font-mono text-[#777777]">{socialList.length} links configured</span>
			</div>

			<!-- Add New Social Link Form -->
			<div class="rounded-xl border border-[#262626] bg-[#161616] p-4 space-y-3 text-xs">
				<div class="font-bold text-white">Add New Social Media Link</div>
				<div class="flex flex-col sm:flex-row items-center gap-3">
					<div class="w-full sm:w-48 space-y-1">
						<label for="new-platform-select" class="text-[#a1a1a1] text-[11px]">Platform Picker</label>
						<select
							id="new-platform-select"
							bind:value={newPlatform}
							class="w-full rounded-xl bg-[#111111] border border-[#2a2a2a] px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500/50"
						>
							{#each platformOptions as opt}
								<option value={opt.label}>{opt.label}</option>
							{/each}
						</select>
					</div>

					<div class="flex-1 w-full space-y-1">
						<label for="new-url-input" class="text-[#a1a1a1] text-[11px]">Profile / Account URL</label>
						<input
							id="new-url-input"
							type="url"
							bind:value={newUrl}
							placeholder="https://..."
							onkeydown={(e) => e.key === 'Enter' && (e.preventDefault(), addSocialLink())}
							class="w-full rounded-xl bg-[#111111] border border-[#2a2a2a] px-3 py-2 text-xs text-white font-mono placeholder-[#555555] focus:outline-none focus:border-blue-500/50"
						/>
					</div>

					<button
						type="button"
						onclick={addSocialLink}
						class="w-full sm:w-auto self-end rounded-xl bg-blue-500 hover:bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition-colors cursor-pointer shadow flex items-center justify-center gap-1.5 active:scale-95"
					>
						<Plus class="w-4 h-4" />
						<span>Add Link</span>
					</button>
				</div>
			</div>

			<!-- Configured Social Links List -->
			<div class="space-y-2 pt-1">
				{#each socialList as link, idx}
					<div class="rounded-xl border border-[#222222] bg-[#161616] p-3 flex items-center justify-between gap-3 text-xs font-mono">
						<div class="flex items-center gap-3 overflow-hidden">
							<span class="px-2.5 py-1 rounded-lg bg-[#222222] text-blue-400 font-bold text-[11px] border border-[#2e2e2e]">
								{link.platform}
							</span>
							<span class="text-[#ededed] truncate">{link.url}</span>
						</div>

						<button
							type="button"
							onclick={() => removeSocialLink(idx)}
							class="p-1.5 rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors cursor-pointer shrink-0"
							title="Remove Link"
						>
							<Trash2 class="w-3.5 h-3.5" />
						</button>
					</div>
				{:else}
					<div class="text-center py-6 text-xs text-[#666666]">
						No social media links added yet. Use the form above to add links.
					</div>
				{/each}
			</div>
		</div>
	</form>
</div>
