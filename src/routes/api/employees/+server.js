export async function PATCH({ request, locals }) {
	const selectedUserId = await request.json();

	await locals.pb
		.collection('users')
		.update(selectedUserId, { 'employee_of-': locals.user.employee_of[0] });

	return new Response(String('User has been succesfully deleted'));
}
