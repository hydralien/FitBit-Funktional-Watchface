import * as time from "../common/time";

const colorList = [
	{color: 'white'},
	{color: 'yellow'},
	{color: 'red'},
	{color: 'green'},
	{color: 'blue'},
	{color: 'brown'},
	{color: 'orange'},
	{color: 'lime'},
	{color: 'pink'},
	{color: 'grey'},
	{color: 'lightgrey'},
	{color: 'darkgrey'},
	{color: 'bisque'},
	{color: 'cyan'},
	{color: 'azure'},
	{color: 'cornflowerblue'},
	{color: 'deepskyblue'},
	{color: 'violet'},
	{color: 'chartreuse'},
	{color: 'springgreen'},
	{color: 'palegreen'},
	{color: 'orchid'},
];

function FunktionalSettings(props) {
	const date = new Date();
	return (
		<Page>
			<Section
				title={<Text bold align="center">Date format</Text>}>
				<Select
					label={`Select your preferred date format (tap here)`}
					settingsKey="dateFormat"
					options={[
						{name: time.dateFormat(date, time.DATE_FORMAT_DB), value: time.DATE_FORMAT_DB},
						{name: time.dateFormat(date, time.DATE_FORMAT_HUMAN_US), value: time.DATE_FORMAT_HUMAN_US},
						{name: time.dateFormat(date, time.DATE_FORMAT_HUMAN_EUR), value: time.DATE_FORMAT_HUMAN_EUR},
						{name: time.dateFormat(date, time.DATE_FORMAT_OFFICIAL_US), value: time.DATE_FORMAT_OFFICIAL_US},
						{name: time.dateFormat(date, time.DATE_FORMAT_OFFICIAL_EUR), value: time.DATE_FORMAT_OFFICIAL_EUR},
					]}
					renderItem={
						(option) =>
							<TextImageRow
								label={option.name}
							/>
					}
				/>
			</Section>
			<Section
				title={<Text bold align="center">Date text color</Text>}>
				<ColorSelect
					settingsKey="dateColor"
					colors={colorList}
				/>
			</Section>
			<Section
				title={<Text bold align="center">Time text color</Text>}>
				<ColorSelect
					settingsKey="clockColor"
					colors={colorList}
				/>
			</Section>
		</Page>
	);
}

registerSettingsPage(FunktionalSettings);