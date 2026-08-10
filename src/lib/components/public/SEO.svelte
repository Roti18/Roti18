<script lang="ts">
	import { page } from '$app/state';
	import { env } from '$env/dynamic/public';

	interface Props {
		title: string;
		description: string;
		image?: string;
		type?: 'website' | 'article';
		article?: {
			publishedTime: string;
			modifiedTime?: string;
			author?: string;
		};
	}

	const BASE_URL = env.PUBLIC_BASE_URL || page.url.origin;

	let {
		title,
		description,
		image = `${BASE_URL}/favicon-512.png`, // Default fallback image
		type = 'website',
		article
	}: Props = $props();

	// Calculate absolute URL for the current page
	let url = $derived(`${BASE_URL}${page.url.pathname}`);
	
	// Ensure image is absolute URL
	let absoluteImage = $derived(
		image.startsWith('http') ? image : `${BASE_URL}${image}`
	);
</script>

<svelte:head>
	<!-- Standard SEO -->
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={url} />

	<!-- Open Graph / Facebook / WhatsApp -->
	<meta property="og:type" content={type} />
	<meta property="og:url" content={url} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={absoluteImage} />

	<!-- Twitter / X -->
	<!-- Use summary_large_image if image is not the default icon -->
	<meta name="twitter:card" content={image === `${BASE_URL}/favicon-512.png` ? 'summary' : 'summary_large_image'} />
	<meta name="twitter:url" content={url} />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={absoluteImage} />

	<!-- Article Specific -->
	{#if type === 'article' && article}
		<meta property="article:published_time" content={article.publishedTime} />
		{#if article.modifiedTime}
			<meta property="article:modified_time" content={article.modifiedTime} />
		{/if}
		{#if article.author}
			<meta property="article:author" content={article.author} />
		{/if}
	{/if}
</svelte:head>
