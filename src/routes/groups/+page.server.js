import { error, redirect } from '@sveltejs/kit';

export async function load({ locals }) {
	if (!locals.pb.authStore.isValid) {
		throw redirect(303, '/login');
	}

	if (locals.user.role !== 'school') {
		throw error(403, 'Tato stránka je přistupná pouze pro manažeřy škol');
	}

	const groups = await locals.pb.collection('study_groups').getFullList({
		sort: '-startDate',
		expand: 'responsible',
		filter: 'archived=false',
		fields:
			'*, expand.responsible.name, expand.responsible.avatar, expand.responsible.id, expand.responsible.collectionId'
	});

	groups.forEach((group) => {
		if (Object.prototype.hasOwnProperty.call(group, 'expand') && group.expand.responsible.avatar) {
			group.expand.responsible.avatarSrc = locals.pb.files.getUrl(
				group.expand.responsible,
				group.expand.responsible.avatar,
				{ thumb: '100x100' }
			);
		}
	});

	return {
		groups
	};
}
