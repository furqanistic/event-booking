// ReservationForm.js
import { Alert } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { AlertTriangle, Calendar } from 'lucide-react'
import React from 'react'

// Constants
export const DURATION_OPTIONS = [
  { value: 30, label: '30 minutes' },
  { value: 60, label: '1 hour' },
  { value: 90, label: '1 hour 30 minutes' },
  { value: 120, label: '2 hours' },
  { value: 150, label: '2 hours 30 minutes' },
  { value: 180, label: '3 hours' },
]

const FormField = ({ label, error, children }) => (
  <div className='space-y-2'>
    <div className='flex justify-between'>
      <label className='block text-sm font-semibold text-gray-700'>
        {label}
      </label>
      {error && (
        <span className='text-sm text-red-500 flex items-center gap-1'>
          <AlertTriangle className='w-4 h-4' />
          {error}
        </span>
      )}
    </div>
    {children}
  </div>
)

const ReservationForm = ({
  reservationTitle,
  setReservationTitle,
  numberOfAttendees,
  setNumberOfAttendees,
  duration,
  setDuration,
  selectedDoctor,
  setSelectedDoctor,
  availableDoctors,
  selectedTime,
  availableTimes,
  setSelectedTime,
  attendeeList,
  setAttendeeList,
  bookingNotes,
  setBookingNotes,
  parseAttendees,
  bookingError,
  handleBooking,
  selectedRoom,
  formErrors = {},
  className = '',
}) => {
  // Helper function to format time
  const formatTime = (time) => {
    const period = time >= 12 ? 'PM' : 'AM'
    const displayHour = time > 12 ? time - 12 : time
    return `${displayHour}:00 ${period}`
  }

  // Validation helpers
  const getAttendeeCount = () => {
    const parsedAttendees = parseAttendees()
    return parsedAttendees.length
  }

  const isFormValid = () => {
    return (
      selectedRoom &&
      selectedTime &&
      reservationTitle &&
      numberOfAttendees &&
      attendeeList &&
      getAttendeeCount() === parseInt(numberOfAttendees)
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Title Section */}
      <FormField label='Reservation Title' error={formErrors.title}>
        <input
          type='text'
          className='block w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-xl leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200'
          value={reservationTitle}
          onChange={(e) => setReservationTitle(e.target.value)}
          placeholder='e.g., Team Meeting, Training Session'
        />
      </FormField>

      {/* Attendees Count Section */}
      <FormField label='Number of Attendees' error={formErrors.attendees}>
        <input
          type='number'
          min='1'
          className='block w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-xl leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200'
          value={numberOfAttendees}
          onChange={(e) => setNumberOfAttendees(e.target.value)}
          placeholder='Enter number of attendees'
        />
      </FormField>

      {/* Duration Section */}
      <FormField label='Duration' error={formErrors.duration}>
        <select
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          className='block w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-xl leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200'
        >
          {DURATION_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </FormField>

      {/* Doctor Selection */}
      <FormField label='Request Doctor (Optional)' error={formErrors.doctor}>
        <select
          className='block w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-xl leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200'
          onChange={(e) =>
            setSelectedDoctor(e.target.value ? Number(e.target.value) : null)
          }
          value={selectedDoctor || ''}
        >
          <option value=''>No doctor needed</option>
          {availableDoctors.map((doctor) => (
            <option key={doctor.id} value={doctor.id}>
              {doctor.name} - {doctor.specialty}
            </option>
          ))}
        </select>
      </FormField>

      {/* Time Selection */}
      {selectedRoom && (
        <FormField label='Available Times' error={formErrors.time}>
          <div className='grid grid-cols-2 sm:grid-cols-4 gap-2'>
            {availableTimes.map((time) => (
              <Button
                key={time}
                onClick={() => setSelectedTime(time)}
                variant={selectedTime === time ? 'default' : 'outline'}
                className='w-full'
              >
                {formatTime(time)}
              </Button>
            ))}
          </div>
          {availableTimes.length === 0 && (
            <Alert className='mt-2'>
              No available times for the selected duration
            </Alert>
          )}
        </FormField>
      )}

      {/* Attendee List */}
      <FormField label='Attendee List' error={formErrors.attendeeList}>
        <textarea
          className='block w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-xl leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200'
          rows='4'
          value={attendeeList}
          onChange={(e) => setAttendeeList(e.target.value)}
          placeholder='Enter one attendee per line
Example:
John Smith, EMP123
Jane Doe, EMP456'
        />
        <div className='flex justify-between mt-1'>
          <p className='text-sm text-gray-500'>Enter one attendee per line</p>
          <p
            className={`text-sm ${
              getAttendeeCount() === parseInt(numberOfAttendees)
                ? 'text-green-600'
                : 'text-gray-500'
            }`}
          >
            Count: {getAttendeeCount()}/{numberOfAttendees || '0'}
          </p>
        </div>
      </FormField>

      {/* Booking Notes */}
      <FormField label='Booking Notes' error={formErrors.notes}>
        <textarea
          className='block w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-xl leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200'
          rows='3'
          value={bookingNotes}
          onChange={(e) => setBookingNotes(e.target.value)}
          placeholder='Add any additional notes or requirements for this booking...'
        />
      </FormField>

      {/* Error Display */}
      {bookingError && (
        <Alert variant='destructive' className='mt-4'>
          {bookingError}
        </Alert>
      )}

      {/* Submit Button */}
      <Button
        className='w-full py-4 px-6'
        onClick={handleBooking}
        disabled={!isFormValid()}
      >
        <Calendar className='w-5 h-5 mr-2' />
        Complete Reservation
      </Button>
    </div>
  )
}

export default ReservationForm
