import { today } from "user-activity";
import { me } from "appbit";
import document from "document";

import {isImperial,convertDistance,distanceMeasure} from "./imperial";
import { getElement } from "../common/utils";

export class Today {
	static paintStats() {
		if (!me.permissions.granted("access_activity")) {
			return
		}

		const todayStats = today.local;

		getElement("todayAMText").text = todayStats.activeZoneMinutes.total || 0;
		getElement("todayAMZ1Text").text = todayStats.activeZoneMinutes.fatBurn || 0;
		getElement("todayAMZ2Text").text = todayStats.activeZoneMinutes.cardio || 0;
		getElement("todayAMZ3Text").text = todayStats.activeZoneMinutes.peak || 0;

		getElement("todayStepsText").text = todayStats.steps || 0;
		getElement("todayDistText").text = `${convertDistance((todayStats.distance || 0)/1000, 1)} ${distanceMeasure()}`;

		getElement("todayElevText").text = `${todayStats.elevationGain || 0}`;
		getElement("todayCalText").text = `${todayStats.calories || 0} kcal`;
	}
}