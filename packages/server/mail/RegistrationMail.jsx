const React = require("react");
const ReactDOMServer = require("react-dom/server");

const RegistrationMail = (props) => {
  const { username, uniqueUrl } = props;
  return (
    <div>
      <p>Hello {username}, verify your account</p>
      <a href={uniqueUrl}>Verify</a>
    </div>
  );
};

const registrationMailString = ({ username, uniqueUrl }) => {
  return ReactDOMServer.renderToString(
    <RegistrationMail username={username} uniqueUrl={uniqueUrl} />
  );
};

module.exports = registrationMailString;
