import { mailerTransporter } from '../config/mailer.config.js';

export const sendRecoveryEmail = async (email: string, token: string): Promise<void> => {

    const recoveryLink = `${process.env.URL_APK}/reset-password?token=${token}`;
    const emisor = process.env.EMAIL_FROM || 'noreply@AkiParaTi.com';

    const headerBgUrl = 'https://static.vecteezy.com/system/resources/previews/022/737/904/non_2x/modern-city-scape-silhouette-simple-minimalist-blue-city-skyline-background-urban-cityscape-silhouettes-illustration-vector.jpg'

    const mailOptions = {
        from: `"Soporte Aki" <${emisor}>`,
        to: email,
        subject: 'Recuperación de contraseña - Aki Para Ti',
        html: `
            <!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AKI Para Ti - Restablecer Contraseña</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f3f2; font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 0; padding: 0; width: 100%; border-collapse: collapse; background-color: #f4f3f2;">
        <tr>
            <td align="center" style="padding: 0; margin: 0;">
                <div style="width: 100%; background: #ffffff; backdrop-filter: blur(0px); overflow: hidden; margin: 0; padding: 0;">
                    
                    <div style="background: linear-gradient(135deg, #fdfaf7 0%, #f7f4f0 100%); padding: 52px 32px 40px; text-align: center; border-bottom: 2px solid rgba(250, 109, 57, 0.6); position: relative; overflow: hidden;">
                        <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; opacity: 0.15; background-image: url('${headerBgUrl}'); background-size: cover; background-position: center; background-repeat: no-repeat;"></div>
                        
                        <div style="position: relative; z-index: 2;">
                            <h1 style="margin: 0; font-size: 42px; font-weight: 800; color: #fa6d39; letter-spacing: -1px; text-shadow: 0 2px 12px rgba(250, 109, 57, 0.15);">
                                AKI <span style="color: #2d2a26;">Para Ti</span>
                            </h1>
                            <p style="margin: 12px 0 0; font-size: 12px; color: #8c7664; font-weight: 400; letter-spacing: 2px; text-transform: uppercase;">Tu App de Confianza</p>
                        </div>
                    </div>

                    <div style="padding: 48px 40px 36px;">
                        <h2 style="margin: 0 0 16px; font-size: 26px; font-weight: 700; color: #2d2a26; letter-spacing: -0.5px; text-align: center;">
                            ¿Olvidaste tu contraseña?
                        </h2>
                        
                        <p style="margin: 0 0 32px; font-size: 15px; line-height: 1.7; color: #5c5651; text-align: center;">
                            Recibimos una solicitud para restablecer <br> el acceso a tu cuenta 
                            <strong style="color: #e05a28; font-weight: 600;">AKI Para Ti</strong>.
                        </p>

                        <a href="${recoveryLink}" style="display: inline-block; background: linear-gradient(135deg, #fa6d39 0%, #e05a28 100%); color: #ffffff; font-size: 15px; font-weight: 700; text-decoration: none; padding: 16px 48px; border-radius: 60px; transition: all 0.3s ease; letter-spacing: 0.5px;">
                            Restablecer contraseña
                        </a>

                        <div style="background: rgba(250, 109, 57, 0.05); border-left: 3px solid #fa6d39; padding: 18px 20px; border-radius: 12px; margin: 24px 0 20px;">
                            <p style="margin: 0; font-size: 13px; color: #8a5832; line-height: 1.5; text-align: center;">
                                <strong>Enlace de un solo uso</strong> Expira en <strong style="color: #e05a28;">15 minutos</strong>. <br> Si no solicitaste este cambio, ignora este mensaje.
                            </p>
                        </div>
                        
                        <div style="margin-top: 36px; padding-top: 24px; border-top: 1px solid rgba(250, 109, 57, 0.2);">
                            <p style="margin: 0 0 12px; font-size: 10px; color: #8c827a; text-transform: uppercase; font-weight: 600; letter-spacing: 1.5px; text-align: center;">
                                Enlace alternativo de recuperación
                            </p>
                            <div style="background: #f8f7f5; border: 1px solid rgba(250, 109, 57, 0.25); padding: 14px 16px; border-radius: 16px;">
                                <p style="margin: 0; font-size: 11px; color: #5c5651; font-family: 'SF Mono', 'Fira Code', monospace; word-break: break-all; text-align: center; line-height: 1.5;">
                                    ${recoveryLink}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div style="background: #faf9f7; padding: 28px 40px 18px; text-align: center; border-top: 1px solid rgba(250, 109, 57, 0.15); margin: 0;">
                        <p style="margin: 0 0 8px; font-size: 11px; color: #8c827a; letter-spacing: 0.5px;">
                            © 2026 AKI Para Ti — <span style="color: #5c5651;">Todos los derechos reservados</span>
                        </p>
                        <p style="margin: 0; font-size: 10px; color: #b0a7a0; line-height: 1.4;">
                            Este es un correo electrónico generado de forma automática.<br>Por favor, no respondas a este mensaje.
                        </p>
                        <div style="margin-top: 12px;">
                            <span style="display: inline-block; width: 40px; height: 2px; background: #fa6d39; opacity: 0.4; border-radius: 2px;"></span>
                        </div>
                    </div>
                    
                </div>
            </td>
        </tr>
    </table>
</body>
</html>
        `,
    };

    await mailerTransporter.sendMail(mailOptions);
};