import nodemailer from "nodemailer";

const EMAIL_SERVER = process.env.EMAIL_SERVER;
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

export const transporter = nodemailer.createTransport({
    host: EMAIL_SERVER,
    port: 587,
    secure: false,
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
    },
});

export async function sendMail({
    to,
    subject,
    html,
}: {
    to: string;
    subject: string;
    html: string;
}) {
    return transporter.sendMail({
        from: EMAIL_USER,
        to,
        subject,
        html,
    });
}
