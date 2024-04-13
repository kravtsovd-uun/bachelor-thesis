import { redirect, error } from '@sveltejs/kit';

export async function load({ locals }) {
	if (!locals.pb.authStore.isValid) {
		throw redirect(303, '/login');
	}

	if (locals.user.role !== 'school') {
		throw error(403, 'Tato stránka je přistupná pouze pro manažeřy škol');
	}

	const groups = await locals.pb.collection('study_groups').getFullList({
		sort: '-updated',
		expand: 'responsible',
		filter: 'archived=true',
		fields:
			'*, expand.responsible.name, expand.responsible.avatar, expand.responsible.id, expand.responsible.collectionId'
	});

	return { groups };
}
