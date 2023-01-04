const React = require("react");
const ReactDOMServer = require("react-dom/server");

require("dotenv").config({ path: "../../../.env" });

const RegistrationMail = (props) => {
  const { username, email, password } = props;

  return (
    <div>
      <p>Hello {username}, this is registration mail</p>
      <button href={`/verify-email/${generateUniqueUrl}`}>Verify</button>
    </div>
  );
};

const bodyContent = ({ username, email, password }) => {
  return ReactDOMServer.renderToString(
    <RegistrationMail username={username} email={email} password={password} />
  );
};

module.exports = bodyContent;
