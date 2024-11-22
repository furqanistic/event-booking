import { sendBulkEmails, sendEmail } from '../utils/emailService.js'

export const sendEmailController = async (req, res, next) => {
  try {
    const { to, subject, text, html } = req.body

    // Basic validation
    if (!to || !subject || (!text && !html)) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      })
    }

    const result = await sendEmail({ to, subject, text, html })

    res.status(200).json({
      success: true,
      message: 'Email sent successfully',
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

export const sendBulkEmailController = async (req, res, next) => {
  try {
    const { emails } = req.body

    // Validate emails array
    if (!Array.isArray(emails) || emails.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid emails array',
      })
    }

    // Validate each email object
    for (const email of emails) {
      if (!email.to || !email.subject || (!email.text && !email.html)) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields in one or more emails',
        })
      }
    }

    const results = await sendBulkEmails(emails)

    res.status(200).json({
      success: true,
      message: 'Bulk emails sent successfully',
      data: results,
    })
  } catch (error) {
    next(error)
  }
}
