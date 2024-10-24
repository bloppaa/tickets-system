import nodemailer from 'nodemailer';

export async function sendResetEmail(email: string, token: string) {
  /**
   const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,  // Configurar en las variables de entorno
      pass: process.env.EMAIL_PASS,  // Configurar en las variables de entorno
    },
  });
  */
 const transporter = nodemailer.createTransport({
    host: 'app.debugmail.io',
    port: 25,
    auth: {
      user: 'b97343bc-b4fe-4a98-a57d-4d27e795c177',
      pass: '1e6ff7fc-2504-4ab5-b715-000098cb9d44'
    }
  });

  const resetUrl = `http://localhost:3000/reset-password?token=${token}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Recuperación de contraseña',
    text: `Haz clic en el siguiente enlace para restablecer tu contraseña: ${resetUrl}`,
  };

  await transporter.sendMail(mailOptions);
}
