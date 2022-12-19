<script lang="ts">
	export let type = 'text';
	export let label = '';
	export let placeholder = '';
	export let value = '';
	export let name = '';
	export let min = '0'
	export let max = '1';
	export let files: FileList | undefined = undefined;

	function typeAction(node: HTMLInputElement) {
		node.type = type
	}
</script>

<!-- TODO: find a more elegant way to dynamically change 
	files that relies less on parent on:change handler -->
<input
	class="rounded-md border-gray-300 border-2 p-2 outline-yellow-300"
	use:typeAction
	on:change
	bind:value
	{files}
	{name}
	{label}
	{min}
	{max}
	{placeholder}
	{...$$restProps}
/>

<style lang="postcss">
	input {
		@apply text-black;
		@apply bg-white;
	}
</style>