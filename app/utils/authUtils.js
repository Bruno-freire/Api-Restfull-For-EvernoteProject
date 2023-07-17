const nodemailer = require('nodemailer')
const gmail = process.env.GMAIL
const password = process.env.PASSWORD
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: gmail,
    pass: password
  },
  debug: true
})

function generateAuthenticationCode() {
  return Math.floor(100000 + Math.random() * 900000);
}

async function sendConfirmationEmail (email, authenticationCode) {
  const mailOptions = {
    from: gmail,
    to: 'mirellenamorim1234@gmail.com',
    subject: 'Confirmação de E-mail',
    text: `Seu código de autenticação é: ${authenticationCode}`
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('E-mail enviado:', info.response);
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
  }
};

module.exports = {generateAuthenticationCode, sendConfirmationEmail}