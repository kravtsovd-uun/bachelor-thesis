<script>
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { goto } from '$app/navigation';
	import { fade } from 'svelte/transition';

	export let data;
	const { groupDetail } = data;
	const { id, name } = groupDetail;

	let isDelPending = false;

	const modalStore = getModalStore();
	const modalArchive = {
		type: 'confirm',

		title: 'Potvrzení o přemístění studijní skupiny do archivu',
		body: `Opravdu si přejete přemístit do archivu studijní skupinu "<strong>${name}</strong>"?`,
		response: async (r) => {
			if (r) {
				isDelPending = true;
				await fetch(`/api/groups`, {
					method: 'PATCH',
					body: JSON.stringify({ id, archive: true }),
					headers: { 'content-type': 'application/json' }
				}).then(() => goto('/groups'));
			}
		}
	};
	const modalUnarchive = {
		type: 'confirm',

		title: 'Potvrzení o obnovení studijní skupiny z archivu',
		body: `Opravdu si přejete obnovit studijní skupinu "<strong>${name}</strong>" z archivu?`,
		response: async (r) => {
			if (r) {
				isDelPending = true;
				await fetch(`/api/groups`, {
					method: 'PATCH',
					body: JSON.stringify({ id, archive: false }),
					headers: { 'content-type': 'application/json' }
				}).then(() => goto('/groups'));
			}
		}
	};
	const modalDelete = {
		type: 'confirm',

		title: 'Potvrzení o smazání studijní skupiny',
		body: `Opravdu si přejete smazat studijní skupinu "<strong>${name}</strong>"?`,
		response: async (r) => {
			if (r) {
				isDelPending = true;
				await fetch(`/api/groups`, {
					method: 'DELETE',
					body: JSON.stringify(id),
					headers: { 'content-type': 'application/json' }
				}).then(() => goto('/groups'));
			}
		}
	};

	function handleArchiveAction() {
		data.groupDetail.archived
			? modalStore.trigger(modalUnarchive)
			: modalStore.trigger(modalArchive);
	}
</script>

{#if !isDelPending}
	<main transition:fade={{ duration: 500 }}>
		<pre>{JSON.stringify(data.groupDetail, undefined, 2)}</pre>
		<button
			class={`${data.groupDetail.archived ? 'variant-filled-tertiary' : 'variant-filled-warning'} btn w-32`}
			on:click={handleArchiveAction}>{data.groupDetail.archived ? 'Obnovit' : 'Archivovat'}</button
		>
		<button class="variant-filled-error btn w-32" on:click={() => modalStore.trigger(modalDelete)}
			>Smazat</button
		>
		<a href="/groups" class="variant-ghost-surface btn w-32">Zpět</a>
	</main>
{/if}
