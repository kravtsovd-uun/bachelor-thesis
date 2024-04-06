<script>
	import EmployeeCard from '$lib/components/client/employees/EmployeeCard.svelte';

	/** @type {import('./$types').PageData} */
	export let data;
	const { userToken, employees } = data;
</script>

<main>
	<aside class="alert variant-ghost-warning mx-auto mt-4 w-full max-w-xl">
		<div class="alert-message">
			<h3 class="h3">Omezení funkcionality</h3>
			<p class="text-justify text-sm">
				Propuštění je funkční, ale je dočasně vypnuto kvůli neúplnému ošetření relací studijních
				skupin při propuštění učitele. Stejně tomu tak je i v případě s odkazy na detaily
				přiřazených studijních skupin.
			</p>
			<p class="text-xl text-sky-300">Bude zpřístupněno v následujícím buildu.</p>
		</div>
	</aside>
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
