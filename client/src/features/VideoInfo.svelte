<script lang="ts">
	import type { Video } from 'src/routes/types';
	import { format } from 'date-fns';
	import Text from '$components/Text.svelte';

	export let video: Video;
</script>

<section>
	<Text>{video.video_name}</Text>
	<Text secondary>{video.price_satoshi} sat</Text>
	<Text secondary>{format(new Date(video.created_at), 'M/dd/yyyy')}</Text>
</section>
