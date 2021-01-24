export function zeroPad(i) {
	if (i < 10) {
		i = "0" + i;
	}
	return i;
}

export const weekMap = {
	0: 'Sunday',
	1: 'Monday',
	2: 'Tuesday',
	3: 'Wednesday',
	4: 'Thursday',
	5: 'Friday',
	6: 'Saturday'
};

export const monthMap = {
	0: 'Jan',
	1: 'Feb',
	2: 'Mar',
	3: 'Apr',
	4: 'May',
	5: 'Jun',
	6: 'Jul',
	7: 'Aug',
	8: 'Sep',
	9: 'Oct',
	10: 'Nov',
	11: 'Dec'
}

export const DATE_FORMAT_DB = 'db';
export const DATE_FORMAT_HUMAN_US = 'hu_us';
export const DATE_FORMAT_HUMAN_EUR = 'hu_eur';
export const DATE_FORMAT_OFFICIAL_EUR = 'of_eur';
export const DATE_FORMAT_OFFICIAL_US = 'of_us';

export function dateFormat(date, formatType) {
	let dayNo = zeroPad(date.getDate());
	let monthNo = zeroPad(date.getMonth() + 1);
	let yearNo = date.getYear() + 1900;

	if (!formatType || formatType === DATE_FORMAT_DB) {
		return `${yearNo}-${monthNo}-${dayNo}`;
	}
	if (formatType === DATE_FORMAT_HUMAN_US) {
		return `${monthMap[date.getMonth()]} ${dayNo}, ${yearNo}`;
	}
	if (formatType === DATE_FORMAT_HUMAN_EUR) {
		return `${dayNo} ${monthMap[date.getMonth()]} ${yearNo}`;
	}
	if (formatType === DATE_FORMAT_OFFICIAL_EUR) {
		return `${dayNo}/${monthNo}/${yearNo}`;
	}
	if (formatType === DATE_FORMAT_OFFICIAL_US) {
		return `${monthNo}/${dayNo}/${yearNo}`;
	}
}