export function processUserInitials(credentials) {
	if (!credentials) {
		return 'AA';
	}
	const spaceIdx = credentials.indexOf(' ');

	return credentials.charAt(0) + credentials.charAt(spaceIdx + 1);
}

export function formatDashboardDate(dateArr) {
	if (!dateArr) return;

	let resultDateArr = [];
	let nearestDays = ['Dnes', 'Zítra', 'Pozítří'];
	for (let i = 0; i < dateArr.length; i++) {
		if (i < 3) {
			resultDateArr.push(
				`${nearestDays[i]} (${dateArr[i].toLocaleDateString('cs-CZ', {
					weekday: 'short',
					year: 'numeric',
					month: 'numeric',
					day: 'numeric'
				})})`
			);
		} else {
			resultDateArr.push(
				dateArr[i].toLocaleDateString('cs-CZ', {
					weekday: 'short',
					year: 'numeric',
					month: 'numeric',
					day: 'numeric'
				})
			);
		}
	}

	return resultDateArr;
}
