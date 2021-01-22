import { minuteHistory, today } from "user-activity";
import { me } from "appbit";

const MILE_SCALE = 1.609344;

export class Stats {
	oneMinTriggerTime = 0;

	fiveMinTriggerTime = 0;

	oneMinPace = 0;

	oneMinDistance = 0;

	fiveMinDistance = 0;

	fiveMinElevation = 0;

	isImperial = false;

	constructor(isImperial) {
		this.isImperial = isImperial;
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
			if (this.isImperial) {
				this.fiveMinDistance = (fiveMinDist / MILE_SCALE).toFixed(2);
			} else {
				this.fiveMinDistance = fiveMinDist.toFixed(2)
			}

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

			if (this.isImperial) {
				this.oneMinDistance = (distKm / MILE_SCALE).toFixed(2);
			} else {
				this.fiveMinDistance = distKm.toFixed(2)
			}

			this.oneMinTriggerTime = currentTime + 60 * 1000;
		}
	}
}