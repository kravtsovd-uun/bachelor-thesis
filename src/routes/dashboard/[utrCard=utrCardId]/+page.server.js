import { error, redirect, fail } from '@sveltejs/kit';
import { superValidate, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';

const utrDetailSchema = z.object({
	teacher: z.string().regex(/^([a-z0-9]{15})$/, 'Teacher ID must be exactly 15 symbols'),
	group: z.string().regex(/^([a-z0-9]{15})$/, 'Group ID must be exactly 15 symbols'),
	room: z.literal('testRoom').default('testRoom'),
	dateFrom: z.coerce
		.date()
		.min(new Date('2024-01-01'), { message: 'Datum od nemůže být starší 2024-01-01 ' }),
	dateTo: z.coerce
		.date()
		.max(new Date('2025-12-31'), { message: 'Datum do nemůže být starší 2025-12-31 ' }),
	isPublic: z.coerce.boolean()
});

//Load available study groups and teachers data for logined school account
async function loadUtrDetailRelationsData(db) {
	const study_groups = db
		.collection('study_groups')
		.getFullList({ sort: 'created', filter: 'active=true', fields: 'id,name' });
	const teachers = db.collection('users').getFullList({ sort: 'created', fields: 'id,name' });
	const resolve = await Promise.all([study_groups, teachers]);

	return {
		groups: resolve[0],
		teachers: resolve[1]
	};
}

export async function load({ params, locals }) {
	if (!locals.user) {
		throw redirect(303, '/login');
	}

	const utrDetailUpdateForm = superValidate(zod(utrDetailSchema));

	const res = locals.pb.collection('time_records').getOne(params.utrCard, {
		expand: 'teacher,school,group',
		fields:
			'*,expand.teacher.id,expand.teacher.name,expand.school.id,expand.school.name,expand.group.id,expand.group.name'
	});

	const utrDetailRelationsData = loadUtrDetailRelationsData(locals.pb);

	const resolve = await Promise.all([utrDetailUpdateForm, res, utrDetailRelationsData]);

	if (!resolve[1]) {
		error(404, 'Not found by given ID');
	}

	return {
		userSchoolId: locals.user.employee_of[0],
		userRole: locals.user.role,
		utrDetailUpdateForm: resolve[0],
		cardData: resolve[1],
		utrDetailRelationsData: resolve[2]
	};
}

export const actions = {
	utrCardUpdate: async ({ request, locals, params }) => {
		const form = await superValidate(request, zod(utrDetailSchema));

		if (!form.valid) {
			fail(400, { form });
		} else {
			await locals.pb.collection('time_records').update(params.utrCard, { ...form.data });
			return message(form, 'The record has been succesfully updated');
		}

		return { form };
	}
};
