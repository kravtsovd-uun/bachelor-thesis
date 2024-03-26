import { redirect } from '@sveltejs/kit';

export const load = async ({ locals, parent }) => {
	if (!locals.user) {
		throw redirect(303, '/login');
	}
	await parent();
};
