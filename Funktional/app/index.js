import clock from "clock";
import document from "document";
import { preferences, units } from "user-settings";
import { HeartRateSensor } from "heart-rate";
import { me } from "appbit";
import { today } from "user-activity";
import { battery } from "power";
import * as util from "../common/utils";
import * as time from "../common/time";
import * as fs from "fs";
import * as messaging from "messaging";
import { vibration } from "haptics";
import { Stats, renderStats } from './stats';
import { deviceAdjustments } from "./devices";
import { Today } from "./today";

const SETTINGS_TYPE = "cbor";
const SETTINGS_FILE = "settings.cbor";

let heartRate = 0;
if (me.permissions.granted("access_heart_rate")) {
	let hrm = new HeartRateSensor({frequency: 1});
	hrm.onreading = function() {
		//console.log("Current heart rate: " + hrm.heartRate);
		heartRate = hrm.heartRate;
	}
	hrm.start();
}

deviceAdjustments();

// Update the clock every minute
clock.granularity = "seconds";

// Get a handle on the <text> element
const clockText = document.getElementById("clockText");
const clockAM = document.getElementById("clockTextAM");
const clockPM = document.getElementById("clockTextPM");

const dateText = document.getElementById("dateText");
const weekText = document.getElementById("weekText");
const heartRateText = document.getElementById("heartRateText");
const stepsText = document.getElementById("stepsText");
const floorsText = document.getElementById("floorsText");
const batteryText = document.getElementById("batteryText");
const activeText = document.getElementById("activeText");
const sMeter = document.getElementById("secondsCircle");

const lockText = document.getElementById("lockText");
const lockTextBg = document.getElementById("lockTextBg");
const lockIcon = document.getElementById("lockIcon");
const globalScape = document.getElementById("globalScape");

const statsTime = document.getElementById("statsTime");

const allScreens = ['clock','today','stats'];

const screens = [
	'clock'
];

const isImperial = units ? units.distance === 'us' : preferences.clockDisplay === "12h";

const activityStats = new Stats(isImperial);

function loadSettings() {
	try {
		return fs.readFileSync(SETTINGS_FILE, SETTINGS_TYPE);
	} catch (ex) {
		return {};
	}
}

function saveSettings() {
	fs.writeFileSync(SETTINGS_FILE, settings, SETTINGS_TYPE);
}

function resetScreens() {
	allScreens.forEach((screen, index) => {
		const screenElement = document.getElementById(screen);
		screenElement.style.display = 'none'
	});
	const screenElement = document.getElementById(screens[screenIndex]);
	screenElement.style.display = 'inline'
}

function addScreen(screenName) {
	if (screens.indexOf(screenName) > -1) return;
	screens.push(screenName);
}

function removeScreen(screenName) {
	const screenRemoveIndex = screens.indexOf(screenName);
	if (screenRemoveIndex === -1) return;
	screenIndex = 0;
	screens.splice(screenRemoveIndex,1);
	resetScreens();
}

function applySettings() {
	if (settings.clockColor)  {
		clockText.style.fill = settings.clockColor;
		clockAM.style.fill = settings.clockColor;
		clockPM.style.fill = settings.clockColor;
	}
	if (settings.dateColor) {
		dateText.style.fill = settings.dateColor;
		weekText.style.fill = settings.dateColor;
	}

	if (settings.showTodayStats) {
		addScreen('today');
	} else {
		removeScreen('today')
	}
	if (settings.showCurrentStats) {
		addScreen('stats');
	} else {
		removeScreen('stats');
	}
}

me.addEventListener("unload", saveSettings);

let settings = loadSettings();
applySettings();

messaging.peerSocket.addEventListener("message", (evt) => {
	const settingsList = {
		'dateFormat': (dateSettings) => settings.dateFormat = dateSettings.values[0].value,
		'clockColor': (colorSetting) => settings.clockColor = colorSetting,
		'dateColor': (colorSetting) => settings.dateColor = colorSetting,
		'showTodayStats': (showTodayStats) => settings.showTodayStats = showTodayStats,
		'showCurrentStats': (showCurrentStats) => settings.showCurrentStats = showCurrentStats
	};

	if (evt && evt.data) {
		if (settingsList[evt.data.key]) settingsList[evt.data.key](evt.data.value);
		applySettings();
	}
});

const SCREEN_INDEX = 'screen-index';
const LOCK_STATE = 'lock-state';
let screenIndex = settings[SCREEN_INDEX] || 0;
if (screenIndex >= screens.length) screenIndex = 0;

