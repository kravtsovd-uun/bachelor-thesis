import { redirect } from '@sveltejs/kit';

export async function load({ request, locals }) {
	if (!locals.pb.authStore.isValid) {
		throw redirect(303, '/login');
	}
	const schoolList = await locals.pb.collection('schools').getFullList({ sorted: 'name' });
	return {schoolList};
}
