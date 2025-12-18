<script lang="ts">
	import { goto } from '$app/navigation';
	import CrudHeader from '$lib/ui/CrudHeader.svelte';
	import EmptyState from '$lib/ui/EmptyState.svelte';

	import Table from '$lib/ui/Table.svelte';
	import TableHead from '$lib/ui/TableHead.svelte';
	import TableBody from '$lib/ui/TableBody.svelte';
	import TableRow from '$lib/ui/TableRow.svelte';
	import TableCell from '$lib/ui/TableCell.svelte';
	import TableHeaderCell from '$lib/ui/TableHeaderCell.svelte';
	import CrudActions from '$lib/ui/CrudActions.svelte';
	import { openAlert } from '$lib/stores/alert';

	export let data;
	let profiless = data.profiles;
</script>

<div class="w-full space-y-6 overflow-x-hidden">
	<CrudHeader hint="Manage profile" />

	{#if profiless.length > 0}
		<!-- ================= DESKTOP TABLE ================= -->
		<div class="hidden md:block">
			<Table>
				<TableHead>
					<TableRow>
						<TableHeaderCell align="center">Title</TableHeaderCell>
						<TableHeaderCell align="center">Left Content</TableHeaderCell>
						<TableHeaderCell align="center">Right Content</TableHeaderCell>
						<TableHeaderCell align="center">Actions</TableHeaderCell>
					</TableRow>
				</TableHead>

				<TableBody>
					{#each profiless as profile}
						<TableRow>
							<TableCell align="center">{profile.title}</TableCell>
							<TableCell align="center">{profile.leftText}</TableCell>
							<TableCell align="center">{profile.rightText}</TableCell>
							<TableCell align="center">
								<CrudActions
									onEdit={() => goto(`/dashboard/profile/${profile.id}/edit`)}
									onDelete={() =>
										openAlert({
											type: 'error',
											title: 'Denied',
											message: "Can't delete profile"
										})}
								/>
							</TableCell>
						</TableRow>
					{/each}
				</TableBody>
			</Table>
		</div>

		<!-- ================= MOBILE CARDS ================= -->
		<div class="grid gap-4 md:hidden">
			{#each profiless as profile}
				<div class="space-y-3 rounded-xl bg-white/5 p-4">
					<div class="space-y-1">
						<p class="text-xs text-white/40">Title</p>
						<p class="text-sm font-medium text-white">
							{profile.title}
						</p>
					</div>

					<div class="space-y-1">
						<p class="text-xs text-white/40">Left Content</p>
						<p class="wrap-break-words text-sm text-white/80">
							{profile.leftText}
						</p>
					</div>

					<div class="space-y-1">
						<p class="text-xs text-white/40">Right Content</p>
						<p class="wrap-break-words text-sm text-white/80">
							{profile.rightText}
						</p>
					</div>

					<div class="pt-2">
						<CrudActions
							onEdit={() => goto(`/dashboard/profile/${profile.id}/edit`)}
							onDelete={() =>
								openAlert({
									type: 'error',
									title: 'Denied',
									message: "Can't delete profile"
								})}
						/>
					</div>
				</div>
			{/each}
		</div>
	{:else}
		<EmptyState title="No profiles found" description="Try again later" />
	{/if}
</div>
