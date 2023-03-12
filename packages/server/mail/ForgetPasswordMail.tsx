import React from "react";
import ReactDOMServer from "react-dom/server";

const ForgetPasswordMail = (props) => {
  const { username, uniqueUrl } = props;
  return (
    <div>
      <p>Hello {username}, create new password</p>
      <a href={uniqueUrl}>Click</a>
    </div>
  );
};

const forgetPasswordMailString = ({ username, uniqueUrl }) => {
  return ReactDOMServer.renderToString(
    <ForgetPasswordMail username={username} uniqueUrl={uniqueUrl} />
  );
};

export default forgetPasswordMailString;
