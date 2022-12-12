<script>
	import Nav from '$components/Nav.svelte';
	import '../app.css';
</script>

<main class="flex gap-4 text-white">
	<Nav />
	<slot />
</main>
