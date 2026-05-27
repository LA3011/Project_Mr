import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

if (
    !process.env.MAILERTRAP_PORT ||
    !process.env.MAILERTRAP_SMTP_ACCESS ||
    !process.env.MAILERTRAP_SMTP_KEY ||
    !process.env.MAILERTRAP_SMTP) {
    console.warn('[Server] Sin definir Las credenciales de "MAILERTRAP" (.env)');
}

export const mailerTransporter = nodemailer.createTransport({
    host: process.env.MAILERTRAP_SMTP,
    port: Number(process.env.MAILERTRAP_PORT),
    secure: false,
    auth: {
        user: process.env.MAILERTRAP_SMTP_ACCESS,
        pass: process.env.MAILERTRAP_SMTP_KEY,
    },
});

mailerTransporter.verify((error, _success) => {
    if (error) {
        console.error('[MAILERTRAP] Error en la conexión con el servidor: ', error.message);
    } else {
        console.log('[MAILERTRAP] Conexión exitosa: El servidor de correos está listo.');
    }
});