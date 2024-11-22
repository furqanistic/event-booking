import dotenv from 'dotenv'
import nodemailer from 'nodemailer'
dotenv.config()

// Verify required environment variables
const requiredEnvVars = ['GMAIL_USER', 'GMAIL_APP_PASSWORD']
requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`)
  }
})

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
})

// Verify connection configuration
const verifyConnection = async () => {
  try {
    await transporter.verify()
    return true
  } catch (error) {
    console.error('Error establishing SMTP connection:', error)
    throw error
  }
}

export const sendEmail = async ({ to, subject, text, html }) => {
  try {
    await verifyConnection()

    const mailOptions = {
      from: {
        name: process.env.COMPANY_NAME || 'Straumann Grp',
        address: process.env.GMAIL_USER,
      },
      to,
      subject,
      text,
      html,
    }

    const info = await transporter.sendMail(mailOptions)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Error sending email:', error)
    throw error
  }
}

export const sendBulkEmails = async (emailsList) => {
  try {
    // Verify connection before sending
    await verifyConnection()
    const results = await Promise.all(
      emailsList.map((emailData) => sendEmail(emailData))
    )
    return { success: true, results }
  } catch (error) {
    console.error('Error sending bulk emails:', error)
    throw error
  }
}
