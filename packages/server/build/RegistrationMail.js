const React = require("react");
const Axios = require("axios");
const ReactDOMServer = require("react-dom/server");
require("dotenv").config({
  path: "../../../.env"
});
const RegistrationMail = props => {
  const {
    username,
    email,
    password
  } = props;
  const [result, setResult] = React.useState("");
  const handleVerification = () => {
    Axios.post(process.env.EMAIL_VERIFICATION_API, {
      header: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username,
        email,
        password
      })
    }).then(response => response.json()).then(data => {
      const {
        status
      } = data;
      if (status === "ok") {
        setResult("Registered");
      } else {
        setResult(data.error);
      }
    });
  };
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", null, "Hello ", username, ", this is registration mail"), result !== "Registered" ? /*#__PURE__*/React.createElement("button", {
    onClick: handleVerification
  }, "Verify") : /*#__PURE__*/React.createElement("p", null, "You are verified!!"));
};
const bodyContent = ({
  username,
  email,
  password
}) => {
  return ReactDOMServer.renderToStaticMarkup( /*#__PURE__*/React.createElement(RegistrationMail, {
    username: username,
    email: email,
    password: password
  }));
};
module.exports = bodyContent;