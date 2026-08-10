<script lang="ts">
	import { enhance } from "$app/forms";
	import { FolderGit2, Plus, Search, Trash2, Edit, ExternalLink } from "lucide-svelte";
	import PageHeader from "$lib/components/admin/PageHeader.svelte";
	import FormModal from "$lib/components/admin/FormModal.svelte";
	import FormInput from "$lib/components/admin/FormInput.svelte";
	import FormTextarea from "$lib/components/admin/FormTextarea.svelte";
	import HeroCoverUploader from "$lib/components/admin/HeroCoverUploader.svelte";
	import MarkdownEditor from "$lib/components/admin/MarkdownEditor.svelte";

	let { data } = $props();
	const projects = $derived(data.projects);

	let searchQuery = $state("");
	let showModal = $state(false);
	let editingItem = $state<any>(null);
	let thumbnailUrl = $state("");
	let originalUrl = $state("");
	let content = $state('');
	let tempSlug = $state('');

	const filteredItems = $derived(
		projects.filter(
			(p) =>
				p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				p.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
				p.shortDesc.toLowerCase().includes(searchQuery.toLowerCase())
		)
	);

	function openCreateModal() {
		editingItem = null;
		thumbnailUrl = "";
		originalUrl = "";
		content = "";
		tempSlug = `draft-${Date.now()}`;
		showModal = true;
	}

	function openEditModal(item: any) {
		editingItem = item;
		thumbnailUrl = item.thumbnailUrl || "";
		originalUrl = item.originalUrl || "";
		content = item.content || "";
		showModal = true;
	}
</script>

