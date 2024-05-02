import { redirect, fail } from '@sveltejs/kit';
import { superValidate, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import { startOfToday } from 'date-fns';

//Load available study groups and teachers data for logined school account
async function loadUtrCreateRelationsData(db) {
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

// Defined outside the load function so the adapter can be cached
const utrCreateSchema = z.object({
	group: z.string().regex(/^([a-z0-9]{15})$/, 'Group ID must be exactly 15 symbols'),
	teacher: z.string().regex(/^([a-z0-9]{15})$/, 'Teacher ID must be exactly 15 symbols'),
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
	const localeTodayStart = startOfToday().toISOString();

	const testForm = superValidate(zod(utrCreateSchema));

	const userTimeRecords = locals.pb.collection('time_records').getList(1, 10, {
		expand: 'teacher, school, group',
		fields:
			'*, expand.teacher.id, expand.teacher.collectionId, expand.teacher.name, expand.teacher.avatar, expand.school.avatar, expand.school.collectionId, expand.school.name, expand.school.id, expand.group.*',
		filter: `dateFrom > '${localeTodayStart}'`,
		sort: 'dateFrom',
		query: { dashboardRoute: 'true' }
	});

	const utrCreateRelationsData = loadUtrCreateRelationsData(locals.pb);

	const resolve = await Promise.all([testForm, userTimeRecords, utrCreateRelationsData]);

	//Filter utr only from active and not archived groups
	resolve[1].items = resolve[1].items.filter(
		(utr) => utr.expand.group.active && !utr.expand.group.archived
	);

	resolve[1].items.forEach((el) => {
		if (el.expand.teacher && el.expand.teacher.avatar) {
			el.expand.teacher.avatarSrc = locals.pb.files.getUrl(
				el.expand.teacher,
				el.expand.teacher.avatar,
				{ thumb: '100x100' }
			);
		}
		if (el.expand.school.avatar) {
			el.expand.school.avatarSrc = locals.pb.files.getUrl(
				el.expand.school,
				el.expand.school.avatar,
				{ thumb: '100x100' }
			);
		}
	});
	return {
		testForm: resolve[0],
		userTimeRecords: resolve[1],
		utrCreateRelationsData: resolve[2]
	};
};

export const actions = {
	default: async ({ request, locals }) => {
		const form = await superValidate(request, zod(utrCreateSchema));

		if (!form.valid) {
			fail(400, { form });
		} else {
			form.data.school = locals.pb.authStore.model.employee_of[0];
			await locals.pb.collection('time_records').create(form.data);
			return message(form, 'Položka byla úspěšně vytvořena');
		}

		return { form };
	}
};
