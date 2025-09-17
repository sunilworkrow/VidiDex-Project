import { NextResponse } from 'next/server';
import db from '@/app/lib/db';
import crypto from 'crypto';
const SibApiV3Sdk = require('@sendinblue/client'); // ✅ Correct for CommonJS
import * as bravokey from '@sendinblue/client';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ success: false, message: 'Email is required' }, { status: 400 });
    }

    const [userResult]: any = await db.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (userResult.length === 0) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    const tokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    await db.query(
      'UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE email = ?',
      [resetToken, tokenExpiry, email]
    );

    const resetLink = `http://localhost:3000/reset-password?token=${resetToken}&email=${email}`;
    console.log("Reset link:", resetLink);



    // ✅ Brevo email sending
    // const brevoClient = new SibApiV3Sdk.TransactionalEmailsApi();
    // brevoClient.setApiKey(
    //   SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey,
    //   process.env.BREVO_API_KEY
    // );

    // await brevoClient.sendTransacEmail({
    //   sender: {
    //     email: 'ksunil@workrow.io',
    //     name: 'workrow',
    //   },
    //   to: [{ email }],
    //   subject: 'Reset your password',
    //   htmlContent: `
    //     <h2>Password Reset</h2>
    //     <p>Click the link below to reset your password:</p>
    //     <a href="${resetLink}">
    //     <button> Click on Reset password  </button>
    //     </a>
    //     <p>This link will expire in 1 hour.</p>
    //   `,
    // });


    const brevoClient = new bravokey.TransactionalEmailsApi();

    console.log("API", brevoClient);

    brevoClient.setApiKey(
      bravokey.TransactionalEmailsApiApiKeys.apiKey,
      process.env.BREVO_API_KEY as string
    );

    console.log("API", brevoClient);



    try {
      const result = await brevoClient.sendTransacEmail({
        sender: {
          email: 'ksunil@workrow.io',
          name: 'workrow',
        },
        to: [{ email }],
        subject: 'Reset your password',
        htmlContent: `
      <h2>Password Reset</h2>
      <p>Click the link below to reset your password:</p>
      <a href="${resetLink}" style="padding: 10px 15px; background-color: #007bff; color: white; text-decoration: none;">Reset Password</a>
      <p>This link will expire in 1 hour.</p>
    `,
      });

      console.log("Brevo Email Sent Successfully:", result);
    } catch (emailError: any) {
      console.error("❌ Brevo Email Send Error:", emailError.response?.body || emailError.message || emailError);
      return NextResponse.json({ success: false, message: 'Failed to send email' }, { status: 500 });
    }


    await brevoClient.sendTransacEmail({
      sender: {
        email: 'ksunil@workrow.io',
        name: 'workrow',
      },
      to: [{ email }],
      subject: 'Reset your password',
      htmlContent: `
        <h2>Password Reset</h2>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}">
        <button> Click on Reset password  </button>
        </a>
        <p>This link will expire in 1 hour.</p>
      `,
    });


    const webhookResponse = await fetch('http://localhost:5678/webhook/80d68536-7214-47ee-9113-4a6b0d066c77', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: true,
        message: 'Reset email sent successfully!',
        email,
        resetLink
      })
    });

    if (!webhookResponse.ok) {
      console.error('Failed to send data to n8n:', await webhookResponse.text());
    }






    return NextResponse.json({
      success: true,
      message: 'Reset email sent successfully!',
    });

  } catch (error: any) {
    console.error("Forgot Password Error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
