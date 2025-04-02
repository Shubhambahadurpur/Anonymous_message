import React from 'react';

interface EmailTemplateProps {
  userName: string,
  verifyCode: string
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  userName,
  verifyCode,
}) => (
  <div>
    <h1>Welcome, {userName}!</h1>
    <h1>Your Verification Code is {verifyCode}</h1>
  </div>
);
