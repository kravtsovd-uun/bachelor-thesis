import { json } from '@sveltejs/kit';
import { startOfToday } from 'date-fns';

export async function GET({ url, locals }) {
	const page = Number(url.searchParams.get('page') ?? 1);
	const perPage = Number(url.searchParams.get('perPage') ?? 10);

	const localeTodayStart = startOfToday().toISOString();
	const res = await locals.pb.collection('time_records').getList(page, perPage, {
		expand: 'teacher, school, group',
		fields: '*, expand.teacher.name, expand.school.name, expand.school.id, expand.group.name',
		filter: `dateFrom > '${localeTodayStart}'`,
		sort: 'dateFrom'
	});

	return json(res);
}
