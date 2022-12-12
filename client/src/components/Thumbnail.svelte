<script lang="ts">
	import type { Video } from 'src/routes/types';

	import VideoInfo from '$features/VideoInfo.svelte';

	export let video: Video;

	// todo: add thumbnails, for now, dog pics from the dog api
	async function getThumbnail() {
		// todo: get thumbnail from AWS storage? otherwise, default to lightning image
		return '/images/lightning.webp';
	}
</script>

<a class="flex flex-col justify-items-start self-start" href={`/${video.video_id}`}>
	<!-- todo: thumbnail image -->
	{#await getThumbnail()}
		<p>Loading Image...</p>
	{:then thumbnail}
		<img src={thumbnail} alt="thumbnail" />
	{:catch error}
		<p>{JSON.stringify(error)}</p>
	{/await}
	<div><VideoInfo {video} /></div>
</a>

<style lang="postcss">
	img {
		@apply transition-all;
	}
	a:hover {
		@apply text-slate-300;
	}
	a:hover > img {
		@apply scale-105 transition-all;
	}
	div {
		@apply mt-2;
	}
</style>
