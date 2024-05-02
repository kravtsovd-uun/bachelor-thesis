<script>
	import SchoolDetail from './SchoolDetail.svelte';

	export let userRole;
	export let userSchoolId;
	export let utrDetailUpdateForm;
	export let cardData;
	
	export let utrDetailRelationsData;
</script>

<section>
	<!-- Only for school managers and only for school owned utrCard. Otherwise view as regular user (teacher) -->
	{#if userRole === 'school' && cardData.expand.school.id === userSchoolId}
		<SchoolDetail {utrDetailUpdateForm} {cardData} {utrDetailRelationsData} />
	{:else}
		<h3 class="h3">Tato stránka je přístupna pouze pro ředitele škol...</h3>
		<a href="/" class="variant-soft-surface btn">Zpět</a>
	{/if}
</section>
