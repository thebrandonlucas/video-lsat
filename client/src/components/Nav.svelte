<script lang="ts">
	import { page } from "$app/stores";

	$: currentPath = $page.url.pathname;

	const paths = [
		{href: '/', name: 'Videos'},
		{href: '/upload', name: 'Upload'},
		{href: '/about', name: 'About'},
	]
</script>

<nav>
	{#each paths as path}
		<a class={path.href === currentPath ? 'active' : ''} href={path.href}>{path.name}</a>
	{/each}
</nav>

<style lang="postcss">
	nav {
		@apply flex flex-col gap-3 bg-slate-700 items-center w-36 h-screen;
	}
	a {
		@apply w-full text-center py-3;
	}
	a:hover {
		@apply bg-slate-500 rounded-md;
	}
	.active {
		@apply bg-slate-600;
	}
</style>