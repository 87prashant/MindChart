import { createRoot } from "react-dom/client";
import "./index.css";
import Root from "./Root";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";

const root = document.getElementById("root");
createRoot(root!).render(
  <BrowserRouter>
    <Root />
  </BrowserRouter>
);

reportWebVitals();
