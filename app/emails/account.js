// https://app.sendgrid.com/settings/sender_auth/senders

const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, firstName) => {
  sgMail.send({
    to: email,
    from: 'tarang.sachdev@techholding.co',
    subject: 'Thanks for joining in!',
    html: `
    <div>
        <h1>Welcome to the app, ${firstName}</h1>
    </div>`,
  });
};

const generateLoginLink = (email) => {
  sgMail.send({
    to: email,
    from: 'tarang.sachdev@techholding.co',
    subject: 'Thanks for Login!',
    html: `
      <div>
          <h1>Welcome to the app, ${email}</h1>
          <h4>here is you login link</h4>
          <a href='taransachdev'>Link</a>
      </div>`,
  });
};

module.exports = {
  sendWelcomeEmail,
  generateLoginLink,
};
