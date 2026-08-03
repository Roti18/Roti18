<script lang="ts">
	import { enhance } from "$app/forms";
	import { formatDateShort } from "$lib/utils/format";
	import {
		Music,
		Plus,
		Search,
		Trash2,
		Edit,
		Radio,
		Copy,
		Check,
		ExternalLink,
		Sparkles,
		X,
		Play,
		RefreshCw,
		Eye,
		EyeOff
	} from "lucide-svelte";
	import PageHeader from "$lib/components/admin/PageHeader.svelte";
	import FormModal from "$lib/components/admin/FormModal.svelte";
	import FormInput from "$lib/components/admin/FormInput.svelte";
	import FormTextarea from "$lib/components/admin/FormTextarea.svelte";
	import HeroCoverUploader from "$lib/components/admin/HeroCoverUploader.svelte";

	let { data, form } = $props();
	const tracks = $derived(data.tracks);

	let searchQuery = $state("");
	let showModal = $state(false);
	let showSyncModal = $state(false);
	let editingTrack = $state<any>(null);
	let coverUrl = $state("");
	let copiedSecret = $state(false);
	let copiedSnippet = $state(false);
	let testingWebhook = $state(false);
	let testResult = $state<string | null>(null);

	// Secret is fetched on demand (admin-only endpoint), never part of page data.
	let secret = $state<string | null>(null);
	let secretVisible = $state(false);
	let secretError = $state<string | null>(null);

	async function loadSecret() {
		if (secret !== null) return;
		secretError = null;
		try {
			const res = await fetch("/api/music/secret");
			const json = await res.json();
			if (json.success) {
				secret = json.secret;
			} else {
				secretError = json.message || "Failed to load secret";
			}
		} catch (err: any) {
			secretError = err.message || "Failed to load secret";
		}
	}

	const filteredTracks = $derived(
		tracks.filter(
			(t) =>
				t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				t.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
				(t.album && t.album.toLowerCase().includes(searchQuery.toLowerCase()))
		)
	);

	function openCreateModal() {
		editingTrack = null;
		coverUrl = "";
		showModal = true;
	}

	function openEditModal(track: any) {
		editingTrack = track;
		coverUrl = track.coverUrl || "";
		showModal = true;
	}

	function copySecret() {
		if (secret === null) return;
		navigator.clipboard.writeText(secret);
		copiedSecret = true;
		setTimeout(() => (copiedSecret = false), 2000);
	}

	// Static snippet for the Lament app: no secret embedded, no listen_key URL param.
	const jsSnippet = `// 1. In Lament, keep your webhook secret in an env var / secure config (NOT exposed to clients).
const WEBHOOK_SECRET = 'SET_ME_IN_LAMENT_ENV';

// 2. When a track plays, send a lightweight signal to the portfolio:
function onSongPlay(song) {
  fetch('https://YOUR_PORTFOLIO_DOMAIN/api/music/now-playing', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      secret: WEBHOOK_SECRET,
      title: song.title,
      artist: song.artist
    })
  }).catch(() => {});
}`;

	function copySnippet() {
		navigator.clipboard.writeText(jsSnippet);
		copiedSnippet = true;
		setTimeout(() => (copiedSnippet = false), 2000);
	}

	async function triggerTestWebhook() {
		if (secret === null) return;
		testingWebhook = true;
		testResult = null;
		try {
			const res = await fetch("/api/music/now-playing", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					secret,
					title: "Test Track - Webhook Verification",
					artist: "Brian / Lament Streamer",
					album: "Portfolio Live Test",
					coverUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300",
					spotifyUrl: "https://open.spotify.com"
				})
			});
			const json = await res.json();
			testResult = json.message || "Webhook test executed!";
		} catch (err: any) {
			testResult = "Error: " + (err.message || "Failed to trigger webhook");
		} finally {
			testingWebhook = false;
		}
	}
</script>

