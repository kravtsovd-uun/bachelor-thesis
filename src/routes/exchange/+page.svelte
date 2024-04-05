<script>
	import { Accordion, AccordionItem, Avatar } from '@skeletonlabs/skeleton';
	import { onDestroy } from 'svelte';
	import { processUserInitials } from '$lib/serviceFunctions.js';

	export let data;
	const { schoolList } = data;
	let searchSchoolInputValue = '';
	const testItems = [
		{ id: 1, name: 'apple' },
		{ id: 2, name: 'banana' },
		{ id: 3, name: 'strawberry' },
		{ id: 4, name: 'apricot' },
		{ id: 5, name: 'banquet' }
	];
	let filteredTestItems = [...schoolList];
	$: isSearchUpdatePending = timeout && true;
	let timeout;
	const debouncedFilter = searchDebounce(searchUpdate);

	function handleSearchSchoolInputChange(event) {
		searchSchoolInputValue = event.target.value;
		debouncedFilter();
	}

	function searchDebounce(callback, delay = 500) {
		return (...args) => {
			clearTimeout(timeout);
			timeout = setTimeout(() => callback(...args), delay);
		};
	}

	function searchUpdate() {
		if (!searchSchoolInputValue) {
			filteredTestItems = [...schoolList];
		} else {
			const searchSchool = searchSchoolInputValue.toLowerCase();
			filteredTestItems = schoolList.filter(
				(item) =>
					item.name.toLowerCase().includes(searchSchool) ||
					item.city.toLowerCase().includes(searchSchool)
			);
		}
		isSearchUpdatePending = false;
	}

	onDestroy(() => clearTimeout(timeout)); //debounce clearup in case component destroyed (memory leak prevention)
</script>

<main>
	<h1 class="h1">Školní burza</h1>
	<h2 class="h2">Info</h2>
	<Accordion class="variant-glass-tertiary max-w-prose">
		<AccordionItem>
			<svelte:fragment slot="summary">Co je to školní burza?</svelte:fragment>
			<svelte:fragment slot="content">
				<p class="text-lg font-thin italic text-error-400">Info o burze tady.</p>
				<p>
					Zobrazují se pouze školy, jenž mají alespoň 1 veřejnou nabídku. Vyhledávání je možné dle
					jména nebo města. Dostupná města jsou Praha, Brno, Ostrava (momentálně).
				</p>
			</svelte:fragment>
		</AccordionItem>
	</Accordion>
	<label class="label">
		<span>Search</span>
		<input
			class="input"
			type="search"
			placeholder="Search..."
			on:input={handleSearchSchoolInputChange}
		/>
	</label>
	<div class={`${isSearchUpdatePending && 'blur-sm'} grid grid-cols-4 gap-8 p-4`}>
		{#if filteredTestItems.length}
			{#each filteredTestItems as school (school.id)}
				<a href="#" class="card card-hover">
					<header class="card-header flex items-center justify-between">
						<div class="flex items-center gap-2">
							<Avatar
								class="shrink-0"
								src={school.avatar}
								initials={processUserInitials(school.name)}
								width="w-12"
							/>
							<div class="flex flex-col">
								<p class="line-clamp-1 text-xl font-bold">{school.name}</p>
								<p class="text-sm font-thin">{school.city}</p>
							</div>
						</div>
						<span class="variant-filled-success badge size-8 rounded-full opacity-80"
							>{Math.round(Math.random() * 100)}</span
						>
					</header>
					<div class="card-body text-surface-600-300-token px-4 py-2">
						<h6 class="h6 font-bold">{@html school.address}</h6>
						<hr class="my-2" />
						<div class="text-sm font-thin">
							<p class="font-bold">Dmytro Kravtsov</p>
							<p>Email: john.doe@example.com</p>
							<p>Tel: +420 123 123 123</p>
						</div>
					</div>
				</a>
			{/each}
		{:else}
			<div class="card text-surface-600-300-token col-start-2 col-end-4 p-4 text-center">
				<h3 class="h3">Hledanému výrazu neodpovídá žádná škola</h3>
				<p class="text-sm">Zkuste si zadat jiný název školy</p>
			</div>
		{/if}
	</div>
</main>