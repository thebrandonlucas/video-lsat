<script lang="ts">
	import Thumbnail from '$components/Thumbnail.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="grid grid-cols-3 grid-rows-3 gap-4 mt-4">
	{#await data}
		<p>Loading...</p>
	{:then { videos }}
		{#if !videos.length}
			<p>No videos to show!</p>
		{:else}
			{#each data.videos as video}
				<Thumbnail {video} />
			{/each}
		{/if}
	{:catch error}
		<p>{error}</p>
	{/await}
</div>
