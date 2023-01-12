import { Route, Routes } from "react-router-dom";
import App from "./components/App/App";
import ForgetPassword from "./components/ForgetPassword";
import VerifyEmail from "./components/VerifyEmail";

const Root = () => (
  <Routes>
    <Route path="/" element={<App />} />
    <Route path="verify-email/:email/:verificationToken" element={<VerifyEmail />} />
    <Route path="forget-password-verify/:email/:verificationToken" element={<ForgetPassword/>}/>
  </Routes>
);
export default Root;
