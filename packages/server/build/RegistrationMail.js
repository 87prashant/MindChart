const React = require("react");
const ReactDOMServer = require("react-dom/server");
const RegistrationMail = ({
  username
}) => {
  const jsxMessage = /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", null, "Hello ", username, ", this is registration mail"));
  const message = ReactDOMServer.renderToString(jsxMessage);
  return message;
};
module.exports = RegistrationMail;