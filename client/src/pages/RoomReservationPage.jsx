// RoomReservationPage.js
import { axiosInstance } from '@/config'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

import ReservationForm from '@/components/Room-Reservation/ReservationForm'
import RoomSection from '@/components/Room-Reservation/RoomSection'
import { AlertDialog } from '@/components/ui/alert-dialog'
import { Circle, Square } from 'lucide-react'
import Layout from './Layout'

// Constants
const rooms = [
  {
    id: 1,
    name: 'Room A',
    icon: Square,
    totalCapacity: 30,
    sections: 3,
    sectionCapacity: 10,
    availability: [9, 10, 11, 13, 14, 15],
  },
  {
    id: 2,
    name: 'Room B',
    icon: Circle,
    totalCapacity: 20,
    sections: 2,
    sectionCapacity: 10,
    availability: [10, 11, 12, 14, 15, 16],
  },
]

const doctors = [
  {
    id: 1,
    name: 'Lorena Alarco',
    email: 'lorena.alarco@straumann.com',
    brand: 'nuo',
    specialty: 'Neodent and Nuvo',
    availability: [9, 10, 11, 14, 15, 16],
  },
  {
    id: 2,
    name: 'Katherine Taboada',
    email: 'katherine.taboada@straumann.com',
    brand: 'straumann',
    specialty: 'Straumann',
    availability: [10, 11, 13, 14, 15],
  },
  // ... other doctors
]

const EMAIL_LISTS = {
  marketing: [
    'gianluca.de.bari@straumann.com',
    'jocelyn.villanueva@straumann.com',
  ],
}

