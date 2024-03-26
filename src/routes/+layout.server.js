export const load = ({ locals }) => {
	if (locals.user) {
		const avatarSrc = locals.pb.files.getUrl(locals.user, locals.user.avatar);
		return {
			user: locals.user,
			avatarSrc: avatarSrc
		};
	}
};
