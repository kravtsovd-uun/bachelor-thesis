import { redirect, fail } from '@sveltejs/kit';
import { superValidate, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import { startOfToday } from 'date-fns';

// Defined outside the load function so the adapter can be cached
const utrCreateSchema = z.object({
	school: z.string().regex(/([a-z0-9]{15})+/),
	group: z.string().regex(/([a-z0-9]{15})+/),
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

	return {
		userTimeRecords: userTimeRecords,
		testForm
	};
};

export const actions = {
	default: async ({ request, locals }) => {
		const form = await superValidate(request, zod(utrCreateSchema));

		if (!form.valid) {
			fail(400, { form });
		} else {
			await locals.pb.collection('time_records').create(form.data);
			message(form, 'Form has been succesfully submitted');
			throw redirect(303, '/');
		}

		return { form };
	}
};
