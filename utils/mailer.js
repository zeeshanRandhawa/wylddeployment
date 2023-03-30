const nodemailer = require("nodemailer");
const { DOMAIN } = process.env
const { DOMAIN_API } = process.env
const user = "testwyldmailer@gmail.com"
const pass = "xfncigtqpsdywjrt"

const fs = require('fs');
const path = require('path');

const transport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: user,
    pass: pass,
  },
  tls: {
    rejectUnauthorized: false
  }
});

sendConfirmationEmail = (email, confirmationCode) => {

  const filePath = path.join(__dirname, '..', 'html templates', 'magic link.html');
  const html = fs.readFileSync(filePath, 'utf-8');
  const image = fs.readFileSync(path.join(__dirname, '..', 'html templates', 'sidebar-logo.png')).toString('base64');

  const htmlWithImage = html.replace('{{image}}', `data:image/svg+xml;base64,${image}`);
  const htmlWithValues = htmlWithImage
    .replace('{{email}}', email)
    
    .replace('{{confirmation_code}}', "http://"+DOMAIN_API+"/api/v1/users/confirm/" + confirmationCode);

  transport.sendMail({
    from: user,
    to: email,
    subject: "Please confirm your account",
    html: htmlWithValues,
  }).catch(err => console.log(err));
};



sendForgotPasswordEmail = (email, confirmationCode) => {

  const filePath = path.join(__dirname, '..', 'html templates', 'forgot password.html');
  const html = fs.readFileSync(filePath, 'utf-8');
  const image = fs.readFileSync(path.join(__dirname, '..', 'html templates', 'sidebar-logo.png')).toString('base64');

  const htmlWithImage = html.replace('{{image}}', `data:image/svg+xml;base64,${image}`);
  const htmlWithValues = htmlWithImage
    .replace('{{email}}', email)
    // .replace('{{confirmation_code}}', "http://"+DOMAIN+"/signupinfo/");
    .replace('{{confirmation_code}}', "http://"+DOMAIN_API+"/api/v1/users/forgotpassword/confirm/" + confirmationCode);
 

  transport.sendMail({
    from: user,
    to: email,
    subject: "Please confirm your account",
    html: htmlWithValues,
  }).catch(err => console.log(err));
};




module.exports = {

  sendConfirmationEmail, sendForgotPasswordEmail

}