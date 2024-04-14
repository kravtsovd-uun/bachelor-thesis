import { error, redirect, fail } from '@sveltejs/kit';
import { superValidate, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';

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

			await locals.pb.collection('study_groups').create(form.data);
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
