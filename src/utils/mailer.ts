import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { logger } from '../utils/logging';
import retry from 'async-retry';

dotenv.config();

interface EmailOptions {
  toEmail: string;
  subject: string;
  htmlContent: string;
}

class MailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendEmail({ toEmail, subject, htmlContent }: EmailOptions): Promise<void> {
    const mailOptions = {
      from: `"My Project" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject,
      html: htmlContent,
    };

    try {
      await retry(
        async () => {
          await this.transporter.sendMail(mailOptions);
        },
        {
          retries: 3,
          minTimeout: 2000,
          factor: 2,
        },
      );

      logger.info(`✅ Email sent to: ${toEmail}`);
    } catch (error) {
      logger.error(`❌ Error sending email to ${toEmail}:`, error);
    }
  }

  generateVerificationEmail(toEmail: string, verificationLink: string): EmailOptions {
    return {
      toEmail,
      subject: 'تأكيد البريد الإلكتروني',
      htmlContent: `
        <!DOCTYPE html>
        <html lang="ar" dir="rtl">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>تأكيد البريد الإلكتروني</title>
            <style>
                body { font-family: Arial, sans-serif; text-align: center; background-color: #f5f5f5; color: #333; }
                .container { background: #fff; padding: 20px; border-radius: 8px; max-width: 600px; margin: auto; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
                h1 { color: #4CAF50; }
                a { display: inline-block; background: #4CAF50; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 5px; font-weight: bold; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>تأكيد بريدك الإلكتروني</h1>
                <p>مرحبًا بك! اضغط على الزر أدناه لتأكيد بريدك الإلكتروني.</p>
                <a href="${verificationLink}">تأكيد البريد الإلكتروني</a>
                <p>إذا لم تقم بالتسجيل، يمكنك تجاهل هذه الرسالة.</p>
            </div>
        </body>
        </html>
      `,
    };
  }

  generateResetPasswordEmail(toEmail: string, resetToken: string): EmailOptions {
    return {
      toEmail,
      subject: 'إعادة تعيين كلمة المرور',
      htmlContent: `
        <!DOCTYPE html>
        <html lang="ar" dir="rtl">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>إعادة تعيين كلمة المرور</title>
            <style>
                body { font-family: Arial, sans-serif; text-align: center; background-color: #f5f5f5; color: #333; }
                .container { background: #fff; padding: 20px; border-radius: 8px; max-width: 600px; margin: auto; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
                h1 { color: #FF5733; }
                .token-box { font-size: 18px; font-weight: bold; background: #eee; padding: 10px; border-radius: 5px; display: inline-block; margin: 10px 0; }
                p { font-size: 16px; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>إعادة تعيين كلمة المرور</h1>
                <p>لقد طلبت إعادة تعيين كلمة المرور الخاصة بك. استخدم الرمز أدناه لإتمام العملية:</p>
                <div class="token-box">${resetToken}</div>
                <p>يرجى نسخ هذا الرمز واستخدامه في نموذج إعادة تعيين كلمة المرور.</p>
                <p>إذا لم تطلب ذلك، يمكنك تجاهل هذه الرسالة.</p>
            </div>
        </body>
        </html>
      `,
    };
  }
}

export default new MailService();
