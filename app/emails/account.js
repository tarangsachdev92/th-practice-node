const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, firstName) => {
  sgMail.send({
    to: email,
    from: process.env.SENDER,
    subject: 'Thanks for joining in!',
    html: `
    <div>
        <h1>Welcome to the app, ${firstName}</h1>
    </div>`
  });
};

const generateLoginLink = (email, authToken) => {
  sgMail.send({
    to: email,
    from: process.env.SENDER,
    subject: 'Thanks for Login!',
    html: `
      <div>
          <h1>Welcome to the app, ${email}</h1>
          <h4>here is you login link</h4>
          <a href='${authToken}'>Link</a>
          <p>your token is ${authToken}</p>
      </div>`
  });
};

module.exports = {
  sendWelcomeEmail,
  generateLoginLink
};

// https://app.sendgrid.com/settings/sender_auth/senders
