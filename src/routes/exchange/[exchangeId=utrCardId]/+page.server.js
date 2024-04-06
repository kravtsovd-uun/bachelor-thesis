import { redirect } from '@sveltejs/kit';

export async function load({ params, locals }) {
	if (!locals.user) {
		redirect(303, '/login');
	}

	const result = await locals.pb.collection('time_records').getList(1, 10, {
		sorted: 'dateFrom',
		//isPublic is filtered on the DB side first, but we need to handle a case, when manager of the school views the exchange.
		filter: `school.id='${params.exchangeId}'&&isPublic=true`,
		query: {'dashboardRoute': 'false'}
	});

	return { result: result.items };
}
