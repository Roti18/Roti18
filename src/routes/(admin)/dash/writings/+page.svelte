<script lang="ts">
	import { enhance } from "$app/forms";
	import { FileText, Plus, Search, Trash2, Edit, ExternalLink } from "lucide-svelte";
	import PageHeader from "$lib/components/admin/PageHeader.svelte";
	import FormModal from "$lib/components/admin/FormModal.svelte";
	import FormInput from "$lib/components/admin/FormInput.svelte";
	import MarkdownEditor from "$lib/components/admin/MarkdownEditor.svelte";
	import HeroCoverUploader from "$lib/components/admin/HeroCoverUploader.svelte";

	let { data } = $props();
	const writings = $derived(data.writings);

	let searchQuery = $state("");
	let filterStatus = $state<'all' | 'published' | 'draft'>('all');
	let showModal = $state(false);
	let editingItem = $state<any>(null);

	let content = $state('');
	let coverUrl = $state('');
	let tempSlug = $state('');

	const filteredItems = $derived(
		writings.filter((w) => {
			const matchesSearch =
				w.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				w.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
				(w.excerpt && w.excerpt.toLowerCase().includes(searchQuery.toLowerCase()));

			const matchesStatus =
				filterStatus === 'all'
					? true
					: filterStatus === 'published'
					? w.published
					: !w.published;

			return matchesSearch && matchesStatus;
		})
	);

	function openCreateModal() {
		editingItem = null;
		content = '';
		coverUrl = '';
		tempSlug = `draft-${Date.now()}`;
		showModal = true;
	}

	function openEditModal(item: any) {
		editingItem = item;
		content = item.content || '';
		coverUrl = item.coverUrl || '';
		showModal = true;
	}
</script>

