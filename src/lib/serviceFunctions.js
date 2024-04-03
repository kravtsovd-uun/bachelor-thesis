export function processUserInitials(credentials) {
	if (!credentials) {
		return 'AA';
	}
	let spaceIdx = credentials.indexOf(' ');
	spaceIdx = spaceIdx > -1 ? spaceIdx : 0; //In case there is only one word in credentials

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

export function convertToDateTimeLocalString(date) {
	const year = date.getFullYear();
	const month = (date.getMonth() + 1).toString().padStart(2, '0');
	const day = date.getDate().toString().padStart(2, '0');
	const hours = date.getHours().toString().padStart(2, '0');
	const minutes = date.getMinutes().toString().padStart(2, '0');

	return `${year}-${month}-${day}T${hours}:${minutes}`;
}
