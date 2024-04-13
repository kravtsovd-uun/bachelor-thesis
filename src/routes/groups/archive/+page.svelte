<script>
	export let data;
	const { groups } = data;
</script>

<main>
	<h1 class="h1 mt-2 px-4">Archiv</h1>
	<hr class="mt-2" />

	<section class="mt-4 p-4">
		{#if groups.length !== 0}
			<h3 class="h3">Řazeno dle data poslední aktualizace</h3>
			<div class="mt-2 flex flex-wrap gap-4">
				{#each groups as group (group.id)}
					<a
						href={`/groups/${group.id}`}
						class={`card card-hover flex min-w-[240px] max-w-sm flex-[1_0_auto] flex-col`}
					>
						<header class="card-header flex flex-col mb-4">
							<div class="flex justify-between">
								<h4 class="h4 font-bold">{group.name}</h4>
							</div>
							<small class="text-zinc-600 dark:text-zinc-300/60">
								Vytvořeno: {new Date(group.created).toLocaleString('cs-CZ')}
							</small>
                            <p class="text-sky-600 dark:text-sky-300/60">
								Aktualizováno: {new Date(group.updated).toLocaleString('cs-CZ')}
							</p>
						</header>
					</a>
				{/each}
			</div>
		{:else}
			<h3 class="h3 text-center font-bold">Archiv je prázdný</h3>
		{/if}
		<a href="/groups" class="variant-ghost-surface btn mt-8 w-32">Zpět</a>
	</section>
</main>
