import { error, redirect, fail } from '@sveltejs/kit';
import { superValidate, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';

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

			relData.hasChanged &&
				(await processRelatedUtrsUpdate(locals.pb, newRecordData, relData.cause));

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
	//TODO: Change to array format, there might be several causes
	const result = { hasChanged: false, cause: 'none' };

	if (oldRecordData.responsible !== newRecordData.responsible) {
		result.hasChanged = true;
		result.cause = 'responsible';
	} else if (JSON.stringify(oldRecordData.studyOn) !== JSON.stringify(newRecordData.studyOn)) {
		result.hasChanged = true;
		result.cause = 'studyOn';
	} else if (oldRecordData.startDate !== newRecordData.startDate) {
		result.hasChanged = true;
		result.cause = 'startDate';
	} else if (oldRecordData.endDate !== newRecordData.endDate) {
		result.hasChanged = true;
		result.cause = 'endDate';
	}

	return result;
}

async function processRelatedUtrsUpdate(db, groupNewData, changeSrc) {
	let groupUtrsData;

	switch (changeSrc) {
		case 'responsible':
			groupUtrsData = await db
				.collection('time_records')
				.getFullList({ filter: `group='${groupNewData.id}'`, fields: 'id' });
			processResponsibleChange(db, groupUtrsData, groupNewData.responsible);
			break;

		case 'studyOn':
			//TODO: Delete whole group and recreate all utrs again with new provided data
			break;

		case 'startDate':
			groupUtrsData = await db
				.collection('time_records')
				.getFullList({ filter: `group='${groupNewData.id}'`, fields: 'id,startDate' });
			break;

		case 'endDate':
			groupUtrsData = await db
				.collection('time_records')
				.getFullList({ filter: `group='${groupNewData.id}'`, fields: 'id,endDate' });
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
