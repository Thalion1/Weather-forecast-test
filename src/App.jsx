import { useEffect, useState, useRef } from "react";
import { SplineChart, ColumnChart } from "./DisplayData.jsx";
import { GetWeather, GetWhere, marge } from "./GetApiData.jsx";
import "./App.css";

export default function App() {
	let textColor = getComputedStyle(document.documentElement).getPropertyValue("--text").trim();
	let backgroundColor = getComputedStyle(document.documentElement).getPropertyValue("--bg").trim();
	const [data, setData] = useState({ temp: [], rain: [], wind: [] });
	const tempRef = useRef(null);
	const rainRef = useRef(null);
	const windRef = useRef(null);
    let dataSet;
    let day = 0;

	useEffect(() => {
		(async () => {
			const [lat, lon] = await GetWhere("Oslo");
			
			dataSet = await GetWeather({ lat, lon });
			setData(marge(dataSet, day));
		})();
	}, []);

	useEffect(() => {
		const userInput = document.getElementById("user-input");
		const userSubBtn = document.getElementById("user-submit");
		const preveusbtn = document.getElementById("preveus");
        const nextbtn = document.getElementById("next");
		preveusbtn.disabled = true;

        function onPrev() {// FUNCT: Preveus day display change
            day--;
            if (day <= 0) preveusbtn.disabled = true;
            nextbtn.disabled = false;
            onSubmit(true);
        };
        function onNext() {// FUNCT: Next day display change
            day++;
            if (day >= 2) nextbtn.disabled = true;
            preveusbtn.disabled = false;
            onSubmit(true);
        };

		const onSubmit = async (dayChange) => {// FUNCT: Changes data displayed
            if (!dayChange) {
                const [lat, lon] = await GetWhere(userInput.value.replaceAll(" ", "+"));
                dataSet = await GetWeather({ lat, lon });
            }
			const newData = marge(dataSet, day);
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
			if (e.code === "Enter") await onSubmit(false);
		};

		userInput.addEventListener("keydown", onKey);
		userSubBtn.addEventListener("click", onSubmit(false));
        preveusbtn.addEventListener('click', onPrev);
        nextbtn.addEventListener('click', onNext);
		return () => {
			userInput.removeEventListener("keydown", onKey);
			userSubBtn.removeEventListener("click", onSubmit(false));
            preveusbtn.removeEventListener('click', onPrev);
            nextbtn.removeEventListener('click', onNext);
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
				<SplineChart title="temp for the day" yaxis="Temprature" tooltip="°C" data={data.temp} time={data.time} color={{ background: backgroundColor, text: textColor }} chartRef={tempRef} />
				<ColumnChart title="rain for the day" yaxis="Rain" tooltip="mm" data={data.rain} time={data.time} color={{ background: backgroundColor, text: textColor }} chartRef={rainRef} />
				<SplineChart title="wind for the day" yaxis="Wind" tooltip="m/s" data={data.wind} time={data.time} color={{ background: backgroundColor, text: textColor }} chartRef={windRef} />
			</div>
		</>
	);
}
