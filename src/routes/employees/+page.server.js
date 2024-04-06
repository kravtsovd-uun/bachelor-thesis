import { error, redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals }) {
	if (!locals.pb.authStore.isValid) {
		throw redirect(303, '/login');
	} else if (locals.user.role !== 'school') {
		error(403, { code: 'NOT_ALLOWED' });
	}

	const employees = locals.pb.collection('users').getFullList({ sorted: 'created' });
	const assigned_groups = locals.pb
		.collection('study_groups')
		.getFullList({ fields: 'id,name,responsible' });

	const resolve = await Promise.all([employees, assigned_groups]);
	if (resolve[0]) {
		resolve[0].forEach((employee) => {
			if (employee.avatar) {
				employee.avatarSrc = locals.pb.files.getUrl(employee, employee.avatar, {
					thumb: '100x100'
				});
			}
			if (resolve[1]) {
				employee.assigned_groups = resolve[1].filter(
					(record) => employee.id === record.responsible
				);
			}
		});
	}

	return {
		employees: resolve[0]
	};
}
