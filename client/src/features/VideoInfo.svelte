<script lang="ts">
	import type { Video } from 'src/routes/types';
	import { formatDistance } from 'date-fns';
	import Text from '$components/Text.svelte';

	export let video: Video;

	const timeAgo = formatDistance(new Date(), new Date(video.created_at))
</script>
 
<section>
	<Text>{video.video_name}</Text>
	<Text secondary>{video.views_count}</Text> 
	<Text secondary>{video.price_satoshi} sat</Text>
	<Text secondary>{timeAgo} ago</Text>
</section>
