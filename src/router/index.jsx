import { createBrowserRouter } from "react-router-dom";
import App from "../App.jsx";

export const router = createBrowserRouter([
    { path: "/", element: <App /> },
    { path: "/position/:lat/:lon", element: <App /> },
    { path: "/place/:place", element: <App /> },
    { path: "*", element: <h1>404 Not Found</h1> }
], {
    basename: "/Weather-forecast-test",
});