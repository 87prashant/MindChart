const React = require("react");
const ReactDOMServer = require("react-dom/server");

const RegistrationMail = ({ username }) => {
  const jsxMessage = (
    <div>
      <p>Hello {username}, this is registration mail</p>
    </div>
  );
  const message = ReactDOMServer.renderToString(jsxMessage);
  return message;
};

module.exports = RegistrationMail;
