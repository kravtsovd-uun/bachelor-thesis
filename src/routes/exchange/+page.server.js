import { error, redirect } from '@sveltejs/kit';

export async function load({ request, locals }) {
	if (!locals.pb.authStore.isValid) {
		throw redirect(303, '/login');
	} else if (locals.user.role === 'teacher') {
		const employeeData = await locals.pb
			.collection('users')
			.getOne(locals.user.id, { expand: 'employee_of', fields: 'expand.employee_of' });
		const isTeacherRestricted = employeeData.expand.employee_of.filter(
			(school) => school.restrictTeachers
		);
		isTeacherRestricted.length &&
			error(403, 'Nedostatečná práva: Jste zaměstnancem školy, která zakazuje přístup k burze.');
	}
	const schoolList = await locals.pb.collection('schools').getFullList({ sorted: 'name' });
	return { schoolList };
}
