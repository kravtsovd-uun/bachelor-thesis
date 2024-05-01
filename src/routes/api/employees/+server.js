export async function PATCH({ request, locals }) {
	const { uid, gids } = await request.json();

	const promiseArr = [];

	promiseArr.push(
		locals.pb.collection('users').update(uid, { 'employee_of-': locals.user.employee_of[0] })
	);

	gids.forEach((el) => {
		promiseArr.push(
			locals.pb
				.collection('study_groups')
				.update(el.id, { responsible: '', active: false }, { requestKey: null })
		);
	});

	await Promise.all(promiseArr);

	return new Response(String('User has been succesfully deleted'));
}
