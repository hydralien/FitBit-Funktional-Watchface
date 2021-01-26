import { me as device } from "device";
import document from "document";
import { me } from "appbit";
import { today } from "user-activity";

export function deviceAdjustments() {
// Versa Lite lacks pressure sensor
	if (device.modelId === "38") {
		const hideElements = [
			'statsFloorsLabel',
			'statsFloorsText',
			'floorsIcon',
			'floorsText',
			'todayElevText',
			'todayElevLabel'
		];

		hideElements.forEach(
			(element) => document.getElementById(element).style.visibility = 'hidden'
		);
	}

	if (device.modelId === "27") {
		// Ionic has narrower screen
		document.getElementById('statsTime').style.display = 'none';
	}

	if (!me.permissions.granted("access_heart_rate")) {
		// hide HR stats from clock
		const hideElements = [
			'heartRateIcon',
			'heartRateText',
		];

		hideElements.forEach(
			(element) => document.getElementById(element).style.visibility = 'hidden'
		);
	}

	if (!me.permissions.granted("access_activity")) {
		// hide HR stats from clock
		const hideElements = [
			'activeIcon',
			'activeText',
			'stepsIcon',
			'stepsText',
			'floorsIcon',
			'floorsText'
		];

		hideElements.forEach(
			(element) => document.getElementById(element).style.visibility = 'hidden'
		);
	}
}