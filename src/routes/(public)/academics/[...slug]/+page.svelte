<script lang="ts">
	import { formatDate } from '$lib/utils/format';
	import { FileText, ArrowLeft } from 'lucide-svelte';
	import MarkdownContent from '$lib/components/public/MarkdownContent.svelte';

	import AuthModal from '$lib/components/AuthModal.svelte';
	import { Lock, LogIn } from 'lucide-svelte';

	const { data } = $props();

	const user = $derived(data.user);
	const hasAccess = $derived(user ? (user.isTrunojoyo || user.isAdmin) : false);

	let overlayClosed = $state(false);
	const showModal = $derived(!hasAccess && !overlayClosed);
</script>

<svelte:head>
	<title>{data.material.title} - Academics - M. Roni</title>
	<meta name="description" content="{data.material.title} - {data.course.title}" />
</svelte:head>

<div class="relative min-h-[70vh]">
	<div class="max-w-5xl mx-auto px-6 py-12 space-y-12 transition-all duration-500 {hasAccess ? '' : 'filter blur-md pointer-events-none select-none opacity-40'}">
	<!-- Breadcrumb Navigation with Red Accent Slashes -->
	<nav
		class="blur-fade-in flex items-center gap-2 text-xs text-[#a1a1a1] flex-wrap"
		aria-label="Breadcrumb"
		id="academic-breadcrumb"
	>
		<a
			href="/academics"
			class="hover:text-red-400 hover:no-underline transition-colors"
			>Academics</a
		>
		{#each data.breadcrumb as crumb}
			<span class="text-red-500/80 font-medium">/</span>
			<a
				href={crumb.href}
				class="hover:text-[#ededed] hover:no-underline transition-colors"
				>{crumb.label}</a
			>
		{/each}
	</nav>

	<article class="blur-fade-in space-y-8">
		<!-- Header Matching Writing Detail Page -->
		<header class="space-y-4 mb-10 pb-6 border-b border-[#1f1f1f]">
			<div class="flex items-center gap-3">
				<span
					class="select-none text-xs font-medium uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-red-900/60 bg-red-950/40 text-red-400"
				>
					{data.material.type}
				</span>
				<time
					class="text-xs text-[#a1a1a1]"
					datetime={data.material.createdAt.toISOString()}
				>
					{formatDate(data.material.createdAt)}
				</time>
			</div>

			<h1
				class="text-3xl font-semibold text-[#ededed] leading-tight tracking-tight"
			>
				{data.material.title}
			</h1>

			{#if data.material.type === "praktikum" && data.course.asprakName}
				<p
					class="text-xs text-[#a1a1a1] p-3 rounded-xl bg-[#141414] border-l-2 border-red-500/80 mt-2"
				>
					Diampu oleh: <strong class="text-[#ededed] font-medium"
						>{data.course.asprakName}</strong
					>
				</p>
			{/if}
		</header>

		<!-- Content Matching Writing Detail Page Prose (Full Container Width Lines) -->
		<div class="prose-p:max-w-[70ch] prose-headings:max-w-[70ch] prose-hr:border-[#1f1f1f] prose-hr:my-8 text-base leading-relaxed text-[#ededed]">
			<MarkdownContent html={data.material.contentHtml} containerId="academic-content" />
		</div>

		<!-- Attachments Section -->
		{#if data.material.attachments && data.material.attachments.length > 0}
			<div class="pt-8 border-t border-[#1f1f1f] space-y-4">
				<h3
					class="text-xs font-semibold text-[#888888] uppercase tracking-wider flex items-center gap-2"
				>
					<span class="w-1.5 h-1.5 rounded-full bg-red-500"></span>
					<span>Attachments</span>
				</h3>
				<div class="flex flex-col gap-2">
					{#each data.material.attachments as file}
						<a
							href={file.url}
							class="inline-flex items-center gap-2 text-sm text-[#ededed] hover:text-red-400 hover:no-underline py-1 transition-colors w-fit"
							target="_blank"
							rel="noopener noreferrer"
						>
							<FileText size={14} class="text-red-400" />
							<span>{file.name}</span>
						</a>
					{/each}
				</div>
			</div>
		{/if}
	</article>

	<!-- Footer Navigation Matching Writing Detail -->
	<div class="blur-fade-in pt-6 border-t border-[#1f1f1f]">
		<a
			href="/academics"
			class="inline-flex items-center gap-2 text-sm text-[#a1a1a1] hover:text-white transition-colors hover:no-underline group w-fit"
		>
			<ArrowLeft size={14} class="transition-transform group-hover:-translate-x-1" />
			<span>Back to Academics</span>
		</a>
	</div>
</div>
</div>

{#if !hasAccess}
	{#if overlayClosed}
		<!-- Center Typography Locked Alert Banner -->
		<div class="absolute inset-0 z-30 flex flex-col items-center justify-center p-6 text-center">
			<div class="max-w-md w-full space-y-4 rounded-2xl border border-red-500/20 bg-[#121212]/90 p-8 shadow-2xl backdrop-blur-xl">
				<div class="inline-flex items-center gap-2 rounded-full bg-red-500/10 px-3 py-1 text-[11px] font-semibold text-red-400 border border-red-500/20 uppercase tracking-wider">
					<Lock class="w-3.5 h-3.5" />
					<span>Student Access Only</span>
				</div>
				<h2 class="text-2xl font-bold tracking-tight text-[#ededed] font-['Space_Grotesk']">
					Material Locked
				</h2>
				<p class="text-xs text-[#a1a1a1] leading-relaxed">
					This material is exclusively restricted to Trunojoyo University student accounts (<span class="text-red-400 font-mono font-medium">@trunojoyo.ac.id</span>).
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

	{#if showModal}
		<AuthModal
			open={true}
			requireTrunojoyo={true}
			onClose={() => (overlayClosed = true)}
		/>
	{/if}
{/if}
