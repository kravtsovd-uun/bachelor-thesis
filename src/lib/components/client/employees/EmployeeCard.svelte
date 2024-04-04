<script>
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { Avatar } from '@skeletonlabs/skeleton';
	import { processUserInitials } from '$lib/serviceFunctions.js';
	import { fade } from 'svelte/transition';

	export let employeeProps;
	const { employee } = employeeProps;

	let isFired = false;

	const modalStore = getModalStore();
	const modal = {
		type: 'confirm',

		title: 'Potvrzení o propuštění vyučujícího',
		body: `Opravdu si přejete učitele ${employee.name} odstranit ze seznamu zaměstnanců Vaši školy?`,
		response: async (r) => {
			if (r) {
				await fetch(`/api/employees`, {
					method: 'PATCH',
					body: JSON.stringify(employee.id),
					headers: { 'content-type': 'application/json' }
				}).then(() => (isFired = true));
			}
		}
	};
</script>

{#if !isFired}
	<div
		class="card variant-ghost-surface flex flex-col justify-between space-y-4 rounded-md"
		transition:fade={{ duration: 1000 }}
	>
		<header class="card-header flex items-end gap-2">
			<Avatar src={employee.avatarSrc} initials={processUserInitials(employee.name)} width="w-12" />
			<h4 class="text-surface-800-100-token h4 font-bold">{employee.name}</h4>
		</header>
		<div class="card-body flex-1 px-4">
			<p class="text-surface-800-100-token text-lg italic">Přiřazené skupiny</p>
			{#if employee.assigned_groups.length > 0}
				<ul
					class="scrollbar-hide list max-h-32 cursor-not-allowed space-y-2 overflow-y-auto opacity-50"
				>
					{#each employee.assigned_groups as ag (ag.id)}
						<li>
							<a
								href={`/studyGroups/${ag.id}`}
								class="bg-primary-300-600-token pointer-events-none w-full rounded-md p-1 text-center font-light"
								>{ag.name}</a
							>
						</li>
					{/each}
				</ul>
			{:else}
				<p class="bg-surface-300-600-token text-surface-600-300-token rounded-md p-1 text-center">
					Žádné skupiny
				</p>
			{/if}
		</div>
		<footer class="card-footer">
			<button
				class="variant-ghost-error btn w-full font-bold"
				disabled
				on:click={() => modalStore.trigger(modal)}>Propustit</button
			>
		</footer>
	</div>
{/if}

<style lang="postcss">
	.scrollbar-hide::-webkit-scrollbar {
		display: none;
	}
</style>
