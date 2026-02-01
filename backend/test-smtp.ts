import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';
dotenv.config();

async function testSMTP() {
    console.log('Testing SMTP Connection...');
    console.log('Host:', process.env.SMTP_HOST || 'smtp.mailtrap.io');
    console.log('Port:', process.env.SMTP_PORT || '2525');
    console.log('User:', process.env.SMTP_USER || 'Not set');

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
        port: parseInt(process.env.SMTP_PORT || '2525'),
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    try {
        await transporter.verify();
        console.log('✅ SMTP Connection successful!');

        await transporter.sendMail({
            from: '"Lesssgo Test" <test@lesssgo.com>',
            to: 'sarmadusmani89@gmail.com', // Placeholder or user email
            subject: 'SMTP Test - Lesssgo',
            text: 'If you see this, SMTP is working perfectly.',
            html: '<b>If you see this, SMTP is working perfectly.</b>',
        });
        console.log('✅ Test email sent successfully!');
    } catch (error) {
        console.error('❌ SMTP Error:', error);
    }
}

testSMTP();
