<script lang="ts">
	import {
		Bold,
		Italic,
		Heading1,
		Heading2,
		Code,
		Quote,
		Table,
		Link as LinkIcon,
		Image as ImageIcon,
		Upload,
		Edit3,
		FileImage,
		Check
	} from "lucide-svelte";
	import AssetManager from "./AssetManager.svelte";

	let { value = $bindable(""), coverUrl = $bindable(""), articleSlug = "uncategorized" } = $props();

	let activeTab = $state<'editor' | 'assets'>('editor');
	let isUploadingInline = $state(false);
	let fileInputEl = $state<HTMLInputElement | null>(null);
	let textareaEl = $state<HTMLTextAreaElement | null>(null);

	function insertTextAtCursor(textToInsert: string) {
		if (!textareaEl) {
			value += textToInsert;
			return;
		}

		const start = textareaEl.selectionStart;
		const end = textareaEl.selectionEnd;

		value = value.substring(0, start) + textToInsert + value.substring(end);

		setTimeout(() => {
			if (textareaEl) {
				textareaEl.focus();
				const newCursorPos = start + textToInsert.length;
				textareaEl.setSelectionRange(newCursorPos, newCursorPos);
			}
		}, 50);
	}

	function insertFormatting(prefix: string, suffix: string = "", defaultText: string = "text") {
		if (!textareaEl) return;
		const start = textareaEl.selectionStart;
		const end = textareaEl.selectionEnd;
		const selected = value.substring(start, end) || defaultText;

		const replacement = `${prefix}${selected}${suffix}`;
		value = value.substring(0, start) + replacement + value.substring(end);

		setTimeout(() => {
			if (textareaEl) {
				textareaEl.focus();
				textareaEl.setSelectionRange(start + prefix.length, start + prefix.length + selected.length);
			}
		}, 50);
	}

	async function uploadAndInsertFiles(files: FileList | File[]) {
		if (!files || files.length === 0) return;
		isUploadingInline = true;

		try {
			const formData = new FormData();
			formData.append("folder", `writing/${articleSlug}`);
			for (let i = 0; i < files.length; i++) {
				formData.append("file", files[i]);
			}

			const res = await fetch("/api/upload", {
				method: "POST",
				body: formData
			});

			const json = await res.json();
			if (json.success && json.files) {
				for (const file of json.files) {
					const altText = file.filename ? file.filename.replace('.webp', '') : 'image';
					insertTextAtCursor(`\n![${altText}](${file.optimizedUrl})\n`);
				}
			}
		} catch (err) {
			console.error("[MarkdownEditor] Inline image upload error:", err);
		} finally {
			isUploadingInline = false;
		}
	}

	function handleDrop(e: DragEvent) {
		e.preventDefault();
		if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
			uploadAndInsertFiles(e.dataTransfer.files);
		}
	}

	function handlePaste(e: ClipboardEvent) {
		const items = e.clipboardData?.items;
		if (!items) return;

		const imageFiles: File[] = [];
		for (let i = 0; i < items.length; i++) {
			if (items[i].type.startsWith("image/")) {
				const file = items[i].getAsFile();
				if (file) imageFiles.push(file);
			}
		}

		if (imageFiles.length > 0) {
			e.preventDefault();
			uploadAndInsertFiles(imageFiles);
		}
	}

	function triggerFilePicker() {
		fileInputEl?.click();
	}
</script>

<!-- Hidden File Input for Toolbar Button -->
<input
	type="file"
	accept="image/*"
	multiple
	bind:this={fileInputEl}
	onchange={(e) => e.currentTarget.files && uploadAndInsertFiles(e.currentTarget.files)}
	class="hidden"
/>

