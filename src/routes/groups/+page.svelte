<script>
	import { Avatar } from '@skeletonlabs/skeleton';
	import { processUserInitials } from '$lib/serviceFunctions.js';
	import GroupCreateModalForm from '$lib/components/client/GroupCreateModalForm.svelte';

	import { superForm } from 'sveltekit-superforms';

	import { getModalStore } from '@skeletonlabs/skeleton';
	const modalStore = getModalStore();

	export let data;
	const { groups } = data;

	const { form, errors, constraints, message, enhance } = superForm(data.groupCreateForm, {
		resetForm: false
	});

	const formProps = {
		form,
		errors,
		constraints,
		message,
		enhance
	};

	const groupCreateFormModalComponent = {
		ref: GroupCreateModalForm,
		props: { formProps: formProps, groupCreateRelationsData: data?.groupCreateRelationsData }
	};

	const groupCreateModal = {
		type: 'component',
		component: groupCreateFormModalComponent,
		// Data
		title: 'Vytvořit novou studijní skupinu',
		body: 'Vyplňte data a odešlete formulář'
	};
</script>

<main>
	<h1 class="h1 mt-2 px-4">Vaše studijní skupiny</h1>
	<hr class="mt-2" />
	<div class="mt-4 flex justify-end gap-2 px-4">
		<a
			href="/groups/archive"
			class="variant-ghost-surface btn w-32 opacity-60 transition-opacity duration-300 hover:opacity-100"
			>Archiv</a
		>
		<button
			class="variant-ghost-success btn w-32"
			on:click={() => modalStore.trigger(groupCreateModal)}>Vytvořit</button
		>
	</div>
	<section class="mt-4 p-4">
		{#if groups.length !== 0}
			<h3 class="h3">Řazeno dle data začátku výuky</h3>
			<div class="mt-2 flex flex-wrap gap-4">
				{#each groups as group (group.id)}
					<a
						href={`/groups/${group.id}`}
						class={`card card-hover flex min-w-[240px] max-w-sm flex-[1_0_auto] flex-col ${!group.active && 'variant-ghost-error opacity-60'}`}
					>
						<header class="card-header">
							<div class="flex justify-between">
								<h4 class="h4 font-bold">{group.name}</h4>
								{#if !group.active}
									<span class="variant-filled-error badge">Neaktivní</span>
								{/if}
							</div>
							<small class="text-zinc-600 dark:text-zinc-300/60">
								{#if group.startDate}
									Začátek: {new Date(group.startDate).toLocaleString('cs-CZ')}
								{:else}
									Datum začátku není nastaveno
								{/if}
							</small>
							<hr />
						</header>
						<footer class="card-footer mt-2 flex items-center gap-2">
							{#if group?.expand?.responsible}
								<Avatar
									src={group.expand.responsible.avatarSrc}
									initials={processUserInitials(group.expand.responsible.name)}
									width="w-8"
								/>
								<p class="text-sm font-thin">{group.expand.responsible.name}</p>
							{:else}
								<Avatar initials="ŽU" width="w-8" />
								<p class="text-sm font-thin">Žádný učitel</p>
							{/if}
						</footer>
					</a>
				{/each}
			</div>
		{:else}
			<h3 class="h3 text-center font-bold">Žádné studijní skupiny</h3>
		{/if}
	</section>
</main>
