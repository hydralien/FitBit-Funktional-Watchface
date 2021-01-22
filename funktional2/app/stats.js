import { minuteHistory, today } from "user-activity";
import { me } from "appbit";
import {isImperial,convertDistance} from "./imperial";

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
			this.fiveMinDistance = convertDistance(fiveMinDist)

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