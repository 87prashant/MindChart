const React = require("react");
const ReactDOMServer = require("react-dom/server");
const RegistrationMail = props => {
  const {
    username,
    uniqueUrl
  } = props;
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", null, "Hello ", username, ", this is registration mail"), /*#__PURE__*/React.createElement("a", {
    href: uniqueUrl
  }, "Verify"));
};
const registrationMailString = ({
  username,
  uniqueUrl
}) => {
  return ReactDOMServer.renderToString( /*#__PURE__*/React.createElement(RegistrationMail, {
    username: username,
    uniqueUrl: uniqueUrl
  }));
};
module.exports = registrationMailString;