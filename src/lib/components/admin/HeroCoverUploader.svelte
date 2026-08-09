<script lang="ts">
	import { Upload, ImageIcon, Trash2, RefreshCw, Sparkles, FileImage, Check } from "lucide-svelte";
	import AssetManager from "./AssetManager.svelte";

	let { coverUrl = $bindable(""), content = "", articleSlug = "new-article", folder = "" } = $props();

	let uploading = $state(false);
	let uploadError = $state<string | null>(null);
	let showAssetModal = $state(false);
	let fileInputEl = $state<HTMLInputElement | null>(null);

	async function uploadCoverFile(files: FileList | File[]) {
		if (!files || files.length === 0) return;
		uploading = true;
		uploadError = null;

		try {
			const targetFolder = folder ? folder : `writing/${articleSlug}`;
			const formData = new FormData();
			formData.append("folder", targetFolder);
			formData.append("file", files[0]);

			const res = await fetch("/api/upload", { method: "POST", body: formData });
			const json = await res.json();

			if (!json.success) {
				uploadError = json.message || "Upload failed";
			} else if (json.files && json.files[0]) {
				coverUrl = json.files[0].optimizedUrl;
			}
		} catch (err: any) {
			uploadError = err.message || "Upload error";
		} finally {
			uploading = false;
		}
	}

	function handleDrop(e: DragEvent) {
		e.preventDefault();
		if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
			uploadCoverFile(e.dataTransfer.files);
		}
	}

	function useFirstMarkdownImage() {
		const match = content.match(/!\[.*?\]\((https?:\/\/[^\s)]+|\/uploads\/[^\s)]+)\)/);
		if (match && match[1]) {
			coverUrl = match[1];
		} else {
			uploadError = "No image markdown found in article content.";
		}
	}

	function removeCover() {
		coverUrl = "";
	}
</script>

<input
	type="file"
	accept="image/*"
	bind:this={fileInputEl}
	onchange={(e) => e.currentTarget.files && uploadCoverFile(e.currentTarget.files)}
	class="hidden"
/>

<div class="space-y-2">
	<div class="flex items-center justify-between">
		<span class="text-[#a1a1a1] font-medium text-xs">Image / Cover Upload (WebP)</span>
		<div class="flex items-center gap-2">
			{#if !coverUrl && content}
				<button
					type="button"
					onclick={useFirstMarkdownImage}
					class="text-[10px] font-mono text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
				>
					<Sparkles class="w-3 h-3" />
					<span>Use 1st Article Image</span>
				</button>
			{/if}
			<button
				type="button"
				onclick={() => (showAssetModal = !showAssetModal)}
				class="text-[10px] font-mono text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
			>
				<FileImage class="w-3 h-3" />
				<span>Choose Asset</span>
			</button>
		</div>
	</div>

	{#if uploadError}
		<div class="rounded-xl border border-red-500/30 bg-red-500/10 p-2 text-xs font-mono text-red-400">
			⚠ {uploadError}
		</div>
	{/if}

	{#if coverUrl}
		<!-- Cover Image Preview Card with Quick Actions -->
		<div class="relative rounded-2xl border border-[#222222] bg-[#121212] p-3 flex items-center justify-between gap-4 shadow-xl">
			<div class="flex items-center gap-3 overflow-hidden">
				<img src={coverUrl} alt="Cover Preview" class="w-20 h-14 rounded-xl object-cover border border-[#2a2a2a] shrink-0" />
				<div class="space-y-1 overflow-hidden">
					<div class="text-xs font-bold text-white font-['Space_Grotesk'] flex items-center gap-1.5">
						<Check class="w-3.5 h-3.5 text-emerald-400" />
						<span>Image Active</span>
					</div>
					<div class="text-[10px] font-mono text-[#777777] truncate">{coverUrl}</div>
				</div>
			</div>

			<div class="flex items-center gap-1.5 shrink-0">
				<button
					type="button"
					onclick={() => fileInputEl?.click()}
					class="px-2.5 py-1.5 rounded-xl border border-[#262626] bg-[#181818] text-xs font-mono text-[#ededed] hover:text-white transition-colors cursor-pointer flex items-center gap-1"
				>
					<RefreshCw class="w-3 h-3" />
					<span>Replace</span>
				</button>
				<button
					type="button"
					onclick={removeCover}
					class="p-1.5 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors cursor-pointer"
					title="Remove Cover"
				>
					<Trash2 class="w-3.5 h-3.5" />
				</button>
			</div>
		</div>
	{:else}
		<!-- Drag and Drop Cover Upload Box -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			role="button"
			tabindex="0"
			ondragover={(e) => e.preventDefault()}
			ondrop={handleDrop}
			onclick={() => fileInputEl?.click()}
			onkeydown={(e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault();
					fileInputEl?.click();
				}
			}}
			class="relative rounded-2xl border-2 border-dashed border-[#2b2b2b] hover:border-red-500/50 bg-[#121212] p-5 text-center transition-all group cursor-pointer outline-none focus-visible:border-red-500/70"
		>
			<div class="space-y-2 pointer-events-none">
				<div class="mx-auto w-9 h-9 rounded-full bg-[#1c1c1c] text-red-400 flex items-center justify-center group-hover:scale-110 transition-transform">
					<Upload class="w-4 h-4" />
				</div>
				<div class="text-xs font-semibold text-white">
					{uploading ? 'Uploading Image & Converting WebP...' : 'Drag & Drop Image, or Click to Browse'}
				</div>
				<p class="text-[10px] font-mono text-[#666666]">
					PNG, JPG, WEBP, GIF up to 15MB. Converts to WebP automatically.
				</p>
			</div>
		</div>
	{/if}

	<!-- Modal Asset Browser Picker -->
	{#if showAssetModal}
		<div class="pt-2">
			<AssetManager
				onSelectImage={(url: string) => {
					coverUrl = url;
					showAssetModal = false;
				}}
				onSetCover={(url: string) => {
					coverUrl = url;
					showAssetModal = false;
				}}
			/>
		</div>
	{/if}
</div>