<div class="space-y-4">
	<!-- Editor Header & Toolbar -->
	<div class="rounded-2xl border border-[#222222] bg-[#121212] overflow-hidden shadow-xl">
		<div class="flex flex-wrap items-center justify-between gap-2 p-3 bg-[#161616] border-b border-[#222222]">
			<!-- Formatting Buttons -->
			<div class="flex items-center gap-1 font-mono text-xs">
				<button type="button" onclick={() => insertFormatting('**', '**', 'bold text')} class="p-1.5 rounded-lg hover:bg-[#222222] text-[#a1a1a1] hover:text-white" title="Bold">
					<Bold class="w-3.5 h-3.5" />
				</button>
				<button type="button" onclick={() => insertFormatting('*', '*', 'italic text')} class="p-1.5 rounded-lg hover:bg-[#222222] text-[#a1a1a1] hover:text-white" title="Italic">
					<Italic class="w-3.5 h-3.5" />
				</button>
				<div class="w-px h-4 bg-[#262626] mx-1"></div>

				<button type="button" onclick={() => insertFormatting('# ', '', 'Heading 1')} class="p-1.5 rounded-lg hover:bg-[#222222] text-[#a1a1a1] hover:text-white" title="H1">
					<Heading1 class="w-3.5 h-3.5" />
				</button>
				<button type="button" onclick={() => insertFormatting('## ', '', 'Heading 2')} class="p-1.5 rounded-lg hover:bg-[#222222] text-[#a1a1a1] hover:text-white" title="H2">
					<Heading2 class="w-3.5 h-3.5" />
				</button>
				<div class="w-px h-4 bg-[#262626] mx-1"></div>

				<button type="button" onclick={() => insertFormatting('> ', '', 'Quote text')} class="p-1.5 rounded-lg hover:bg-[#222222] text-[#a1a1a1] hover:text-white" title="Quote">
					<Quote class="w-3.5 h-3.5" />
				</button>
				<button type="button" onclick={() => insertFormatting('```typescript\n', '\n```', 'const hello = "world";')} class="p-1.5 rounded-lg hover:bg-[#222222] text-[#a1a1a1] hover:text-white" title="Code Block">
					<Code class="w-3.5 h-3.5" />
				</button>
				<button type="button" onclick={() => insertFormatting('[', '](https://...)', 'Link text')} class="p-1.5 rounded-lg hover:bg-[#222222] text-[#a1a1a1] hover:text-white" title="Link">
					<LinkIcon class="w-3.5 h-3.5" />
				</button>

				<!-- Insert Image Toolbar Button (Auto Upload & Insert) -->
				<button
					type="button"
					onclick={triggerFilePicker}
					class="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 transition-colors cursor-pointer"
					title="Insert Image (Auto WebP Upload)"
				>
					<ImageIcon class="w-3.5 h-3.5" />
					<span class="text-[11px] font-semibold">Insert Image</span>
				</button>
			</div>

			<!-- Tab Switcher (Editor / Asset Browser) -->
			<div class="flex items-center gap-1 rounded-xl bg-[#1d1d1d] p-1 border border-[#282828] text-xs font-mono">
				<button
					type="button"
					onclick={() => (activeTab = 'editor')}
					class="px-2.5 py-1 rounded-lg transition-colors cursor-pointer {activeTab === 'editor' ? 'bg-red-500 text-white font-semibold' : 'text-[#888888] hover:text-white'}"
				>
					<Edit3 class="w-3 h-3 inline mr-1" />
					<span>Markdown</span>
				</button>
				<button
					type="button"
					onclick={() => (activeTab = 'assets')}
					class="px-2.5 py-1 rounded-lg transition-colors cursor-pointer {activeTab === 'assets' ? 'bg-red-500 text-white font-semibold' : 'text-[#888888] hover:text-white'}"
				>
					<FileImage class="w-3 h-3 inline mr-1" />
					<span>Assets</span>
				</button>
			</div>
		</div>

		{#if activeTab === 'editor'}
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<!-- Textarea with Integrated Drag & Drop and Paste Listener -->
			<div
				ondragover={(e) => e.preventDefault()}
				ondrop={handleDrop}
				class="relative p-4 bg-[#0e0e0e]"
			>
				{#if isUploadingInline}
					<div class="absolute top-2 right-4 z-20 flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/40 text-red-400 text-xs font-mono font-semibold animate-pulse">
						<Upload class="w-3.5 h-3.5" />
						<span>Uploading & Converting WebP...</span>
					</div>
				{/if}

				<textarea
					bind:this={textareaEl}
					bind:value
					onpaste={handlePaste}
					rows={14}
					placeholder="Write markdown article here... Drag & Drop images or Paste (Ctrl+V) directly into text area."
					class="w-full h-full min-h-320px bg-transparent text-xs text-[#ededed] font-mono leading-relaxed placeholder-[#444444] focus:outline-none resize-y"
				></textarea>
			</div>
		{:else}
			<div class="p-4">
				<AssetManager
					onSelectImage={(url: string) => {
						insertTextAtCursor(`\n![image](${url})\n`);
						activeTab = 'editor';
					}}
					onSetCover={(url: string) => {
						coverUrl = url;
					}}
				/>
			</div>
		{/if}
	</div>
</div>