<div class="space-y-6 max-w-7xl mx-auto">
	<!-- Reusable Page Header -->
	<PageHeader
		badgeLabel="Projects Manager"
		title="Portfolio Projects & Apps"
		description="Manage showcase projects, github repositories & live demo links"
		icon={FolderGit2}
	>
		<button
			onclick={openCreateModal}
			class="flex items-center gap-2 rounded-xl bg-blue-500 hover:bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-lg transition-all cursor-pointer active:scale-95"
		>
			<Plus class="w-4 h-4" />
			<span>Add Project</span>
		</button>
	</PageHeader>

	<!-- Main Datatable Card -->
	<div class="rounded-2xl border border-[#222222] bg-[#121212] overflow-hidden shadow-xl">
		<div class="border-b border-[#222222] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
			<div class="relative w-full sm:w-72">
				<Search class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#666666]" />
				<input
					type="text"
					bind:value={searchQuery}
					placeholder="Search project title, desc, slug..."
					class="w-full rounded-xl bg-[#161616] border border-[#262626] pl-9 pr-3 py-1.5 text-xs text-[#ededed] placeholder-[#555555] focus:outline-none focus:border-blue-500/50"
				/>
			</div>

			<div class="text-xs text-[#777777] font-mono">
				Showing {filteredItems.length} of {projects.length} projects
			</div>
		</div>

		<div class="overflow-x-auto">
			<table class="w-full text-left text-xs text-[#ededed]">
				<thead class="bg-[#161616] text-[#777777] font-mono uppercase text-[10px]">
					<tr>
						<th class="px-4 py-3">Project</th>
						<th class="px-4 py-3">Featured Home</th>
						<th class="px-4 py-3">Links</th>
						<th class="px-4 py-3">Sort Order</th>
						<th class="px-4 py-3 text-right">Actions</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-[#1e1e1e]">
					{#each filteredItems as item}
						<tr class="hover:bg-white/5 transition-colors">
							<td class="px-4 py-3 max-w-sm">
								<div class="font-bold text-white font-['Space_Grotesk']">{item.title}</div>
								<div class="text-[11px] text-[#777777] line-clamp-1">{item.shortDesc}</div>
							</td>
							<td class="px-4 py-3">
								<form method="POST" action="?/toggleFeatured" use:enhance class="inline">
									<input type="hidden" name="id" value={item.id} />
									<input type="hidden" name="featured" value={item.featuredOnHome ? 'true' : 'false'} />
									<button
										type="submit"
										class="px-2.5 py-0.5 rounded-full text-[10px] font-mono transition-colors cursor-pointer border {item.featuredOnHome ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20 font-semibold' : 'bg-[#1a1a1a] text-[#666666] border-[#262626] hover:text-[#a1a1a1]'}"
									>
										{item.featuredOnHome ? '★ Featured' : '☆ Standard'}
									</button>
								</form>
							</td>
							<td class="px-4 py-3 font-mono text-[11px]">
								<div class="flex items-center gap-2">
									{#if item.demoUrl}
										<a href={item.demoUrl} target="_blank" class="text-blue-400 hover:underline flex items-center gap-1">
											<span>Live</span>
											<ExternalLink class="w-3 h-3" />
										</a>
									{/if}
									{#if item.repoUrl}
										<a href={item.repoUrl} target="_blank" class="text-[#a1a1a1] hover:text-white flex items-center gap-1">
											<FolderGit2 class="w-3 h-3" />
											<span>Repo</span>
										</a>
									{/if}
								</div>
							</td>
							<td class="px-4 py-3 font-mono text-[#888888]">{item.sortOrder}</td>
							<td class="px-4 py-3 text-right space-x-1">
								<button
									onclick={() => openEditModal(item)}
									class="p-1.5 rounded-lg border border-[#2a2a2a] bg-[#181818] text-[#a1a1a1] hover:text-white hover:border-[#333333] transition-colors cursor-pointer"
									title="Edit Project"
								>
									<Edit class="w-3.5 h-3.5" />
								</button>
								<form method="POST" action="?/deleteProject" use:enhance class="inline">
									<input type="hidden" name="id" value={item.id} />
									<button
										type="submit"
										class="p-1.5 rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors cursor-pointer"
										title="Delete Project"
										onclick={(e) => {
											if (!confirm(`Delete "${item.title}"?`)) e.preventDefault();
										}}
									>
										<Trash2 class="w-3.5 h-3.5" />
									</button>
								</form>
							</td>
						</tr>
					{:else}
						<tr>
							<td colspan="5" class="px-4 py-8 text-center text-[#666666]">
								No projects found.
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>

<!-- Reusable Form Modal -->
<FormModal
	bind:open={showModal}
	title={editingItem ? 'Edit Portfolio Project' : 'Add New Portfolio Project'}
	actionUrl={editingItem ? '?/updateProject' : '?/createProject'}
	isEditing={!!editingItem}
>
	{#if editingItem}
		<input type="hidden" name="id" value={editingItem.id} />
	{/if}

	<div class="grid grid-cols-3 gap-3">
		<div class="col-span-2">
			<FormInput
				id="project-title"
				name="title"
				label="Project Title"
				required={true}
				value={editingItem?.title || ''}
				placeholder="e.g. Svelte Analytics"
			/>
		</div>
		<div>
			<FormInput
				id="project-sort"
				name="sortOrder"
				type="number"
				label="Sort Order"
				mono={true}
				value={editingItem?.sortOrder ?? 0}
			/>
		</div>
	</div>

	<FormInput
		id="project-slug"
		name="slug"
		label="Custom Slug (Optional)"
		mono={true}
		value={editingItem?.slug || ''}
		placeholder="project-slug-url"
	/>

	<FormInput
		id="project-shortdesc"
		name="shortDesc"
		label="Short Description"
		required={true}
		value={editingItem?.shortDesc || ''}
		placeholder="One line summary..."
	/>

	<div class="grid grid-cols-2 gap-3">
		<div>
			<FormInput
				id="project-demo"
				name="demoUrl"
				type="url"
				label="Live Demo URL (Optional)"
				value={editingItem?.demoUrl || ''}
				placeholder="https://..."
			/>
			<input type="hidden" name="demoIsLive" value="true" />
		</div>
		<div>
			<FormInput
				id="project-repo"
				name="repoUrl"
				type="url"
				label="Repo GitHub URL (Optional)"
				value={editingItem?.repoUrl || ''}
				placeholder="https://github.com/..."
			/>
			<input type="hidden" name="repoIsPublic" value="true" />
		</div>
	</div>

	<input type="hidden" name="thumbnailUrl" value={thumbnailUrl} />
	<input type="hidden" name="originalUrl" value={originalUrl} />

	<!-- Dedicated Project Thumbnail Uploader (WebP R2) -->
	<HeroCoverUploader bind:coverUrl={thumbnailUrl} bind:originalUrl={originalUrl} folder="projects" />

	<div class="space-y-1">
		<span class="text-[#a1a1a1] font-medium text-xs">Project Content (Markdown)</span>
		<input type="hidden" name="content" value={content} />
		<MarkdownEditor bind:value={content} articleSlug={editingItem?.slug || tempSlug} folder="projects" />
	</div>

	<div class="flex items-center gap-2 pt-1">
		<input
			type="checkbox"
			id="project-featured"
			name="featuredOnHome"
			checked={editingItem ? editingItem.featuredOnHome : false}
			class="rounded bg-[#181818] border-[#262626] text-blue-500 focus:ring-0 cursor-pointer"
		/>
		<label for="project-featured" class="text-xs text-[#ededed] font-medium cursor-pointer">
			Feature this project on Landing Page home section
		</label>
	</div>
</FormModal>
