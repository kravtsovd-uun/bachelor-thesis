<script>
	import { getModalStore, ProgressRadial } from '@skeletonlabs/skeleton';

	const modalStore = getModalStore();

	export let formProps;
	export let utrCreateRelationsData;

	const { form, errors, constraints, message, enhance, delayed } = formProps;
</script>

{#if $modalStore[0]}
	<div class="card w-modal space-y-4 p-4 shadow-xl">
		{#if $message}<h4 class="h4">{$message}</h4>{/if}
		{#if Object.keys($errors).length > 0}<pre>{JSON.stringify($errors)}</pre>{/if}
		<header class="text-2xl font-bold">{$modalStore[0].title ?? '(Žádný název)'}</header>
		<article>{$modalStore[0].body ?? '(Žádné tělo formuláře)'}</article>
		<form method="POST" action="/" use:enhance class="space-y-4 border border-surface-500 p-4">
			<label class="label">
				<span>Studijní skupina</span>
				<select
					class="select variant-form-material"
					bind:value={$form.group}
					name="group"
					aria-invalid={$errors.group ? true : undefined}
					{...$constraints.group}
				>
					{#each utrCreateRelationsData.groups as { id, name }, i}
						<option value={id}>{name}</option>
					{/each}
				</select>
			</label>

			<label class="label">
				<span>Vyučující</span>
				<select
					class="select variant-form-material"
					bind:value={$form.teacher}
					name="teacher"
					aria-invalid={$errors.teacher ? true : undefined}
					{...$constraints.teacher}
				>
					{#each utrCreateRelationsData.teachers as { id, name }, i}
						<option value={id}>{name}</option>
					{/each}
				</select>
			</label>

			<label class="label">
				<span>Začátek</span>
				<input
					class="input"
					type="datetime-local"
					name="dateFrom"
					aria-invalid={$errors.dateFrom ? 'true' : undefined}
					bind:value={$form.dateFrom}
					{...$constraints.dateFrom}
				/>
			</label>

			<label class="label">
				<span>Konec</span>
				<input
					class="input"
					type="datetime-local"
					name="dateTo"
					aria-invalid={$errors.dateTo ? 'true' : undefined}
					bind:value={$form.dateTo}
					{...$constraints.dateTo}
				/>
			</label>
			<footer class="flex w-full justify-end gap-2">
				<button class="variant-ghost-error btn font-thin" on:click={() => modalStore.close()}
					>Storno</button
				>
				<button class="variant-filled-success btn basis-1/3 font-bold" type="submit"
					>Vytvořit</button
				>
				{#if $delayed}
					<ProgressRadial width="w-10" />
				{/if}
			</footer>
		</form>
	</div>
{/if}
