import * as messaging from "messaging";
import {settingsStorage} from "settings";
import {me as companion} from "companion";

const settingsList = [
	'dateFormat',
	'clockColor',
	'dateColor'
];

if (companion.launchReasons.settingsChanged) {
	settingsList.forEach((settingName) => sendValue(settingName, settingsStorage.getItem(settingName)));
}

settingsStorage.addEventListener("change", evt => {
	if (evt.oldValue !== evt.newValue) {
		sendValue(evt.key, evt.newValue);
	}
});

function sendValue(key, val) {
	if (val) {
		sendSettingData({
			key: key,
			value: JSON.parse(val)
		});
	}
}

function sendSettingData(data) {
	if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
		messaging.peerSocket.send(data);
	} else {
		console.log("No peerSocket connection");
	}
}