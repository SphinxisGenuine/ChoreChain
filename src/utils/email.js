import { TransactionalEmailsApi, SendSmtpEmail } from "@getbrevo/brevo";
 const sendmailverification = async(options)=>{

const emailAPI = new TransactionalEmailsApi();
 emailAPI.authentications.apiKey.apiKey = process.env.BREVO_API;

const emailcontent = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Verify your email</title>
  </head>
  <body style="margin:0; padding:0; background-color:#f4f4f4;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4; padding:20px 0;">
      <tr>
        <td align="center">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; background-color:#ffffff; border-radius:8px; overflow:hidden; font-family:Arial, sans-serif;">
            
            <tr>
              <td style="padding:20px; background:#111827; color:#ffffff; text-align:center;">
                <h1 style="margin:0; font-size:24px;">ChoreChain</h1>
                <p style="margin:8px 0 0; font-size:14px; opacity:0.9;">
                  Verify your email address
                </p>
              </td>
            </tr>

            
            <tr>
              <td style="padding:24px;">
                <p style="margin:0 0 16px; font-size:16px; color:#111827;">
                  Hi ${options.username},
                </p>
                <p style="margin:0 0 16px; font-size:14px; color:#4b5563; line-height:1.6;">
                  Thanks for signing up! Please confirm that this is your email address by clicking the button below.
                </p>

                
                <p style="margin:24px 0; text-align:center;">
                  <a href=${options.link}
                    style="
                      display:inline-block;
                      padding:12px 24px;
                      font-size:14px;
                      font-weight:bold;
                      text-decoration:none;
                      color:#ffffff;
                      background-color:#2563eb;
                      border-radius:999px;
                    ">
                    Verify Email
                  </a>
                </p>

                <p style="margin:0 0 16px; font-size:12px; color:#6b7280; line-height:1.6;">
                  If the button doesn’t work, copy and paste this link into your browser:
                  <br />
                  <span style="word-break:break-all; color:#2563eb;">
                    ${options.link}
                  </span>
                </p>

                <p style="margin:24px 0 0; font-size:12px; color:#9ca3af;">
                  If you didn’t create an account, you can safely ignore this email.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html> `


const message = new SendSmtpEmail();

  message.subject = options.subject;
  message.sender = {
    email: process.env.SENDER_EMAIL,
    name: "ChoreChain",
  };
  message.to = [
    {
      email: options.email,
      name: options.username,
    },
  ];

  message.htmlContent =emailcontent

await emailAPI.sendTransacEmail(message);
}

export default sendmailverification
