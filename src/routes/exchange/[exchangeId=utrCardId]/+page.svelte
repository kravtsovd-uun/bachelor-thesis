<script>
	export let data;
</script>

<h1 class="h1">Burzovní nabídky ...</h1>
<ul>
	{#each data.result as item (item.id)}
		<li>{item.id} - {item.dateFrom}</li>
	{/each}
</ul>
