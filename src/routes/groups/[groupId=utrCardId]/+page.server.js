import { error, redirect, fail } from '@sveltejs/kit';
import { superValidate, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';

import { nextDay, isSameDay, addDays, isAfter, formatISO } from 'date-fns';

const groupDetailSchema = z.object({
	responsible: z.string().regex(/^([a-z0-9]{15})$/, 'Responsible ID must be exactly 15 symbols'),
	name: z
		.string()
		.regex(
			/^[a-zA-Z0-9\s]{6,32}$/,
			'Jméno může obsahovat pouze latinská písmena a číslice. Min. délka 6 symbolů. Max. délka 32 symbolů.'
		),
	studyOn: z
		.string()
		.regex(
			/^([1-7](,|$)){1,7}$/,
			'Povoleny jsou jenom číslice 1 až 7 nebo čárky bez mezer. Max. délka řádku včetně čárek 13 symbolů. Duplicity budou odstraněny.'
		),
	max_students_count: z.number().int().positive().safe(),
	ageFrom: z.number().int().positive().safe(),
	ageTo: z.number().int().positive().safe(),
	startDate: z.coerce
		.date()
		.min(new Date('2024-01-01'), { message: 'Datum od nemůže být starší 2024-01-01 ' }),
	endDate: z.coerce
		.date()
		.max(new Date('2025-12-31'), { message: 'Datum do nemůže být starší 2025-12-31 ' }),
	active: z.boolean({ invalid_type_error: 'Hodnota musí být logického typu (true/false)' })
});

async function loadGroupDetailRelationsData(db) {
	const teachers = await db.collection('users').getFullList({ sort: 'created', fields: 'id,name' });

	return {
		teachers
	};
}

export async function load({ params, locals }) {
	if (!locals.pb.authStore.isValid) {
		throw redirect(303, '/login');
	}

	if (locals.user.role !== 'school') {
		throw error(403, 'Tato stránka je přistupná pouze pro manažeřy škol');
	}
	const groupDetailUpdateForm = superValidate(zod(groupDetailSchema));

	const groupDetail = locals.pb.collection('study_groups').getOne(params.groupId, {
		expand: 'responsible',
		fields: '*,expand.responsible.id, expand.responsible.name'
	});

	const groupDetailRelationsData = loadGroupDetailRelationsData(locals.pb);

	const resolve = await Promise.all([groupDetail, groupDetailRelationsData, groupDetailUpdateForm]);

	if (!resolve[0]) {
		error(404, 'Hledaná skupina neexistuje');
	}

	return {
		groupDetail: resolve[0],
		responsibleList: resolve[1],
		groupDetailUpdateForm: resolve[2]
	};
}

export const actions = {
	groupDetailUpdate: async ({ request, locals, params }) => {
		const form = await superValidate(request, zod(groupDetailSchema));

		if (!form.valid) {
			fail(400, { form });
		} else {
			form.data.studyOn = getUniqueDaysOfWeek(form.data.studyOn);

			//oldRecordData for check whenever new record data relational fields updated. If yes - upate all related utr.
			const resolve = await Promise.all([
				locals.pb.collection('study_groups').getOne(params.groupId),
				locals.pb.collection('study_groups').update(params.groupId, { ...form.data })
			]);

			const oldRecordData = resolve[0];
			const newRecordData = resolve[1];

			const relData = checkRelationalDataChanged(oldRecordData, newRecordData);

			relData !== 0 && (await processRelatedUtrsUpdate(locals.pb, newRecordData, relData));

			message(form, 'The record has been succesfully updated');
			throw redirect(303, '/groups');
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

function checkRelationalDataChanged(oldRecordData, newRecordData) {
	/*
	0 - Other changes
	1 - responsible only change. Update existing utrs.
	2 - other relational data change. Delete and reacreate all utrs.
	*/
	let result = 0;

	if (oldRecordData.responsible !== newRecordData.responsible) result = 1;

	if (JSON.stringify(oldRecordData.studyOn) !== JSON.stringify(newRecordData.studyOn)) {
		result = 2;
		return result;
	}

	if (oldRecordData.startDate !== newRecordData.startDate) {
		result = 2;
		return result;
	}

	if (oldRecordData.endDate !== newRecordData.endDate) {
		result = 2;
		return result;
	}

	return result;
}

async function processRelatedUtrsUpdate(db, groupNewData, changeIdx) {
	let groupUtrsData;

	switch (changeIdx) {
		case 1:
			groupUtrsData = await db
				.collection('time_records')
				.getFullList({ filter: `group='${groupNewData.id}'`, fields: 'id' });
			processResponsibleChange(db, groupUtrsData, groupNewData.responsible);
			break;

		case 2:
			//Delete whole group with utr db cascade deletion and recreate all utrs again with newly provided data
			deleteGroupUtrs(db, groupNewData.id);
			recreateGroupAndUtrs(db, groupNewData);
	}
}

async function processResponsibleChange(db, utrArray, responsibleId) {
	if (utrArray.length === 0) return;

	const utrsUpdatePromiseArr = [];

	utrArray.forEach((el) => {
		utrsUpdatePromiseArr.push(
			db.collection('time_records').update(el.id, { teacher: responsibleId }, { requestKey: null })
		);
	});

	await Promise.all(utrsUpdatePromiseArr);
}

async function deleteGroupUtrs(db, groupId) {
	await db.collection('study_groups').delete(groupId);
}

async function recreateGroupAndUtrs(db, groupData) {
	delete groupData.id; //ID in db will be regenerated.

	const createdGroup = await db.collection('study_groups').create(groupData);

	const datesArr = calcUtrTimestamps(
		createdGroup.studyOn,
		createdGroup.startDate,
		createdGroup.endDate
	);

	const resultInstanceTimestampsArr = [];

	datesArr.forEach((date) => {
		const formatStartDate = new Date(date);
		formatStartDate.setHours(new Date(createdGroup.startDate).getHours());
		formatStartDate.setMinutes(new Date(createdGroup.startDate).getMinutes());

		const formatEndDate = new Date(date);
		formatEndDate.setHours(new Date(createdGroup.endDate).getHours());
		formatEndDate.setMinutes(new Date(createdGroup.endDate).getMinutes());

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

		const createUtrPromise = db.collection('time_records').create(utrData, { requestKey: null }); //requestKey = null enables disable mass request auto cancellation for single batch

		createUtrsPromiseArr.push(createUtrPromise);
	});
	//Create all user time records in specified range via mass Promise
	await Promise.all(createUtrsPromiseArr);
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
