import { useContext } from "react";
import { AppContext } from "./App.jsx";

export function Dropdownlist({list, input}) {
    console.log(list);
    
    const { onSubmit } = useContext(AppContext);
    console.log(input);
    try {
        return (
            <div>
                {list.locations.map((s, i) => (
                    <div key={i} onClick={() => onSubmit?.(false, input, i)}>
                        <h3>{s.name}</h3>
                        <p>{s.label}</p>
                    </div>
                ))}
            </div>
        )
    } catch (error) {
        if (error instanceof TypeError) {
            return (
                <div>
                    <p>No search results</p>
                </div>
            )
        } else {
            console.error(error);
            <div>
                <p>Search error</p>
            </div>
        }
    }
}