<div class="space-y-6 max-w-7xl mx-auto">
	<!-- Reusable Page Header -->
	<PageHeader
		badgeLabel="Lament Music Webhook Sync"
		title="Music Tracker & Logs"
		description="Manage song metadata, sync from Lament DB/API, and test live play signals"
		icon={Radio}
	>
		<button
			onclick={() => (showSyncModal = true)}
			class="flex items-center gap-2 rounded-xl border border-[#2a2a2a] bg-[#181818] hover:bg-[#222222] px-3.5 py-2 text-xs font-semibold text-[#ededed] transition-all cursor-pointer active:scale-95"
		>
			<RefreshCw class="w-3.5 h-3.5 text-blue-400" />
			<span>Sync Metadata from Lament</span>
		</button>

		<button
			onclick={triggerTestWebhook}
			disabled={testingWebhook}
			class="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 px-3.5 py-2 text-xs font-mono font-semibold text-emerald-400 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
		>
			<Play class="w-3.5 h-3.5" />
			<span>{testingWebhook ? 'Testing...' : 'Test Play Signal'}</span>
		</button>

		<button
			onclick={openCreateModal}
			class="flex items-center gap-2 rounded-xl bg-red-500 hover:bg-red-600 px-4 py-2 text-xs font-semibold text-white shadow-lg transition-all cursor-pointer active:scale-95"
		>
			<Plus class="w-4 h-4" />
			<span>Add Track</span>
		</button>
	</PageHeader>

	{#if form?.message}
		<div class="rounded-xl border border-blue-500/30 bg-blue-500/10 p-3 text-xs font-mono text-blue-400 flex items-center justify-between">
			<span>ℹ {form.message}</span>
		</div>
	{/if}

	{#if testResult}
		<div class="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs font-mono text-emerald-400 flex items-center justify-between">
			<span>✅ {testResult}</span>
			<button onclick={() => (testResult = null)} class="text-emerald-400 hover:text-white">
				<X class="w-4 h-4" />
			</button>
		</div>
	{/if}

	<!-- Secret Key & Code Snippet Box for Lament App Integration -->
	<div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
		<div class="rounded-2xl border border-[#222222] bg-[#121212] p-5 space-y-3 shadow-xl">
			<div class="flex items-center justify-between">
				<div class="text-xs font-bold text-white font-['Space_Grotesk']">Webhook Secret Key</div>
				<span class="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">PRIVATE</span>
			</div>
			<p class="text-[11px] text-[#777777]">Used by Lament app to authenticate Brian's play signal. Only shown on demand.</p>

			{#if secret === null}
				<button
					onclick={loadSecret}
					class="w-full flex items-center justify-center gap-2 rounded-xl bg-[#181818] border border-[#262626] p-2.5 text-xs font-mono text-[#ededed] hover:bg-[#222222] hover:text-white transition-colors cursor-pointer"
				>
					<Eye class="w-3.5 h-3.5" />
					<span>Show Secret Key</span>
				</button>
			{:else}
				<div class="flex items-center gap-2 rounded-xl bg-[#181818] border border-[#262626] p-2 font-mono text-xs text-red-400 overflow-hidden">
					<span class="truncate flex-1">{secretVisible ? secret : '•'.repeat(12)}</span>
					<button
						onclick={() => (secretVisible = !secretVisible)}
						class="p-1.5 rounded-lg bg-[#222222] text-[#ededed] hover:text-white hover:bg-[#2a2a2a] transition-colors"
						title={secretVisible ? 'Hide Secret Key' : 'Show Secret Key'}
					>
						{#if secretVisible}
							<EyeOff class="w-3.5 h-3.5" />
						{:else}
							<Eye class="w-3.5 h-3.5" />
						{/if}
					</button>
					<button
						onclick={copySecret}
						class="p-1.5 rounded-lg bg-[#222222] text-[#ededed] hover:text-white hover:bg-[#2a2a2a] transition-colors"
						title="Copy Secret Key"
					>
						{#if copiedSecret}
							<Check class="w-3.5 h-3.5 text-emerald-400" />
						{:else}
							<Copy class="w-3.5 h-3.5" />
						{/if}
					</button>
				</div>
			{/if}

			{#if secretError}
				<p class="text-[11px] font-mono text-red-400">⚠ {secretError}</p>
			{/if}
		</div>

		<!-- JS Snippet Helper Box (2 Cols) -->
		<div class="lg:col-span-2 rounded-2xl border border-[#222222] bg-[#121212] p-5 space-y-3 shadow-xl">
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-2">
					<Sparkles class="w-4 h-4 text-emerald-400" />
					<span class="text-xs font-bold text-white font-['Space_Grotesk']">Lament JS Play Signal Snippet</span>
				</div>
				<button
					onclick={copySnippet}
					class="flex items-center gap-1.5 rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] px-2.5 py-1 text-[11px] font-mono text-[#ededed] hover:text-white hover:border-[#333333] transition-colors cursor-pointer"
				>
					{#if copiedSnippet}
						<Check class="w-3 h-3 text-emerald-400" />
						<span>Copied!</span>
					{:else}
						<Copy class="w-3 h-3" />
						<span>Copy JS Snippet</span>
					{/if}
				</button>
			</div>

			<pre class="rounded-xl bg-[#090909] p-3 text-[11px] font-mono text-[#888888] overflow-x-auto max-h-40 border border-[#1f1f1f]">{jsSnippet}</pre>
		</div>
	</div>

	<!-- Main Datatable Card -->
	<div class="rounded-2xl border border-[#222222] bg-[#121212] overflow-hidden shadow-xl">
		<div class="border-b border-[#222222] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
			<div class="relative w-full sm:w-72">
				<Search class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#666666]" />
				<input
					type="text"
					bind:value={searchQuery}
					placeholder="Search tracks by title, artist, album..."
					class="w-full rounded-xl bg-[#161616] border border-[#262626] pl-9 pr-3 py-1.5 text-xs text-[#ededed] placeholder-[#555555] focus:outline-none focus:border-red-500/50"
				/>
			</div>

			<div class="text-xs text-[#777777] font-mono">
				Showing {filteredTracks.length} of {tracks.length} tracks
			</div>
		</div>

		<div class="overflow-x-auto">
			<table class="w-full text-left text-xs text-[#ededed]">
				<thead class="bg-[#161616] text-[#777777] font-mono uppercase text-[10px]">
					<tr>
						<th class="px-4 py-3">Cover</th>
						<th class="px-4 py-3">Song Title</th>
						<th class="px-4 py-3">Artist</th>
						<th class="px-4 py-3">Album</th>
						<th class="px-4 py-3">Last Played At</th>
						<th class="px-4 py-3 text-right">Actions</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-[#1e1e1e]">
					{#each filteredTracks as track}
						<tr class="hover:bg-white/5 transition-colors">
							<td class="px-4 py-2.5">
								{#if track.coverUrl}
									<img src={track.coverUrl} alt={track.title} class="w-8 h-8 rounded-lg object-cover border border-[#262626]" />
								{:else}
									<div class="w-8 h-8 rounded-lg bg-[#222222] flex items-center justify-center text-xs text-[#666666]">
										🎵
									</div>
								{/if}
							</td>
							<td class="px-4 py-2.5 font-bold text-white font-['Space_Grotesk']">
								{track.title}
								{#if track.spotifyUrl}
									<a href={track.spotifyUrl} target="_blank" class="inline-block ml-1 text-emerald-400 hover:text-emerald-300">
										<ExternalLink class="w-3 h-3 inline" />
									</a>
								{/if}
							</td>
							<td class="px-4 py-2.5 text-[#a1a1a1] font-medium">{track.artist}</td>
							<td class="px-4 py-2.5 text-[#777777]">{track.album || '-'}</td>
							<td class="px-4 py-2.5 font-mono text-[11px] text-emerald-400">
								{track.playedAt ? formatDateShort(track.playedAt) : 'Recently'}
							</td>
							<td class="px-4 py-2.5 text-right space-x-1">
								<button
									onclick={() => openEditModal(track)}
									class="p-1.5 rounded-lg border border-[#2a2a2a] bg-[#181818] text-[#a1a1a1] hover:text-white hover:border-[#333333] transition-colors cursor-pointer"
									title="Edit Track"
								>
									<Edit class="w-3.5 h-3.5" />
								</button>
								<form method="POST" action="?/deleteTrack" use:enhance class="inline">
									<input type="hidden" name="id" value={track.id} />
									<button
										type="submit"
										class="p-1.5 rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors cursor-pointer"
										title="Delete Track"
										onclick={(e) => {
											if (!confirm(`Delete "${track.title}"?`)) e.preventDefault();
										}}
									>
										<Trash2 class="w-3.5 h-3.5" />
									</button>
								</form>
							</td>
						</tr>
					{:else}
						<tr>
							<td colspan="6" class="px-4 py-8 text-center text-[#666666]">
								No tracks found. Click "Add Track", "Sync Metadata", or test a play signal.
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>

<!-- Reusable Form Modal: Add/Edit Track -->
<FormModal
	bind:open={showModal}
	title={editingTrack ? 'Edit Music Track' : 'Add New Music Track'}
	actionUrl={editingTrack ? '?/updateTrack' : '?/createTrack'}
	isEditing={!!editingTrack}
	maxWidth="max-w-md"
>
	{#if editingTrack}
		<input type="hidden" name="id" value={editingTrack.id} />
	{/if}

	<FormInput id="track-title" name="title" label="Song Title" required={true} value={editingTrack?.title || ''} placeholder="e.g. Starboy" />
	<FormInput id="track-artist" name="artist" label="Artist Name" required={true} value={editingTrack?.artist || ''} placeholder="e.g. The Weeknd" />
	<FormInput id="track-album" name="album" label="Album (Optional)" value={editingTrack?.album || ''} placeholder="e.g. Starboy Album" />
	<input type="hidden" name="coverUrl" value={coverUrl} />

	<!-- Dedicated Music Cover Uploader (WebP R2) -->
	<HeroCoverUploader bind:coverUrl articleSlug="music" />
	<FormInput id="track-spotify" name="spotifyUrl" type="url" label="Spotify Link (Optional)" value={editingTrack?.spotifyUrl || ''} placeholder="https://open.spotify.com/track/..." />
</FormModal>

<!-- Reusable Form Modal: Sync Lament Metadata -->
<FormModal
	bind:open={showSyncModal}
	title="Sync / Import Metadata from Lament DB"
	actionUrl="?/syncLamentMetadata"
	submitLabel="Sync Tracks Now"
	maxWidth="max-w-lg"
>
	<p class="text-[#777777] text-xs">
		Pull and seed song metadata (Title, Artist, Album, Cover URL, Spotify URL) from your Lament Music Streaming app into this portfolio database!
	</p>

	<FormInput
		id="lament-api-url"
		name="apiUrl"
		type="url"
		label="Option A: Lament REST API Endpoint URL"
		mono={true}
		placeholder="https://lament-music.app/api/tracks"
	/>

	<div class="text-center font-mono text-[10px] text-[#555555] font-bold uppercase">— OR —</div>

	<FormTextarea
		id="lament-json"
		name="metadataJson"
		label="Option B: Paste Song Metadata JSON Array"
		rows={5}
		placeholder={`[
  { "title": "Starboy", "artist": "The Weeknd", "album": "Starboy", "coverUrl": "https://..." }
]`}
	/>
</FormModal>
