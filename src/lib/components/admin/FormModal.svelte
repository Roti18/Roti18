<script lang="ts">
	import { enhance } from "$app/forms";
	import { X } from "lucide-svelte";

	let { open = $bindable(false), title, actionUrl, isEditing = false, submitLabel = "", maxWidth = "max-w-xl", children } = $props();
</script>

{#if open}
	<!-- Backdrop -->
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4" onclick={() => (open = false)}>
		<div class="relative w-full {maxWidth} max-h-[90vh] overflow-y-auto rounded-2xl border border-[#222222] bg-[#121212] p-6 shadow-2xl space-y-4 text-xs" onclick={(e) => e.stopPropagation()}>
			<div class="flex items-center justify-between border-b border-[#222222] pb-3">
				<h2 class="text-base font-bold text-white font-['Space_Grotesk']">{title}</h2>
				<button type="button" onclick={() => (open = false)} class="text-[#666666] hover:text-white transition-colors cursor-pointer">
					<X class="w-4 h-4" />
				</button>
			</div>

			<form method="POST" action={actionUrl} use:enhance={() => {
				open = false;
				return async ({ update }) => update();
			}} class="space-y-3.5">
				{@render children()}

				<div class="pt-3 flex items-center justify-end gap-2 border-t border-[#222222]">
					<button type="button" onclick={() => (open = false)} class="rounded-xl border border-[#262626] bg-[#161616] px-4 py-2 text-xs font-semibold text-[#a1a1a1] hover:text-white transition-colors cursor-pointer">
						Cancel
					</button>
					<button type="submit" class="rounded-xl bg-red-500 hover:bg-red-600 px-4 py-2 text-xs font-semibold text-white transition-colors cursor-pointer shadow-lg active:scale-95">
						{submitLabel || (isEditing ? 'Save Changes' : 'Create Entry')}
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}
