import { hydrateRoot } from "react-dom/client";
import { App } from "./app.tsx";

declare global {
  interface Window {
    __INITIAL_DATA__: any;
  }
}

const rootElement = document.getElementById("root");
if (rootElement) {
  const initialData = window.__INITIAL_DATA__;
  hydrateRoot(rootElement, <App {...initialData} />);
}