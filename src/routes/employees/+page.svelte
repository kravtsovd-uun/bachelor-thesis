<script>
	import EmployeeCard from '$lib/components/client/employees/EmployeeCard.svelte';

	/** @type {import('./$types').PageData} */
	export let data;
	const { userToken, employees } = data;
</script>

<main class="p-4">
	<h1 class="h1">Vaši zaměstnanci</h1>
	<p class="text-surface-800-100-token mt-4 max-w-prose text-xl">
		Na této stránce si můžete prohlédnout seznam Vašich zaměstnanců, přidat nového učitele nebo
		někoho z nich propustit.
	</p>
	<p class="text-error-400-500-token mt-4 max-w-prose text-xl font-bold">
		Při propuštění dochází také k odstranění učitele ze všech přiřazených skupin a jednotlivých
		rozvrhových akcí!
	</p>
	<div class="mt-12 flex flex-wrap gap-8">
		{#each employees as employee (employee.id)}
			<EmployeeCard employeeProps={{ employee }} />
		{/each}
	</div>
</main>
