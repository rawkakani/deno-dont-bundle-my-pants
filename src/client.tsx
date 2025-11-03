import { hydrateRoot } from "react-dom/client";
import { App } from "./app.tsx";

const rootElement = document.getElementById("root");
if (rootElement) {
  hydrateRoot(rootElement, <App />);
}