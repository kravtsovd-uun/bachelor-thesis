export async function PATCH({ request, locals }) {
	const { uid, status } = await request.json();

	if (locals.user.role === 'school') {
		await locals.pb.collection('schools').update(uid, { restrictTeachers: status });
	} else {
		await locals.pb.collection('users').update(uid, { isPublic: status });
	}

	return new Response(String('Data has been succesfully updated'));
}
