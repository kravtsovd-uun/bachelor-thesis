<script>
	import { superForm } from 'sveltekit-superforms';
	import { getModalStore, SlideToggle } from '@skeletonlabs/skeleton';
	import { goto } from '$app/navigation';
	import { fade } from 'svelte/transition';
	import { convertToDateTimeLocalString } from '$lib/serviceFunctions.js';

	export let data;
	const { groupDetail, responsibleList, groupDetailUpdateForm } = data;
	const { id, name, startDate, endDate } = groupDetail;

	let isDelPending = false;

	const { form, errors, constraints, message, enhance } = superForm(groupDetailUpdateForm, {
		resetForm: false
	});

	$form.name = name;
	$form.responsible = groupDetail?.expand?.responsible.id ?? -1;
	$form.studyOn = groupDetail.studyOn;
	$form.max_students_count = groupDetail.max_students_count;
	$form.ageFrom = groupDetail.ageFrom;
	$form.ageTo = groupDetail.ageTo;
	$form.startDate = convertToDateTimeLocalString(new Date(startDate));
	$form.endDate = convertToDateTimeLocalString(new Date(endDate));
	$form.active = groupDetail.active;

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
		<form
			method="POST"
			action={`/groups/${id}?/groupDetailUpdate`}
			use:enhance
			class="card m-4 max-w-xl space-y-4 p-4"
		>
			<header class="h2 font-bold">Detail studijní skupiny "{name}"</header>

			<label class="label">
				<span>Název skupiny</span>
				<input
					class="input variant-form-material"
					name="name"
					type="text"
					aria-invalid={$errors.name ? 'true' : undefined}
					bind:value={$form.name}
					{...$constraints.name}
				/>
			</label>

			<label class="label">
				<span>Odpovědný vyučující</span>
				<select
					class="select variant-form-material"
					name="responsible"
					aria-invalid={$errors.responsible ? 'true' : undefined}
					bind:value={$form.responsible}
					{...$constraints.responsible}
				>
					{#if responsibleList.teachers.length === 0}
						<option disabled value="">Žádní dostupní učitelé</option>
					{:else}
						{#each responsibleList.teachers as { id, name }, i}
							<option value={id}>{name}</option>
						{/each}
					{/if}
				</select>
			</label>

			<label class="label">
				<span>Konání výuky (dny)</span>
				<input
					class="input variant-form-material"
					name="studyOn"
					type="text"
					aria-invalid={$errors.studyOn ? 'true' : undefined}
					bind:value={$form.studyOn}
					{...$constraints.studyOn}
				/>
			</label>

			<label class="label">
				<span>Max. počet studentů</span>
				<input
					class="input variant-form-material"
					name="max_students_count"
					type="number"
					aria-invalid={$errors.max_students_count ? 'true' : undefined}
					bind:value={$form.max_students_count}
					{...$constraints.max_students_count}
				/>
			</label>

			<div class="flex gap-4">
				<label class="label">
					<span>Věk: Od</span>
					<input
						class="input variant-form-material"
						name="ageFrom"
						type="number"
						aria-invalid={$errors.ageFrom ? 'true' : undefined}
						bind:value={$form.ageFrom}
						{...$constraints.ageFrom}
					/>
				</label>

				<label class="label">
					<span>Věk: Do</span>
					<input
						class="input variant-form-material"
						name="ageTo"
						type="number"
						aria-invalid={$errors.ageTo ? 'true' : undefined}
						bind:value={$form.ageTo}
						{...$constraints.ageTo}
					/>
				</label>
			</div>

			<label class="label">
				<span>Začátek kurzu</span>
				<input
					class="input variant-form-material"
					type="datetime-local"
					name="startDate"
					aria-invalid={$errors.startDate ? 'true' : undefined}
					bind:value={$form.startDate}
					{...$constraints.startDate}
				/>
			</label>

			<label class="label">
				<span>Konec kurzu</span>
				<input
					class="input variant-form-material"
					type="datetime-local"
					name="endDate"
					aria-invalid={$errors.endDate ? 'true' : undefined}
					bind:value={$form.endDate}
					{...$constraints.endDate}
				/>
			</label>

			<SlideToggle
				name="active"
				disabled={$form.responsible === -1}
				bind:checked={$form.active}
				size="sm"
				active="bg-success-400 dark:bg-success-700">Aktivní</SlideToggle
			>

			<p>
				Naposledy aktualizováno: <span>{new Date(groupDetail.updated).toLocaleString('cs-CZ')}</span
				>
			</p>

			<footer>
				<button class="variant-filled-success btn w-full" type="submit">Aktualizovat</button>
			</footer>
		</form>
		<div class="mx-4 flex max-w-xl justify-between">
			<a href="/groups" class="variant-ghost-surface btn w-32">Zpět</a>
			<div class="space-x-2">
				<button
					class={`${data.groupDetail.archived ? 'variant-filled-tertiary' : 'variant-filled-warning'} btn w-32`}
					on:click={handleArchiveAction}
					>{data.groupDetail.archived ? 'Obnovit' : 'Archivovat'}</button
				>
				<button
					class="variant-filled-error btn w-32"
					on:click={() => modalStore.trigger(modalDelete)}>Smazat</button
				>
			</div>
		</div>
	</main>
{/if}
