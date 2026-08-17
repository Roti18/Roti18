<script lang="ts">
	import { enhance } from "$app/forms";
	import { Image, Plus, Search, Trash2, Edit, Camera } from "lucide-svelte";
	import PageHeader from "$lib/components/admin/PageHeader.svelte";
	import FormModal from "$lib/components/admin/FormModal.svelte";
	import FormInput from "$lib/components/admin/FormInput.svelte";
	import HeroCoverUploader from "$lib/components/admin/HeroCoverUploader.svelte";

	let { data } = $props();
	const photos = $derived(data.photos);

	let searchQuery = $state("");
	let showModal = $state(false);
	let editingItem = $state<any>(null);
	let imageUrl = $state("");
	let originalUrl = $state("");
	let width = $state(0);
	let height = $state(0);
	let cameraDesc = $state("");
	let locationName = $state("");
	let takenAt = $state("");

	const filteredItems = $derived(
		photos.filter(
			(p) =>
				p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				p.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
				(p.shortDesc && p.shortDesc.toLowerCase().includes(searchQuery.toLowerCase())) ||
				(p.cameraDesc && p.cameraDesc.toLowerCase().includes(searchQuery.toLowerCase()))
		)
	);

	function openCreateModal() {
		editingItem = null;
		imageUrl = "";
		originalUrl = "";
		width = 0;
		height = 0;
		cameraDesc = "";
		locationName = "";
		takenAt = "";
		showModal = true;
	}

	function openEditModal(item: any) {
		editingItem = item;
		imageUrl = item.imageUrl || "";
		originalUrl = item.originalUrl || "";
		width = item.width || 0;
		height = item.height || 0;
		cameraDesc = item.cameraDesc || "";
		locationName = item.locationName || "";
		if (item.createdAt) {
			const d = new Date(item.createdAt);
			takenAt = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
		} else {
			takenAt = "";
		}
		showModal = true;
	}
</script>

<div class="space-y-6 max-w-7xl mx-auto">
	<!-- Reusable Page Header -->
	<PageHeader
		badgeLabel="Gallery Photo Manager"
		title="Photography & Visual Assets"
		description="Manage gallery photos, camera EXIF specs, and image links"
		icon={Image}
	>
		<button
			onclick={openCreateModal}
			class="flex items-center gap-2 rounded-xl bg-purple-500 hover:bg-purple-600 px-4 py-2 text-xs font-semibold text-white shadow-lg transition-all cursor-pointer active:scale-95"
		>
			<Plus class="w-4 h-4" />
			<span>Add Photo</span>
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
					placeholder="Search photo title, camera, slug..."
					class="w-full rounded-xl bg-[#161616] border border-[#262626] pl-9 pr-3 py-1.5 text-xs text-[#ededed] placeholder-[#555555] focus:outline-none focus:border-purple-500/50"
				/>
			</div>

			<div class="text-xs text-[#777777] font-mono">
				Showing {filteredItems.length} of {photos.length} photos
			</div>
		</div>

		<div class="overflow-x-auto">
			<table class="w-full text-left text-xs text-[#ededed]">
				<thead class="bg-[#161616] text-[#777777] font-mono uppercase text-[10px]">
					<tr>
						<th class="px-4 py-3">Preview</th>
						<th class="px-4 py-3">Title & Description</th>
						<th class="px-4 py-3">Camera / Lens Specs</th>
						<th class="px-4 py-3">Sort Order</th>
						<th class="px-4 py-3 text-right">Actions</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-[#1e1e1e]">
					{#each filteredItems as item}
						<tr class="hover:bg-white/5 transition-colors">
							<td class="px-4 py-2.5">
								<a href={item.originalUrl || item.imageUrl} target="_blank" class="inline-block">
									<img src={item.imageUrl} alt={item.title} class="w-12 h-12 rounded-xl object-cover border border-[#2a2a2a]" />
								</a>
							</td>
							<td class="px-4 py-2.5 max-w-xs">
								<div class="font-bold text-white font-['Space_Grotesk']">{item.title}</div>
								<div class="text-[11px] text-[#777777] truncate">{item.shortDesc || `/${item.slug}`}</div>
							</td>
							<td class="px-4 py-2.5 font-mono text-[11px] text-purple-400">
								{#if item.cameraDesc}
									<div class="flex items-center gap-1">
										<Camera class="w-3 h-3" />
										<span>{item.cameraDesc}</span>
									</div>
								{:else}
									<span class="text-[#555555]">-</span>
								{/if}
							</td>
							<td class="px-4 py-2.5 font-mono text-[#888888]">{item.sortOrder}</td>
							<td class="px-4 py-2.5 text-right space-x-1">
								<button
									onclick={() => openEditModal(item)}
									class="p-1.5 rounded-lg border border-[#2a2a2a] bg-[#181818] text-[#a1a1a1] hover:text-white hover:border-[#333333] transition-colors cursor-pointer"
									title="Edit Photo"
								>
									<Edit class="w-3.5 h-3.5" />
								</button>
								<form method="POST" action="?/deletePhoto" use:enhance class="inline">
									<input type="hidden" name="id" value={item.id} />
									<button
										type="submit"
										class="p-1.5 rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors cursor-pointer"
										title="Delete Photo"
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
								No photos found.
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
	title={editingItem ? 'Edit Gallery Photo' : 'Add New Gallery Photo'}
	actionUrl={editingItem ? '?/updatePhoto' : '?/createPhoto'}
	isEditing={!!editingItem}
	maxWidth="max-w-lg"
>
	{#if editingItem}
		<input type="hidden" name="id" value={editingItem.id} />
	{/if}

	<FormInput
		id="photo-title"
		name="title"
		label="Photo Title"
		required={true}
		value={editingItem?.title || ''}
		placeholder="e.g. Sunset in Surabaya"
	/>

	<input type="hidden" name="imageUrl" value={imageUrl} />
	<input type="hidden" name="originalUrl" value={originalUrl} />
	<input type="hidden" name="width" value={width} />
	<input type="hidden" name="height" value={height} />

	<!-- Dedicated Gallery Photo Uploader (WebP R2) -->
	<HeroCoverUploader bind:coverUrl={imageUrl} bind:originalUrl={originalUrl} bind:width={width} bind:height={height} folder="gallery" onExifExtract={(desc, dateStr, loc) => {
		if (desc && !cameraDesc) cameraDesc = desc;
		if (loc && !locationName) locationName = loc;
		if (dateStr && !takenAt) {
			const d = new Date(dateStr);
			takenAt = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
		}
	}} />

	<FormInput
		id="photo-takenat"
		name="createdAt"
		type="datetime-local"
		label="Date Taken (Override automatic)"
		bind:value={takenAt}
	/>

	<FormInput
		id="photo-slug"
		name="slug"
		label="Custom Slug (Optional)"
		mono={true}
		value={editingItem?.slug || ''}
		placeholder="photo-slug-url"
	/>

	<FormInput
		id="photo-cameradesc"
		name="cameraDesc"
		label="Camera / Lens EXIF Info (Optional)"
		bind:value={cameraDesc}
		placeholder="e.g. Sony A7IV 35mm f/1.4"
	/>

	<FormInput
		id="photo-location"
		name="locationName"
		label="Location / GPS Data (Optional)"
		bind:value={locationName}
		placeholder="e.g. Pantai Kuta, Bali"
	/>

	<FormInput
		id="photo-shortdesc"
		name="shortDesc"
		label="Short Description (Optional)"
		value={editingItem?.shortDesc || ''}
		placeholder="Brief location or shot description..."
	/>
</FormModal>
