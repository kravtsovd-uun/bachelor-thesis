<script>
	import SidebarControl from './controls/SidebarControl.svelte';

	export let userRole = 'teacher';

	const controls = [
		{ link: '/', title: 'Agenda' },
		{ link: '/profile', title: 'Profil' },
		{ link: '/employees', title: 'Zaměstnanci' },
		{ link: '/groups', title: 'Skupiny' },
		{ link: '/exchange', title: 'Burza' }
	];
</script>

<aside class="w-[15rem] border-r-2 border-primary-500 border-opacity-30">
	<h3 class="text-surface-700-200-token h3 ml-6 mt-4 font-bold">Navigace</h3>
	<div class="mt-4 flex flex-col items-center gap-6">
		<SidebarControl link={controls[0].link} title={controls[0].title} />
		<SidebarControl link={controls[1].link} title={controls[1].title} />
		{#if userRole === 'school'}
			<SidebarControl link={controls[2].link} title={controls[2].title} />
			<SidebarControl link={controls[3].link} title={controls[3].title} />
		{/if}
		<SidebarControl link={controls[4].link} title={controls[4].title} />

		<form method="POST" action="/logout">
			<button type="submit" class="variant-outline-error btn w-48 hover:variant-filled-error"
				>Odhlásit se</button
			>
		</form>
	</div>
</aside>
