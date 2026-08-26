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
    const tempRef = useRef(null);
    const rainRef = useRef(null);
    const windRef = useRef(null);
    const previousButtonRef = useRef(null);
    const nextButtonRef = useRef(null);
    const dataSet = useRef(null);
    let day = 0;
    const baseLink = "/Weather-forecast-test"
    const navigate = useNavigate();
    const { lat, lon, place } = useParams();
    const mode = useRef(place !== undefined ? "place" : (lat !== undefined && lon !== undefined) ? "position" : "none")
    const [searchInput, setSearchInput] = useState("")
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
            // FUNCT: Handls text box inputs
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

        async function testFunct(lat, lon, place) {
            console.log("test");
            if (place !== undefined) {
                [lat, lon] = await getWhere(place.value.replaceAll(" ", "+"), 0);
            }
            
            mode.current = "position";
            navigate(`${baseLink}/position/${lat}/${lon}`);
            console.log("mode", mode.current);
        }

        userInput.addEventListener("keydown", onKey); // FUNCT: Adds eventlisteners
        userSubBtn.addEventListener("click", () => onSubmit(false, 0));
        previousButton.addEventListener("click", onPrev);
        nextButton.addEventListener("click", onNext);
        const onTest = () => {
            navigate(baseLink + "/");
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
        // FUNCT: Preveus day display change
        day--;
        if (day <= 0) previousButtonRef.current.disabled = true;
        nextButtonRef.current.disabled = false;
        onSubmit(true);
    }
    function onNext() {
        // FUNCT: Next day display change
        day++;
        if (day >= 2) nextButtonRef.current.disabled = true;
        previousButtonRef.current.disabled = false;
        
        onSubmit(true);
    }

    const onSubmit = async (dayChange, index = 0) => {// FUNCT: Changes data displayed
        console.log("onSubmit called", { dayChange, index });
        
        if (!dayChange) {
            const [lat, lon] = await getWhere(document.getElementById("user-input").value.replaceAll(" ", "+"), index);
            navigate(`${baseLink}/position/${lat}/${lon}`);
            dataSet.current = await getWeather({ lat, lon });
        }
        
        const newData = marge(dataSet.current, day);
        console.log(dataSet.current);
        
        setData(newData);
        setData2({ locations: [] });

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

    useEffect(() => {
        console.log("jkfldaj", lat, lon, place);
        
        (async () => {
            // const { lat, lon, place } = useParams();
            // const mode = place !== undefined ? "place" : (lat !== undefined && lon !== undefined) ? "position" : "none";
            const position = { lat: parseFloat(lat), lon: parseFloat(lon) }
            console.log(mode.current);

            console.log(typeof(lat), lat, typeof(lon), lon, typeof(place), place);
            switch (mode.current) {
                case "place":
                    console.log("place test");
                    const [lat, lon] = await getWhere(place, 0);
                    dataSet.current = await getWeather({ lat, lon });
                    onSubmit(true)
                    break;
                case "position":
                    console.log("position test");

                    dataSet.current = await getWeather(position);

                    onSubmit(true);
                    break;
                default:

                    break;
            }
        })();
    }, [lat, lon, place])
    
    const contextValue = useMemo(() => ({ onSubmit }), [onSubmit]);
    console.log("AppContext in App.jsx:", AppContext);
    console.log("Provider value:", contextValue);

    return (
        <AppContext.Provider value={contextValue}>
            <>
            <nav>
                <button id="preveus" ref={previousButtonRef}>←</button>
                <div className="user-inputs">
                    <input type="text" id="user-input" value={searchInput} onChange={(e) => {setSearchInput(e.target.value)}} />
                    <input type="submit" value="submit" id="user-submit" />
                    <input type="submit" value="Clear" id="test" />
                </div>
                <div className="dropdown-container">
                    <Dropdownlist list={data2} input={document.getElementById("user-input")} />
                </div>
                <button id="next" ref={nextButtonRef}>→</button>
            </nav>
            <main>
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