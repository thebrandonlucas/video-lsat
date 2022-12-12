<script lang="ts">
	export let inline = false;
	export let secondary = false;
</script>

<p class:inline class:secondary><slot /></p>

<style lang="postcss">
	p {
		@apply text-white;
	}
	.secondary {
		@apply text-gray-400;
	}
</style>
