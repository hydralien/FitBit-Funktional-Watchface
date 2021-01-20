import clock from "clock";
import document from "document";
import { preferences } from "user-settings";
import { HeartRateSensor } from "heart-rate";
import { me } from "appbit";
import { today } from "user-activity";
import { battery } from "power";
import * as util from "../common/utils";

let heartRate = 0;
if (me.permissions.granted("access_heart_rate")) {
	let hrm = new HeartRateSensor({frequency: 1});
	hrm.onreading = function() {
		//console.log("Current heart rate: " + hrm.heartRate);
		heartRate = hrm.heartRate;
	}
	hrm.start();
}

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
const globalScape = document.getElementById("globalScape");

const statsHeartRateText = document.getElementById("statsHeartRateText");

const week = {
	0: 'Sunday',
	1: 'Monday',
	2: 'Tuesday',
	3: 'Wednesday',
	4: 'Thursday',
	5: 'Friday',
	6: 'Saturday'
};

const screens = [
	'clock',
	'stats'
];

let screenIndex = 0;

let screenLocked = false;

let hideLockHint = (evt) => {
	lockText.style.visibility = 'hidden';
	lockTextBg.style.visibility = 'hidden';
}

globalScape.onmousedown = (evt) => {
	lockText.text = screenLocked ? "Long tap to unlock" : "Long tap to lock";
	lockText.style.visibility = 'visible';
	lockTextBg.style.visibility = 'visible';
	setTimeout(hideLockHint, 2000)
	if (screenLocked) return;

	const prevScreen = document.getElementById(screens[screenIndex]);
	screenIndex = (screenIndex + 1) % screens.length;
	const newScreen = document.getElementById(screens[screenIndex]);
	prevScreen.style.visibility = 'hidden';
	newScreen.style.visibility = 'visible';
}

// Update the <text> element every tick with the current time
clock.ontick = (evt) => {
	let thisDay = evt.date;
	let hours = thisDay.getHours();
	let minutes = thisDay.getMinutes();
	let seconds = thisDay.getSeconds();

	if (preferences.clockDisplay === "12h") {
		// 12h format
		if (hours < 12) {
			clockPM.style.display = "none";
			clockAM.style.display = "inline";
		} else {
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

	//let thisTZDay = new Date(thisDay.getTime() + thisDay.getTimezoneOffset()*60000);
	let dayNo = util.zeroPad(thisDay.getDate());
	let monthNo = util.zeroPad(thisDay.getMonth()+1);
	let yearNo = thisDay.getYear() + 1900;

	statsHeartRateText.text = heartRate || '--';

	clockText.text = `${hours}:${mins}`;//:${secs}`;
	dateText.text = `${yearNo}-${monthNo}-${dayNo}`;
	weekText.text = week[thisDay.getDay()];
	heartRateText.text = heartRate || '--';
	floorsText.text = today.local ? (today.local.elevationGain || 0) : 0;
	stepsText.text = today.local ? (today.local.steps || 0) : 0;
	activeText.text = today.local ? (today.local.activeMinutes || 0) : 0;
	//let batteryLevel = parseInt(battery.chargeLevel);
	batteryText.text = `${battery.chargeLevel}%`;

	let sweepAngle = 10;
	let startAngle = parseInt(360/60 * seconds) - parseInt(sweepAngle/2);
	if (startAngle < 0) {
		startAngle += 360;
	}

	sMeter.startAngle = startAngle;
	sMeter.sweepAngle = sweepAngle;

}
