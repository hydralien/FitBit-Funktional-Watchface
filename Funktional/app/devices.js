import { me as device } from "device";

// Vers Lite lacks pressure sensor
if (device.modelId === 38) {
	const hideElements = [
		'statsFloorsLabel',
		'statsFloorsText',
		'floorsIcon',
		'floorsText'
	];

	hideElements.forEach(
		(element) => document.getElementById(element).style.display = 'none'
	);
}