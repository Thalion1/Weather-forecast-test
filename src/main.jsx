import { StrictMode, useEffect, useState, useRef } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { SplineChart, ColumnChart } from "./DisplayData.jsx";
import { GetWeather, GetWhere } from "./GetApiData.jsx";

let textColor = getComputedStyle(document.documentElement).getPropertyValue("--text").trim();
let backgroundColor = getComputedStyle(document.documentElement).getPropertyValue("--bg").trim();

function Root() {
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
		<StrictMode>
			<div>
				<input type="text" id="user-input" />
				<input type="submit" value="submit" id="user-submit" />
			</div>
			<div id="container">
				<SplineChart title="temp for the day" data={data.temp} color={{ background: backgroundColor, text: textColor }} chartRef={tempRef} />
				<ColumnChart title="rain for the day" data={data.rain} color={{ background: backgroundColor, text: textColor }} chartRef={rainRef} />
				<SplineChart title="wind for the day" data={data.wind} color={{ background: backgroundColor, text: textColor }} chartRef={windRef} />
			</div>
		</StrictMode>
	);
}

createRoot(document.getElementById("root")).render(<Root />);
