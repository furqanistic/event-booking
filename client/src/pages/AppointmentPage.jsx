import { Calendar, ChevronDown, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import Layout from './Layout'

// Mock data for doctors and rooms
const doctors = [
  {
    id: 1,
    name: 'Dr. Smith',
    specialty: 'Cardiology',
    availability: [9, 10, 11, 14, 15, 16],
  },
  {
    id: 2,
    name: 'Dr. Johnson',
    specialty: 'Neurology',
    availability: [10, 11, 13, 14, 15],
  },
  {
    id: 3,
    name: 'Dr. Williams',
    specialty: 'Pediatrics',
    availability: [9, 12, 13, 14, 16, 17],
  },
]

const rooms = [
  { id: 1, name: 'Room A', capacity: 3, availability: [9, 10, 11, 13, 14, 15] },
  {
    id: 2,
    name: 'Room B',
    capacity: 5,
    availability: [10, 11, 12, 14, 15, 16],
  },
]

// Simple Alert component
const Alert = ({ children, variant = 'default' }) => (
  <div
    className={`p-4 mb-4 rounded-md ${
      variant === 'destructive'
        ? 'bg-red-100 text-red-700'
        : 'bg-blue-100 text-blue-700'
    }`}
  >
    {children}
  </div>
)

// Simple AlertDialog component
const AlertDialog = ({ isOpen, onClose, title, description, onConfirm }) => {
  if (!isOpen) return null

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4'>
      <div className='bg-white rounded-lg p-6 max-w-sm w-full'>
        <h2 className='text-xl font-bold mb-4'>{title}</h2>
        <p className='mb-6'>{description}</p>
        <div className='flex justify-end space-x-2'>
          <button
            className='px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300'
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
            onClick={onConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}

const AppointmentPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)
  const [availableTimes, setAvailableTimes] = useState([])
  const [patientName, setPatientName] = useState('')
  const [patientEmail, setPatientEmail] = useState('')
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [bookingError, setBookingError] = useState(null)

  useEffect(() => {
    if (selectedDoctor && selectedRoom) {
      const doctorAvailability = doctors.find(
        (d) => d.id === selectedDoctor
      ).availability
      const roomAvailability = rooms.find(
        (r) => r.id === selectedRoom
      ).availability
      const commonAvailability = doctorAvailability.filter((time) =>
        roomAvailability.includes(time)
      )
      setAvailableTimes(commonAvailability)
    }
  }, [selectedDoctor, selectedRoom])

  const handleBooking = () => {
    if (
      selectedDoctor &&
      selectedRoom &&
      selectedTime &&
      patientName &&
      patientEmail
    ) {
      setShowConfirmDialog(true)
    } else {
      setBookingError('Please fill in all fields before booking.')
    }
  }

  const confirmBooking = () => {
    // Here you would typically send this data to your backend
    console.log('Booking confirmed:', {
      doctor: doctors.find((d) => d.id === selectedDoctor).name,
      room: rooms.find((r) => r.id === selectedRoom).name,
      date: selectedDate.toDateString(),
      time: `${selectedTime}:00`,
      patientName,
      patientEmail,
    })

    // Reset form
    setSelectedDoctor(null)
    setSelectedRoom(null)
    setSelectedTime(null)
    setPatientName('')
    setPatientEmail('')
    setShowConfirmDialog(false)
  }

  return (
    <Layout>
      <div className='max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl'>
        <h2 className='text-3xl font-bold mb-6 text-center text-gray-800'>
          Book an Appointment
        </h2>

        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='date'
          >
            Select Date
          </label>
          <input
            type='date'
            id='date'
            className='block w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500'
            value={selectedDate.toISOString().split('T')[0]}
            onChange={(e) => setSelectedDate(new Date(e.target.value))}
          />
        </div>

        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='doctor'
          >
            Select Doctor
          </label>
          <div className='relative'>
            <select
              id='doctor'
              className='block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500'
              onChange={(e) => setSelectedDoctor(Number(e.target.value))}
              value={selectedDoctor || ''}
            >
              <option value=''>Choose a doctor</option>
              {doctors.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.name} - {doctor.specialty}
                </option>
              ))}
            </select>
            <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700'>
              <ChevronDown size={20} />
            </div>
          </div>
        </div>

        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='room'
          >
            Select Room
          </label>
          <div className='relative'>
            <select
              id='room'
              className='block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500'
              onChange={(e) => setSelectedRoom(Number(e.target.value))}
              value={selectedRoom || ''}
            >
              <option value=''>Choose a room</option>
              {rooms.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.name} (Capacity: {room.capacity})
                </option>
              ))}
            </select>
            <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700'>
              <ChevronDown size={20} />
            </div>
          </div>
        </div>

        {availableTimes.length > 0 ? (
          <div className='mb-6'>
            <label className='block text-gray-700 text-sm font-bold mb-2'>
              Available Times
            </label>
            <div className='grid grid-cols-4 gap-2'>
              {availableTimes.map((time) => (
                <button
                  key={time}
                  className={`py-2 px-4 rounded ${
                    selectedTime === time
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-800'
                  } hover:bg-blue-400 transition duration-300`}
                  onClick={() => setSelectedTime(time)}
                >
                  {time}:00
                </button>
              ))}
            </div>
          </div>
        ) : (
          selectedDoctor &&
          selectedRoom && (
            <Alert variant='destructive'>
              <h3 className='font-bold'>No Available Times</h3>
              <p>
                There are no common available times for the selected doctor and
                room on this date. Please try a different combination.
              </p>
            </Alert>
          )
        )}

        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='patientName'
          >
            Patient Name
          </label>
          <input
            type='text'
            id='patientName'
            className='block w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500'
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            placeholder='Enter patient name'
          />
        </div>

        <div className='mb-6'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='patientEmail'
          >
            Patient Email
          </label>
          <input
            type='email'
            id='patientEmail'
            className='block w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500'
            value={patientEmail}
            onChange={(e) => setPatientEmail(e.target.value)}
            placeholder='Enter patient email'
          />
        </div>

        {bookingError && (
          <Alert variant='destructive'>
            <h3 className='font-bold'>Error</h3>
            <p>{bookingError}</p>
          </Alert>
        )}

        <button
          className='w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline flex items-center justify-center'
          onClick={handleBooking}
        >
          <Calendar className='mr-2' size={20} />
          Book Appointment
        </button>

        <AlertDialog
          isOpen={showConfirmDialog}
          onClose={() => setShowConfirmDialog(false)}
          title='Confirm Appointment'
          description={`
          Are you sure you want to book this appointment?
          Doctor: ${
            selectedDoctor
              ? doctors.find((d) => d.id === selectedDoctor).name
              : ''
          }
          Room: ${
            selectedRoom ? rooms.find((r) => r.id === selectedRoom).name : ''
          }
          Date: ${selectedDate.toDateString()}
          Time: ${selectedTime ? `${selectedTime}:00` : ''}
          Patient: ${patientName}
          Email: ${patientEmail}
        `}
          onConfirm={confirmBooking}
        />
      </div>
    </Layout>
  )
}

export default AppointmentPage
