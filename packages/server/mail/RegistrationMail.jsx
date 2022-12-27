const React = require("react");

class RegistrationMail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      result: "",
    };
  }

  handleVerification = () => {
    const { username, email, password } = this.props;
    app
      .fetch("/verify-email", {
        method: "post",
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
          ? `<button onClick="${this.handleVerification.bind(this).toString()}">Verify</button>`
          : `<p>You are verified!!</p>`
      }
    </div>
  `;
  }
}

module.exports = RegistrationMail;
