import { redirect } from '@sveltejs/kit';

export async function load({ locals }) {
	if (locals.pb.authStore.isValid) {
		throw redirect(303, '/');
	}

	return {};
}

export const actions = {
	register: async ({ locals, request }) => {
		const formData = await request.formData();
		const data = Object.fromEntries([...formData]);
		data.emailVisibility = true;
		data.phone = '+420 123 123 123';
		const cities = ['Praha', 'Brno', 'Ostrava'];
		data.city = cities[Math.round(Math.random() * 2)];
		
		try {
			data.role = 'teacher';
			await locals.pb.collection('users').create(data);
			locals.pb.authStore.clear();
		} catch (_) {
			console.log('Error: Something went wrong during user creation');
		}
		throw redirect(303, '/login');
	}
};
