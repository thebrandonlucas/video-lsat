<script lang="ts">
	export let type = 'text';
	export let placeholder = '';
	export let value = '';
</script>

<input
	class="rounded-md border-gray-300 border-2 p-2 outline-yellow-300"
	{type}
	{placeholder}
	{value}
/>
