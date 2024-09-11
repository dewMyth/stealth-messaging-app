import { Injectable } from '@nestjs/common';
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');

@Injectable()
export class EmailService {
  async sendVerificationEmail(email, username, code) {
    // Using Gmail as the Email Server
    /**
     *
     * To do this,
     * 1. we need a two way authentication enabled gmail account
     * 2. we need create a new app and have app password ( https://knowledge.workspace.google.com/kb/how-to-create-app-passwords-000009237)
     *
     */
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 465,
      auth: {
        user: 'dewmyth.dev@gmail.com', // Use any gmail
        pass: 'qklm neni exwv lzgs', // Replace the app password created for your account
      },
    });

    // Construct the path to the HTML template file
    const templatePath = path.join(
      __dirname,
      'templates',
      'verification-email-template.html',
    );

    console.log(templatePath);

    // Read the HTML template file
    let htmlTemplate = fs.readFileSync(templatePath, 'utf8');

    // Replace placeholder(s) with actual data
    htmlTemplate = htmlTemplate.replace('[RECIPIENT_NAME]', username);
    htmlTemplate = htmlTemplate.replace('[VERIFICATION_CODE]', code);

    // Constuct the email options
    const mailOptions = {
      from: '"Stealth Messaging App" <dewmyth.dev@gmail.com>',
      to: `${email}`,
      subject: 'Email Verification',
      html: htmlTemplate,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log('Message sent: %s', info.messageId);

    return info.messageId
      ? 'Message sent: ' + info.messageId
      : 'Error Sending Message';
  }
}
