import nodemailer from 'nodemailer';

export interface SmtpConfig {
  user: string;
  password: string;
  host: string;
  port: number;
  secure: boolean;
}

export async function sendEmail(config: SmtpConfig, options: { to: string; subject: string; text: string; html?: string }) {
  if (!config.user || !config.password) {
    throw new Error("SMTP Error: Username or Password was empty at the transport layer.");
  }

  console.log(`📡 SMTP Connect: ${config.host}:${config.port} | User: ${config.user}`);
  
  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure, 
    auth: {
      user: config.user.trim(),
      pass: config.password.trim(), // Note: Nodemailer uses 'pass', not 'password' in some versions!
    },
    debug: true,
    logger: true
  });

  try {
    const info = await transporter.sendMail({
      from: config.user,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });

    console.log('✅ SMTP Success! Message ID:', info.messageId);
    return info;
  } catch (error: any) {
    console.error('❌ SMTP Runtime Error:', error.message);
    throw error;
  }
}
