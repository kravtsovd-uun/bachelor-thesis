import { redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(303, '/login');
	}

	const userTimeRecords = await locals.pb.collection('time_records').getList(1, 10, {
		expand: 'teacher, school, group',
		fields: '*, expand.teacher.name, expand.school.name, expand.group.*',
		filter: 'dateFrom > @todayStart',
		sort: 'dateFrom'
	});

	return {
		userTimeRecords: userTimeRecords
	};
};
