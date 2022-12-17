<script lang="ts">
	export let small = false;
</script>

<div class="loading" class:small />

<style lang="postcss">
	.loading {
		@apply inline-block w-8 h-8 border-blue-200 border-t-blue-500 border-4 rounded-[50%];
		animation: spin 1s ease-in-out infinite;
		-webkit-animation: spin 1s ease-in-out infinite;
	}

	.small {
		@apply w-6 h-6;
	}

	@keyframes spin {
		to {
			-webkit-transform: rotate(360deg);
		}
	}
	@-webkit-keyframes spin {
		to {
			-webkit-transform: rotate(360deg);
		}
	}
</style>
