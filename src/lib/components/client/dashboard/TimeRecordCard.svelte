<script>
	import { processUserInitials } from '$lib/serviceFunctions.js';

	export let trcID = 'invalid_id';
	export let groupName = 'Blue Lagoon 02';
	export let groupStudentCount = 15;
	export let groupStudentAgeFrom = 16;
	export let groupStudentAgeTo;
	export let room = 'Recepce';
	export let date = '2024-03-30';
	// export let teacherAvatar = '';
	// export let schoolAvatar = '';
	export let schoolName = 'Jaška';
	export let teacherName = 'Náhradní učitel';
	export let teacherAvatar = '';
	export let schoolAvatar = '';
	export let userRole = 'teacher';
	export let timeFrom = '2024-03-30T09:00:00.000Z';
	export let timeTo = '2024-03-30T10:30:00.000Z';
	export let notPrimarySchool = false;

	import { Avatar } from '@skeletonlabs/skeleton';
	import { isPast as checkPast, subMinutes } from 'date-fns';
	let isPast = checkPast(timeFrom);
	let isLessThanHour = !isPast && checkPast(subMinutes(timeFrom, 60));

	function formatTRDIssuerOrSolver() {
		return userRole === 'school' ? teacherName : schoolName;
	}

	function formatTRDIssuerOrSolverAvatar() {
		return userRole === 'school' ? teacherAvatar : schoolAvatar;
	}
</script>

<a
	href={`/dashboard/${trcID}`}
	class={`card variant-ghost-primary card-hover min-w-80 max-w-80 flex-1 ${isPast && 'opacity-40'} ${notPrimarySchool && 'variant-ghost-secondary'} ${teacherName === 'Žádný učitel' && 'variant-ghost-warning'}
	rounded-md shadow-md dark:shadow-none`}
>
	<header class="card-header p-2">
		<div class="flex w-full justify-between">
			<div class="text-surface-900-50-token flex flex-col">
				<h3 class="h3">{groupName}</h3>
				<h6 class="h6">
					{new Date(date).toLocaleString('cs-CZ', {
						year: 'numeric',
						month: 'numeric',
						day: 'numeric'
					})}
				</h6>
			</div>
			{#if teacherName === 'Žádný učitel'}
				<span class="variant-filled-warning badge self-center">Veřejná</span>
			{/if}
			<!-- <Avatar initials="PP" background="bg-surface-400-500-token" width="w-12" class="h-12" /> -->
		</div>
	</header>
	<hr class="!border-surface-400-500-token mx-2 rounded-md !border-2" />
	<section class="p-2">
		<div class="flex flex-col">
			<div class="flex w-full justify-around">
				<div>
					{new Date(timeFrom).toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' })}
				</div>
				<div>
					{new Date(timeTo).toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' })}
				</div>
			</div>
			<div class="flex flex-col gap-2">
				<div>Počet: do {groupStudentCount} osob</div>
				<div>Věk: {groupStudentAgeFrom}-{groupStudentAgeTo === 0 ? '18+' : groupStudentAgeTo}</div>
			</div>
		</div>
	</section>
	<hr class="!border-surface-400-500-token mx-2 rounded-md !border-2" />
	<footer class="card-footer flex justify-between p-2">
		<div class="flex items-center gap-2">
			<Avatar
				src={formatTRDIssuerOrSolverAvatar()}
				initials={processUserInitials(formatTRDIssuerOrSolver())}
				background="bg-surface-400-500-token"
				width="w-10"
				class="h-10"
			/>
			<h5 class="text-primary-700-200-token h5">{formatTRDIssuerOrSolver()}</h5>
		</div>
		{#if isLessThanHour}
			<span class="variant-ghost-error badge">Méně než za 1 hodinu</span>
		{:else}
			<p class="my-auto font-thin">{room}</p>
		{/if}
	</footer>
</a>
