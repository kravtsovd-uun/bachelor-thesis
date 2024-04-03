<script>
	import { superForm } from 'sveltekit-superforms';
	import SuperDebug from 'sveltekit-superforms';
	import { SlideToggle } from '@skeletonlabs/skeleton';
	import { convertToDateTimeLocalString } from '$lib/serviceFunctions.js';
	
	export let cardData;
	const { updated } = cardData;

	export let utrDetailUpdateForm;
	const { form, errors, constraints, message, enhance } = superForm(utrDetailUpdateForm, {
		resetForm: false
	});

	$form.teacher = cardData.expand.teacher.id;
	$form.group = cardData.expand.group.id;
	$form.dateFrom = convertToDateTimeLocalString(new Date(cardData.dateFrom));
	$form.dateTo = convertToDateTimeLocalString(new Date(cardData.dateTo));

	export let utrDetailRelationsData;
</script>

<div class="my-12">
	<SuperDebug data={$form} />
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

		<footer>
			<a href="/" class="variant-ghost-error btn">Storno</a>
			<button class="variant-filled-success btn" type="submit">Aktualizovat</button>
		</footer>
		<!-- Ucitel, skupina, mistnost, datum Od, datum Do, Verejna (burza), Aktualizovano -->
	</form>
</div>
