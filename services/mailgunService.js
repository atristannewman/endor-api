const mailgun = require('mailgun-js');
const config = require('../config/mailgun');

const mg = mailgun({ apiKey: config.apiKey, domain: config.domain });

const sendMagicLinkToEmail = async (email, magicLink) => {
    const data = {
        from: config.fromEmail,
        to: email,
        subject: 'Login to Flock App with the link below',
        text: `Click the link to log in: ${magicLink}`,
    };

    console.log(`Sending magic link to ${email}`);
    // Placeholder for email sending logic

    try {
        await mg.messages().send(data);
        console.log(`Magic link sent to ${email}`);
    } catch (error) {
        console.error('Error sending magic link:', error);
        throw error;
    }
};
  
module.exports = {
    sendMagicLinkToEmail,
}