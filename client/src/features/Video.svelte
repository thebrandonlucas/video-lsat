<script lang="ts">
	import type { Video } from 'src/routes/types';
	import VideoInfo from './VideoInfo.svelte';

	export let video: Video;
	export let url: string;
</script>

<div>
	<video controls src={url} type="video/mp4">
		<track kind="captions" />
	</video>
	<VideoInfo {video} />
</div>
