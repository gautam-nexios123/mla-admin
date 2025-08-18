import "./i18n";
import "./styles/app-base.css";
import "./styles/app-components.css";
import "./styles/app-utilities.css";
import { createRoot } from "react-dom/client";
import App from "./app/App";
import { LicenseInfo } from "@mui/x-license";
// import * as serviceWorker from './serviceWorker';
// import reportWebVitals from './reportWebVitals';
LicenseInfo.setLicenseKey(
  "49ad80af5e84f42ad927a5f986d63f21Tz0xMTQ0OTAsRT0xNzgxMzA4Nzk5MDAwLFM9cHJvLExNPXN1YnNjcmlwdGlvbixQVj1pbml0aWFsLEtWPTI="
);
/**
 * The root element of the application.
 */
const container = document.getElementById("root");

if (!container) {
  throw new Error("Failed to find the root element");
}

/**
 * The root component of the application.
 */
const root = createRoot(container);

root.render(<App />);

// reportWebVitals();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
// serviceWorker.unregister();
