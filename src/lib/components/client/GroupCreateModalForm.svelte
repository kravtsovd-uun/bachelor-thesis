<script>
	import { getModalStore } from '@skeletonlabs/skeleton';
	import SuperDebug from 'sveltekit-superforms';
	const modalStore = getModalStore();

	export let formProps;
	export let groupCreateRelationsData;

	const { form, errors, constraints, message, enhance } = formProps;
</script>

{#if $modalStore[0]}
	<div class="card w-modal space-y-4 p-4 shadow-xl">
		<SuperDebug data={$form} />
		{#if $message}<h4 class="h4">{$message}</h4>{/if}
		{#if Object.keys($errors).length > 0}<pre>{JSON.stringify($errors)}</pre>{/if}
		<header class="text-2xl font-bold">{$modalStore[0].title ?? '(Žádný název)'}</header>
		<article>{$modalStore[0].body ?? '(Žádné tělo formuláře)'}</article>
		<form
			method="POST"
			action="/groups?/groupCreate"
			use:enhance
			class="space-y-4 border border-surface-500 p-4"
		>
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
					bind:value={$form.responsible}
					name="responsible"
					aria-invalid={$errors.responsible ? 'true' : undefined}
					{...$constraints.responsible}
				>
					{#if groupCreateRelationsData.teachers.length === 0}
						<option disabled value="">Žádní dostupní učitelé</option>
					{:else}
						{#each groupCreateRelationsData.teachers as { id, name }, i}
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

			<div class="flex justify-between">
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
					class="input"
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
					class="input"
					type="datetime-local"
					name="endDate"
					aria-invalid={$errors.endDate ? 'true' : undefined}
					bind:value={$form.endDate}
					{...$constraints.endDate}
				/>
			</label>
			<footer class="flex w-full justify-end gap-2">
				<button class="variant-ghost-error btn font-thin" on:click={() => modalStore.close()}
					>Storno</button
				>
				<button class="variant-filled-success btn basis-1/3 font-bold" type="submit"
					>Vytvořit</button
				>
			</footer>
		</form>
	</div>
{/if}
