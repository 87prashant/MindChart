import { Route, Routes } from "react-router-dom";
import App from "./components/App/App";
import VerifyEmail from "./components/VerifyEmail";

const Root = () => (
  <Routes>
    <Route path="/" element={<App />} />
    <Route path="verify-email/:email/:verificationToken" element={<VerifyEmail />} />
  </Routes>
);
export default Root;
