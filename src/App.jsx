import { useEffect, useState, useRef, createContext, useCallback, useMemo } from "react";
import { SplineChart, ColumnChart } from "./DisplayData.jsx";
import { getWeather, getWhere, marge } from "./GetApiData.jsx";
import { Dropdownlist } from "./DropDown.jsx";
// import { AppContext } from "./App.jsx";
import "./App.css";
import { useParams, useNavigate } from "react-router-dom";

export const AppContext = createContext({});

/* const AppContext = ({children}) => {
    const Provider = {onS}
    return (
        <appContext.Provider value={contextValue}>
            {children}
        </appContext.Provider>
    )
} */

export default function App() {
    let textColor = getComputedStyle(document.documentElement).getPropertyValue("--text").trim();
    let backgroundColor = getComputedStyle(document.documentElement).getPropertyValue("--bg").trim();
    const [data, setData] = useState({ temp: [], rain: [], wind: [] });
    const [loading, setLoading] = useState(false);
    const [loadError, setLoadError] = useState("");
    const tempRef = useRef(null);
    const rainRef = useRef(null);
    const windRef = useRef(null);
    const previousButtonRef = useRef(null);
    const nextButtonRef = useRef(null);
    const dataSet = useRef(null);
    let day = 0;
    const navigate = useNavigate();
    const { lat, lon, place } = useParams();
    const mode = place !== undefined ? "place" : lat !== undefined && lon !== undefined ? "position" : "none";
    const [searchInput, setSearchInput] = useState("");
    if (mode !== "none") {
        console.log(mode, { lat, lon, place });
    }

    const [data2, setData2] = useState({ locations: [] });

    // useEffect(() => {

    // }, [])

    useEffect(() => {
        const userInput = document.getElementById("user-input");
        const userSubBtn = document.getElementById("user-submit");
        const previousButton = previousButtonRef.current;
        const nextButton = nextButtonRef.current;
        const testInput = document.getElementById("test");

        previousButton.disabled = true;

        let debounceTimer = null;

        const onKey = async (e) => {
            // Submit immediately with Enter; otherwise wait until typing pauses
            // before requesting location suggestions.
            if (e.code === "Enter") {
                // immediate submit on Enter
                if (debounceTimer) clearTimeout(debounceTimer);
                await onSubmit(false, 0);
                // await testFunct(1, 1, userInput)
                return;
            }

            // schedule GetWhere after 300ms of no new input
            if (debounceTimer) clearTimeout(debounceTimer);
            const query = userInput.value.replaceAll(" ", "+");

            debounceTimer = setTimeout(async () => {
                setData2(await getWhere(query));
            }, 1250);
        };

        // These listeners connect the existing controls to the handlers below.
        userInput.addEventListener("keydown", onKey);
        userSubBtn.addEventListener("click", () => onSubmit(false, 0));
        previousButton.addEventListener("click", onPrev);
        nextButton.addEventListener("click", onNext);
        const onTest = () => {
            navigate("/");
            setData({ temp: [], rain: [], wind: [] });
        };
        testInput.addEventListener("click", onTest);
        return () => {
            userInput.removeEventListener("keydown", onKey);
            userSubBtn.removeEventListener("click", onSubmit);
            previousButton.removeEventListener("click", onPrev);
            nextButton.removeEventListener("click", onNext);
            testInput.removeEventListener("click", onTest);
        };
    }, []);

    function onPrev() {
        // Move to the previous forecast day and disable the button at day zero.
        day--;
        if (day <= 0) previousButtonRef.current.disabled = true;
        nextButtonRef.current.disabled = false;
        onSubmit(true);
    }
    function onNext() {
        // Move to the next forecast day and stop at the final supported day.
        day++;
        if (day >= 2) nextButtonRef.current.disabled = true;
        previousButtonRef.current.disabled = false;

        onSubmit(true);
    }

    const onSubmit = async (dayChange, index = 0) => {
        console.log("onSubmit called", { dayChange, index });

        if (!dayChange) {
            // A new search resolves a place first, then fetches both weather sources.
            const [lat, lon] = await getWhere(document.getElementById("user-input").value.replaceAll(" ", "+"), index);
            navigate(`/position/${lat}/${lon}`);
            dataSet.current = await getWeather({ lat, lon });
        }

        // Select the current day and convert provider data into chart series.
        const newData = marge(dataSet.current, day);
        console.log(dataSet.current);

        setData(newData);
        setData2({ locations: [] });

        // Update mounted charts in place when possible to avoid rebuilding them.
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

    useEffect(() => {
        if (mode === "none") {
            setLoading(false);
            return;
        }

        let cancelled = false;
        setLoading(true);
        setLoadError("");

        async function loadForecast() {
            try {
                // Routes can provide either a place name or coordinates.
                let position;
                if (mode === "place") {
                    const [placeLat, placeLon] = await getWhere(place, 0);
                    position = { lat: placeLat, lon: placeLon };
                } else {
                    position = { lat: parseFloat(lat), lon: parseFloat(lon) };
                }

                const weather = await getWeather(position);

                if (!cancelled) {
                    dataSet.current = weather;
                    setData(marge(weather, 0));
                    setLoading(false);
                }
            } catch (error) {
                console.error("Unable to load forecast for route", error);
                if (!cancelled) {
                    setLoading(false);
                    setLoadError(error instanceof Error ? error.message : "Unable to load forecast");
                }
            }
        }

        loadForecast();
        return () => {
            cancelled = true;
        };
    }, [lat, lon, place]);

    const contextValue = useMemo(() => ({ onSubmit }), [onSubmit]);
    console.log("AppContext in App.jsx:", AppContext);
    console.log("Provider value:", contextValue);

    return (
        <AppContext.Provider value={contextValue}>
            <>
                <nav>
                    <button id="preveus" ref={previousButtonRef}>
                        ←
                    </button>
                    <div className="user-inputs">
                        <input
                            type="text"
                            id="user-input"
                            value={searchInput}
                            onChange={(e) => {
                                setSearchInput(e.target.value);
                            }}
                        />
                        <input type="submit" value="submit" id="user-submit" />
                        <input type="submit" value="Clear" id="test" />
                    </div>
                    <div className="dropdown-container">
                        <Dropdownlist list={data2} input={document.getElementById("user-input")} />
                    </div>
                    <button id="next" ref={nextButtonRef}>
                        →
                    </button>
                </nav>
                <main>
                    {loading && <p>Loading forecast...</p>}
                    {loadError && <p role="alert">Forecast error: {loadError}</p>}
                    <div id="container">
                        <SplineChart title="temp for the day" yaxis="Temprature" tooltip="°C" data={data.temp} time={data.time} color={{ background: backgroundColor, text: textColor }} chartRef={tempRef} />
                        <ColumnChart title="rain for the day" yaxis="Rain" tooltip="mm" data={data.rain} time={data.time} color={{ background: backgroundColor, text: textColor }} chartRef={rainRef} />
                        <SplineChart title="wind for the day" yaxis="Wind" tooltip="m/s" data={data.wind} time={data.time} color={{ background: backgroundColor, text: textColor }} chartRef={windRef} />
                    </div>
                </main>
            </>
        </AppContext.Provider>
    );
}

/*
onClick={onPrev()} preveus
onClick={onNext()} next

*/
