// Email configuration and helper functions
const NOTIFICATION_EMAILS = [
  'tcavalcanti.freelance@gmail.com',
  'furqanistic@gmail.com',
  'lorena.alarco@straumann.com',
  'katherine.taboada@straumann.com',
  'carla.bustios@straumann.com',
  'daniel.huamani@straumann.com',
  'juan.zevallos@straumann.com',
  'rosa.villagra@straumann.com',
]

const formatEventEmailDetails = (eventData, userData) => {
  const eventDate = new Date().toLocaleDateString()
  const eventTime = new Date().toLocaleTimeString()
  const eventId = `EVENT-${Date.now()}`

  const materialsList = eventData.selectedMaterials
    .map(
      (item) =>
        `- ${item.name}: ${item.quantity} units (${eventData.start} to ${eventData.end})`
    )
    .join('\n')

  const merchandisingList = eventData.selectedMerchandising
    ?.map((item) => `- ${item.name}: ${item.quantity} units`)
    .join('\n')

  const locationDetails = `
    Address: ${eventData.address || 'N/A'}
    Reference: ${eventData.reference || 'N/A'}
    Department: ${eventData.department}
    Province: ${eventData.province}
    District: ${eventData.district}
    Destination: ${eventData.destination}
  `

  return {
    subject: `New Event Registration #${eventId} - ${eventDate}`,
    text: `New Event Registration from ${userData.name}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>New Event Registration</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif;">
        <div style="width: 100%; max-width: 600px; margin: 0 auto; padding: 20px;">
          <!-- Header -->
          <div style="background-color: #2563eb; padding: 20px; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px; text-align: center;">New Event Registration</h1>
          </div>

          <!-- Content -->
          <div style="border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px; padding: 20px;">
            <!-- Event Info -->
            <div style="margin-bottom: 20px;">
              <h2 style="color: #374151; margin: 0 0 10px 0;">${
                eventData.title
              }</h2>
              <p style="color: #374151; font-size: 16px; margin: 4px 0;">
                <strong>Event ID:</strong> ${eventId}
              </p>
              <p style="color: #374151; font-size: 16px; margin: 4px 0;">
                <strong>Type:</strong> ${eventData.eventType}
              </p>
              <p style="color: #374151; font-size: 16px; margin: 4px 0;">
                <strong>Date Range:</strong> ${eventData.start} to ${
      eventData.end
    }
              </p>
            </div>

            <!-- Materials -->
            ${
              materialsList
                ? `
              <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <h3 style="color: #1f2937; margin: 0 0 10px 0;">Reserved Materials</h3>
                <pre style="margin: 0; font-family: Arial, sans-serif;">${materialsList}</pre>
              </div>
            `
                : ''
            }

            <!-- Merchandising -->
            ${
              merchandisingList
                ? `
              <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <h3 style="color: #1f2937; margin: 0 0 10px 0;">Merchandising Items</h3>
                <pre style="margin: 0; font-family: Arial, sans-serif;">${merchandisingList}</pre>
              </div>
            `
                : ''
            }

            <!-- Location -->
            <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px;">
              <h3 style="color: #1f2937; margin: 0 0 10px 0;">Event Location</h3>
              <pre style="margin: 0; font-family: Arial, sans-serif;">${locationDetails}</pre>
            </div>
          </div>

          <!-- Footer -->
          <div style="text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px;">
            <p>This is an automated message for event registration.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }
}

const sendEventEmails = async (eventData, userData) => {
  try {
    const emailDetails = formatEventEmailDetails(eventData, userData)

    await Promise.all(
      NOTIFICATION_EMAILS.map(async (email) => {
        const response = await axiosInstance.post('/email/send', {
          to: email,
          ...emailDetails,
        })
        return response.data
      })
    )
  } catch (error) {
    console.error('Error sending event emails:', error)
    throw new Error(`Failed to send email notifications: ${error.message}`)
  }
}

export const handleEventEmailNotification = async (eventData, userData) => {
  try {
    await sendEventEmails(eventData, userData)
    return {
      success: true,
      message: 'Event registration emails sent successfully',
    }
  } catch (error) {
    console.error('Error handling event notification:', error)
    return {
      success: false,
      message: 'Failed to send event registration notifications',
      error: error.message,
    }
  }
}

export default handleEventEmailNotification
