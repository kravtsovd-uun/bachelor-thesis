export async function PATCH({ request, locals }) {
	const { uid, utrId} = await request.json();

	await locals.pb.collection('time_records').update(utrId, { teacher: uid, isPublic: false });

	return new Response(String('User has been succesfully added'));
}
