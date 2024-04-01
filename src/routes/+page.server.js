import { redirect, fail } from '@sveltejs/kit';
import { superValidate, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import { startOfToday } from 'date-fns';

async function loadAvailableStudyGroups(db) {
	const result = await db
		.collection('study_groups')
		.getFullList({ skipTotal: true, sorted: 'created', filter: 'active=true', fields: 'id,name' });
	return result;
}

// Defined outside the load function so the adapter can be cached
const utrCreateSchema = z.object({
	group: z.string().regex(/([a-z0-9]{15})+/, 'Must be exactly 15 symbols'),
	dateFrom: z.coerce
		.date()
		.min(new Date('2024-01-01'), { message: 'Datum od nemůže být starší 2024-01-01 ' }),
	dateTo: z.coerce
		.date()
		.max(new Date('2025-12-31'), { message: 'Datum do nemůže být starší 2025-12-31 ' })
});

export const load = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(303, '/login');
	}
	const testForm = await superValidate(zod(utrCreateSchema));

	const localeTodayStart = startOfToday().toISOString();
	const userTimeRecords = await locals.pb.collection('time_records').getList(1, 10, {
		expand: 'teacher, school, group',
		fields: '*, expand.teacher.name, expand.school.name, expand.school.id, expand.group.*',
		filter: `dateFrom > '${localeTodayStart}'`,
		sort: 'dateFrom'
	});

	const study_groups = await loadAvailableStudyGroups(locals.pb);

	return {
		userTimeRecords: userTimeRecords,
		study_groups: study_groups,
		testForm
	};
};

export const actions = {
	default: async ({ request, locals }) => {
		const form = await superValidate(request, zod(utrCreateSchema));

		if (!form.valid) {
			fail(400, { form });
		} else {
			form.data.school = locals.pb.authStore.model.employee_of[0];
			form.data.teacher = 'cvoh6kqgyy6jjbk';
			await locals.pb.collection('time_records').create(form.data);
			return message(form, 'Form has been succesfully submitted');
		}

		return { form };
	}
};
