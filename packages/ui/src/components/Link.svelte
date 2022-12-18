<script lang="ts">
	export let href = '';
	export let blank = false;
</script>

<a class="text-[#0066CC] hover:underline" {href} target={blank ? '_blank' : null}><slot /></a>
