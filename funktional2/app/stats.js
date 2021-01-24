import { minuteHistory, today } from "user-activity";
import { me } from "appbit";
import { user } from "user-profile";

import {isImperial,convertDistance} from "./imperial";
import { getElement } from "../common/utils";
import {getZone, zoneColors} from "./zones";

const MILE_SCALE = 1.609344;

export class Stats {
	oneMinTriggerTime = 0;

	fiveMinTriggerTime = 0;

	oneMinPace = 0;

	oneMinDistance = 0;

	fiveMinDistance = 0;

	fiveMinElevation = 0;

	isImperial = isImperial();

	constructor() {
	}

	getStats() {
		this.refreshStats();

		return {
			oneMinPace: this.oneMinPace,
			fiveMinDistance: this.fiveMinDistance,
			fiveMinElevation: this.fiveMinElevation
		}
	}

	refreshStats() {
		const currentTime = new Date().getTime();

		if (!me.permissions.granted("access_activity")) {
			return
		}

		if (currentTime > this.fiveMinTriggerTime) {
			const minuteRecords = minuteHistory.query({limit: 5});
			let fiveMinDist = 0;
			let fiveMinElevation = 0;
			minuteRecords.forEach((minuteRecord) => {
				fiveMinDist += minuteRecord.distance || 0;
				fiveMinElevation += minuteRecord.elevationGain || 0;
			})
			this.fiveMinElevation = fiveMinElevation;
			this.fiveMinDistance = convertDistance(fiveMinDist / 1000)

			this.fiveMinTriggerTime = currentTime + (5 * 60) * 1000;
		}

		if (currentTime > this.oneMinTriggerTime) {
			const minuteRecords = minuteHistory.query({limit: 1});
			const lastMinute = minuteRecords.length > 0 ? minuteRecords[0] : {};

			const distKm = (lastMinute.distance || 0) / 1000;
			let pace = '0:00';

			if (distKm > 0) {
				let paceNum = 0;
				if (this.isImperial) {
					const distMi = distKm / MILE_SCALE;
					paceNum = 1 / distMi;
				} else {
					paceNum = 1 / distKm;
				}

				const paceMin = (Math.floor(paceNum) + (paceNum % 1) * 0.6).toFixed(2);
				pace = paceMin.toString().replace('.', ':');
			}
			this.oneMinPace = pace;

			this.oneMinDistance = convertDistance(distKm);

			this.oneMinTriggerTime = currentTime + 60 * 1000;
		}
	}
}

export function renderStats(aStats, heartRate) {
	if (heartRate) {
		let userAge = 30;
		let maxHeartRate = undefined;
		if (me.permissions.granted("access_user_profile")) {
			userAge = user.age;
			maxHeartRate = user.maxHeartRate;
		}

		const hrZone = getZone(heartRate, userAge, maxHeartRate);
		const hrZoneColor = zoneColors[hrZone];

		getElement('statsZoneText').style.fill = hrZoneColor;
		getElement('statsHeartRateText').style.fill = hrZoneColor;
		getElement('statsHeartRateText').text = heartRate;
		getElement('statsZoneText').text = hrZone;
	} else {
		getElement('statsHeartRateText').text = '--';
	}

	const paceMeasure = isImperial() ? 'mi.' : 'km';

	getElement('statsPaceText').text = `${aStats.oneMinPace}/${paceMeasure}`;
	getElement('statsStepsText').text =  `${aStats.fiveMinDistance} ${paceMeasure}`;
	getElement('statsFloorsText').text = `${aStats.fiveMinElevation} floors`;
}