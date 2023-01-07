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

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
