import { error, redirect } from '@sveltejs/kit';

export async function load({ request, locals }) {
	if (!locals.pb.authStore.isValid) {
		redirect(303, '/login');
	} else if (locals.user.role !== 'school') {
		error(403, 'Tento zdroj je přístupný pouze pro zástupce škol');
	}

	const publicTeachers = await locals.pb.collection('users').getFullList({
		sort: 'city',
		filter: 'isPublic = true',
		query: { teacherContacts: 'true' },
		expand: 'employee_of',
		fields:
			'id,collectionId,email,name,phone,city,avatar,expand.employee_of.id,expand.employee_of.name'
	});

	publicTeachers.forEach((teacher) => {
		teacher.avatarSrc = locals.pb.files.getUrl(teacher, teacher.avatar, { thumb: '100x100' });
	});

	return {
		userSchoolId: locals.user.employee_of[0],
		publicTeachers
	};
}
