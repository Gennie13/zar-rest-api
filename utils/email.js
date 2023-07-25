const nodemailer = require("nodemailer");

const sendEmail = async (option) => {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.nextTick.SMTP_PORT,
        secure: false,
        auth: {
          user: process.nextTick.SMTP_USERNAME,
          pass: process.env.SMTP_PASSWORD
        }
      });
      
      async function main() {
        // https://mailtrap.io/inboxes/2328894/messages
        const info = await transporter.sendMail({
          from: `"${process.env.SMTP_FROM}  - " <${process.env.SMTP_FROM_EMAIL}>`, // sender address
          to: options.email, // list of receivers
          subject: options.subject, // Subject line
          text: options.subject, // plain text body
          html: options.message, // html body
        });
      
        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

        return info
      }
      
}


module.exports = sendEmail