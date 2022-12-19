<script lang="ts">
	export let type = 'button';
</script>

<button {type} on:click><slot /></button>

<style lang="postcss">
	button {
		@apply bg-yellow-500 rounded-md p-3;
		@apply hover:bg-yellow-400 transition-all;
	}
</style>
