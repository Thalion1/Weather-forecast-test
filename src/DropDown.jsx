import { useContext } from "react";
import { AppContext } from "./App.jsx";

export function Dropdownlist({list, input}) {
    
    
    const { onSubmit } = useContext(AppContext);
    console.log("Dropdownlist AppContext:", AppContext);
    console.log("Dropdownlist onSubmit:", useContext(AppContext)?.onSubmit);
    
    try {
        return (
            <div>
                {list.locations.map((s, i) => (
                    <div key={i} onClick={() => onSubmit?.(false, i)} className="hover-cursor">
                        <h3>{s.name}</h3>
                        <p>{s.label}</p>
                    </div>
                ))}
            </div>
        )
    } catch (error) {
        console.error(error);
        
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