let screenLocked = settings[LOCK_STATE] || false;
if (screens.length === 1) screenLocked = false;
let lockTimer = undefined;
let lockHintTimer = undefined;

let hideLockHint = (evt) => {
	lockText.style.visibility = 'hidden';
	lockTextBg.style.visibility = 'hidden';
}

let lockToggle = (evt) => {
	if (screens.length === 1) return;
	if (screenLocked) {
		screenLocked = false;
		hideLockHint(evt);
	} else {
		screenLocked = true;
	}
	lockIcon.style.visibility = screenLocked ? 'visible' : 'hidden';
	settings[LOCK_STATE] = screenLocked;
	vibration.start("bump");
	setTimeout(vibration.stop, 100);
};

globalScape.onload = () => {
	resetScreens();
	lockIcon.style.visibility = screenLocked ? 'visible' : 'hidden';
};

let downX = 0;
let downY = 0;

globalScape.onmousedown = (evt) => {
	downX = evt.screenX
	downY = evt.screenY
	clearTimeout(lockTimer);
	lockTimer = setTimeout(lockToggle, 2000);
};

globalScape.onmouseup = (evt) => {
	clearTimeout(lockTimer);
};

globalScape.onmousemove = (evt) => {
	// console.log("XXXX", downX, evt.screenX - downX)
	// console.log("YYYY", downY, evt.screenY - downY)
	if (Math.abs(evt.screenX - downX) > 20 || Math.abs(evt.screenY - downY) > 20) {
		clearTimeout(lockTimer);
	}
}

globalScape.onclick = (evt) => {
	if (screens.length === 1) return;
	lockText.text = screenLocked ? "Long tap to unlock" : "Long tap to lock";
	lockText.style.visibility = 'visible';
	lockTextBg.style.visibility = 'visible';

	clearTimeout(lockHintTimer);
	lockHintTimer = setTimeout(hideLockHint, 2000);

	if (screenLocked) return;

	const prevScreen = document.getElementById(screens[screenIndex]);
	screenIndex = (screenIndex + 1) % screens.length;
	const newScreen = document.getElementById(screens[screenIndex]);

	prevScreen.style.display = 'none';
	newScreen.style.display = 'inline';

	settings[SCREEN_INDEX] = screenIndex;
	clock.ontick(evt);
}

// Update the <text> element every tick with the current time
clock.ontick = (evt) => {
	let thisDate = evt.date || new Date();
	let hours = thisDate.getHours();
	let minutes = thisDate.getMinutes();
	let seconds = thisDate.getSeconds();

	let clockPad = ''
	if (preferences.clockDisplay === "12h") {
		// 12h format
		if (hours < 12) {
			clockPad = ' AM';
			clockPM.style.display = "none";
			clockAM.style.display = "inline";
		} else {
			clockPad = ' PM';
			clockPM.style.display = "inline";
			clockAM.style.display = "none";
		}
		hours = hours % 12 || 12;
	} else {
		// 24h format
		hours = util.zeroPad(hours);
		clockPM.style.display = "none";
		clockAM.style.display = "none";
	}

	let mins = util.zeroPad(minutes);
	let secs = util.zeroPad(seconds);

	if (screens[screenIndex] === 'today') {
		statsTime.style.visibility = 'visible';

		Today.paintStats();

		statsTime.text = `${hours}:${mins}:${secs}${clockPad}`;
	}

	if (screens[screenIndex] === 'stats') {
		statsTime.style.visibility = 'visible';

		const aStats = activityStats.getStats(thisDate);

		renderStats(aStats, heartRate);

		statsTime.text = `${hours}:${mins}:${secs}${clockPad}`;
	}

	if (screens[screenIndex] === 'clock') {
		statsTime.style.visibility = 'hidden';
		clockText.text = `${hours}:${mins}`;//:${secs}`;
		dateText.text = time.dateFormat(thisDate, settings.dateFormat);
		weekText.text = time.weekMap[thisDate.getDay()];
		heartRateText.text = heartRate || '--';
		floorsText.text = today.local ? (today.local.elevationGain || 0) : 0;
		stepsText.text = today.local ? (today.local.steps || 0) : 0;

		activeText.text = today.local && today.local.activeZoneMinutes ? (today.local.activeZoneMinutes.total || 0) : 0;

		let sweepAngle = 10;
		let startAngle = parseInt(360 / 60 * seconds) - parseInt(sweepAngle / 2);
		if (startAngle < 0) {
			startAngle += 360;
		}

		sMeter.startAngle = startAngle;
		sMeter.sweepAngle = sweepAngle;

		batteryText.text = `${battery.chargeLevel}%`;
	}
}
