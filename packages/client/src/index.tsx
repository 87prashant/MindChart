import { createRoot } from "react-dom/client";
import "./index.css";
import Root from "./Root";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

const root = document.getElementById("root");
createRoot(root!).render(
  <BrowserRouter>
  <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID!}>
    <Root />
  </GoogleOAuthProvider>
  </BrowserRouter>
);

reportWebVitals();
