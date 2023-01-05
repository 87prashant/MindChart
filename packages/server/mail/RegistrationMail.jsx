const React = require("react");
const ReactDOMServer = require("react-dom/server");

const RegistrationMail = (props) => {
  const { username, uniqueUrl } = props;

  return (
    <div>
      <p>Hello {username}, this is registration mail</p>
      <button href={uniqueUrl}>Verify</button>
    </div>
  );
};

const bodyContent = ({ username, uniqueUrl }) => {
  return ReactDOMServer.renderToString(
    <RegistrationMail username={username} uniqueUrl={uniqueUrl} />
  );
};

module.exports = bodyContent;
