import React, { useState } from 'react';
import Axios from 'axios';

const RegistrationMail = (props) => {
  const { username, email, password } = props;
  const [result, setResult] = useState('');
  
  const handleVerification = () => {
    Axios
      .post('/verify-email', {
        header: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      })
      .then((response) => response.json())
      .then((data) => {
        const { status } = data;
        if (status === 'ok') {
          setResult('Registered');
        } else {
          setResult(data.error);
        }
      });
  };
  
  return (
    <div>
      <p>Hello ${username}, this is registration mail</p>
      {
        result !== 'Registered'
          ? `<button onClick="${handleVerification}">Verify</button>`
          : `<p>You are verified!!</p>`
      }
    </div>
  );
};

export default RegistrationMail;