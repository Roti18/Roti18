<script lang="ts">
	import { page } from "$app/state";
	import { goto } from "$app/navigation";
	import { onDestroy } from "svelte";
	import { browser } from "$app/environment";
	import SEO from "$lib/components/public/SEO.svelte";

	import AuthModal from "$lib/components/AuthModal.svelte";
	import { Lock, LogIn } from "lucide-svelte";

	const { data } = $props();

	const user = $derived(data.user);
	const hasAccess = $derived(user ? user.isTrunojoyo || user.isAdmin : false);

	let overlayClosed = $state(false);
	const showModal = $derived(!hasAccess && !overlayClosed);

	// Parse open nodes from URL query
	const openParam = $derived(page.url.searchParams.get("open") || "");
	let openNodes = $state<Set<string>>(new Set());

	$effect(() => {
		if (openParam) {
			openNodes = new Set(openParam.split(",").filter(Boolean));
		}
	});

	let containerEl: HTMLElement;
	let ctx: any = null;

	onDestroy(() => {
		if (ctx) ctx.revert();
	});

	function toggleNode(slug: string, nodeEl?: HTMLElement) {
		const newSet = new Set(openNodes);
		const willOpen = !newSet.has(slug);

		if (willOpen) {
			newSet.add(slug);
		} else {
			newSet.delete(slug);
		}
		openNodes = newSet;

		// GSAP context dropdown animation
		if (browser && nodeEl) {
			import("gsap").then(({ gsap }) => {
				if (ctx) ctx.revert();
				ctx = gsap.context(() => {
					const childrenEl = nodeEl.querySelector(
						".tree-children",
					) as HTMLElement;
					const chevronEl = nodeEl.querySelector(
						".tree-chevron",
					) as HTMLElement;

					if (chevronEl) {
						gsap.to(chevronEl, {
							rotate: willOpen ? 90 : 0,
							duration: 0.2,
							ease: "power2.out",
						});
					}

					if (childrenEl) {
						if (willOpen) {
							gsap.fromTo(
								childrenEl,
								{ height: 0, opacity: 0, overflow: "hidden" },
								{
									height: "auto",
									opacity: 1,
									duration: 0.3,
									ease: "power2.out",
								},
							);
						}
					}
				}, nodeEl);
			});
		}

		// Sync to URL
		const params = new URLSearchParams(page.url.searchParams);
		if (newSet.size > 0) {
			params.set("open", Array.from(newSet).join(","));
		} else {
			params.delete("open");
		}
		goto(`?${params.toString()}`, {
			replaceState: true,
			noScroll: true,
			keepFocus: true,
		});
	}

	function isOpen(slug: string): boolean {
		return openNodes.has(slug);
	}
</script>

<SEO
	title="Academics - M. Roni"
	description="Academic resources archive - semesters, courses, and materials."
/>

