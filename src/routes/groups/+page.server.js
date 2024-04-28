import { error, redirect, fail } from '@sveltejs/kit';
import { superValidate, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import { isAfter, nextDay, addDays, isSameDay, formatISO } from 'date-fns';

async function loadGroupCreateRelationsData(db) {
	const teachers = await db.collection('users').getFullList({ sort: 'created', fields: 'id,name' });

	return {
		teachers
	};
}

// Defined outside the load function so the adapter can be cached
const groupCreateSchema = z.object({
	responsible: z.string().regex(/^([a-z0-9]{15})$/, 'Responsible ID must be exactly 15 symbols'),
	name: z
		.string()
		.regex(
			/^[a-zA-Z0-9\s]{6,32}$/,
			'Jméno může obsahovat pouze latinská písmena a číslice. Min. délka 6 symbolů. Max. délka 32 symbolů.'
		)
		.default('Nová skupina'),
	studyOn: z
		.string()
		.regex(
			/^([1-7](,|$)){1,7}$/,
			'Povoleny jsou jenom číslice 1 až 7 nebo čárky bez mezer. Max. délka řádku včetně čárek 13 symbolů. Duplicity budou odstraněny.'
		)
		.default('1,2,3,4,5'),
	max_students_count: z.number().int().positive().safe().default(15),
	ageFrom: z.number().int().positive().safe().default(6),
	ageTo: z.number().int().positive().safe().default(0),
	startDate: z.coerce
		.date()
		.min(new Date('2024-01-01'), { message: 'Datum od nemůže být starší 2024-01-01 ' }),
	endDate: z.coerce
		.date()
		.max(new Date('2025-12-31'), { message: 'Datum do nemůže být starší 2025-12-31 ' }),
	active: z
		.boolean({ invalid_type_error: 'Hodnota musí být logického typu (true/false)' })
		.default(true)
});

export async function load({ locals }) {
	if (!locals.pb.authStore.isValid) {
		throw redirect(303, '/login');
	}

	if (locals.user.role !== 'school') {
		throw error(403, 'Tato stránka je přistupná pouze pro manažeřy škol');
	}

	const groups = locals.pb.collection('study_groups').getFullList({
		sort: '-startDate',
		expand: 'responsible',
		filter: 'archived=false',
		fields:
			'*, expand.responsible.name, expand.responsible.avatar, expand.responsible.id, expand.responsible.collectionId'
	});

	const groupCreateRelationsData = loadGroupCreateRelationsData(locals.pb);

	const groupCreateForm = superValidate(zod(groupCreateSchema));

	const resolve = await Promise.all([groups, groupCreateRelationsData, groupCreateForm]);

	resolve[0].forEach((group) => {
		if (Object.prototype.hasOwnProperty.call(group, 'expand') && group.expand.responsible.avatar) {
			group.expand.responsible.avatarSrc = locals.pb.files.getUrl(
				group.expand.responsible,
				group.expand.responsible.avatar,
				{ thumb: '100x100' }
			);
		}
	});

	return {
		groups: resolve[0],
		groupCreateRelationsData: resolve[1],
		groupCreateForm: resolve[2]
	};
}

export const actions = {
	groupCreate: async ({ request, locals, params }) => {
		const form = await superValidate(request, zod(groupCreateSchema));

		if (!form.valid) {
			fail(400, { form });
		} else {
			form.data.owner = locals.pb.authStore.model.employee_of[0];
			form.data.studyOn = getUniqueDaysOfWeek(form.data.studyOn);
			form.data.active = true;

			const createdGroup = await locals.pb.collection('study_groups').create(form.data);

			const datesArr = calcUtrTimestamps(
				createdGroup.studyOn,
				form.data.startDate,
				form.data.endDate
			);

			const resultInstanceTimestampsArr = [];

			datesArr.forEach((date) => {
				const formatStartDate = new Date(date);
				formatStartDate.setHours(form.data.startDate.getHours());
				formatStartDate.setMinutes(form.data.startDate.getMinutes());

				const formatEndDate = new Date(date);
				formatEndDate.setHours(form.data.endDate.getHours());
				formatEndDate.setMinutes(form.data.endDate.getMinutes());

				const resultStartDate = formatISO(formatStartDate);
				const resultEndDate = formatISO(formatEndDate);

				resultInstanceTimestampsArr.push({ startDate: resultStartDate, endDate: resultEndDate });
			});

			const createUtrsPromiseArr = [];

			resultInstanceTimestampsArr.forEach((el) => {
				const utrData = {
					school: createdGroup.owner,
					teacher: createdGroup.responsible,
					group: createdGroup.id,
					room: 'testRoom',
					dateFrom: el.startDate,
					dateTo: el.endDate
				};

				const createUtrPromise = locals.pb
					.collection('time_records')
					.create(utrData, { requestKey: null }); //requestKey = null enables disable mass request auto cancellation for single batch

				createUtrsPromiseArr.push(createUtrPromise);
			});

			//Create all user time records in specified range via mass Promise
			await Promise.all(createUtrsPromiseArr);

			return message(form, 'The record has been succesfully updated');
			// throw redirect(303, '/groups');
		}

		return { form };
	}
};

function getUniqueDaysOfWeek(stringInput) {
	// Split the input string by commas to get an array of digits
	const splitArr = stringInput.split(',');

	const sanitazedDigits = splitArr.filter((val) => val !== '');

	// Check for duplicate numbers using a Set.
	const uniqueDayValues = new Set([...sanitazedDigits].sort());

	//Return sorted string array suitable for DB field format.
	return Array.from(uniqueDayValues);
}

function calcUtrTimestamps(daySequence, startDate, endDate) {
	let numbers = daySequence.map((digit) => +digit); //Convert string value to integer with unary + operator.
	let results = [];

	//handle first day occurance if within studyOn array
	numbers.forEach((number) => {
		const searchedDay = nextDay(new Date(addDays(new Date(startDate), -7)), number);

		if (isSameDay(new Date(searchedDay), new Date(startDate))) {
			results.push(searchedDay.toISOString().slice(0, 10));
		}
	});

	numbers.forEach((number) => {
		processNextOccurences(startDate, endDate, number, results);
	});

	return results;
}

function processNextOccurences(startDate, endDate, dayNumber, resultArr) {
	if (isAfter(new Date(startDate), new Date(endDate))) {
		return;
	}

	const nextDayOccurence = nextDay(new Date(startDate), dayNumber);

	//prevent pushing occasionally overflow date
	!isAfter(new Date(nextDayOccurence), new Date(endDate)) &&
		resultArr.push(nextDayOccurence.toISOString().slice(0, 10));

	processNextOccurences(addDays(new Date(startDate), 7), endDate, dayNumber, resultArr);
}
