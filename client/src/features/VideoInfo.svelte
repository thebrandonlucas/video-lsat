<script lang="ts">
	import type { Video } from 'src/routes/types';
	import { format } from 'date-fns';

	export let video: Video;
</script>

<div>
	<p>{video.video_name}</p>
	<p>{video.price_satoshi} sat</p>
	<p>{format(new Date(video.created_at), 'M/dd/yyyy')}</p>
</div>
