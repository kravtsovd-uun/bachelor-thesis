<script>
	import { superForm } from 'sveltekit-superforms';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { goto } from '$app/navigation';

	import { SlideToggle } from '@skeletonlabs/skeleton';
	import { convertToDateTimeLocalString } from '$lib/serviceFunctions.js';

	export let cardData;

	const modalStore = getModalStore();

	const { updated } = cardData;

	export let utrDetailUpdateForm;
	const { form, errors, constraints, message, enhance } = superForm(utrDetailUpdateForm, {
		resetForm: false
	});

	$form.teacher = cardData.expand?.teacher?.id ?? -1;
	$form.group = cardData.expand.group.id;
	$form.dateFrom = convertToDateTimeLocalString(new Date(cardData.dateFrom));
	$form.dateTo = convertToDateTimeLocalString(new Date(cardData.dateTo));
	$form.isPublic = cardData.isPublic;

	export let utrDetailRelationsData;

	const deleteModal = {
		type: 'confirm',

		title: 'Potvrzení o smazání položky agendy',
		body: `Opravdu si přejete tuto položku agendy smazat?`,
		response: async (r) => {
			if (r) {
				await fetch(`/api/dashboard/fetch-time-records`, {
					method: 'DELETE',
					body: JSON.stringify({ utrId: cardData.id }),
					headers: { 'content-type': 'application/json' }
				});
				goto('/');
			}
		}
	};

	function handleUtrDelete() {
		modalStore.trigger(deleteModal);
	}
</script>

<div class="my-12">
	{#if $message}<h4 class="h4">{$message}</h4>{/if}
	<form
		method="POST"
		action={`/dashboard/${cardData.id}?/utrCardUpdate`}
		use:enhance
		class="card space-y-4 p-4"
	>
		<header class="h2 font-bold">Detail karty</header>

		<label class="label">
			<span>Vyučující</span>
			<select
				class="select variant-form-material"
				bind:value={$form.teacher}
				name="teacher"
				aria-invalid={$errors.teacher ? true : undefined}
				{...$constraints.teacher}
			>
				{#each utrDetailRelationsData.teachers as { id, name }, i}
					<option value={id}>{name}</option>
				{/each}
			</select>
		</label>

		<label class="label">
			<span>Studijní skupina</span>
			<select
				class="select variant-form-material"
				bind:value={$form.group}
				name="group"
				aria-invalid={$errors.group ? true : undefined}
				{...$constraints.group}
			>
				{#each utrDetailRelationsData.groups as { id, name }, i}
					<option value={id}>{name}</option>
				{/each}
			</select>
		</label>

		<label class="label">
			<span>Výuková místnost</span>
			<input class="input variant-form-material" type="text" disabled bind:value={$form.room} />
		</label>

		<label class="label">
			<span>Začátek události</span>
			<input
				class="input variant-form-material"
				type="datetime-local"
				name="dateFrom"
				aria-invalid={$errors.dateFrom ? 'true' : undefined}
				bind:value={$form.dateFrom}
				{...$constraints.dateFrom}
			/>
		</label>

		<label class="label">
			<span>Konec události</span>
			<input
				class="input variant-form-material"
				type="datetime-local"
				name="dateTo"
				aria-invalid={$errors.dateTo ? 'true' : undefined}
				bind:value={$form.dateTo}
				{...$constraints.dateTo}
			/>
		</label>

		<SlideToggle
			name="isPublic"
			bind:checked={$form.isPublic}
			size="sm"
			active="bg-success-400 dark:bg-success-700">Veřejná nabídka</SlideToggle
		>

		<p>Naposledy aktualizováno: <span>{new Date(updated).toLocaleString('cs-CZ')}</span></p>

		<footer class="space-x-4">
			<a href="/" class="variant-ghost-surface btn">Storno</a>
			<button class="variant-filled-success btn w-64" type="submit">Aktualizovat</button>
		</footer>
		<!-- Ucitel, skupina, mistnost, datum Od, datum Do, Verejna (burza), Aktualizovano -->
	</form>
	<button class="variant-filled-error btn mt-2 w-96" on:click={handleUtrDelete}>Smazat</button>
</div>
