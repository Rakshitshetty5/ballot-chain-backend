const nodemailer = require('nodemailer')
const EMAIL_ID = process.env.EMAIL_ID
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD

const sendEmail = async options => {
    //1 Create a transporter
    
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
        user: EMAIL_ID,
        pass: EMAIL_PASSWORD
        }
    });

    //2 Define the email options
    const mailOptions = {
        from: EMAIL_ID,
        to: options.email,
        subject: options.subject,
        text: options.message
    }

    //3 Actually send the email
    await transporter.sendMail(mailOptions)
}

module.exports = sendEmail