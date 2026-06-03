import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { SplineChart, ColumnChart } from "./DisplayData.jsx";
import { getWeather, getWhere } from "./GetApiData.jsx";

const data = await getWeather({ lat: 59.9133301, lon: 10.7389701 });
let backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim();
let textColor = getComputedStyle(document.documentElement).getPropertyValue('--text').trim();

console.log(document.getElementById('user-submit'));

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <div>
            <input type="text" id="user-input" />
            <input type="submit" value="submit" id="user-submit" />
        </div>
        <div>
		    <SplineChart title="temp for the day" data={data} color={{background: backgroundColor, text: textColor}} />
		    <ColumnChart title="rain for the day" data={[3, 4, 1, 5, 2]} color={{background: backgroundColor, text: textColor}} />
            <SplineChart title="wind for the day" data={data} color={{background: backgroundColor, text: textColor}} />
        </div>
	</StrictMode>,
);

console.log(document.getElementById('user-submit'));