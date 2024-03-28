<script>
	import { addDays } from 'date-fns';

	import { formatDashboardDate } from '$lib/serviceFunctions.js';

	function _processDays() {
		let daysDuration = 7; // 1 week
		let daysArr = [new Date()];

		for (let i = 1; i <= daysDuration; i++) {
			daysArr.push(addDays(new Date(), i));
		}

		return daysArr;
	}

	let processedDaysDuration = _processDays();
	let daysData = formatDashboardDate(processedDaysDuration);

	export let data;
</script>

<main class="p-4">
	<h1 class="h1 font-bold text-surface-200">Rozvrh uživatele {data.user.name}</h1>
	{#each daysData as day, i}
		{#if i < 3}
			<p class="mt-4 rounded-lg bg-surface-500 p-4 text-2xl font-bold text-surface-200">
				{day}
			</p>
		{:else}
			<p class="font-bolder mt-2 rounded-md bg-surface-700 p-2 text-lg text-surface-200">
				{day}
			</p>
		{/if}
	{/each}
</main>
