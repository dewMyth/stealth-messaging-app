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

  async conversationPINEmail(email, username, pin, friendEmail) {
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
      'conversation-pin-template.html',
    );

    console.log(templatePath);

    // Read the HTML template file
    let htmlTemplate = fs.readFileSync(templatePath, 'utf8');

    // Replace placeholder(s) with actual data
    htmlTemplate = htmlTemplate.replace('[friendsName]', friendEmail[0]);
    htmlTemplate = htmlTemplate.replace('[YourName]', username);
    htmlTemplate = htmlTemplate.replace('[PIN_Code]', pin);

    // Constuct the email options
    const mailOptions = {
      from: '"Stealth Messaging App" <dewmyth.dev@gmail.com>',
      to: `${email}`,
      subject: 'Your Secure Conversation Unlock PIN for Stealth Messaging App',
      html: htmlTemplate,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log('Message sent: %s', info.messageId);

    return info.messageId
      ? 'Message sent: ' + info.messageId
      : 'Error Sending Message';
  }

  async conversationUnlockFailAlertEmail(
    email,
    username,
    attemptedUser,
    friendName,
  ) {
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
      'conversation-unlock-failed-alert.html',
    );

    console.log(templatePath);

    // Read the HTML template file
    let htmlTemplate = fs.readFileSync(templatePath, 'utf8');

    // Replace placeholder(s) with actual data
    htmlTemplate = htmlTemplate.replace('[friendsName]', friendName);
    htmlTemplate = htmlTemplate.replace('[YourName]', username);
    htmlTemplate = htmlTemplate.replace('[attemptedUser]', attemptedUser);

    // Constuct the email options
    const mailOptions = {
      from: '"Stealth Messaging App" <dewmyth.dev@gmail.com>',
      to: `${email}`,
      subject: 'Unlock attmept failed for Stealth Messaging App',
      html: htmlTemplate,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log('Message sent: %s', info.messageId);

    return info.messageId
      ? 'Message sent: ' + info.messageId
      : 'Error Sending Message';
  }
}
