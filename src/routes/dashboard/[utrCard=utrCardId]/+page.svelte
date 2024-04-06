<script>
	import { CodeBlock } from '@skeletonlabs/skeleton';
	import UtrCardDetail from '$lib/components/client/dashboard/utr-detail/UtrCardDetail.svelte';

	export let data;
	const { cardData, userSchoolId, userRole, utrDetailUpdateForm, utrDetailRelationsData } = data;
</script>

<main>
	<h1 class="text-surface-700-200-token h1">Detail položky agendy</h1>
	<hr />
	<UtrCardDetail
		{cardData}
		{userSchoolId}
		{userRole}
		{utrDetailUpdateForm}
		{utrDetailRelationsData}
	/>
	<CodeBlock language="js" code={`${JSON.stringify(cardData, undefined, 2)}`}></CodeBlock>
</main>
