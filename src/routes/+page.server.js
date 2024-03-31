import { redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';

// Define outside the load function so the adapter can be cached
const testSchema = z.object({
	name: z.string().default('Hello world!'),
	email: z.string().email()
});

export const load = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(303, '/login');
	}
	const testForm = await superValidate(zod(testSchema));

	const userTimeRecords = await locals.pb.collection('time_records').getList(1, 10, {
		expand: 'teacher, school, group',
		fields: '*, expand.teacher.name, expand.school.name, expand.school.id, expand.group.*',
		filter: 'dateFrom > @todayStart',
		sort: 'dateFrom'
	});

	return {
		userTimeRecords: userTimeRecords,
		testForm
	};
};
