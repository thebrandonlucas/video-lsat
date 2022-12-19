<script lang="ts">
	import Spinner from '$components/Spinner.svelte';
	import Thumbnail from '$components/Thumbnail.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div>
	{#await data}
		<Spinner />
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

<style lang="postcss">
	div {
		@apply grid justify-items-center gap-8 m-4;
		/* FIXME: consistent size for different number of items in row, 
			currently, thumbnail item stretches to fill
		*/
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
	}
</style>
