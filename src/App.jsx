import { useEffect, useState, useRef, createContext, useCallback, useMemo } from "react";
import { SplineChart, ColumnChart } from "./DisplayData.jsx";
import { GetWeather, GetWhere, marge } from "./GetApiData.jsx";
import { Dropdownlist } from "./DropDown.jsx";
// import { AppContext } from "./App.jsx";
import "./App.css";
console.log("file start"); // TEST start

export const AppContext = createContext({});



export default function App() {
    let textColor = getComputedStyle(document.documentElement).getPropertyValue("--text").trim();
    let backgroundColor = getComputedStyle(document.documentElement).getPropertyValue("--bg").trim();
    const [data, setData] = useState({ temp: [], rain: [], wind: [] });
    const tempRef = useRef(null);
    const rainRef = useRef(null);
    const windRef = useRef(null);
    // const [dataSet, setDataSet] = useState(0);
    const dataSet = useRef(null);
    let day = 0;
    console.log('app start');// TEST app start
    

    const [data2, setData2] = useState({ locations: [] });

    useEffect(() => {
        (async () => {
            console.log('dropdown start');// TEST dropdown start state
            
            // setData2(await GetWhere("vold"));
            /*const [lat, lon] = await GetWhere("Oslo");

            dataSet = await GetWeather({ lat, lon });
            setData(marge(dataSet, day));*/
        })();
    }, []);

    useEffect(() => {
        console.log('primery useEffect start');// TEST prim useEffect start
        
        const userInput = document.getElementById("user-input");
        const userSubBtn = document.getElementById("user-submit");
        const preveusbtn = document.getElementById("preveus");
        const nextbtn = document.getElementById("next");
        preveusbtn.disabled = true;

        async function test() {
            setData2(await GetWhere(userInput.value.replaceAll(" ", "+")));
        }
        function onPrev() {
            // FUNCT: Preveus day display change
            day--;
            if (day <= 0) preveusbtn.disabled = true;
            nextbtn.disabled = false;
            onSubmit(true);
        }
        function onNext() {
            // FUNCT: Next day display change
            day++;
            if (day >= 2) nextbtn.disabled = true;
            preveusbtn.disabled = false;
            console.log("dataSet", dataSet);
            
            onSubmit(true);
        }

        let debounceTimer = null;

        const onKey = async (e) => {
            if (e.code === "Enter") {
                // immediate submit on Enter
                if (debounceTimer) clearTimeout(debounceTimer);
                await onSubmit(false, userInput, 0);
                return;
            }

            // schedule GetWhere after 300ms of no new input
            if (debounceTimer) clearTimeout(debounceTimer);
            const query = userInput.value.replaceAll(" ", "+");
            console.log(query); // TEST query log

            debounceTimer = setTimeout(async () => {
                setData2(await GetWhere(query));
            }, 1250);
        };

        console.log('event listener start');// TEST event listener start
        
        userInput.addEventListener("keydown", onKey); // FUNCT: Adds eventlisteners
        userSubBtn.addEventListener("click", () => onSubmit(false, userInput, 0));
        preveusbtn.addEventListener("click", onPrev);
        nextbtn.addEventListener("click", onNext);
        return () => {
            userInput.removeEventListener("keydown", onKey);
            userSubBtn.removeEventListener("click", onSubmit);
            preveusbtn.removeEventListener("click", onPrev);
            nextbtn.removeEventListener("click", onNext);
        };
    }, []);

    const onSubmit = async (dayChange, input, index = 0) => {// FUNCT: Changes data displayed
        console.log(dayChange, input, index);
        
        if (!dayChange) {
            console.log(input.value, 'submit test');// TEST submit input
            
            const [lat, lon] = await GetWhere(input.value.replaceAll(" ", "+"), index);
            
            dataSet.current = await GetWeather({ lat, lon });
        }
        console.log("dataSet", dataSet.current, day);
        
        const newData = marge(dataSet.current, day);
        console.log("newData", newData, day);
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
    
    const contextValue = useMemo(() => ({ onSubmit }), [onSubmit]);

    return (
        <AppContext.Provider value={contextValue}>
            <nav>
                <button id="preveus">←</button>
                <div className="user-inputs">
                    <input type="text" id="user-input" />
                    <input type="submit" value="submit" id="user-submit" />
                </div>
                <div className="dropdown-container">
                    <Dropdownlist list={data2} input={document.getElementById("user-input")} />
                </div>
                <button id="next">→</button>
            </nav>
            <main>
                <div id="container">
                    <SplineChart title="temp for the day" yaxis="Temprature" tooltip="°C" data={data.temp} time={data.time} color={{ background: backgroundColor, text: textColor }} chartRef={tempRef} />
                    <ColumnChart title="rain for the day" yaxis="Rain" tooltip="mm" data={data.rain} time={data.time} color={{ background: backgroundColor, text: textColor }} chartRef={rainRef} />
                    <SplineChart title="wind for the day" yaxis="Wind" tooltip="m/s" data={data.wind} time={data.time} color={{ background: backgroundColor, text: textColor }} chartRef={windRef} />
                </div>
            </main>
        </AppContext.Provider>
    );
}
