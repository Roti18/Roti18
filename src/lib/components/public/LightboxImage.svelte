<script lang="ts">
	import { onMount } from "svelte";
	import PhotoSwipeLightbox from "photoswipe/lightbox";
	import "photoswipe/style.css";

	let { containerId = "article-body" } = $props();

	onMount(() => {
		const container = document.getElementById(containerId);
		if (!container) return;

		const lightbox = new PhotoSwipeLightbox({
			gallery: `#${containerId}`,
			children: "img[data-pswp-src]",
			pswpModule: () => import("photoswipe")
		});

		lightbox.init();

		return () => {
			lightbox.destroy();
		};
	});
</script>
