import { redirect, error } from '@sveltejs/kit';

export async function load({ params, locals }) {
	if (!locals.pb.authStore.isValid) {
		throw redirect(303, '/login');
	}

	if (locals.user.role !== 'school') {
		throw error(403, 'Tato stránka je přistupná pouze pro manažeřy škol');
	}

	const groupDetail = await locals.pb.collection('study_groups').getOne(params.groupId);

	return { groupDetail };
}
