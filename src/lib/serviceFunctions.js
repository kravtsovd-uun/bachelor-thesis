export function processUserInitials(credentials) {
	if (!credentials) {
		return 'AA';
	}
	const spaceIdx = credentials.indexOf(' ');

	return credentials.charAt(0) + credentials.charAt(spaceIdx + 1);
}
