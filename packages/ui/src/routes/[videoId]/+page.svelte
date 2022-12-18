<script lang="ts">
	import type { PageData } from './$types';
	import QRCode from 'qrcode';
	import { onMount } from 'svelte';
	import { PUBLIC_API_URL } from '$env/static/public';
	import { page } from '$app/stores';
	import Spinner from '$components/Spinner.svelte';
	import Link from '$components/Link.svelte';
	import Button from '$components/Button.svelte';
	import VideoInfo from '$features/VideoInfo.svelte';
	import Video from '$features/Video.svelte';
	import { browser } from '$app/environment';

	export let data: PageData;

	// Stop auto-polling for payment after 5 minutes
	const CHECK_PAYMENT_ATTEMPTS = 100;
	const CHECK_PAYMENT_INTERVAL_MS = 3000;

	const { lsat, video } = data;
	let hasPaid: null | boolean = null;
	let url = '';
	let checkPaymentAttempts = 0;
	let loading = false;
	let error: Error | null = null;
	let copied = false;

	$: showVideo = url !== '' && hasPaid;

	onMount(async () => {
		loading = true;
		await checkForLsat();
		if (hasPaid) {
			return;
		}
		loading = false;
		const canvas = document.getElementById('canvas');
		QRCode.toCanvas(canvas, lsat.invoice as string, (error: unknown) => {
			if (error) console.error(error);
			console.log('Generated QRCode');
		});
		pollForPayment();
	});

	async function getVideo(videoId: string, macaroon: string, secret: string) {
		// user has paid for content, send back LSAT
		const getVideoUrl = `${PUBLIC_API_URL}/video/${videoId}`;
		const res = await fetch(getVideoUrl, {
			headers: {
				Authorization: toToken(macaroon, secret)
			}
		});
		const { video_base64 } = await res.json();
		return video_base64;
	}

	// Checks if a paid LSAT for this video already exists in localStorage
	async function checkForLsat() {
		if (browser) {
			const lsatJSON = window.localStorage.getItem(video.video_id);
			if (lsatJSON) {
				const { macaroon, preimage } = JSON.parse(lsatJSON);
				const videoBase64 = await getVideo(video.video_id, macaroon, preimage);
				url = `data:video/mp4;base64,${videoBase64}`;
				hasPaid = true;
			} else {
				hasPaid = false;
			}
		}
	}

	async function pollForPayment() {
		loading = true;

		checkPaymentAttempts++;
		const checkPaymentUrl = `${PUBLIC_API_URL}/checkpayment`;
		const body = {
			payment_hash: lsat.paymentHash,
			video_id: $page.params.videoId
		};
		const res = await fetch(checkPaymentUrl, {
			method: 'post',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(body)
		});
		const { is_confirmed, secret } = (await res.json()) as unknown as {
			is_confirmed: boolean;
			secret: string;
		};
		if (is_confirmed) {
			// set lsat in browser
			const lsatJSON = { macaroon: lsat.baseMacaroon, preimage: secret };
			if (browser) {
				window.localStorage.setItem(video.video_id, JSON.stringify(lsatJSON));
			}
			const video_base64 = await getVideo($page.params.videoId, lsat.baseMacaroon, secret);
			url = `data:video/mp4;base64,${video_base64}`;
			hasPaid = true;
			error = null;
		} else {
			hasPaid = false;
			if (checkPaymentAttempts < CHECK_PAYMENT_ATTEMPTS) {
				setTimeout(pollForPayment, CHECK_PAYMENT_INTERVAL_MS);
			} else {
				error = new Error(
					`Too many attempts: ${checkPaymentAttempts}. Checking for payment failed`
				);
			}
		}
		loading = false;
	}

	function toToken(macaroon: string, preimage: string) {
		return `LSAT ${macaroon}:${preimage}`;
	}

	function copy() {
		navigator.clipboard.writeText(lsat.invoice || '');
		copied = true;
		setTimeout(() => {
			copied = false;
		}, 4000);
	}
</script>

<div class="flex flex-col gap-4 items-center mt-3">
	{#if !showVideo}
		<!-- todo: would be cool to have a toggle between bolt-11, LNURL, and lightning address  -->
		<p>
			Please pay the <Link blank href="https://www.bolt11.org/">Bolt-11</Link> invoice to unlock:
		</p>
		<VideoInfo {video} />
		<canvas class="cursor-pointer" id="canvas" on:click={copy} />
		<Button on:click={copy}>{copied ? 'Copied!' : 'Copy Invoice'}</Button>
	{/if}

	{#if checkPaymentAttempts < CHECK_PAYMENT_ATTEMPTS && !hasPaid}
		<div class="flex align-baseline gap-2">
			<Spinner small />
			<p>waiting for payment...</p>
		</div>
	{:else if !hasPaid}
		{#if error}
			<p>{error}</p>
		{/if}
		<Button on:click={pollForPayment}>Manually check payment</Button>
	{:else if showVideo}
		<Video {video} {url} />
	{/if}
</div>
