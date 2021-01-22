import { me as device } from "device";
import document from "document";

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
}