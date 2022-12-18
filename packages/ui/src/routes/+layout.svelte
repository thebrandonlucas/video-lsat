<script>
	import Nav from '$components/Nav.svelte';
	import '../app.css';
</script>

<main>
	<aside>
		<Nav />
	</aside>
	<section>
		<slot />
	</section>
</main>

<style lang="postcss">
	main {
		@apply flex text-white h-full;
	}
	aside {
		@apply fixed h-full w-44;
	}
	section {
		@apply ml-48;
	}
</style>
