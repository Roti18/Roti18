<script lang="ts">
	import { enhance } from "$app/forms";
import {
	GraduationCap,
	Plus,
	Search,
	Trash2,
	Edit,
	BookOpen,
	FileText,
	Paperclip,
	X,
	Layers
} from "lucide-svelte";
import MarkdownEditor from "$lib/components/admin/MarkdownEditor.svelte";

	let { data, form } = $props();
	let tempSlug = $state('');

	const semesters = $derived(data.semesters);
	const courses = $derived(data.courses);
	const materials = $derived(data.materials);

	let activeTab = $state<'materials' | 'courses' | 'semesters'>('materials');
	let searchQuery = $state("");

	// Modals state
	let showMaterialModal = $state(false);
	let showCourseModal = $state(false);
	let showSemesterModal = $state(false);

	let editingMaterial = $state<any>(null);
	let materialContent = $state('');

	// Attachment inputs
	let attachmentList = $state<{ name: string; url: string }[]>([]);
	let attName = $state('');
	let attUrl = $state('');

	function openCreateMaterial() {
		editingMaterial = null;
		materialContent = '';
		attachmentList = [];
		tempSlug = `draft-${Date.now()}`;
		showMaterialModal = true;
	}

	function openEditMaterial(item: any) {
		editingMaterial = item;
		materialContent = item.content || '';
		attachmentList = item.attachments || [];
		showMaterialModal = true;
	}

	function addAttachment() {
		if (attName && attUrl) {
			attachmentList = [...attachmentList, { name: attName, url: attUrl }];
			attName = '';
			attUrl = '';
		}
	}

	function removeAttachment(idx: number) {
		attachmentList = attachmentList.filter((_, i) => i !== idx);
	}

	function getCourseName(courseId: string) {
		const c = courses.find((x) => x.id === courseId);
		return c ? `${c.title} (${c.dosenName})` : 'Unknown Course';
	}

	function getSemesterTitle(semesterId: string) {
		const s = semesters.find((x) => x.id === semesterId);
		return s ? s.title : 'Semester';
	}
</script>

