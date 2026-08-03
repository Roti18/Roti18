<script lang="ts">
	import { formatDateShort } from "$lib/utils/format";
	import {
		FileText,
		FolderGit2,
		Music,
		Image,
		GraduationCap,
		Users,
		TrendingUp,
		Plus,
		ExternalLink,
		Sparkles,
		Activity,
		Radio,
		ArrowRight,
		ShieldCheck
	} from "lucide-svelte";

	let { data } = $props();
	const stats = $derived(data.stats);
	const recentWritings = $derived(data.recentWritings);
	const recentProjects = $derived(data.recentProjects);
	const recentMusic = $derived(data.recentMusic);
	const recentUsers = $derived(data.recentUsers);

	let activeTab = $state<'writings' | 'projects' | 'music' | 'users'>('writings');
</script>

<div class="space-y-8 max-w-7xl mx-auto">
	<!-- Top Greeting & Overview Banner -->
	<div class="relative overflow-hidden rounded-2xl border border-[#222222] bg-gradient-to-r from-[#141414] via-[#111111] to-[#0d0d0d] p-6 shadow-2xl">
		<div class="absolute top-0 right-0 h-full w-1/3 bg-gradient-to-l from-red-500/10 to-transparent pointer-events-none"></div>

		<div class="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
			<div class="space-y-1">
				<div class="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 px-3 py-1 text-[10px] font-mono font-semibold text-red-400 border border-red-500/20 uppercase tracking-widest">
					<Sparkles class="w-3 h-3" />
					<span>Admin Executive Control Panel</span>
				</div>
				<h1 class="text-2xl md:text-3xl font-bold tracking-tight text-white font-['Space_Grotesk']">
					Portfolio Executive Dashboard
				</h1>
				<p class="text-xs md:text-sm text-[#888888]">
					Welcome back! All portfolio services, content modules, and API webhooks are operational.
				</p>
			</div>

			<div class="flex items-center gap-2">
				<a
					href="/dash/writings"
					class="flex items-center gap-2 rounded-xl bg-red-500 hover:bg-red-600 px-4 py-2 text-xs font-semibold text-white shadow-lg transition-all cursor-pointer hover:no-underline active:scale-95"
				>
					<Plus class="w-4 h-4" />
					<span>New Post</span>
				</a>
				<a
					href="/dash/projects"
					class="flex items-center gap-2 rounded-xl border border-[#262626] bg-[#141414] hover:bg-[#1a1a1a] px-4 py-2 text-xs font-semibold text-[#ededed] transition-all cursor-pointer hover:no-underline active:scale-95"
				>
					<Plus class="w-4 h-4" />
					<span>Add Project</span>
				</a>
			</div>
		</div>
	</div>

	<!-- KPI Stat Summary Cards (Grid) -->
	<div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
		<!-- Card 1: Writings -->
		<a
			href="/dash/writings"
			class="group rounded-2xl border border-[#222222] bg-[#121212] p-4 transition-all hover:border-red-500/40 hover:bg-[#161616] hover:no-underline"
		>
			<div class="flex items-center justify-between text-[#666666]">
				<span class="text-[11px] font-mono uppercase tracking-wider">Writings</span>
				<div class="p-2 rounded-xl bg-red-500/10 text-red-400 group-hover:scale-110 transition-transform">
					<FileText class="w-4 h-4" />
				</div>
			</div>
			<div class="mt-3 text-2xl font-bold text-white font-['Space_Grotesk']">
				{stats.writings}
			</div>
			<div class="mt-1 text-[10px] text-[#888888] flex items-center gap-1 font-mono">
				<span class="text-emerald-400 font-semibold">{stats.publishedWritings} published</span>
			</div>
		</a>

		<!-- Card 2: Projects -->
		<a
			href="/dash/projects"
			class="group rounded-2xl border border-[#222222] bg-[#121212] p-4 transition-all hover:border-blue-500/40 hover:bg-[#161616] hover:no-underline"
		>
			<div class="flex items-center justify-between text-[#666666]">
				<span class="text-[11px] font-mono uppercase tracking-wider">Projects</span>
				<div class="p-2 rounded-xl bg-blue-500/10 text-blue-400 group-hover:scale-110 transition-transform">
					<FolderGit2 class="w-4 h-4" />
				</div>
			</div>
			<div class="mt-3 text-2xl font-bold text-white font-['Space_Grotesk']">
				{stats.projects}
			</div>
			<div class="mt-1 text-[10px] text-[#888888] font-mono">
				Portfolio items
			</div>
		</a>

		<!-- Card 3: Music -->
		<a
			href="/dash/music"
			class="group rounded-2xl border border-[#222222] bg-[#121212] p-4 transition-all hover:border-emerald-500/40 hover:bg-[#161616] hover:no-underline"
		>
			<div class="flex items-center justify-between text-[#666666]">
				<span class="text-[11px] font-mono uppercase tracking-wider">Music</span>
				<div class="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
					<Music class="w-4 h-4" />
				</div>
			</div>
			<div class="mt-3 text-2xl font-bold text-white font-['Space_Grotesk']">
				{stats.music}
			</div>
			<div class="mt-1 text-[10px] text-emerald-400 font-mono flex items-center gap-1">
				<Radio class="w-3 h-3 animate-pulse" />
				<span>Live Webhook</span>
			</div>
		</a>

		<!-- Card 4: Gallery -->
		<a
			href="/dash/gallery"
			class="group rounded-2xl border border-[#222222] bg-[#121212] p-4 transition-all hover:border-purple-500/40 hover:bg-[#161616] hover:no-underline"
		>
			<div class="flex items-center justify-between text-[#666666]">
				<span class="text-[11px] font-mono uppercase tracking-wider">Gallery</span>
				<div class="p-2 rounded-xl bg-purple-500/10 text-purple-400 group-hover:scale-110 transition-transform">
					<Image class="w-4 h-4" />
				</div>
			</div>
			<div class="mt-3 text-2xl font-bold text-white font-['Space_Grotesk']">
				{stats.gallery}
			</div>
			<div class="mt-1 text-[10px] text-[#888888] font-mono">
				Photos stored
			</div>
		</a>

		<!-- Card 5: Academics -->
		<a
			href="/dash/academics"
			class="group rounded-2xl border border-[#222222] bg-[#121212] p-4 transition-all hover:border-amber-500/40 hover:bg-[#161616] hover:no-underline"
		>
			<div class="flex items-center justify-between text-[#666666]">
				<span class="text-[11px] font-mono uppercase tracking-wider">Academics</span>
				<div class="p-2 rounded-xl bg-amber-500/10 text-amber-400 group-hover:scale-110 transition-transform">
					<GraduationCap class="w-4 h-4" />
				</div>
			</div>
			<div class="mt-3 text-2xl font-bold text-white font-['Space_Grotesk']">
				{stats.academics}
			</div>
			<div class="mt-1 text-[10px] text-[#888888] font-mono">
				Course materials
			</div>
		</a>

		<!-- Card 6: Users -->
		<div class="rounded-2xl border border-[#222222] bg-[#121212] p-4">
			<div class="flex items-center justify-between text-[#666666]">
				<span class="text-[11px] font-mono uppercase tracking-wider">Users</span>
				<div class="p-2 rounded-xl bg-rose-500/10 text-rose-400">
					<Users class="w-4 h-4" />
				</div>
			</div>
			<div class="mt-3 text-2xl font-bold text-white font-['Space_Grotesk']">
				{stats.users}
			</div>
			<div class="mt-1 text-[10px] text-[#888888] font-mono">
				Registered accounts
			</div>
		</div>
	</div>

	<!-- Interactive Section: Analytics & Content Distribution Bar Chart -->
	<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
		<!-- Left: Visual SVG Distribution Bar Chart (2 Cols) -->
		<div class="lg:col-span-2 rounded-2xl border border-[#222222] bg-[#121212] p-6 space-y-5">
			<div class="flex items-center justify-between">
				<div>
					<h2 class="text-base font-bold text-white font-['Space_Grotesk']">Content Distribution</h2>
					<p class="text-xs text-[#777777]">Overview of portfolio assets stored in Database</p>
				</div>
				<span class="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
					ONLINE • TURSO DB
				</span>
			</div>

			<!-- SVG Bar Chart -->
			<div class="space-y-4 pt-2">
				{#each [
					{ label: 'Writings', count: stats.writings, max: Math.max(stats.writings, stats.projects, stats.music, stats.gallery, stats.academics, 1), color: 'bg-red-500' },
					{ label: 'Projects', count: stats.projects, max: Math.max(stats.writings, stats.projects, stats.music, stats.gallery, stats.academics, 1), color: 'bg-blue-500' },
					{ label: 'Music Tracks', count: stats.music, max: Math.max(stats.writings, stats.projects, stats.music, stats.gallery, stats.academics, 1), color: 'bg-emerald-500' },
					{ label: 'Gallery Photos', count: stats.gallery, max: Math.max(stats.writings, stats.projects, stats.music, stats.gallery, stats.academics, 1), color: 'bg-purple-500' },
					{ label: 'Academic Courseware', count: stats.academics, max: Math.max(stats.writings, stats.projects, stats.music, stats.gallery, stats.academics, 1), color: 'bg-amber-500' }
				] as item}
					{@const pct = Math.round((item.count / item.max) * 100)}
					<div class="space-y-1.5">
						<div class="flex items-center justify-between text-xs">
							<span class="text-[#a1a1a1] font-medium">{item.label}</span>
							<span class="text-white font-mono font-bold">{item.count} items</span>
						</div>
						<div class="h-2 w-full rounded-full bg-[#1e1e1e] overflow-hidden">
							<div
								class="h-full rounded-full transition-all duration-700 ease-out {item.color}"
								style="width: {pct}%"
							></div>
						</div>
					</div>
				{/each}
			</div>
		</div>

		<!-- Right: Quick Shortcuts Panel (1 Col) -->
		<div class="rounded-2xl border border-[#222222] bg-[#121212] p-6 space-y-4">
			<h2 class="text-base font-bold text-white font-['Space_Grotesk']">Quick Shortcuts</h2>
			<p class="text-xs text-[#777777]">Direct CRUD navigation</p>

			<div class="space-y-2 pt-1">
				<a
					href="/dash/home"
					class="flex items-center justify-between rounded-xl border border-[#222222] bg-[#161616] p-3 text-xs text-[#ededed] hover:border-red-500/40 hover:bg-[#1c1c1c] transition-all hover:no-underline group"
				>
					<div class="flex items-center gap-3">
						<div class="p-2 rounded-lg bg-red-500/10 text-red-400">
							<Sparkles class="w-4 h-4" />
						</div>
						<div>
							<div class="font-semibold text-white">Home Featured</div>
							<div class="text-[10px] text-[#777777]">Manage landing page items</div>
						</div>
					</div>
					<ArrowRight class="w-4 h-4 text-[#555555] group-hover:text-white transition-transform group-hover:translate-x-1" />
				</a>

				<a
					href="/dash/writings"
					class="flex items-center justify-between rounded-xl border border-[#222222] bg-[#161616] p-3 text-xs text-[#ededed] hover:border-red-500/40 hover:bg-[#1c1c1c] transition-all hover:no-underline group"
				>
					<div class="flex items-center gap-3">
						<div class="p-2 rounded-lg bg-blue-500/10 text-blue-400">
							<FileText class="w-4 h-4" />
						</div>
						<div>
							<div class="font-semibold text-white">Articles & Writings</div>
							<div class="text-[10px] text-[#777777]">Edit blog posts & essays</div>
						</div>
					</div>
					<ArrowRight class="w-4 h-4 text-[#555555] group-hover:text-white transition-transform group-hover:translate-x-1" />
				</a>

				<a
					href="/dash/music"
					class="flex items-center justify-between rounded-xl border border-[#222222] bg-[#161616] p-3 text-xs text-[#ededed] hover:border-emerald-500/40 hover:bg-[#1c1c1c] transition-all hover:no-underline group"
				>
					<div class="flex items-center gap-3">
						<div class="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
							<Music class="w-4 h-4" />
						</div>
						<div>
							<div class="font-semibold text-white">Lament Music Sync</div>
							<div class="text-[10px] text-[#777777]">Webhook & playback history</div>
						</div>
					</div>
					<ArrowRight class="w-4 h-4 text-[#555555] group-hover:text-white transition-transform group-hover:translate-x-1" />
				</a>
			</div>
		</div>
	</div>

	<!-- Recent Content Datatables Tabs -->
	<div class="rounded-2xl border border-[#222222] bg-[#121212] overflow-hidden shadow-xl">
		<div class="border-b border-[#222222] p-4 flex flex-wrap items-center justify-between gap-3">
			<div class="flex items-center gap-2">
				<Activity class="w-4 h-4 text-red-400" />
				<h2 class="text-sm font-bold text-white font-['Space_Grotesk']">Recent Activity Log</h2>
			</div>

			<!-- Tabs -->
			<div class="flex items-center gap-1 rounded-xl bg-[#181818] p-1 border border-[#262626] text-xs font-mono">
				<button
					onclick={() => (activeTab = 'writings')}
					class="px-3 py-1 rounded-lg transition-colors cursor-pointer {activeTab === 'writings' ? 'bg-red-500 text-white font-semibold' : 'text-[#888888] hover:text-white'}"
				>
					Writings ({recentWritings.length})
				</button>
				<button
					onclick={() => (activeTab = 'projects')}
					class="px-3 py-1 rounded-lg transition-colors cursor-pointer {activeTab === 'projects' ? 'bg-red-500 text-white font-semibold' : 'text-[#888888] hover:text-white'}"
				>
					Projects ({recentProjects.length})
				</button>
				<button
					onclick={() => (activeTab = 'music')}
					class="px-3 py-1 rounded-lg transition-colors cursor-pointer {activeTab === 'music' ? 'bg-red-500 text-white font-semibold' : 'text-[#888888] hover:text-white'}"
				>
					Music ({recentMusic.length})
				</button>
				<button
					onclick={() => (activeTab = 'users')}
					class="px-3 py-1 rounded-lg transition-colors cursor-pointer {activeTab === 'users' ? 'bg-red-500 text-white font-semibold' : 'text-[#888888] hover:text-white'}"
				>
					Users ({recentUsers.length})
				</button>
			</div>
		</div>

		<!-- Table View -->
		<div class="overflow-x-auto">
			{#if activeTab === 'writings'}
				<table class="w-full text-left text-xs text-[#ededed]">
					<thead class="bg-[#161616] text-[#777777] font-mono uppercase text-[10px]">
						<tr>
							<th class="px-4 py-3">Title</th>
							<th class="px-4 py-3">Year</th>
							<th class="px-4 py-3">Status</th>
							<th class="px-4 py-3 text-right">Action</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-[#1e1e1e]">
						{#each recentWritings as item}
							<tr class="hover:bg-white/5 transition-colors">
								<td class="px-4 py-3 font-semibold text-white">{item.title}</td>
								<td class="px-4 py-3 font-mono text-[#888888]">{item.year}</td>
								<td class="px-4 py-3">
									<span class="px-2 py-0.5 rounded-full text-[10px] font-mono {item.published ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}">
										{item.published ? 'Published' : 'Draft'}
									</span>
								</td>
								<td class="px-4 py-3 text-right">
									<a href="/dash/writings" class="text-red-400 hover:text-red-300 font-mono">Edit ›</a>
								</td>
							</tr>
						{:else}
							<tr>
								<td colspan="4" class="px-4 py-6 text-center text-[#666666]">No writings found.</td>
							</tr>
						{/each}
					</tbody>
				</table>
			{:else if activeTab === 'projects'}
				<table class="w-full text-left text-xs text-[#ededed]">
					<thead class="bg-[#161616] text-[#777777] font-mono uppercase text-[10px]">
						<tr>
							<th class="px-4 py-3">Project Title</th>
							<th class="px-4 py-3">Featured Home</th>
							<th class="px-4 py-3">Demo Link</th>
							<th class="px-4 py-3 text-right">Action</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-[#1e1e1e]">
						{#each recentProjects as item}
							<tr class="hover:bg-white/5 transition-colors">
								<td class="px-4 py-3 font-semibold text-white">{item.title}</td>
								<td class="px-4 py-3 font-mono">
									{#if item.featuredOnHome}
										<span class="text-emerald-400">★ Featured</span>
									{:else}
										<span class="text-[#666666]">-</span>
									{/if}
								</td>
								<td class="px-4 py-3 font-mono text-[#888888]">
									{item.demoUrl || 'N/A'}
								</td>
								<td class="px-4 py-3 text-right">
									<a href="/dash/projects" class="text-red-400 hover:text-red-300 font-mono">Edit ›</a>
								</td>
							</tr>
						{:else}
							<tr>
								<td colspan="4" class="px-4 py-6 text-center text-[#666666]">No projects found.</td>
							</tr>
						{/each}
					</tbody>
				</table>
			{:else if activeTab === 'music'}
				<table class="w-full text-left text-xs text-[#ededed]">
					<thead class="bg-[#161616] text-[#777777] font-mono uppercase text-[10px]">
						<tr>
							<th class="px-4 py-3">Song Title</th>
							<th class="px-4 py-3">Artist</th>
							<th class="px-4 py-3">Album</th>
							<th class="px-4 py-3 text-right">Played At</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-[#1e1e1e]">
						{#each recentMusic as item}
							<tr class="hover:bg-white/5 transition-colors">
								<td class="px-4 py-3 font-semibold text-white">{item.title}</td>
								<td class="px-4 py-3 text-[#a1a1a1]">{item.artist}</td>
								<td class="px-4 py-3 text-[#777777]">{item.album || '-'}</td>
								<td class="px-4 py-3 text-right font-mono text-[11px] text-emerald-400">
									{item.playedAt ? formatDateShort(item.playedAt) : 'Recently'}
								</td>
							</tr>
						{:else}
							<tr>
								<td colspan="4" class="px-4 py-6 text-center text-[#666666]">No music tracks logged yet.</td>
							</tr>
						{/each}
					</tbody>
				</table>
			{:else if activeTab === 'users'}
				<table class="w-full text-left text-xs text-[#ededed]">
					<thead class="bg-[#161616] text-[#777777] font-mono uppercase text-[10px]">
						<tr>
							<th class="px-4 py-3">User Name</th>
							<th class="px-4 py-3">Email Address</th>
							<th class="px-4 py-3 text-right">Joined</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-[#1e1e1e]">
						{#each recentUsers as item}
							<tr class="hover:bg-white/5 transition-colors">
								<td class="px-4 py-3 font-semibold text-white flex items-center gap-2">
									{#if item.image}
										<img src={item.image} alt={item.name} class="w-5 h-5 rounded-full object-cover" />
									{:else}
										<div class="w-5 h-5 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center text-[9px] font-bold">
											{item.name ? item.name[0].toUpperCase() : 'U'}
										</div>
									{/if}
									<span>{item.name}</span>
								</td>
								<td class="px-4 py-3 font-mono text-[#888888]">{item.email}</td>
								<td class="px-4 py-3 text-right font-mono text-[11px] text-[#777777]">
									{formatDateShort(item.createdAt)}
								</td>
							</tr>
						{:else}
							<tr>
								<td colspan="3" class="px-4 py-6 text-center text-[#666666]">No registered users.</td>
							</tr>
						{/each}
					</tbody>
				</table>
			{/if}
		</div>
	</div>
</div>
