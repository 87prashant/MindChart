import { Route, Routes } from "react-router-dom";
import App from "./components/App/App";
import ForgetPasswordPage from "./components/ForgetPasswordPage";
import VerifyEmailPage from "./components/VerifyEmailPage";

const Root = () => (
  <Routes>
    <Route path="/" element={<App />} />
    <Route path="verify-email/:email/:verificationToken" element={<VerifyEmailPage />} />
    <Route path="forget-password-verify/:email/:verificationToken" element={<ForgetPasswordPage/>}/>
  </Routes>
);
export default Root;
