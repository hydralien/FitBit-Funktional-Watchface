const REST = 'regular';
const FAT_BURN = 'fat burn';
const CARDIO = 'cardio';
const PEAK = 'peak';

export const zoneColors = {}
zoneColors[REST] =  '#ffffff';
zoneColors[FAT_BURN] = '#f9a513';
zoneColors[CARDIO] = '#f17719';
zoneColors[PEAK] = '#e91f38';

export function getZone(heartRate, age, maxRate) {
	if (!maxRate) maxRate = 220 - age;

	const ratePct = (heartRate / maxRate) * 100;

	if (ratePct < 50) return REST;
	if (ratePct < 70) return FAT_BURN;
	if (ratePct < 85) return CARDIO;
	return PEAK;
}