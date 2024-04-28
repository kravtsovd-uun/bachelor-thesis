export async function DELETE({ locals, request }) {
	if (!locals.pb.authStore.isValid || locals.pb.authStore.model.role !== 'school') {
		return new Response(
			JSON.stringify({
				error: true,
				message: 'This resource is available for authorized school managers only called internally.'
			}),
			{
				status: 403,
				statusText:
					'This resource is available for authorized school managers only called internally.'
			}
		);
	}

	const selectedGroupId = await request.json();

	await locals.pb.collection('study_groups').delete(selectedGroupId);

	return new Response(String('Group has been succesfully deleted'));
}

export async function PATCH({ locals, request }) {
	if (!locals.pb.authStore.isValid || locals.pb.authStore.model.role !== 'school') {
		return new Response(
			JSON.stringify({
				error: true,
				message: 'This resource is available for authorized school managers only called internally.'
			}),
			{
				status: 403,
				statusText:
					'This resource is available for authorized school managers only called internally.'
			}
		);
	}

	const res = await request.json();

	res.archive
		? await locals.pb
				.collection('study_groups')
				.update(res.id, { archived: true, active: false })
		: await locals.pb.collection('study_groups').update(res.id, { archived: false });

	return new Response(String('Group has been succesfully updated'));
}
