<script>
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { goto } from '$app/navigation';

	export let exchangeAdd;
	export let utrId;
	
	let teacherAddPending = false;
	let submitBtnDisabled = true;

	const modalStore = getModalStore();

	async function handleTeacherAdd() {
		const teacherID = document.getElementById('teacherID').value;
		if (teacherID !== '') teacherAddPending = true;

		if (exchangeAdd) {
			const req = await fetch(`/api/exchange`, {
				method: 'PATCH',
				body: JSON.stringify({ uid: teacherID, utrId: utrId }),
				headers: { 'content-type': 'application/json' }
			}).then((res) => {
				modalStore.close();
				goto('/');
			});
		} else {
			const req = await fetch(`/api/employees`, {
				method: 'PATCH',
				body: JSON.stringify({ uid: teacherID, addTeacher: true }),
				headers: { 'content-type': 'application/json' }
			}).then((res) => {
				modalStore.close();
				goto('/');
			});
		}
	}

	function handleSubmitDisabled(event) {
		const value = event.target.value;
		submitBtnDisabled = value === '' ? true : false;
	}
</script>

{#if $modalStore[0]}
	<div class="card w-modal space-y-4 p-4 shadow-xl">
		{#if teacherAddPending}
			<div class="p-4">
				<h3 class="h3">Přidávám učitele, vyčkejte prosím...</h3>
			</div>
		{:else}
			<header class="text-2xl font-bold">{$modalStore[0].title ?? '(Žádný název)'}</header>
			<article>{@html $modalStore[0].body ?? '(Žádné tělo dialogu)'}</article>
			<div>{utrId}</div>
			<input
				class="input variant-form-material"
				type="text"
				id="teacherID"
				name="teacherID"
				placeholder="Vložte ID učitele..."
				on:input={handleSubmitDisabled}
			/>

			<div class="flex justify-end gap-2">
				<button class="variant-soft-surface btn w-32" on:click={() => modalStore.close()}
					>Storno</button
				>
				<button
					class="variant-ghost-success btn w-32"
					disabled={submitBtnDisabled}
					on:click={handleTeacherAdd}>Přidat</button
				>
			</div>
		{/if}
	</div>
{/if}
