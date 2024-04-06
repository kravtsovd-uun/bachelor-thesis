import { error, redirect } from '@sveltejs/kit';

export const load = async ({ locals, parent }) => {
	if (!locals.user) {
		throw redirect(303, '/login');
	}
	const schoolList = locals.pb.collection('users').getOne(locals.user.id, {
		expand: 'employee_of',
		fields: 'expand.employee_of.id, expand.employee_of.name'
	});
	const resolve = await Promise.all([schoolList, parent]);

	return {
		schoolList: resolve[0].expand?.employee_of ?? []
	};
};

export const actions = {
	updateProfile: async ({ request, locals }) => {
		const formData = await request.formData();
		const data = Object.fromEntries([...formData]);

		data.avatar.size === 0 && delete data.avatar; //If only name has changed - keep avatar without changes
		const dataHaveChanged = data?.avatar?.size > 0 || data.name !== locals.user.name;

		if (dataHaveChanged) {
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
