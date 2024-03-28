import { error, redirect } from '@sveltejs/kit';

export const load = async ({ locals, parent }) => {
	if (!locals.user) {
		throw redirect(303, '/login');
	}
	await parent();
};

export const actions = {
	updateProfile: async ({ request, locals }) => {
		const formData = await request.formData();
		const data = Object.fromEntries([...formData]);

		const dataHaveChanged = data.avatar.size > 0 || data.name !== locals.user.name;

		if (dataHaveChanged) {
			console.log('Data have changed');
			try {
				const { name, avatar } = await locals.pb.collection('users').update(locals?.user?.id, data);
				locals.user.name = name;
				locals.user.avatar = avatar;
			} catch (err) {
				console.log('Error:', err);

				throw error(400, 'Something went wrong during profile update request');
			}
		}
		return {
			success: true
		};
	}
};