<div class="space-y-6 max-w-7xl mx-auto">
	<!-- Page Header -->
	<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
		<div>
			<div class="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-[10px] font-mono font-semibold text-amber-400 border border-amber-500/20 uppercase tracking-widest mb-1">
				<GraduationCap class="w-3 h-3" />
				<span>Curriculum & Academics Manager</span>
			</div>
			<h1 class="text-2xl font-bold text-white font-['Space_Grotesk']">Trunojoyo Academic Portal</h1>
			<p class="text-xs text-[#888888]">Comprehensive management for Semesters, Courses, Lecture Materials & File Attachments</p>
		</div>

		<div class="flex items-center gap-2">
			{#if activeTab === 'materials'}
				<button
					onclick={openCreateMaterial}
					class="flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-600 px-4 py-2 text-xs font-semibold text-white shadow-lg transition-all cursor-pointer active:scale-95"
				>
					<Plus class="w-4 h-4" />
					<span>Add Material</span>
				</button>
			{:else if activeTab === 'courses'}
				<button
					onclick={() => (showCourseModal = true)}
					class="flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-600 px-4 py-2 text-xs font-semibold text-white shadow-lg transition-all cursor-pointer active:scale-95"
				>
					<Plus class="w-4 h-4" />
					<span>Add Course (Matkul)</span>
				</button>
			{:else}
				<button
					onclick={() => (showSemesterModal = true)}
					class="flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-600 px-4 py-2 text-xs font-semibold text-white shadow-lg transition-all cursor-pointer active:scale-95"
				>
					<Plus class="w-4 h-4" />
					<span>Add Semester</span>
				</button>
			{/if}
		</div>
	</div>

	<!-- Tabs Navigation -->
	<div class="flex items-center gap-2 border-b border-[#222222] pb-3 text-xs font-mono">
		<button
			onclick={() => (activeTab = 'materials')}
			class="px-4 py-2 rounded-xl transition-all cursor-pointer border {activeTab === 'materials' ? 'bg-amber-500/15 text-amber-400 border-amber-500/30 font-bold' : 'bg-[#121212] text-[#888888] border-[#222222] hover:text-white'}"
		>
			1. Course Materials & Docs ({materials.length})
		</button>
		<button
			onclick={() => (activeTab = 'courses')}
			class="px-4 py-2 rounded-xl transition-all cursor-pointer border {activeTab === 'courses' ? 'bg-amber-500/15 text-amber-400 border-amber-500/30 font-bold' : 'bg-[#121212] text-[#888888] border-[#222222] hover:text-white'}"
		>
			2. Courses / Mata Kuliah ({courses.length})
		</button>
		<button
			onclick={() => (activeTab = 'semesters')}
			class="px-4 py-2 rounded-xl transition-all cursor-pointer border {activeTab === 'semesters' ? 'bg-amber-500/15 text-amber-400 border-amber-500/30 font-bold' : 'bg-[#121212] text-[#888888] border-[#222222] hover:text-white'}"
		>
			3. Semesters ({semesters.length})
		</button>
	</div>

	<!-- Tab 1: Materials & Attachments -->
	{#if activeTab === 'materials'}
		<div class="rounded-2xl border border-[#222222] bg-[#121212] overflow-hidden shadow-xl">
			<div class="border-b border-[#222222] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
				<div class="relative w-full sm:w-72">
					<Search class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#666666]" />
					<input
						type="text"
						bind:value={searchQuery}
						placeholder="Search materials by title, course..."
						class="w-full rounded-xl bg-[#161616] border border-[#262626] pl-9 pr-3 py-1.5 text-xs text-[#ededed] placeholder-[#555555] focus:outline-none focus:border-amber-500/50"
					/>
				</div>

				<div class="text-xs text-[#777777] font-mono">
					Showing {materials.length} material entries
				</div>
			</div>

			<div class="overflow-x-auto">
				<table class="w-full text-left text-xs text-[#ededed]">
					<thead class="bg-[#161616] text-[#777777] font-mono uppercase text-[10px]">
						<tr>
							<th class="px-4 py-3">Material Title</th>
							<th class="px-4 py-3">Course & Dosen</th>
							<th class="px-4 py-3">Type</th>
							<th class="px-4 py-3">Attachments</th>
							<th class="px-4 py-3 text-right">Actions</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-[#1e1e1e]">
						{#each materials as item}
							<tr class="hover:bg-white/5 transition-colors">
								<td class="px-4 py-3 max-w-xs">
									<div class="font-bold text-white font-['Space_Grotesk']">{item.title}</div>
									<div class="text-[11px] font-mono text-[#777777] truncate">/{item.fullSlug}</div>
								</td>
								<td class="px-4 py-3 text-[#a1a1a1]">
									{getCourseName(item.courseId)}
								</td>
								<td class="px-4 py-3 font-mono">
									<span class="px-2 py-0.5 rounded-full text-[10px] uppercase font-bold border {item.type === 'materi' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : item.type === 'tugas' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-purple-500/10 text-purple-400 border-purple-500/20'}">
										{item.type}
									</span>
								</td>
								<td class="px-4 py-3 font-mono text-[11px] text-amber-400">
									{#if item.attachments && item.attachments.length > 0}
										<div class="flex items-center gap-1">
											<Paperclip class="w-3 h-3" />
											<span>{item.attachments.length} files</span>
										</div>
									{:else}
										<span class="text-[#555555]">-</span>
									{/if}
								</td>
								<td class="px-4 py-3 text-right space-x-1">
									<button
										onclick={() => openEditMaterial(item)}
										class="p-1.5 rounded-lg border border-[#2a2a2a] bg-[#181818] text-[#a1a1a1] hover:text-white hover:border-[#333333] transition-colors cursor-pointer"
										title="Edit Material"
									>
										<Edit class="w-3.5 h-3.5" />
									</button>
									<form method="POST" action="?/deleteMaterial" use:enhance class="inline">
										<input type="hidden" name="id" value={item.id} />
										<button
											type="submit"
											class="p-1.5 rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors cursor-pointer"
											title="Delete Material"
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
									No course materials found.
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	{/if}

	<!-- Tab 2: Courses / Mata Kuliah -->
	{#if activeTab === 'courses'}
		<div class="rounded-2xl border border-[#222222] bg-[#121212] overflow-hidden shadow-xl">
			<div class="overflow-x-auto">
				<table class="w-full text-left text-xs text-[#ededed]">
					<thead class="bg-[#161616] text-[#777777] font-mono uppercase text-[10px]">
						<tr>
							<th class="px-4 py-3">Course Title (Mata Kuliah)</th>
							<th class="px-4 py-3">Semester</th>
							<th class="px-4 py-3">Dosen & Asprak</th>
							<th class="px-4 py-3">Praktikum</th>
							<th class="px-4 py-3 text-right">Actions</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-[#1e1e1e]">
						{#each courses as course}
							<tr class="hover:bg-white/5 transition-colors">
								<td class="px-4 py-3 font-bold text-white font-['Space_Grotesk']">
									{course.title}
								</td>
								<td class="px-4 py-3 font-mono text-amber-400">
									{getSemesterTitle(course.semesterId)}
								</td>
								<td class="px-4 py-3 text-[#a1a1a1]">
									<div>Dosen: <span class="text-white">{course.dosenName}</span></div>
									{#if course.asprakName}
										<div class="text-[10px] text-[#777777]">Asprak: {course.asprakName}</div>
									{/if}
								</td>
								<td class="px-4 py-3 font-mono">
									{#if course.hasPraktikum}
										<span class="text-emerald-400 font-semibold">✓ Yes</span>
									{:else}
										<span class="text-[#666666]">No</span>
									{/if}
								</td>
								<td class="px-4 py-3 text-right">
									<form method="POST" action="?/deleteCourse" use:enhance class="inline">
										<input type="hidden" name="id" value={course.id} />
										<button
											type="submit"
											class="p-1.5 rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors cursor-pointer"
											title="Delete Course"
											onclick={(e) => {
												if (!confirm(`Delete "${course.title}"?`)) e.preventDefault();
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
									No courses created yet. Click "Add Course" above.
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	{/if}

	<!-- Tab 3: Semesters -->
	{#if activeTab === 'semesters'}
		<div class="rounded-2xl border border-[#222222] bg-[#121212] overflow-hidden shadow-xl">
			<div class="overflow-x-auto">
				<table class="w-full text-left text-xs text-[#ededed]">
					<thead class="bg-[#161616] text-[#777777] font-mono uppercase text-[10px]">
						<tr>
							<th class="px-4 py-3">Semester Title</th>
							<th class="px-4 py-3">Slug</th>
							<th class="px-4 py-3">Sort Order</th>
							<th class="px-4 py-3 text-right">Actions</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-[#1e1e1e]">
						{#each semesters as sem}
							<tr class="hover:bg-white/5 transition-colors">
								<td class="px-4 py-3 font-bold text-white font-['Space_Grotesk']">{sem.title}</td>
								<td class="px-4 py-3 font-mono text-amber-400">/{sem.slug}</td>
								<td class="px-4 py-3 font-mono text-[#888888]">{sem.sortOrder}</td>
								<td class="px-4 py-3 text-right">
									<form method="POST" action="?/deleteSemester" use:enhance class="inline">
										<input type="hidden" name="id" value={sem.id} />
										<button
											type="submit"
											class="p-1.5 rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors cursor-pointer"
											title="Delete Semester"
											onclick={(e) => {
												if (!confirm(`Delete "${sem.title}"?`)) e.preventDefault();
											}}
										>
											<Trash2 class="w-3.5 h-3.5" />
										</button>
									</form>
								</td>
							</tr>
						{:else}
							<tr>
								<td colspan="4" class="px-4 py-8 text-center text-[#666666]">
									No semesters created yet. Click "Add Semester" above.
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	{/if}
</div>

<!-- Modal Form: Material & Attachments -->
{#if showMaterialModal}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4" onclick={() => (showMaterialModal = false)}>
		<div class="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl border border-[#222222] bg-[#121212] p-6 shadow-2xl space-y-4" data-lenis-prevent onclick={(e) => e.stopPropagation()}>
			<div class="flex items-center justify-between border-b border-[#222222] pb-3">
				<h2 class="text-base font-bold text-white font-['Space_Grotesk']">
					{editingMaterial ? 'Edit Academic Material' : 'Add New Academic Material'}
				</h2>
				<button onclick={() => (showMaterialModal = false)} class="text-[#666666] hover:text-white">
					<X class="w-4 h-4" />
				</button>
			</div>

			<form method="POST" action={editingMaterial ? '?/updateMaterial' : '?/createMaterial'} use:enhance={() => {
				showMaterialModal = false;
				return async ({ update }) => update();
			}} class="space-y-3 text-xs">
				<input type="hidden" name="attachments" value={JSON.stringify(attachmentList)} />

				{#if editingMaterial}
					<input type="hidden" name="id" value={editingMaterial.id} />
				{:else}
					<div class="space-y-1">
						<label for="mat-course" class="text-[#a1a1a1] font-medium">Select Course (Mata Kuliah) *</label>
						<select
							id="mat-course"
							name="courseId"
							required
							class="w-full rounded-xl bg-[#181818] border border-[#262626] px-3 py-2 text-[#ededed] focus:outline-none focus:border-amber-500/50"
						>
							{#each courses as course}
								<option value={course.id}>{course.title} ({course.dosenName})</option>
							{/each}
						</select>
					</div>
				{/if}

				<div class="grid grid-cols-3 gap-3">
					<div class="col-span-2 space-y-1">
						<label for="mat-title" class="text-[#a1a1a1] font-medium">Material Title *</label>
						<input
							id="mat-title"
							type="text"
							name="title"
							required
							value={editingMaterial?.title || ''}
							placeholder="e.g. Modul Pertemuan 1 - Arsitektur Web"
							class="w-full rounded-xl bg-[#181818] border border-[#262626] px-3 py-2 text-[#ededed] placeholder-[#555555] focus:outline-none focus:border-amber-500/50"
						/>
					</div>
					<div class="space-y-1">
						<label for="mat-type" class="text-[#a1a1a1] font-medium">Type *</label>
						<select
							id="mat-type"
							name="type"
							required
							class="w-full rounded-xl bg-[#181818] border border-[#262626] px-3 py-2 text-[#ededed] focus:outline-none focus:border-amber-500/50"
						>
							<option value="materi" selected={editingMaterial?.type === 'materi'}>Materi</option>
							<option value="tugas" selected={editingMaterial?.type === 'tugas'}>Tugas</option>
							<option value="praktikum" selected={editingMaterial?.type === 'praktikum'}>Praktikum</option>
						</select>
					</div>
				</div>

				<div class="space-y-1">
					<span class="text-[#a1a1a1] font-medium text-xs">Material Content (Markdown)</span>
					<input type="hidden" name="content" value={materialContent} />
					<MarkdownEditor bind:value={materialContent} articleSlug={editingMaterial?.id || tempSlug} />
				</div>

				<!-- Attachments Manager -->
				<div class="rounded-xl border border-[#222222] bg-[#161616] p-3 space-y-2">
					<div class="text-xs font-bold text-white font-['Space_Grotesk'] flex items-center justify-between">
						<span>Document Attachments & PDFs</span>
						<span class="text-[10px] text-[#777777] font-mono">{attachmentList.length} files attached</span>
					</div>

					<div class="flex items-center gap-2">
						<input type="text" bind:value={attName} placeholder="Doc Title (e.g. Modul_1.pdf)" class="flex-1 rounded-lg bg-[#111111] border border-[#262626] px-2.5 py-1 text-xs text-white" />
						<input type="url" bind:value={attUrl} placeholder="PDF/Doc Link (https://...)" class="flex-1 rounded-lg bg-[#111111] border border-[#262626] px-2.5 py-1 text-xs text-white" />
						<label class="px-2.5 py-1 rounded-lg bg-[#222222] hover:bg-[#2a2a2a] border border-[#333333] text-xs font-mono text-[#ededed] cursor-pointer">
							Upload
							<input
								type="file"
								class="hidden"
								onchange={async (e) => {
									const file = e.currentTarget.files?.[0];
									if (!file) return;
									const formData = new FormData();
									formData.append('folder', 'academics/documents');
									formData.append('file', file);
									try {
										const res = await fetch('/api/upload', { method: 'POST', body: formData });
										const json = await res.json();
										if (json.success && json.files?.[0]) {
											const uploadedUrl = json.files[0].optimizedUrl || json.files[0].originalUrl;
											const uploadedName = file.name;
											attachmentList = [...attachmentList, { name: uploadedName, url: uploadedUrl }];
											attName = '';
											attUrl = '';
										}
									} catch (err) {
										console.error('Upload failed:', err);
									}
								}}
							/>
						</label>
						<button type="button" onclick={addAttachment} class="px-2.5 py-1 rounded-lg bg-amber-500 text-white font-semibold">+ Add Link</button>
					</div>

					<div class="space-y-1 pt-1">
						{#each attachmentList as file, idx}
							<div class="flex items-center justify-between rounded-lg bg-[#111111] px-2.5 py-1 text-[11px] font-mono text-[#ededed]">
								<span class="truncate">{file.name} ({file.url})</span>
								<button type="button" onclick={() => removeAttachment(idx)} class="text-red-400 hover:text-red-300 ml-2">×</button>
							</div>
						{/each}
					</div>
				</div>

				<div class="pt-3 flex items-center justify-end gap-2 border-t border-[#222222]">
					<button type="button" onclick={() => (showMaterialModal = false)} class="rounded-xl border border-[#262626] bg-[#161616] px-4 py-2 text-xs font-semibold text-[#a1a1a1]">Cancel</button>
					<button type="submit" class="rounded-xl bg-amber-500 hover:bg-amber-600 px-4 py-2 text-xs font-semibold text-white shadow-lg">{editingMaterial ? 'Save Changes' : 'Create Material'}</button>
				</div>
			</form>
		</div>
	</div>
{/if}

<!-- Modal Form: Add Course -->
{#if showCourseModal}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4" onclick={() => (showCourseModal = false)}>
		<div class="relative w-full max-w-md rounded-2xl border border-[#222222] bg-[#121212] p-6 shadow-2xl space-y-4" onclick={(e) => e.stopPropagation()}>
			<div class="flex items-center justify-between border-b border-[#222222] pb-3">
				<h2 class="text-base font-bold text-white font-['Space_Grotesk']">Add New Course (Mata Kuliah)</h2>
				<button onclick={() => (showCourseModal = false)} class="text-[#666666] hover:text-white"><X class="w-4 h-4" /></button>
			</div>

			<form method="POST" action="?/createCourse" use:enhance={() => {
				showCourseModal = false;
				return async ({ update }) => update();
			}} class="space-y-3 text-xs">
				<div class="space-y-1">
					<label for="course-sem" class="text-[#a1a1a1] font-medium">Semester *</label>
					<select id="course-sem" name="semesterId" required class="w-full rounded-xl bg-[#181818] border border-[#262626] px-3 py-2 text-[#ededed]">
						{#each semesters as sem}
							<option value={sem.id}>{sem.title}</option>
						{/each}
					</select>
				</div>

				<div class="space-y-1">
					<label for="course-title" class="text-[#a1a1a1] font-medium">Course Title (Mata Kuliah) *</label>
					<input id="course-title" type="text" name="title" required placeholder="e.g. Pemrograman Web" class="w-full rounded-xl bg-[#181818] border border-[#262626] px-3 py-2 text-[#ededed]" />
				</div>

				<div class="grid grid-cols-2 gap-3">
					<div class="space-y-1">
						<label for="course-dosen" class="text-[#a1a1a1] font-medium">Nama Dosen *</label>
						<input id="course-dosen" type="text" name="dosenName" required placeholder="Dr. Achmad..." class="w-full rounded-xl bg-[#181818] border border-[#262626] px-3 py-2 text-[#ededed]" />
					</div>
					<div class="space-y-1">
						<label for="course-asprak" class="text-[#a1a1a1] font-medium">Nama Asprak</label>
						<input id="course-asprak" type="text" name="asprakName" placeholder="Nama Asprak..." class="w-full rounded-xl bg-[#181818] border border-[#262626] px-3 py-2 text-[#ededed]" />
					</div>
				</div>

				<div class="flex items-center gap-2 pt-1">
					<input type="checkbox" id="course-praktikum" name="hasPraktikum" class="rounded bg-[#181818] border-[#262626] text-amber-500" />
					<label for="course-praktikum" class="text-xs text-[#ededed] cursor-pointer">Has Praktikum / Lab Work</label>
				</div>

				<div class="pt-3 flex items-center justify-end gap-2 border-t border-[#222222]">
					<button type="button" onclick={() => (showCourseModal = false)} class="rounded-xl border border-[#262626] bg-[#161616] px-4 py-2 text-xs text-[#a1a1a1]">Cancel</button>
					<button type="submit" class="rounded-xl bg-amber-500 hover:bg-amber-600 px-4 py-2 text-xs font-semibold text-white shadow-lg">Create Course</button>
				</div>
			</form>
		</div>
	</div>
{/if}

<!-- Modal Form: Add Semester -->
{#if showSemesterModal}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4" onclick={() => (showSemesterModal = false)}>
		<div class="relative w-full max-w-sm rounded-2xl border border-[#222222] bg-[#121212] p-6 shadow-2xl space-y-4" onclick={(e) => e.stopPropagation()}>
			<div class="flex items-center justify-between border-b border-[#222222] pb-3">
				<h2 class="text-base font-bold text-white font-['Space_Grotesk']">Add New Semester</h2>
				<button onclick={() => (showSemesterModal = false)} class="text-[#666666] hover:text-white"><X class="w-4 h-4" /></button>
			</div>

			<form method="POST" action="?/createSemester" use:enhance={() => {
				showSemesterModal = false;
				return async ({ update }) => update();
			}} class="space-y-3 text-xs">
				<div class="space-y-1">
					<label for="sem-title" class="text-[#a1a1a1] font-medium">Semester Title *</label>
					<input id="sem-title" type="text" name="title" required placeholder="e.g. Semester 5" class="w-full rounded-xl bg-[#181818] border border-[#262626] px-3 py-2 text-[#ededed]" />
				</div>

				<div class="space-y-1">
					<label for="sem-slug" class="text-[#a1a1a1] font-medium">Slug (e.g. sem-5)</label>
					<input id="sem-slug" type="text" name="slug" placeholder="sem-5" class="w-full rounded-xl bg-[#181818] border border-[#262626] px-3 py-2 text-[#ededed] font-mono" />
				</div>

				<div class="pt-3 flex items-center justify-end gap-2 border-t border-[#222222]">
					<button type="button" onclick={() => (showSemesterModal = false)} class="rounded-xl border border-[#262626] bg-[#161616] px-4 py-2 text-xs text-[#a1a1a1]">Cancel</button>
					<button type="submit" class="rounded-xl bg-amber-500 hover:bg-amber-600 px-4 py-2 text-xs font-semibold text-white shadow-lg">Create Semester</button>
				</div>
			</form>
		</div>
	</div>
{/if}
