<script lang="ts">
	import { Upload, Copy, Check, Image as ImageIcon, Sparkles, Trash2, Plus } from "lucide-svelte";

	let { onSelectImage = (_url: string) => {}, onSetCover = (_url: string) => {}, folder = "writing/general" } = $props();

	let uploading = $state(false);
	let uploadError = $state<string | null>(null);
	let uploadedAssets = $state<any[]>([]);
	let copiedUrl = $state<string | null>(null);

	async function handleFilesUpload(files: FileList | File[]) {
		if (!files || files.length === 0) return;

		uploading = true;
		uploadError = null;

		try {
			const formData = new FormData();
			formData.append("folder", folder);
			for (let i = 0; i < files.length; i++) {
				formData.append("file", files[i]);
			}

			const res = await fetch("/api/upload", {
				method: "POST",
				body: formData
			});

			const json = await res.json();
			if (!json.success) {
				uploadError = json.message || "Upload failed";
			} else if (json.files) {
				uploadedAssets = [...json.files, ...uploadedAssets];
			}
		} catch (err: any) {
			uploadError = err.message || "Upload error";
		} finally {
			uploading = false;
		}
	}

	function handleDrop(e: DragEvent) {
		e.preventDefault();
		if (e.dataTransfer?.files) {
			handleFilesUpload(e.dataTransfer.files);
		}
	}

	function copyMarkdown(asset: any) {
		const md = `![${asset.filename || 'image'}](${asset.originalUrl || asset.optimizedUrl})`;
		navigator.clipboard.writeText(md);
		copiedUrl = asset.optimizedUrl;
		setTimeout(() => (copiedUrl = null), 2000);
	}
</script>

<div class="space-y-4 rounded-2xl border border-[#222222] bg-[#121212] p-5 shadow-xl">
	<div class="flex items-center justify-between border-b border-[#222222] pb-3">
		<div class="flex items-center gap-2 font-bold text-white text-xs font-['Space_Grotesk']">
			<Sparkles class="w-4 h-4 text-amber-400" />
			<span>WebP Asset Manager & Storage</span>
		</div>
		<span class="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 uppercase">
			Auto WebP 82% Compression
		</span>
	</div>

	{#if uploadError}
		<div class="rounded-xl border border-red-500/30 bg-red-500/10 p-2.5 text-xs font-mono text-red-400">
			⚠ {uploadError}
		</div>
	{/if}

	<!-- Drag and Drop Zone -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		ondragover={(e) => e.preventDefault()}
		ondrop={handleDrop}
		class="relative rounded-xl border-2 border-dashed border-[#2b2b2b] hover:border-red-500/50 bg-[#161616] p-6 text-center transition-all group cursor-pointer"
	>
		<input
			type="file"
			accept="image/*"
			multiple
			onchange={(e) => e.currentTarget.files && handleFilesUpload(e.currentTarget.files)}
			class="absolute inset-0 z-10 w-full h-full opacity-0 cursor-pointer"
		/>

		<div class="space-y-2 pointer-events-none">
			<div class="mx-auto w-10 h-10 rounded-full bg-[#222222] text-[#ededed] flex items-center justify-center group-hover:scale-110 transition-transform">
				<Upload class="w-5 h-5 text-red-400" />
			</div>
			<div class="text-xs font-medium text-white">
				{uploading ? 'Uploading & Converting to WebP...' : 'Drag & Drop Images here, or Click to Browse'}
			</div>
			<p class="text-[10px] font-mono text-[#777777]">
				PNG, JPG, WEBP, GIF, SVG up to 15MB. Automatically compressed to WebP.
			</p>
		</div>
	</div>

	<!-- Uploaded Assets Thumbnail Grid -->
	{#if uploadedAssets.length > 0}
		<div class="space-y-2 pt-2">
			<div class="text-[11px] font-mono text-[#888888]">Recent Uploads ({uploadedAssets.length})</div>
			<div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
				{#each uploadedAssets as asset}
					<div class="relative group rounded-xl border border-[#262626] bg-[#161616] overflow-hidden p-2 space-y-2">
						<div class="relative aspect-video rounded-lg overflow-hidden bg-[#0d0d0d]">
							<img src={asset.optimizedUrl} alt="Thumbnail" class="w-full h-full object-cover" />
							<span class="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/80 text-[9px] font-mono text-emerald-400">
								WEBP
							</span>
						</div>

						<div class="text-[10px] font-mono text-[#777777] flex items-center justify-between">
							<span>{asset.width}x{asset.height}px</span>
							<span>{(asset.size / 1024).toFixed(0)} KB</span>
						</div>

						<div class="flex items-center gap-1 pt-1 border-t border-[#222222]">
							<button
								type="button"
								onclick={() => onSetCover(asset.optimizedUrl)}
								class="flex-1 px-2 py-1 rounded bg-[#222222] hover:bg-[#2a2a2a] text-[10px] text-amber-400 font-mono transition-colors"
								title="Set as Hero Cover"
							>
								Cover
							</button>
							<button
								type="button"
								onclick={() => onSelectImage(asset.originalUrl || asset.optimizedUrl)}
								class="flex-1 px-2 py-1 rounded bg-[#222222] hover:bg-[#2a2a2a] text-[10px] text-blue-400 font-mono transition-colors"
								title="Insert into Markdown Content"
							>
								Insert
							</button>
							<button
								type="button"
								onclick={() => copyMarkdown(asset)}
								class="p-1 rounded bg-[#222222] hover:bg-[#2a2a2a] text-[#ededed]"
								title="Copy Markdown"
							>
								{#if copiedUrl === asset.optimizedUrl}
									<Check class="w-3 h-3 text-emerald-400" />
								{:else}
									<Copy class="w-3 h-3" />
								{/if}
							</button>
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>
