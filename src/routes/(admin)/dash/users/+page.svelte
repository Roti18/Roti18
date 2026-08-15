<script lang="ts">
	import { formatDateShort, formatDate } from "$lib/utils/format";
	import { Users, Activity, ShieldCheck, Mail, Calendar, Clock, MonitorSmartphone, Key } from "lucide-svelte";
	import { slide } from "svelte/transition";

	let { data } = $props();
	const users = $derived(data.users);

	let expandedUser = $state<string | null>(null);

	function toggleExpand(userId: string) {
		expandedUser = expandedUser === userId ? null : userId;
	}
</script>

<div class="space-y-6 max-w-7xl mx-auto">
	<!-- Header -->
	<div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
		<div class="space-y-1">
			<div class="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 px-3 py-1 text-[10px] font-mono font-semibold text-rose-400 border border-rose-500/20 uppercase tracking-widest">
				<ShieldCheck class="w-3 h-3" />
				<span>Access Monitor</span>
			</div>
			<h1 class="text-2xl md:text-3xl font-bold tracking-tight text-white font-['Space_Grotesk']">
				User Logins & Sessions
			</h1>
			<p class="text-xs md:text-sm text-[#888888]">
				Monitor active sessions and see who has logged into the system via Google Auth.
			</p>
		</div>
	</div>

	<!-- Stats Summary -->
	<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
		<div class="rounded-2xl border border-[#222222] bg-[#121212] p-5 flex items-center gap-4">
			<div class="p-3 rounded-xl bg-blue-500/10 text-blue-400">
				<Users class="w-6 h-6" />
			</div>
			<div>
				<div class="text-xs text-[#888888] font-mono uppercase tracking-wider">Total Users</div>
				<div class="text-2xl font-bold text-white font-['Space_Grotesk']">{users.length}</div>
			</div>
		</div>
		<div class="rounded-2xl border border-[#222222] bg-[#121212] p-5 flex items-center gap-4">
			<div class="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
				<Activity class="w-6 h-6" />
			</div>
			<div>
				<div class="text-xs text-[#888888] font-mono uppercase tracking-wider">Active Sessions</div>
				<div class="text-2xl font-bold text-white font-['Space_Grotesk']">
					{users.reduce((acc, user) => acc + user.sessions.length, 0)}
				</div>
			</div>
		</div>
	</div>

	<!-- Users List -->
	<div class="rounded-2xl border border-[#222222] bg-[#121212] overflow-hidden shadow-xl">
		<div class="border-b border-[#222222] p-4 flex items-center gap-2">
			<Key class="w-4 h-4 text-rose-400" />
			<h2 class="text-sm font-bold text-white font-['Space_Grotesk']">Registered Accounts</h2>
		</div>

		<div class="divide-y divide-[#1e1e1e]">
			{#each users as user}
				{@const activeSessionCount = user.sessions.length}
				<div class="flex flex-col">
					<!-- User Row Header -->
					<!-- svelte-ignore a11y_click_events_have_key_events -->
					<!-- svelte-ignore a11y_no_static_element_interactions -->
					<div 
						class="flex items-center justify-between p-4 hover:bg-white/5 transition-colors cursor-pointer"
						onclick={() => toggleExpand(user.id)}
					>
						<div class="flex items-center gap-4">
							{#if user.image}
								<img src={user.image} alt={user.name} class="w-10 h-10 rounded-full object-cover border border-[#333333]" />
							{:else}
								<div class="w-10 h-10 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center text-sm font-bold border border-rose-500/30">
									{user.name ? user.name[0].toUpperCase() : 'U'}
								</div>
							{/if}
							
							<div>
								<div class="font-bold text-white text-sm flex items-center gap-2">
									{user.name}
									{#if activeSessionCount > 0}
										<span class="px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[9px] font-mono border border-emerald-500/20 uppercase">
											Online
										</span>
									{:else}
										<span class="px-1.5 py-0.5 rounded-full bg-[#333333] text-[#888888] text-[9px] font-mono border border-[#444444] uppercase">
											Offline
										</span>
									{/if}
								</div>
								<div class="text-xs text-[#a1a1a1] flex items-center gap-1.5 mt-0.5">
									<Mail class="w-3 h-3 text-[#666666]" />
									{user.email}
								</div>
							</div>
						</div>

						<div class="text-right hidden sm:block">
							<div class="text-xs text-[#a1a1a1] flex items-center justify-end gap-1.5 mb-0.5">
								<Clock class="w-3 h-3 text-[#666666]" />
								Last Active: <span class="text-white font-mono">{formatDateShort(user.lastActive)}</span>
							</div>
							<div class="text-[10px] text-[#666666] font-mono">
								Joined {formatDate(user.createdAt)}
							</div>
						</div>
					</div>

					<!-- Expanded Session Details -->
					{#if expandedUser === user.id}
						<div class="bg-[#0a0a0a] border-t border-[#1e1e1e] p-4 px-4 sm:px-8" transition:slide={{ duration: 200 }}>
							<h3 class="text-xs font-semibold text-[#888888] uppercase tracking-wider mb-3 flex items-center gap-2">
								<MonitorSmartphone class="w-3 h-3" />
								Active Sessions ({user.sessions.length})
							</h3>
							
							{#if user.sessions.length > 0}
								<div class="space-y-3">
									{#each user.sessions as session}
										<div class="rounded-xl border border-[#222222] bg-[#141414] p-3 text-xs flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
											<div class="space-y-1">
												<div class="text-white font-mono font-medium break-all">
													{session.userAgent || 'Unknown Device'}
												</div>
												<div class="text-[#666666] font-mono flex items-center gap-2">
													<span>IP: {session.ipAddress || 'Unknown'}</span>
													<span>•</span>
													<span>Expires: {formatDateShort(session.expiresAt)}</span>
												</div>
											</div>
											<div class="shrink-0 text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/20 font-mono">
												Valid Session
											</div>
										</div>
									{/each}
								</div>
							{:else}
								<div class="rounded-xl border border-dashed border-[#333333] bg-[#141414] p-4 text-center text-xs text-[#666666]">
									No active sessions found for this user.
								</div>
							{/if}
						</div>
					{/if}
				</div>
			{:else}
				<div class="p-8 text-center text-sm text-[#666666]">
					No users found in the database.
				</div>
			{/each}
		</div>
	</div>
</div>
