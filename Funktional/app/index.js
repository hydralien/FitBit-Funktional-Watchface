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
    console.log("Current heart rate: " + hrm.heartRate);
    heartRate = hrm.heartRate;
  }
  hrm.start();
}

// Update the clock every minute
clock.granularity = "seconds";

// Get a handle on the <text> element
const clockText = document.getElementById("clockText");
const dateText = document.getElementById("dateText");
const weekText = document.getElementById("weekText");
const heartRateText = document.getElementById("heartRateText");
const stepsText = document.getElementById("stepsText");
const floorsText = document.getElementById("floorsText");
const batteryText = document.getElementById("batteryText");
const sMeter = document.getElementById("secondsCircle");

const week = {
  0: 'Sunday',
  1: 'Monday',
  2: 'Tuesday',
  3: 'Wednesday',
  4: 'Thursday',
  5: 'Friday',
  6: 'Saturday'
};

// Update the <text> element every tick with the current time
clock.ontick = (evt) => {
  let thisDay = evt.date;
  let hours = thisDay.getHours();
  let minutes = thisDay.getMinutes();
  let seconds = thisDay.getSeconds();
  if (preferences.clockDisplay === "12h") {
    // 12h format
    hours = hours % 12 || 12;
  } else {
    // 24h format
    hours = util.zeroPad(hours);
  }

  let mins = util.zeroPad(minutes);
  let secs = util.zeroPad(seconds);

  clockText.text = `${hours}:${mins}`;//:${secs}`;
  dateText.text = thisDay.toDateString();
  weekText.text = week[thisDay.getDay()];
  heartRateText.text = heartRate || '--';
  floorsText.text = today.local ? (today.local.elevationGain || 0) : 0;
  stepsText.text = today.local ? (today.local.steps || 0) : 0;
  //let batteryLevel = parseInt(battery.chargeLevel);
  batteryText.text = battery.chargeLevel + '%';

  let sweepAngle = 10;
  let startAngle = parseInt(360/60 * seconds) - parseInt(sweepAngle/2);
  if (startAngle < 0) {
    startAngle += 360; 
  }

  sMeter.startAngle = startAngle;
  sMeter.sweepAngle = sweepAngle;

}