<div class="space-y-6 max-w-7xl mx-auto">
	<!-- Reusable Page Header -->
	<PageHeader
		badgeLabel="Writings Content Manager"
		title="Articles & Essay Entries"
		description="Create, edit, publish or unpublish blog writings with WebP R2 image storage & Markdown"
		icon={FileText}
	>
		<button
			onclick={openCreateModal}
			class="flex items-center gap-2 rounded-xl bg-red-500 hover:bg-red-600 px-4 py-2 text-xs font-semibold text-white shadow-lg transition-all cursor-pointer active:scale-95"
		>
			<Plus class="w-4 h-4" />
			<span>New Article</span>
		</button>
	</PageHeader>

	<!-- Main Datatable Card -->
	<div class="rounded-2xl border border-[#222222] bg-[#121212] overflow-hidden shadow-xl">
		<div class="border-b border-[#222222] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
			<div class="flex flex-wrap items-center gap-3">
				<div class="relative w-full sm:w-72">
					<Search class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#666666]" />
					<input
						type="text"
						bind:value={searchQuery}
						placeholder="Search title, slug, excerpt..."
						class="w-full rounded-xl bg-[#161616] border border-[#262626] pl-9 pr-3 py-1.5 text-xs text-[#ededed] placeholder-[#555555] focus:outline-none focus:border-red-500/50"
					/>
				</div>

				<div class="flex items-center gap-1 rounded-xl bg-[#181818] p-1 border border-[#262626] text-xs font-mono">
					<button
						onclick={() => (filterStatus = 'all')}
						class="px-2.5 py-1 rounded-lg transition-colors cursor-pointer {filterStatus === 'all' ? 'bg-red-500 text-white font-semibold' : 'text-[#888888] hover:text-white'}"
					>
						All ({writings.length})
					</button>
					<button
						onclick={() => (filterStatus = 'published')}
						class="px-2.5 py-1 rounded-lg transition-colors cursor-pointer {filterStatus === 'published' ? 'bg-red-500 text-white font-semibold' : 'text-[#888888] hover:text-white'}"
					>
						Published ({writings.filter(w => w.published).length})
					</button>
					<button
						onclick={() => (filterStatus = 'draft')}
						class="px-2.5 py-1 rounded-lg transition-colors cursor-pointer {filterStatus === 'draft' ? 'bg-red-500 text-white font-semibold' : 'text-[#888888] hover:text-white'}"
					>
						Drafts ({writings.filter(w => !w.published).length})
					</button>
				</div>
			</div>

			<div class="text-xs text-[#777777] font-mono">
				Showing {filteredItems.length} articles
			</div>
		</div>

		<div class="overflow-x-auto">
			<table class="w-full text-left text-xs text-[#ededed]">
				<thead class="bg-[#161616] text-[#777777] font-mono uppercase text-[10px]">
					<tr>
						<th class="px-4 py-3">Title & Slug</th>
						<th class="px-4 py-3">Year</th>
						<th class="px-4 py-3">Likes</th>
						<th class="px-4 py-3">Status</th>
						<th class="px-4 py-3 text-right">Actions</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-[#1e1e1e]">
					{#each filteredItems as item}
						<tr class="hover:bg-white/5 transition-colors">
							<td class="px-4 py-3 max-w-md">
								<div class="font-bold text-white font-['Space_Grotesk'] truncate">
									{item.title}
								</div>
								<div class="text-[11px] font-mono text-[#777777] flex items-center gap-2">
									<span>/{item.slug}</span>
									{#if item.published}
										<a href="/writing/{item.slug}" target="_blank" class="text-red-400 hover:underline inline-flex items-center gap-0.5">
											<span>view</span>
											<ExternalLink class="w-2.5 h-2.5" />
										</a>
									{/if}
								</div>
							</td>
							<td class="px-4 py-3 font-mono text-[#888888]">{item.year}</td>
							<td class="px-4 py-3 font-mono text-rose-400">♥ {item.likes}</td>
							<td class="px-4 py-3">
								<form method="POST" action="?/togglePublish" use:enhance class="inline">
									<input type="hidden" name="id" value={item.id} />
									<input type="hidden" name="published" value={item.published ? 'true' : 'false'} />
									<button
										type="submit"
										class="px-2.5 py-0.5 rounded-full text-[10px] font-mono transition-colors cursor-pointer border {item.published ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20'}"
									>
										{item.published ? '● Published' : '○ Draft'}
									</button>
								</form>
							</td>
							<td class="px-4 py-3 text-right space-x-1">
								<button
									onclick={() => openEditModal(item)}
									class="p-1.5 rounded-lg border border-[#2a2a2a] bg-[#181818] text-[#a1a1a1] hover:text-white hover:border-[#333333] transition-colors cursor-pointer"
									title="Edit Article"
								>
									<Edit class="w-3.5 h-3.5" />
								</button>
								<form method="POST" action="?/deleteWriting" use:enhance class="inline">
									<input type="hidden" name="id" value={item.id} />
									<button
										type="submit"
										class="p-1.5 rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors cursor-pointer"
										title="Delete Article"
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
								No articles found matching criteria.
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>

<!-- Reusable Form Modal with Markdown Editor & Asset Manager -->
<FormModal
	bind:open={showModal}
	title={editingItem ? 'Edit Article Entry' : 'Create New Article'}
	actionUrl={editingItem ? '?/updateWriting' : '?/createWriting'}
	isEditing={!!editingItem}
	maxWidth="max-w-4xl"
>
	{#if editingItem}
		<input type="hidden" name="id" value={editingItem.id} />
	{/if}
	<input type="hidden" name="content" value={content} />
	<input type="hidden" name="coverUrl" value={coverUrl} />

	<div class="grid grid-cols-3 gap-3">
		<div class="col-span-2">
			<FormInput
				id="writing-title"
				name="title"
				label="Article Title"
				required={true}
				value={editingItem?.title || ''}
				placeholder="Title of the post"
			/>
		</div>
		<div>
			<FormInput
				id="writing-year"
				name="year"
				type="number"
				label="Year"
				required={true}
				mono={true}
				value={editingItem?.year || new Date().getFullYear()}
			/>
		</div>
	</div>

	<FormInput
		id="writing-slug"
		name="slug"
		label="Custom Slug (Optional)"
		mono={true}
		value={editingItem?.slug || ''}
		placeholder="my-custom-url-slug"
	/>


	<FormInput
		id="writing-excerpt"
		name="excerpt"
		label="Excerpt Summary (Optional)"
		value={editingItem?.excerpt || ''}
		placeholder="Brief preview line..."
	/>

	<!-- Markdown Editor with R2 Upload Integration -->
	<div class="space-y-1">
		<span class="text-[#a1a1a1] font-medium text-xs">Article Content (Markdown)</span>
		<MarkdownEditor bind:value={content} bind:coverUrl articleSlug={editingItem?.slug || tempSlug} />
	</div>

	<div class="flex items-center gap-2 pt-1">
		<input
			type="checkbox"
			id="writing-published"
			name="published"
			checked={editingItem ? editingItem.published : true}
			class="rounded bg-[#181818] border-[#262626] text-red-500 focus:ring-0 cursor-pointer"
		/>
		<label for="writing-published" class="text-xs text-[#ededed] font-medium cursor-pointer">
			Publish immediately to public website
		</label>
	</div>
</FormModal>
