<script lang="ts">
	import Button from '$components/Button.svelte';
	import { PUBLIC_API_URL } from '$env/static/public';

	let videoFiles: FileList;
	let thumbnailFiles: FileList;
	let price: string;
	let invoice_macaroon: string;
	let api_host_port: string;

	let loading = false;
	let uploaded = false;
	let error: Error | undefined;

	async function submit(e: Event) {
		loading = true;
		if (!videoFiles) {
			alert('You must select a video!');
			return;
		}
		e.preventDefault();
		const formData = new FormData();
		formData.append('video', videoFiles[0]);
		formData.append('price', price);
		formData.append('invoice_macaroon', invoice_macaroon);
		formData.append('api_host_port', api_host_port);
		formData.append('thumbnail', thumbnailFiles[0])
		try {
			const res = await fetch(`${PUBLIC_API_URL}/upload`, {
				method: 'post',
				body: formData
			});
			if (res.status === 201) {
				uploaded = true;
			}
		} catch (e) {
			console.error(e);
			error = new Error(String(e));
		}
		loading = false;
	}
</script>

{#if loading}
	<p>Uploading!</p>
{:else if uploaded}
	<p>Successfully uploaded!</p>
{:else if error}
	<p>Error! {String(error)}</p>
{:else}
	<form method="post" enctype="multipart/form-data">
		<label for="video">Upload Video</label>
		<input type="file" name="video" accept="video/*" bind:files={videoFiles} required />
		<label for="thumbnail">Upload Thumbnail (optional)</label>
		<input type="file" name="thumbnail" accept="image/*" bind:files={thumbnailFiles} />
		<label for="price">Price (Satoshi)</label>
		<input type="number" min=1 name="price" placeholder="21" bind:value={price} required />
		<label for="invoice_macaroon">Invoice Macaroon</label>
		<input name="invoice_macaroon" placeholder="AgEDbG5kA..." bind:value={invoice_macaroon} required />
		<label for="api_host_port">GRPC host and port</label>
		<input name="api_host_port" placeholder="your-node-url:10009" bind:value={api_host_port} required />
		<Button type="submit" on:click={submit}>Submit</Button>
	</form>
{/if}

<style lang="postcss">
	form {
		@apply flex flex-col gap-4;
	}
	label {
		@apply font-bold;
	}
</style>
