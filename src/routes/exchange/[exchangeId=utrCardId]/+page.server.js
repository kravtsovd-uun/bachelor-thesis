import { redirect } from '@sveltejs/kit';
import { startOfToday } from 'date-fns';

export async function load({ params, locals }) {
	if (!locals.user) {
		redirect(303, '/login');
	}

	const localeTodayStart = startOfToday().toISOString();

	const trCards = locals.pb.collection('time_records').getFullList({
		//isPublic is filtered on the DB side first, but we need to handle a case, when manager of the school views the exchange.
		filter: `dateFrom>'${localeTodayStart}'&&school.id='${params.exchangeId}'&&isPublic=true`,
		sort: 'dateFrom',
		query: { dashboardRoute: 'false' },
		expand: 'group'
	});
	const schoolData = locals.pb.collection('schools').getOne(params.exchangeId, {
		expand: 'responsiblePerson'
	});

	const resolve = await Promise.all([trCards, schoolData]);

	//Obtain school manager user avatar, pass empty value for fallback if image is not set
	resolve[1].expand.responsiblePerson.avatarSrc = '';
	if (resolve[1].expand.responsiblePerson.avatar) {
		const userRecord = resolve[1].expand.responsiblePerson;
		resolve[1].expand.responsiblePerson.avatarSrc = locals.pb.files.getUrl(
			userRecord,
			resolve[1].expand.responsiblePerson.avatar,
			{
				thumb: '100x100'
			}
		);
	}

	return { userId: locals.user.id, userRole: locals.user.role, trCards: resolve[0], schoolData: resolve[1] };
}
