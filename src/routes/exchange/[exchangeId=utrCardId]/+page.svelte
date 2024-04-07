<script>
	import { Accordion, AccordionItem, Avatar } from '@skeletonlabs/skeleton';
	import { processUserInitials } from '$lib/serviceFunctions.js';
	import { isPast } from 'date-fns';

	export let data;
	const { trCards, schoolData } = data;
	const { email, name, phone, avatarSrc } = schoolData.expand.responsiblePerson;

	const groupedTrCards = trCards.reduce((acc, record) => {
		const date = new Date(record.dateFrom).toLocaleDateString('cs-CZ', {
			weekday: 'long',
			year: 'numeric',
			month: 'numeric',
			day: 'numeric'
		}); //Format time record date
		if (!acc[date]) {
			acc[date] = [];
		}
		acc[date].push(record);
		return acc;
	}, {});

	const today = new Date().toLocaleDateString('cs-CZ', {
		weekday: 'long',
		year: 'numeric',
		month: 'numeric',
		day: 'numeric'
	});
</script>

<main class="mt-2 px-4">
	{#if data.userRole === 'school'}
		<div class="flex w-full justify-end">
			<a href="/exchange/teacherContacts" target="_blank" class="variant-ghost-success btn"
				>Kontakty externích učitelů</a
			>
		</div>
	{/if}
	<h1 class="h1">Burzovní nabídky školy {schoolData.name}</h1>
	<hr class="mt-2" />
	{#if data.userRole !== 'school'}
		<div class="variant-ghost-surface mt-6 max-w-prose p-2">
			<h2 class="h2">Kontakt</h2>
			<h6 class="h6 mt-2 font-bold">{@html schoolData.address}</h6>
			<hr class="my-2" />
			<div class="mt-4 flex items-center justify-between">
				<div class="flex gap-2">
					<Avatar src={avatarSrc} initials={processUserInitials(name)} />
					<div class="text-sm font-thin">
						<p class="text-lg font-bold">{name}</p>
						<p>
							Email: <a
								href={`mailto:${email}?subject=UUN LMS - Burzovní nabídka Vaši školy`}
								class="anchor">{email}</a
							>
						</p>
						<p>Tel: <a href={`tel:${phone.replace(/\s+/g, '')}`} class="anchor">{phone}</a></p>
					</div>
				</div>
				<div class="variant-ghost-primary rounded-md p-4 text-center">
					<span class="text-sm font-thin text-rose-600 dark:text-amber-300">Vaše ID</span>
					<p class="text-primary-700-200-token text-lg">{data.userId}</p>
				</div>
			</div>
		</div>

		<Accordion class="variant-ghost-surface mt-2 max-w-prose">
			<AccordionItem>
				<svelte:fragment slot="summary">Nápověda</svelte:fragment>
				<svelte:fragment slot="content">
					<blockquote class="blockquote mt-2 bg-surface-300/10">
						<ul class="list mt-2 space-y-4 py-2">
							<li>
								Níže jsou vypsany všechny aktuálně veřejně přístupné nabídky školy {schoolData.name}
							</li>
							<li>
								Pokud se nabídka zobrazuje tady, je stále aktivní a můžete se k ní přihlásit po
								kontaktování odpovědné osoby školy.
							</li>
							<li>
								Sdělte odpovědné osobě datum a čas požadované nabídky a následně sdělté také své ID
								uživatele, které naleznete výše, vpravo od informačního bloku kontaktu na odpovědnou
								osobu.
							</li>
							<li>
								Poté budete přiřazení jako vyučující dané rozvrhové akce a následně se RA objeví ve
								Vaši agendě a bude z burzy stažená.
							</li>
							<li>
								Výše odměny a další administrativní formality jsou plně po předchzozí domluvě s
								odpovědnou osobou školy.
							</li>
						</ul>
					</blockquote>
				</svelte:fragment>
			</AccordionItem>
		</Accordion>
		<hr class="mt-6" />
	{/if}
	<div class="mt-8 flex flex-col space-y-12">
		{#if !Object.keys(groupedTrCards).length}
			<div class="variant-soft-surface flex w-full flex-col items-center rounded-lg p-4">
				<h2 class="h2">Žádné nabídky</h2>
				<p class="opacity-60">Tato škola zatím nezveřejnila žádnou nabídku</p>
			</div>
		{:else}
			{#each Object.entries(groupedTrCards) as [date, records], i}
				<div class="variant-soft-surface flex w-full flex-col space-y-4 rounded-lg p-4">
					<h2 class="h2">
						{#if date === today}
							Dnes <small class="text-sm">({date})</small>
						{:else}
							{date}
						{/if}
					</h2>
					<div class="flex flex-wrap gap-6">
						{#each records as record (record.id)}
							<div
								class={`card variant-ghost-surface min-w-80 max-w-80 flex-1 rounded-md shadow-md dark:shadow-none ${isPast(record.dateFrom) && 'opacity-40'}`}
							>
								<header class="card-header flex justify-between">
									<p class="text-lg font-semibold text-primary-800 dark:text-primary-500">
										{record.expand.group.name}
									</p>
									<p class="font-thin">{new Date(record.dateFrom).toLocaleDateString('cs-CZ')}</p>
								</header>
								<div class="card-body flex flex-col px-4">
									<div class="flex w-full justify-around">
										<div>
											{new Date(record.dateFrom).toLocaleTimeString('cs-CZ', {
												hour: '2-digit',
												minute: '2-digit'
											})}
										</div>
										<div>
											{new Date(record.dateTo).toLocaleTimeString('cs-CZ', {
												hour: '2-digit',
												minute: '2-digit'
											})}
										</div>
									</div>
									<div class="flex flex-col gap-2">
										<div>Počet: do {record.expand.group.max_students_count} osob</div>
										<div>
											Věk: {record.expand.group.ageFrom}-{record.expand.group.ageTo === 0
												? '18+'
												: record.expand.group.ageTo}
										</div>
									</div>
								</div>
							</div>
						{/each}
					</div>
				</div>
			{/each}
		{/if}
	</div>
	{#if data.userRole !== 'school'}
		<a href="/exchange" class="variant-ghost-surface btn mt-2">Zpět</a>
	{/if}
</main>
