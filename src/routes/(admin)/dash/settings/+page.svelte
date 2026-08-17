<script lang="ts">
	import { enhance } from "$app/forms";
	import { Settings, ShieldCheck, Database, Radio, Wrench, Check, AlertTriangle } from "lucide-svelte";

	let { data, form } = $props();
	const user = $derived(data.user);
	const adminEmails = $derived(data.adminEmails);
	const maintenanceMode = $derived(data.maintenanceMode);
</script>

<div class="space-y-6 max-w-7xl mx-auto">
	<div>
		<div class="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 px-3 py-1 text-[10px] font-mono font-semibold text-red-400 border border-red-500/20 uppercase tracking-widest mb-1">
			<Settings class="w-3 h-3" />
			<span>System Settings</span>
		</div>
		<h1 class="text-2xl font-bold text-white font-['Space_Grotesk']">Admin System & Security</h1>
		<p class="text-xs text-[#888888]">Overview of maintenance mode, environment variables, and security configuration</p>
	</div>

	{#if form?.success}
		<div class="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs font-mono text-emerald-400 flex items-center gap-2">
			<Check class="w-4 h-4" />
			<span>{form.message}</span>
		</div>
	{/if}

	<!-- Maintenance Mode Control Panel -->
	<div class="rounded-2xl border border-[#222222] bg-[#121212] p-6 space-y-4 shadow-xl">
		<div class="flex items-center justify-between">
			<div class="flex items-center gap-3">
				<div class="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
					<Wrench class="w-5 h-5" />
				</div>
				<div>
					<h2 class="text-base font-bold text-white font-['Space_Grotesk']">Public Maintenance Mode</h2>
					<p class="text-xs text-[#777777]">When enabled, public site visitors see a maintenance page while Admins retain full access</p>
				</div>
			</div>

			<form method="POST" action="?/toggleMaintenanceMode" use:enhance>
				<input type="hidden" name="currentMode" value={maintenanceMode ? 'true' : 'false'} />
				<button
					type="submit"
					class="px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer border flex items-center gap-2 shadow-lg active:scale-95 {maintenanceMode ? 'bg-amber-500 text-black border-amber-400' : 'bg-[#181818] text-[#888888] border-[#2a2a2a] hover:text-white'}"
				>
					<span class="h-2 w-2 rounded-full {maintenanceMode ? 'bg-black animate-pulse' : 'bg-[#555555]'}"></span>
					<span>{maintenanceMode ? 'MAINTENANCE ACTIVE' : 'SYSTEM ONLINE'}</span>
				</button>
			</form>
		</div>
	</div>

	<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
		<!-- Card 1: Admin Authorization -->
		<div class="rounded-2xl border border-[#222222] bg-[#121212] p-6 space-y-4 shadow-xl">
			<div class="flex items-center gap-2 text-white font-bold font-['Space_Grotesk']">
				<ShieldCheck class="w-5 h-5 text-red-400" />
				<span>Admin Access Control</span>
			</div>
			<p class="text-xs text-[#777777]">Emails configured in ADMIN_EMAILS environment variable with access to /dash</p>

			<div class="space-y-2 pt-2">
				{#each adminEmails as email}
					<div class="flex items-center justify-between rounded-xl bg-[#161616] p-3 border border-[#262626] font-mono text-xs text-[#ededed]">
						<span>{email}</span>
						<span class="text-[10px] bg-red-500/10 text-red-400 px-2 py-0.5 rounded border border-red-500/20 font-bold uppercase">
							ADMIN AUTHORIZED
						</span>
					</div>
				{/each}
			</div>
		</div>

		<!-- Card 2: Database & System Status -->
		<div class="rounded-2xl border border-[#222222] bg-[#121212] p-6 space-y-4 shadow-xl">
			<div class="flex items-center gap-2 text-white font-bold font-['Space_Grotesk']">
				<Database class="w-5 h-5 text-emerald-400" />
				<span>Database Connection Health</span>
			</div>
			<p class="text-xs text-[#777777]">Production database connection and status</p>

			<div class="space-y-2 pt-2 text-xs font-mono">
				<div class="flex items-center justify-between rounded-xl bg-[#161616] p-3 border border-[#262626]">
					<span class="text-[#888888]">Database Provider</span>
					<span class="text-white font-bold">SQL Database / Drizzle ORM</span>
				</div>

				<div class="flex items-center justify-between rounded-xl bg-[#161616] p-3 border border-[#262626]">
					<span class="text-[#888888]">Webhook Integration</span>
					<span class="text-emerald-400 font-bold">ACTIVE (/api/music/now-playing)</span>
				</div>

				<div class="flex items-center justify-between rounded-xl bg-[#161616] p-3 border border-[#262626]">
					<span class="text-[#888888]">Auth Provider</span>
					<span class="text-white font-bold">Better Auth (Google OAuth)</span>
				</div>
			</div>
		</div>
	</div>
</div>
