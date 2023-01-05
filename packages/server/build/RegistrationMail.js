const React = require("react");
const ReactDOMServer = require("react-dom/server");
const generateUniqueUrl = require("./generateUniqueUrl");
require("dotenv").config({
  path: "../../.env"
});
require("dotenv").config({
  path: "../../../.env"
});
const RegistrationMail = props => {
  const {
    username,
    email,
    password
  } = props;
  console.log(`${process.env.ORIGIN}/verify-email/${generateUniqueUrl()}`);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", null, "Hello ", username, ", this is registration mail"), /*#__PURE__*/React.createElement("button", {
    href: `${process.env.ORIGIN}/verify-email/${generateUniqueUrl}`
  }, "Verify"));
};
const bodyContent = ({
  username,
  email,
  password
}) => {
  return ReactDOMServer.renderToString( /*#__PURE__*/React.createElement(RegistrationMail, {
    username: username,
    email: email,
    password: password
  }));
};
module.exports = bodyContent;