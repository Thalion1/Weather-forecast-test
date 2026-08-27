import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import "./index.css";
import { router } from "./router";
// import App from "./App.jsx";

// Restore a nested route after GitHub Pages sends it through 404.html.
const redirect = new URLSearchParams(window.location.search).get("redirect");
if (redirect) {
	window.history.replaceState(null, "", redirect);
}

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<RouterProvider router={router} />
	</StrictMode>,
);