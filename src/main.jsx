import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { SplineChart, ColumnChart } from "./DisplayData.jsx";
import { getWeather, getWhere } from "./GetApiData.jsx";

const data = [
	{
        data: [
            3,
            4,
            {
                y: 26.4,
                marker: {
                    symbol: "url(https://www.highcharts.com/samples/graphics/sun.png)"
                },
                accessibility: {
                    description: "Sunny symbol, this is the warmest point in the " + "chart."
                }
            },
            5,
            2
        ],
        name: "yr"
    },{
        data: [2,
            3,
            2,
            4,
            1
        ],
        name: "storm"
    }
];

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<SplineChart title="temp for the day" data={data} />
		<ColumnChart title="rain for the day" data={[3, 4, 1, 5, 2]} />
	</StrictMode>,
);

getWeather({ lat: 59.9133301, lon: 10.7389701 });