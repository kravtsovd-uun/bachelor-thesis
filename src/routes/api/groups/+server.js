export async function DELETE({ locals, request }) {
	const selectedGroupId = await request.json();

	await locals.pb.collection('study_groups').delete(selectedGroupId);

	return new Response(String('Group has been succesfully deleted'));
}

export async function PATCH({ locals, request }) {
	if (!locals.pb.authStore.isValid) {
		return new Response(
			{ error: true, message: 'This resource is not available for unauthorized calls' },
			{ status: 403, statusText: 'This resource is not available for unauthorized calls' }
		);
	}

	const res = await request.json();

	res.archive
		? await locals.pb
				.collection('study_groups')
				.update(res.id, { archived: true, active: false, responsible: '' })
		: await locals.pb.collection('study_groups').update(res.id, { archived: false });

	return new Response(String('Group has been succesfully updated'));
}