const RoomReservationPage = ({ userBrand = 'nuo', userEmail }) => {
  // State management
  const [formState, setFormState] = useState({
    reservationTitle: '',
    numberOfAttendees: '',
    selectedRoom: null,
    selectedTime: null,
    duration: 30,
    selectedDoctor: null,
    attendeeList: '',
    bookingNotes: '',
  })

  const [formErrors, setFormErrors] = useState({})
  const [availableTimes, setAvailableTimes] = useState([])
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Get available doctors based on user brand
  const availableDoctors = doctors.filter(
    (doctor) => doctor.brand === userBrand
  )

  // Helper function to parse attendee list
  const parseAttendees = () => {
    if (!formState.attendeeList) return []
    return formState.attendeeList
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .map((line) => {
        const [name, id] = line.split(/[,\t]/).map((item) => item.trim())
        return { name: name || '', id: id || '' }
      })
  }

  // Validation function
  const validateForm = () => {
    const errors = {}

    if (!formState.reservationTitle) {
      errors.title = 'Title is required'
    }

    if (!formState.numberOfAttendees) {
      errors.attendees = 'Number of attendees is required'
    } else if (
      parseAttendees().length !== parseInt(formState.numberOfAttendees)
    ) {
      errors.attendees = 'Number of attendees must match the list'
    }

    if (!formState.selectedRoom) {
      errors.room = 'Please select a room'
    }

    if (!formState.selectedTime) {
      errors.time = 'Please select a time'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Create email content
  const createEmailTemplate = (reservationDetails) => {
    return `
      <h2>Room Reservation Confirmation</h2>
      <p>A new room has been reserved with the following details:</p>
      <ul>
        <li>Title: ${reservationDetails.title}</li>
        <li>Room: ${reservationDetails.room}</li>
        <li>Date: ${reservationDetails.date}</li>
        <li>Time: ${reservationDetails.time}</li>
        <li>Duration: ${reservationDetails.duration}</li>
        <li>Number of Attendees: ${reservationDetails.numberOfAttendees}</li>
        <li>Required Sections: ${reservationDetails.sections}</li>
        ${
          reservationDetails.doctor
            ? `<li>Doctor: ${reservationDetails.doctor}</li>`
            : ''
        }
        ${
          reservationDetails.notes
            ? `<li>Notes: ${reservationDetails.notes}</li>`
            : ''
        }
      </ul>
      <h3>Attendee List:</h3>
      <ul>
        ${reservationDetails.attendees
          .map(
            (attendee) =>
              `<li>${attendee.name}${
                attendee.id ? ` (${attendee.id})` : ''
              }</li>`
          )
          .join('')}
      </ul>
    `
  }

  // Handle sending notifications
  const sendReservationNotifications = async (reservationDetails) => {
    try {
      const recipients = new Set([userEmail, ...EMAIL_LISTS.marketing])

      if (reservationDetails.doctorEmail) {
        recipients.add(reservationDetails.doctorEmail)
      }

      const emailTemplate = createEmailTemplate(reservationDetails)

      await Promise.all(
        Array.from(recipients).map((email) =>
          axiosInstance.post('/email/send', {
            to: email,
            subject: `Room Reservation: ${reservationDetails.title}`,
            html: emailTemplate,
          })
        )
      )
    } catch (error) {
      console.error('Error sending notifications:', error)
      throw error
    }
  }

  // Handle form submission
  const handleBooking = async () => {
    if (!validateForm()) {
      toast.error('Please fill in all required fields correctly')
      return
    }

    setShowConfirmDialog(true)
  }

  // Handle confirmation
  const handleConfirmBooking = async () => {
    try {
      setIsSubmitting(true)
      const room = rooms.find((r) => r.id === formState.selectedRoom)
      const doctor = doctors.find((d) => d.id === formState.selectedDoctor)

      const reservationDetails = {
        title: formState.reservationTitle,
        room: room.name,
        sections: calculateRequiredSection(
          parseInt(formState.numberOfAttendees),
          room.sectionCapacity
        ),
        date: new Date().toDateString(),
        time: `${formState.selectedTime}:00`,
        duration: `${formState.duration} minutes`,
        numberOfAttendees: formState.numberOfAttendees,
        doctor: doctor?.name,
        doctorEmail: doctor?.email,
        attendees: parseAttendees(),
        notes: formState.bookingNotes,
      }

      // Send notifications
      await sendReservationNotifications(reservationDetails)

      // Show success message
      toast.success('Reservation confirmed!')

      // Reset form
      setFormState({
        reservationTitle: '',
        numberOfAttendees: '',
        selectedRoom: null,
        selectedTime: null,
        duration: 30,
        selectedDoctor: null,
        attendeeList: '',
        bookingNotes: '',
      })

      setShowConfirmDialog(false)
    } catch (error) {
      console.error('Error processing reservation:', error)
      toast.error('Error processing reservation')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Update available times when dependencies change
  useEffect(() => {
    if (formState.selectedRoom && formState.numberOfAttendees) {
      const room = rooms.find((r) => r.id === formState.selectedRoom)
      let times = [...room.availability]

      if (formState.selectedDoctor) {
        const doctor = doctors.find((d) => d.id === formState.selectedDoctor)
        times = times.filter((time) => doctor.availability.includes(time))
      }

      const durationHours = formState.duration / 60
      times = times.filter((time) => {
        const endTime = time + durationHours
        const timeSlots = []
        for (let t = time; t < endTime; t += 0.5) {
          timeSlots.push(Math.floor(t))
        }
        return timeSlots.every((t) => room.availability.includes(t))
      })

      setAvailableTimes(times)
    }
  }, [
    formState.selectedRoom,
    formState.selectedDoctor,
    formState.duration,
    formState.numberOfAttendees,
  ])

  return (
    <Layout>
      <div className='min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-4xl mx-auto'>
          <div className='text-center mb-8'>
            <h2 className='text-3xl font-bold text-gray-900 mb-2'>
              Room Reservation
            </h2>
            <p className='text-gray-600'>
              Schedule a room for your next meeting or event
            </p>
          </div>

          <div className='bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden'>
            <div className='p-6 space-y-8'>
              <RoomSection
                selectedRoom={formState.selectedRoom}
                setSelectedRoom={(roomId) =>
                  setFormState((prev) => ({ ...prev, selectedRoom: roomId }))
                }
                numberOfAttendees={formState.numberOfAttendees}
                showError={!!formErrors.room}
              />

              <ReservationForm
                {...formState}
                setReservationTitle={(title) =>
                  setFormState((prev) => ({ ...prev, reservationTitle: title }))
                }
                setNumberOfAttendees={(num) =>
                  setFormState((prev) => ({ ...prev, numberOfAttendees: num }))
                }
                setDuration={(dur) =>
                  setFormState((prev) => ({ ...prev, duration: dur }))
                }
                setSelectedDoctor={(doc) =>
                  setFormState((prev) => ({ ...prev, selectedDoctor: doc }))
                }
                setSelectedTime={(time) =>
                  setFormState((prev) => ({ ...prev, selectedTime: time }))
                }
                setAttendeeList={(list) =>
                  setFormState((prev) => ({ ...prev, attendeeList: list }))
                }
                setBookingNotes={(notes) =>
                  setFormState((prev) => ({ ...prev, bookingNotes: notes }))
                }
                availableDoctors={availableDoctors}
                availableTimes={availableTimes}
                parseAttendees={parseAttendees}
                handleBooking={handleBooking}
                formErrors={formErrors}
              />
            </div>
          </div>
        </div>

        <AlertDialog
          isOpen={showConfirmDialog}
          onClose={() => setShowConfirmDialog(false)}
          title='Confirm Reservation'
          description={`
            Room: ${
              formState.selectedRoom
                ? rooms.find((r) => r.id === formState.selectedRoom).name
                : ''
            }
            Time: ${
              formState.selectedTime ? `${formState.selectedTime}:00` : ''
            }
            Duration: ${formState.duration} minutes
            Title: ${formState.reservationTitle}
            Number of Attendees: ${formState.numberOfAttendees}
            Doctor: ${
              formState.selectedDoctor
                ? doctors.find((d) => d.id === formState.selectedDoctor).name
                : 'None'
            }
            ${
              formState.bookingNotes ? `\nNotes: ${formState.bookingNotes}` : ''
            }
          `}
          onConfirm={handleConfirmBooking}
          isSubmitting={isSubmitting}
        />
      </div>
    </Layout>
  )
}

export default RoomReservationPage
