const React = require("react");
const ReactDOMServer = require("react-dom/server");
const ForgetPasswordMail = props => {
  const {
    username,
    uniqueUrl
  } = props;
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", null, "Hello ", username, ", Create new password"), /*#__PURE__*/React.createElement("a", {
    href: uniqueUrl
  }, "Click"));
};
const forgetPasswordMailString = ({
  username,
  uniqueUrl
}) => {
  return ReactDOMServer.renderToString( /*#__PURE__*/React.createElement(ForgetPasswordMail, {
    username: username,
    uniqueUrl: uniqueUrl
  }));
};
module.exports = forgetPasswordMailString;