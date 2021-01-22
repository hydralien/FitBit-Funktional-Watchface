import { preferences, units } from "user-settings";

const MILE_SCALE = 1.609344;

export function isImperial() {
	if (!units && !preferences) return false;
	return units ? units.distance === 'us' : preferences.clockDisplay === "12h";
}

export function convertDistance(distance, precision) {
	if (precision === undefined) precision = 2;

	if (isImperial()) {
		return (distance / MILE_SCALE).toFixed(precision);
	} else {
		return distance.toFixed(precision);
	}
}

export function distanceMeasure() {
	return isImperial() ? 'mi.' : 'km';
}