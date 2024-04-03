<script>
	import SchoolDetail from './SchoolDetail.svelte';

	export let userRole;
	export let utrDetailUpdateForm;
	export let cardData;

	export let utrDetailRelationsData;
</script>

<section>
	<aside class="alert variant-soft-warning">
		<div class="alert-message">
			<h3 class="h3">In construction</h3>
			<p>
				Vzhled této stránky není finální! Je ve vývoji a je momentálně zaměřená prioritně na
				funkcionalitu.
			</p>
		</div>
	</aside>
	{#if userRole === 'school'}
		<SchoolDetail {utrDetailUpdateForm} {cardData} {utrDetailRelationsData} />
	{/if}
</section>
