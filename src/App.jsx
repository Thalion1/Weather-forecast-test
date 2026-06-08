import { useEffect, useState, useRef } from "react";
import { SplineChart, ColumnChart } from "./DisplayData.jsx";
import { GetWeather, GetWhere } from "./GetApiData.jsx";
import "./App.css";

export default function App() {
	let textColor = getComputedStyle(document.documentElement).getPropertyValue("--text").trim();
	let backgroundColor = getComputedStyle(document.documentElement).getPropertyValue("--bg").trim();
	const [data, setData] = useState({ temp: [], rain: [], wind: [] });
	const tempRef = useRef(null);
	const rainRef = useRef(null);
	const windRef = useRef(null);

	useEffect(() => {
		(async () => {
			const initial = await GetWeather({ lat: 62.19983, lon: 6.12904 });
			setData(initial);
		})();
	}, []);

	useEffect(() => {
		const userInput = document.getElementById("user-input");
		const userSubBtn = document.getElementById("user-submit");
		const preveusbtn = document.getElementById("preveus");
		console.log(preveusbtn);

		const onSubmit = async () => {
			const [lat, lon] = await GetWhere(userInput.value.replaceAll(" ", "+"));
			const newData = await GetWeather({ lat, lon });
			setData(newData);
            
			// Optional: in-place update via chart instance for better performance
			const chart = tempRef.current?.chart;
			if (chart && newData.temp?.[0]) {
				const s = chart.get(newData.temp[0].id ?? "s-0");
				if (s) s.setData(newData.temp[0].data, true);
			}
			const cchart = rainRef.current?.chart;
			if (cchart && newData.rain?.[0]) {
				const cs = cchart.get(newData.rain[0].id ?? "c-0");
				if (cs) cs.setData(newData.rain[0].data, true);
			}
			// repeat for windRef if needed
		};

		const onKey = async (e) => {
			if (e.code === "Enter") await onSubmit();
		};

		userInput.addEventListener("keydown", onKey);
		userSubBtn.addEventListener("click", onSubmit);
		return () => {
			userInput.removeEventListener("keydown", onKey);
			userSubBtn.removeEventListener("click", onSubmit);
		};
	}, []);

	return (
		<>
			<nav>
				<button id="preveus">←</button>
				<div>
					<input type="text" id="user-input" />
					<input type="submit" value="submit" id="user-submit" />
				</div>
				<button id="next">→</button>
			</nav>
			<div id="container">
				<SplineChart title="temp for the day" yaxis="Temprature" data={data.temp} time={data.time} color={{ background: backgroundColor, text: textColor }} chartRef={tempRef} />
				<ColumnChart title="rain for the day" yaxis="Rain" data={data.rain} time={data.time} color={{ background: backgroundColor, text: textColor }} chartRef={rainRef} />
				<SplineChart title="wind for the day" yaxis="Wind" data={data.wind} time={data.time} color={{ background: backgroundColor, text: textColor }} chartRef={windRef} />
			</div>
		</>
	);
}
