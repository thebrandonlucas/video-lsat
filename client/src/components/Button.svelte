<script lang="ts">
	export let type = 'button';
</script>

<button {type} on:click><slot /></button>

<style lang="postcss">
	button {
		@apply bg-yellow-300 rounded-md p-3;
		@apply hover:bg-yellow-200 transition-all;
	}
</style>
