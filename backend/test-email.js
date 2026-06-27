import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'byishimovedaste19@gmail.com',
    pass: 'fhstinrwexhedajl',
  },
  tls: { rejectUnauthorized: false },
  dnsOptions: { family: 4 },
});

async function testEmail() {
  try {
    console.log('Verifying connection...');
    await transporter.verify();
    console.log('Connection verified. Sending test email...');
    
    const info = await transporter.sendMail({
      from: '"Test" <byishimovedaste19@gmail.com>',
      to: 'byishimovedaste19@gmail.com',
      subject: 'Test Email',
      text: 'This is a test email.',
    });
    console.log('Email sent successfully:', info.messageId);
  } catch (err) {
    console.error('Error sending email:', err);
  }
}

testEmail();