<div class="relative min-h-[70vh]">
	<div
		class="max-w-5xl mx-auto px-6 py-12 space-y-8 transition-all duration-500 {hasAccess
			? ''
			: 'filter blur-md pointer-events-none select-none opacity-40'}"
		bind:this={containerEl}
	>
		<div class="flex flex-col gap-2" id="academic-tree">
			{#each data.semesters as semester}
				{@const semesterOpen = isOpen(semester.slug)}
				<div
					class="blur-fade-in flex flex-col text-base"
					id="semester-wrapper-{semester.slug}"
				>
					<button
						class="flex items-center gap-3 px-3 -mx-3 py-2.5 rounded-xl text-[#ededed] hover:bg-[#141414] transition-colors text-left w-full cursor-pointer font-medium"
						onclick={(e) =>
							toggleNode(
								semester.slug,
								e.currentTarget.parentElement as HTMLElement,
							)}
						id="semester-{semester.slug}"
					>
						<span
							class="tree-chevron text-xs text-[#666666] transition-transform duration-200 w-3 text-center inline-block {semesterOpen
								? 'rotate-90'
								: ''}"
						>
							›
						</span>
						<span>{semester.title}</span>
					</button>

					{#if semesterOpen}
						<div
							class="tree-children pl-6 flex flex-col gap-1.5 my-1"
						>
							{#each semester.courses as course}
								{@const courseOpen = isOpen(course.slug)}
								<div
									class="flex flex-col"
									id="course-wrapper-{course.slug}"
								>
									<button
										class="flex items-center gap-3 px-3 -mx-3 py-2 rounded-xl text-[#ededed] hover:bg-[#141414] transition-colors text-left w-full cursor-pointer"
										onclick={(e) =>
											toggleNode(
												course.slug,
												e.currentTarget
													.parentElement as HTMLElement,
											)}
										id="course-{course.slug}"
									>
										<span
											class="tree-chevron text-xs text-[#666666] transition-transform duration-200 w-3 text-center inline-block {courseOpen
												? 'rotate-90'
												: ''}"
										>
											›
										</span>
										<span
											class="text-base font-normal text-[#ededed]"
											>{course.title}</span
										>
										<span class="text-xs text-[#666666]"
											>{course.dosenName}</span
										>
									</button>

									{#if courseOpen}
										<div
											class="tree-children pl-6 flex flex-col gap-1.5 my-1"
										>
											{#each ["materi", "tugas", "praktikum"] as type}
												{@const typeMaterials =
													course.materials.filter(
														(m) => m.type === type,
													)}
												{#if typeMaterials.length > 0}
													{@const subKey = `${course.slug}-${type}`}
													{@const subOpen =
														isOpen(subKey)}
													<div
														class="flex flex-col"
														id="sub-wrapper-{subKey}"
													>
														<button
															class="flex items-center gap-2.5 px-3 -mx-3 py-1.5 rounded-xl text-[#a1a1a1] hover:text-[#ededed] hover:bg-[#141414] transition-colors text-left w-full cursor-pointer"
															onclick={(e) =>
																toggleNode(
																	subKey,
																	e
																		.currentTarget
																		.parentElement as HTMLElement,
																)}
														>
															<span
																class="tree-chevron text-xs text-[#666666] transition-transform duration-200 w-3 text-center inline-block {subOpen
																	? 'rotate-90'
																	: ''}"
															>
																›
															</span>
															<span
																class="text-xs font-semibold uppercase tracking-wider text-[#888888]"
																>{type}</span
															>
														</button>

														{#if subOpen}
															<div
																class="tree-children pl-6 flex flex-col gap-1 my-1"
															>
																{#each typeMaterials as material}
																	<a
																		href="/academics/{material.fullSlug}"
																		class="flex items-center gap-3 px-3 -mx-3 py-1.5 rounded-xl hover:bg-[#141414] text-base hover:no-underline group transition-colors"
																		id="material-{material.slug}"
																	>
																		<span
																			class="text-[#ededed] group-hover:underline underline-offset-4 font-normal"
																		>
																			{material.title}
																		</span>
																	</a>
																{/each}
															</div>
														{/if}
													</div>
												{/if}
											{/each}
										</div>
									{/if}
								</div>
							{/each}
						</div>
					{/if}
				</div>
			{/each}
		</div>
	</div>

	{#if !hasAccess}
		{#if overlayClosed}
			<!-- Center Typography Locked Alert Banner -->
			<div
				class="absolute inset-0 z-30 flex flex-col items-center justify-center p-6 text-center bg-black/40 backdrop-blur-[2px]"
			>
				<div
					class="max-w-md w-full space-y-4 rounded-2xl p-8 shadow-2xl backdrop-blur-xl bg-[#111111]/80 border border-[#222222]"
				>
					<div
						class="inline-flex items-center gap-2 rounded-full bg-red-500/10 px-3 py-1 text-[11px] font-semibold text-red-400 border border-red-500/20 uppercase tracking-wider"
					>
						<Lock class="w-3.5 h-3.5" />
						<span>Student Access Only</span>
					</div>
					<h2
						class="text-2xl font-bold tracking-tight text-[#ededed] font-['Space_Grotesk']"
					>
						Academics Archive Locked
					</h2>
					<p class="text-xs text-[#a1a1a1] leading-relaxed">
						Course materials, assignments, and lab resources are
						exclusively restricted to Trunojoyo University student
						accounts (<span
							class="text-red-400 font-mono font-medium"
							>@student.trunojoyo.ac.id</span
						>).
					</p>
					<button
						onclick={() => (overlayClosed = false)}
						class="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-2.5 text-xs font-semibold text-black transition-all hover:bg-neutral-200 cursor-pointer active:scale-95 shadow-md"
					>
						<LogIn class="w-4 h-4" />
						<span>Unlock Access / Sign In</span>
					</button>
				</div>
			</div>
		{/if}
	{/if}
</div>

{#if !hasAccess && showModal}
	<AuthModal
		open={true}
		requireTrunojoyo={true}
		onClose={() => (overlayClosed = true)}
	/>
{/if}
