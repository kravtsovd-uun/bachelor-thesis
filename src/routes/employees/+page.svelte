<script>
	import EmployeeCard from '$lib/components/client/employees/EmployeeCard.svelte';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import SearchTeacherIdModalForm from '$lib/components/client/SearchTeacherIdModalForm.svelte';

	/** @type {import('./$types').PageData} */
	export let data;
	const { userToken, employees } = data;

	const modalStore = getModalStore();

	const insertIdFormModalComponent = {
		ref: SearchTeacherIdModalForm
	};
	const insertIdModal = {
		type: 'component',
		component: insertIdFormModalComponent,
		// Data
		title: 'Přidání nového učitele',
		body: 'Vložte ID hledaného vyučujícího. <br/>Tento údaj by Vám pracovník měl sdělit při Vašem s ním kontaktování.'
	};
</script>

<main class="p-4">
	<div class="flex justify-end">
		<button
			class="variant-ghost-success btn w-32 font-bold opacity-30 transition duration-300 hover:opacity-100"
			on:click={() => modalStore.trigger(insertIdModal)}>Přidat učitele</button
		>
	</div>
	<h1 class="h1">Vaši zaměstnanci</h1>
	<p class="text-surface-800-100-token mt-4 max-w-prose text-xl">
		Na této stránce si můžete prohlédnout seznam Vašich zaměstnanců, přidat nového učitele nebo
		někoho z nich propustit.
	</p>
	<p class="text-error-400-500-token mt-4 max-w-prose rounded-md bg-error-800/20 p-4 font-thin">
		Při propuštění dochází také k odstranění učitele ze všech přiřazených skupin a jednotlivých
		rozvrhových akcí!
	</p>
	{#if employees.length}
		<div class="mt-12 flex flex-wrap gap-8">
			{#each employees as employee (employee.id)}
				<EmployeeCard employeeProps={{ employee }} />
			{/each}
		</div>
	{:else}
		<div class="mt-12 space-y-6 rounded-md bg-surface-800 p-12 text-center">
			<h2 class="h2 text-primary-200">Nemáte zatím žádného zaměstnance</h2>
			<button
				class="variant-ghost-success btn w-32"
				on:click={() => modalStore.trigger(insertIdModal)}>Přidat učitele</button
			>
		</div>
	{/if}
</main>
