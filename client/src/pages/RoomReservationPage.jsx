import { Calendar, ChevronDown, Plus, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import Layout from './Layout'

// Mock data for rooms and doctors
const rooms = [
  {
    id: 1,
    name: 'Room A',
    capacity: 3,
    equipment: ['Projector', 'Whiteboard'],
    availability: [9, 10, 11, 13, 14, 15],
  },
  {
    id: 2,
    name: 'Room B',
    capacity: 5,
    equipment: ['TV Screen', 'Conference Phone'],
    availability: [10, 11, 12, 14, 15, 16],
  },
]

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

const AlertDialog = ({ isOpen, onClose, title, description, onConfirm }) => {
  if (!isOpen) return null

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4'>
      <div className='bg-white rounded-lg p-6 max-w-sm w-full'>
        <h2 className='text-xl font-bold mb-4'>{title}</h2>
        <p className='mb-6 whitespace-pre-line'>{description}</p>
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

const RoomReservationPage = ({ userBrand = 'nuo' }) => {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)
  const [availableTimes, setAvailableTimes] = useState([])
  const [reservationTitle, setReservationTitle] = useState('')
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [attendees, setAttendees] = useState([])
  const [newAttendee, setNewAttendee] = useState({ name: '', id: '' })
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [bookingError, setBookingError] = useState(null)

  // Get the assigned doctor based on the user's brand
  const assignedDoctor = doctors.find(
    (d) =>
      (userBrand === 'nuo' && d.id === 2) ||
      (userBrand === 'cardio' && d.id === 1) ||
      (userBrand === 'pedia' && d.id === 3)
  )

  useEffect(() => {
    if (selectedRoom) {
      const room = rooms.find((r) => r.id === selectedRoom)
      let availableTimes = room.availability

      if (selectedDoctor) {
        const doctor = doctors.find((d) => d.id === selectedDoctor)
        availableTimes = availableTimes.filter((time) =>
          doctor.availability.includes(time)
        )
      }

      setAvailableTimes(availableTimes)
    }
  }, [selectedRoom, selectedDoctor])

  const handleAddAttendee = () => {
    if (newAttendee.name && newAttendee.id) {
      setAttendees([...attendees, newAttendee])
      setNewAttendee({ name: '', id: '' })
    }
  }

  const removeAttendee = (index) => {
    setAttendees(attendees.filter((_, i) => i !== index))
  }

  const handleBooking = () => {
    if (
      selectedRoom &&
      selectedTime &&
      reservationTitle &&
      attendees.length > 0
    ) {
      setShowConfirmDialog(true)
    } else {
      setBookingError(
        'Please fill in all required fields and add at least one attendee.'
      )
    }
  }

  const confirmBooking = () => {
    // Here you would typically send this data to your backend
    console.log('Reservation confirmed:', {
      room: rooms.find((r) => r.id === selectedRoom).name,
      date: selectedDate.toDateString(),
      time: `${selectedTime}:00`,
      title: reservationTitle,
      doctor: selectedDoctor
        ? doctors.find((d) => d.id === selectedDoctor).name
        : 'None',
      attendees,
    })

    // Reset form
    setSelectedRoom(null)
    setSelectedTime(null)
    setReservationTitle('')
    setSelectedDoctor(null)
    setAttendees([])
    setShowConfirmDialog(false)
  }

  return (
    <Layout>
      <div className='max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl'>
        <h2 className='text-3xl font-bold mb-6 text-center text-gray-800'>
          Room Reservation
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
          {selectedRoom && (
            <div className='mt-2 text-sm text-gray-600'>
              Equipment:{' '}
              {rooms.find((r) => r.id === selectedRoom).equipment.join(', ')}
            </div>
          )}
        </div>

        {availableTimes.length > 0 && (
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
        )}

        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='title'
          >
            Reservation Title
          </label>
          <input
            type='text'
            id='title'
            className='block w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500'
            value={reservationTitle}
            onChange={(e) => setReservationTitle(e.target.value)}
            placeholder='e.g., Training Session, Team Meeting'
          />
        </div>

        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='doctor'
          >
            Request Doctor (Optional)
          </label>
          <div className='relative'>
            <select
              id='doctor'
              className='block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500'
              onChange={(e) =>
                setSelectedDoctor(
                  e.target.value ? Number(e.target.value) : null
                )
              }
              value={selectedDoctor || ''}
            >
              <option value=''>No doctor needed</option>
              <option value={assignedDoctor.id}>
                {assignedDoctor.name} - {assignedDoctor.specialty}
              </option>
            </select>
            <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700'>
              <ChevronDown size={20} />
            </div>
          </div>
        </div>

        <div className='mb-6'>
          <label className='block text-gray-700 text-sm font-bold mb-2'>
            Attendees
          </label>
          <div className='space-y-2'>
            {attendees.map((attendee, index) => (
              <div
                key={index}
                className='flex items-center space-x-2 bg-gray-50 p-2 rounded'
              >
                <span className='flex-grow'>
                  {attendee.name} (ID: {attendee.id})
                </span>
                <button
                  onClick={() => removeAttendee(index)}
                  className='text-red-500 hover:text-red-700'
                >
                  <X size={20} />
                </button>
              </div>
            ))}
          </div>
          <div className='mt-2 flex space-x-2'>
            <input
              type='text'
              placeholder='Attendee Name'
              className='flex-grow bg-white border border-gray-300 text-gray-700 py-2 px-3 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500'
              value={newAttendee.name}
              onChange={(e) =>
                setNewAttendee({ ...newAttendee, name: e.target.value })
              }
            />
            <input
              type='text'
              placeholder='ID Number'
              className='w-32 bg-white border border-gray-300 text-gray-700 py-2 px-3 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500'
              value={newAttendee.id}
              onChange={(e) =>
                setNewAttendee({ ...newAttendee, id: e.target.value })
              }
            />
            <button
              onClick={handleAddAttendee}
              className='bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded'
            >
              <Plus size={20} />
            </button>
          </div>
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
          Reserve Room
        </button>

        <AlertDialog
          isOpen={showConfirmDialog}
          onClose={() => setShowConfirmDialog(false)}
          title='Confirm Reservation'
          description={`
          Are you sure you want to make this reservation?
          
          Room: ${
            selectedRoom ? rooms.find((r) => r.id === selectedRoom).name : ''
          }
          Date: ${selectedDate.toDateString()}
          Time: ${selectedTime ? `${selectedTime}:00` : ''}
          Title: ${reservationTitle}
          Doctor: ${
            selectedDoctor
              ? doctors.find((d) => d.id === selectedDoctor).name
              : 'None'
          }
          Attendees: ${attendees.length}
        `}
          onConfirm={confirmBooking}
        />
      </div>
    </Layout>
  )
}

export default RoomReservationPage
