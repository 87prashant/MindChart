const React = require("react");
const Axios = require("axios")

class RegistrationMail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      result: "",
    };
  }

  handleVerification = () => {
    const { username, email, password } = this.props;
    Axios
      .post("/verify-email", {
        header: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      })
      .then((response) => response.json())
      .then((data) => {
        const { status } = data;
        if (status === "ok") {
          this.setState({ result: "Registered" });
        } else {
          this.setState({ result: data.error });
        }
      });
  };

  render() {
    const { username } = this.props;
    const { result } = this.state;
    return `
    <div>
      <p>Hello ${username}, this is registration mail</p>
      ${
        result !== "Registered"
          ? `<button onClick="${this.handleVerification}">Verify</button>`
          : `<p>You are verified!!</p>`
      }
    </div>
  `;
  }
}

module.exports = RegistrationMail;
