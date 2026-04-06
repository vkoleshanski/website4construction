import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const redirectedPath = sessionStorage.getItem("format4_redirect_path");
if (redirectedPath) {
	sessionStorage.removeItem("format4_redirect_path");
	window.history.replaceState(null, "", redirectedPath);
}

createRoot(document.getElementById("root")!).render(<App />);
