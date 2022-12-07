<script lang="ts">
	import Button from '$components/Button.svelte';
	import { PUBLIC_API_URL } from '$env/static/public';

	let videoFile: FileList;
	let price: string;
	let invoice_macaroon: string;
	let api_host_port: string;

	let loading = false;
	let uploaded = false;
	let error: Error | undefined;

	async function submit(e: Event) {
		loading = true;
		if (!videoFile) {
			alert('You must select a video!');
			return;
		}
		e.preventDefault();
		const formData = new FormData();
		formData.append('video', videoFile[0]);
		formData.append('price', price);
		formData.append('invoice_macaroon', invoice_macaroon);
		formData.append('api_host_port', api_host_port);
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
{:else}
	<form method="post" enctype="multipart/form-data">
		<input type="file" name="video" accept="video/*" bind:files={videoFile} />
		<label for="price">Price (Satoshi)</label>
		<input type="number" name="price" placeholder="21" bind:value={price} />
		<label for="invoice_macaroon">Invoice Macaroon</label>
		<input name="invoice_macaroon" bind:value={invoice_macaroon} />
		<label for="api_host_port">GRPC host and port</label>
		<input name="api_host_port" placeholder="your-node-url:10009" bind:value={api_host_port} />
		<Button type="submit" on:click={submit}>Submit</Button>
	</form>
{/if}
