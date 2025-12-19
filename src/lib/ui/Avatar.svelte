<script lang="ts">
	export let src: string | null = null;
	export let name = '';

	const imageSrc =
		src || 'https://zt2fm2rzmiug0mtb.public.blob.vercel-storage.com/avatars/default/default.webp';
</script>

<div class="flex h-10 w-full items-center justify-center overflow-hidden rounded-full bg-white/10">
	<img src={imageSrc} alt={name} class="h-full w-full object-cover" />
</div>
