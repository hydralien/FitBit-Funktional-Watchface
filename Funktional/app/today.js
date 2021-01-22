import { today } from "user-activity";
import { me } from "appbit";
import document from "document";

import {isImperial,convertDistance,distanceMeasure} from "./imperial";

const elements = {
	todayAMText: document.getElementById("todayAMText"),
	todayAMZ1Text: document.getElementById("todayAMZ1Text"),
	todayAMZ2Text: document.getElementById("todayAMZ2Text"),
	todayAMZ3Text: document.getElementById("todayAMZ3Text"),
	todayStepsText: document.getElementById("todayStepsText"),
	todayDistText: document.getElementById("todayDistText"),
	todayElevText: document.getElementById("todayElevText"),
	todayCalText: document.getElementById("todayCalText"),
}

export class Today {
	static paintStats() {
		if (!me.permissions.granted("access_activity")) {
			return
		}

		const todayStats = today.local;

		elements.todayAMText.text = todayStats.activeZoneMinutes.total || 0;
		elements.todayAMZ1Text.text = todayStats.activeZoneMinutes.fatBurn || 0;
		elements.todayAMZ2Text.text = todayStats.activeZoneMinutes.cardio || 0;
		elements.todayAMZ3Text.text = todayStats.activeZoneMinutes.peak || 0;

		elements.todayStepsText.text = todayStats.steps || 0;
		elements.todayDistText.text = `${convertDistance((todayStats.distance || 0)/1000, 1)} ${distanceMeasure()}`;

		elements.todayElevText.text = `${todayStats.elevationGain || 0}`;
		elements.todayCalText.text = `${todayStats.calories || 0} kcal`;
	}
}