import { createBrowserRouter } from "react-router-dom";
import App from "../app";

export const router = createBrowserRouter([
    { path: "/Weather-forecast-test/", element: <App />, children: [
        { path: "position/:lat/:lon", element: <App /> },
        { path: "place/:place", element: <App />}
    ]},
    { path: "*", element: <h1>404 Not Found</h1> }
])