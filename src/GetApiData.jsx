class hourlyStep {
	constructor(time, temperature, weather_code, precipitation, wind_speed, wind_direction, day) {
		this.time = time,
		this.temperature = temperature,
		this.weather_code = weather_code,
		this.precipitation = precipitation,
		this.wind_speed = wind_speed,
		this.wind_direction = wind_direction
		if (day === 1) {
			this.day = "_day";
		} else if (day === 0) {
			this.day = "_night";
		} else {
			this.day = "";
		}
	}
}

class symbolAdder {
	constructor(y, wind_direction, iconURL, day, description) {
		this.y = y;
		if (wind_direction === "") {
			this.marker = {
				symbol: `url(https://raw.githubusercontent.com/metno/weathericons/refs/heads/main/weather/svg/${iconURL + day}.svg)`,
				width: 30,
				height: 30,
			};
		} else {
			((this.label = "↓"),
				(this.marker = {
					width: 40,
					height: 40,
					rotation: wind_direction,
				}));
		}
		if (description) {
			this.accessibility = {
				description: description,
			};
		}
	}
}

export async function GetWhere(props) {// FUNCT: Get's lat and lon
	const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${props}&format=jsonv2`);
	const data = await response.json();
	
	return [data[0].lat, data[0].lon];// FIXME: it's spiting out errors on start
}

export async function GetWeather({ lat, lon }) {// FUNCT: Get's weather data
	const weatherCodeInfo = await fetch(`https://thalion1.github.io/static-apis/weather-id-to-icon.JSON`);
	const openMeteoResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,weather_code,apparent_temperature,precipitation,wind_speed_10m,wind_direction_10m,wind_direction_80m,wind_speed_80m,is_day&forecast_days=3&wind_speed_unit=ms`);
	const pentResponse = await fetch(`https://pent.no/api/v2/long-term-forecast/${lat}/${lon}?days=3&resolution=1`);
	const weatherCodeInfoData = await weatherCodeInfo.json();
	const openMeteoData = await openMeteoResponse.json();
	const pentData = await pentResponse.json();

	return {openMeteo: dataCleanup(openMeteoData, pentData), pent: pentData, code: weatherCodeInfoData};
}

function dataCleanup(openMeteo, pentData) {// FUNCT: cleans up openMeteo data
	const data = openMeteo.hourly;
	let result = [];

	for (const day of pentData.yr) {
		const dayStart = new Date(day.steps[0].startDate).toISOString().substr(0, 16);
		const dayEnd = new Date(day.steps[day.steps.length - 1].startDate).toISOString().substr(0, 16);
		let days = [];
		let temp = 0;
		for (let i = data.time.indexOf(dayStart); i < data.time.indexOf(dayEnd) + 1; i++) {
			days.push(new hourlyStep(
                data.time[i],
                data.apparent_temperature[i],
                data.weather_code[i],
                data.precipitation[i],
                data.wind_speed_10m[i],
                data.wind_direction_10m[i],
                data.is_day[i]
            ));
		}
		result.push(days);
		temp++;
	}

	return result;
}

export function marge({openMeteo, pent, code}, day) {// FUNCT: Combins data
	const key = Object.keys(pent);
	let temps = [];
	let rain = [];
	let wind = [];
	let time = [];
	for (const items of key) {
		let tempArray = [
			[],// temp
			[],// rain
			[] // wind
		];
		for (const item of pent[items][day].steps) {
			tempArray[0].push(new symbolAdder(
                item.temperature,
                "",
                code[parseInt(item.symbol.substr(0, 2)) - 1].code,
                code[parseInt(item.symbol.substr(0, 2)) - 1].dayNight ? (item.symbol.length === 2 ? "_day" : "_night") : ""
            ));
			tempArray[1].push(item.precipitation);
			tempArray[2].push(new symbolAdder(item.windSpeed, item.windDirection));
		}
		temps.push({ data: tempArray[0], name: items });
		rain.push({ data: tempArray[1], name: items });
		wind.push({ data: tempArray[2], name: items });
	}
	let temp = [
		[],// temp
		[] // rain
	];
	for (const item of openMeteo[day]) {
		try {
			temp[0].push(new symbolAdder(
				item.temperature,
				"",
				codeForWmoWithIndex(code, item.weather_code).code,
				code[codeForWmoWithIndex(code, item.weather_code).index].dayNight ? item.day : ""
			));
		} catch (TypeError) {
			temp[0].push(item.temperature);
		}
		temp[1].push(item.precipitation);
	}
	temps.push({ data: temp[0], name: "openMeteo" });
	rain.push({ data: temp[1], name: "openMeteo" });

	let result = { time: pent.yr[day].steps.map(obj => obj.startDate.substr(11,5)), temp: temps, rain: rain, wind: wind };
    
	return result;
}

function codeForWmoWithIndex(data, target) {// FUNCT: get's code and index from data
  for (let i = 0; i < data.length; i++) {
    const w = data[i].wmo;
    if (w === undefined) continue;
    if (Array.isArray(w) ? w.includes(target) : w === target) {
      return { index: i, code: data[i].code };
    }
  }
  return null;
}
