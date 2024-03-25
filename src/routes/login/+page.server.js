import { redirect } from '@sveltejs/kit';

export const actions = {
	login: async ({ locals, request }) => {
		const formData = await request.formData();
		const data = Object.fromEntries([...formData]);

		try {
			const { token, record } = await locals.pb
				.collection('users')
				.authWithPassword(data.email, data.password);
		} catch (err) {
			console.log('Error:', err);
			return {
				error: true,
				email: data.email
			};
		}

		throw redirect(303, '/');
	}
};
