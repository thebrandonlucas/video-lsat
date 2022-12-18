<script lang="ts">
	import { page } from '$app/stores';
	import Icon from '@iconify/svelte';

	$: currentPath = $page.url.pathname;

	const paths = [
		{ href: '/', name: 'Videos', icon: 'fa-solid:video' },
		{ href: '/upload', name: 'Upload', icon: 'fa-solid:file-upload' },
		{ href: '/about', name: 'About', icon: 'fa-solid:info-circle' }
	];
</script>

<nav>
	{#each paths as path}
		<a class={path.href === currentPath ? 'active' : ''} href={path.href}
			><div><Icon icon={path.icon} /><span>{path.name}</span></div></a
		>
	{/each}
</nav>

<style lang="postcss">
	nav {
		@apply flex flex-col gap-1 bg-slate-700 items-center p-3 h-full;
	}
	a {
		@apply w-full text-center py-3 rounded-md;
	}
	a:hover {
		@apply bg-slate-500;
	}
	div {
		@apply flex items-baseline justify-evenly;
	}
	.active {
		@apply bg-slate-600;
	}
</style>
