<script>
	import { Avatar } from '@skeletonlabs/skeleton';
	import { processUserInitials } from '$lib/serviceFunctions.js';

	export let data;
	const { publicTeachers } = data;

	//Will be sorted by city as well
	const groupedPublicTeachers = publicTeachers.reduce((acc, record) => {
		if (!acc[record.city]) {
			acc[record.city] = [];
		}
		acc[record.city].push(record);
		return acc;
	}, {});

	//Sort additionally teachers by name in each city
	Object.keys(groupedPublicTeachers).forEach((city) => {
		groupedPublicTeachers[city].sort((a, b) => {
			const nameA = a.name.toUpperCase(); // ignore upper and lowercase
			const nameB = b.name.toUpperCase(); // ignore upper and lowercase
			if (nameA < nameB) {
				return -1;
			}
			if (nameA > nameB) {
				return 1;
			}
			return 0; // names must be equal
		});
	});

	function checkIsOwnEmployee(teacher) {
		let isOwnEmployee = false;
		isOwnEmployee = teacher.expand.employee_of.every((school) => {
			if (school.id === data.userSchoolId) {
				return false;
			}
			return true;
		});
		return !isOwnEmployee; //bcs of every() mechanics we need to return inverted value
	}
</script>

<main class="px-4">
	<div class="mt-8 flex flex-col space-y-12">
		{#each Object.entries(groupedPublicTeachers) as [city, records], i}
			<div class="variant-soft-surface flex w-full flex-col space-y-4 rounded-lg p-4">
				<h2 class="h2">
					{city}
				</h2>
				<div class="flex flex-wrap gap-6">
					{#each records as record (record.id)}
						<div
							class={`card min-w-80 max-w-80 flex-1 rounded-md shadow-md dark:shadow-none ${checkIsOwnEmployee(record) ? 'variant-ghost-warning' : 'variant-ghost-surface'}`}
						>
							<header class="card-header flex items-center justify-between">
								<p class="text-2xl font-semibold text-primary-800 dark:text-primary-500">
									{record.name}
								</p>
								<Avatar
									src={record.avatarSrc}
									initials={processUserInitials(record.name)}
									width="w-12 2xl:w-16"
								/>
							</header>
							<div class="card-body my-2 px-4 font-thin">
								<hr class="!border-2" />
								<div class="flex flex-col">
									<a
										href={`mailto:${record.email}?subject=UUN LMS - Poptávka výuky ve škole [NÁZEV VAŠI ŠKOLY]`}
										class="anchor mt-1 2xl:text-lg">{record.email}</a
									>
									<a href={`tel:${record.phone.replace(/\s+/g, '')}`} class="anchor 2xl:text-lg"
										>{record.phone}</a
									>
								</div>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/each}
	</div>

	<a href="/exchange" class="variant-filled-primary btn mt-2">Burza</a>
</main>
