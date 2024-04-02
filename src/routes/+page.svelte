<script>
	import { addDays } from 'date-fns';
	import { formatDashboardDate } from '$lib/serviceFunctions.js';
	import { Paginator } from '@skeletonlabs/skeleton';
	import TimeRecordCard from '$lib/components/client/dashboard/TimeRecordCard.svelte';
	import NoDataThumbnail from '$lib/components/client/dashboard/NoDataThumbnail.svelte';
	import TestModalForm from '$lib/components/client/TestModalForm.svelte';

	import { superForm } from 'sveltekit-superforms';

	import { getModalStore } from '@skeletonlabs/skeleton';
	const modalStore = getModalStore();

	export let data;

	const { form, errors, constraints, message, enhance } = superForm(data.testForm, {
		resetForm: false
	});

	const formProps = {
		form,
		errors,
		constraints,
		message,
		enhance
	};

	const formModalComponent = {
		ref: TestModalForm,
		props: { formProps: formProps, utrCreateRelationsData: data?.utrCreateRelationsData }
	};

	const testModal = {
		type: 'component',
		component: formModalComponent,
		// Data
		title: 'Vytvořit novou nabídku',
		body: 'Vyplňte data a odešlete formulář'
	};

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

	let updatedUserTRData;
	let isFetchPending = false;

	let paginationSettings = {
		page: data.userTimeRecords.page - 1,
		limit: data.userTimeRecords.perPage,
		size: data.userTimeRecords.totalItems,
		amounts: [10, 20, 50]
	};

	$: paginationSettings.size = data.userTimeRecords.totalItems;

	async function onPageChange(event) {
		isFetchPending = true;
		const response = await fetch(`/api/dashboard/fetch-time-records?page=${event.detail + 1}`);
		const result = await response.json();

		updatedUserTRData = result;
		isFetchPending = false;
	}

	// Group user's time records by date
	// Object with keys as unique sorted formatted days. Each key contains related time record which belongs to that day
	// e.g.: {"30.3.2025": [{...record1Data}, {...record2Data}], ...}
	const groupedUserTimeRecords = data?.userTimeRecords.items.reduce((acc, record) => {
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

	$: updatedGroupedUserTimeRecords = updatedUserTRData?.items.reduce((acc, record) => {
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

<main class="p-4">
	<div class="flex justify-between">
		<h1 class="text-surface-700-200-token h1 font-bold">Agenda</h1>
		{#if data?.user.role === 'school'}
			<div
				class="variant-ghost-success btn-group rounded-md font-bold opacity-50 transition-opacity duration-300 hover:opacity-100"
			>
				<button>Vytvořit skupinu</button>
				<button on:click={() => modalStore.trigger(testModal)}>Vytvořit nabídku</button>
			</div>
		{/if}
	</div>
	{#if data?.userTimeRecords.items.length === 0}
		<NoDataThumbnail userRole={data?.user.role} />
	{:else}
		<!--If fetched records count is less than pagination minimum dispay option - paginator isn't shown-->
		{#if paginationSettings.size > paginationSettings.amounts[0]}
			<Paginator
				settings={paginationSettings}
				showNumerals
				maxNumerals={3}
				class="mt-4 max-w-xs"
				on:page={onPageChange}
				disabled={isFetchPending}
			/>
		{/if}
		<section class="mt-8 flex flex-col space-y-16">
			{#key updatedUserTRData}
				{#if isFetchPending}
					<section class="card mt-4 w-full rounded-lg">
						<h2 class="text-surface-700-200-token h2 p-4 text-2xl">
							Nahrávám agendu... Vyčkejte, prosím.
						</h2>
						<div class="space-y-4 p-4">
							<div class="placeholder animate-pulse" />
							<div class="grid grid-cols-3 gap-8">
								<div class="placeholder animate-pulse" />
								<div class="placeholder animate-pulse" />
								<div class="placeholder animate-pulse" />
							</div>
							<div class="grid grid-cols-4 gap-4">
								<div class="placeholder animate-pulse" />
								<div class="placeholder animate-pulse" />
								<div class="placeholder animate-pulse" />
								<div class="placeholder animate-pulse" />
							</div>
						</div>
					</section>
				{:else}
					{#each Object.entries(updatedGroupedUserTimeRecords ?? groupedUserTimeRecords) as [date, records]}
						<div class="variant-soft-surface flex w-full flex-col space-y-4 rounded-lg p-4">
							<h2 class="h2">
								{#if date === today}
									Dnes <small class="text-sm">({date})</small>
								{:else}
									{date}
								{/if}
							</h2>
							<div class="flex flex-wrap gap-6">
								{#each records as record}
									<TimeRecordCard
										groupName={record.expand.group.name}
										groupStudentCount={record.expand.group.max_students_count}
										groupStudentAgeFrom={record.expand.group.ageFrom}
										groupStudentAgeTo={record.expand.group.ageTo}
										room={record.room}
										date={record.dateFrom}
										schoolName={record.expand.school.name}
										teacherName={record.expand.teacher.name}
										timeFrom={record.dateFrom}
										timeTo={record.dateTo}
										notPrimarySchool={data?.user.employee_of[0] !== record.expand.school.id}
										userRole={data?.user.role}
									/>
								{/each}
							</div>
						</div>
					{/each}
				{/if}
				{#if data.page === data.totalPages}
					<NoDataThumbnail isDataLastPage userRole={data?.user.role} />
				{/if}
			{/key}
		</section>
	{/if}
</main>
