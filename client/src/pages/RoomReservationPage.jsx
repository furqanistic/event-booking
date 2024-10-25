import { Calendar, ChevronDown, Plus, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import Layout from './Layout'

// Mock data for rooms and doctors
const rooms = [
  {
    id: 1,
    name: 'Room A',
    capacity: 3,
    availability: [9, 10, 11, 13, 14, 15],
  },
  {
    id: 2,
    name: 'Room B',
    capacity: 5,
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
            {/* Progress Steps */}
            <div className='bg-gray-50 px-6 py-4 border-b border-gray-200'>
              <div className='flex items-center justify-between max-w-2xl mx-auto'>
                <div className='flex flex-col items-center'>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      selectedDate
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    1
                  </div>
                  <span className='text-xs mt-1 font-medium text-gray-600'>
                    Date
                  </span>
                </div>
                <div
                  className={`h-1 flex-1 mx-2 ${
                    selectedRoom ? 'bg-indigo-600' : 'bg-gray-200'
                  }`}
                />
                <div className='flex flex-col items-center'>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      selectedRoom
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    2
                  </div>
                  <span className='text-xs mt-1 font-medium text-gray-600'>
                    Room
                  </span>
                </div>
                <div
                  className={`h-1 flex-1 mx-2 ${
                    selectedTime ? 'bg-indigo-600' : 'bg-gray-200'
                  }`}
                />
                <div className='flex flex-col items-center'>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      selectedTime
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    3
                  </div>
                  <span className='text-xs mt-1 font-medium text-gray-600'>
                    Details
                  </span>
                </div>
              </div>
            </div>

            <div className='p-6'>
              <div className='max-w-2xl mx-auto space-y-8'>
                {/* Date Selection */}
                <div className='space-y-4'>
                  <label
                    className='block text-sm font-semibold text-gray-700'
                    htmlFor='date'
                  >
                    Select Date
                  </label>
                  <input
                    type='date'
                    id='date'
                    className='block w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-xl leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200'
                    value={selectedDate.toISOString().split('T')[0]}
                    onChange={(e) => setSelectedDate(new Date(e.target.value))}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                {/* Room Selection */}
                <div className='space-y-4'>
                  <label
                    className='block text-sm font-semibold text-gray-700'
                    htmlFor='room'
                  >
                    Select Room
                  </label>
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    {rooms.map((room) => (
                      <div
                        key={room.id}
                        onClick={() => setSelectedRoom(room.id)}
                        className={`cursor-pointer rounded-xl border-2 p-4 transition-all duration-200 ${
                          selectedRoom === room.id
                            ? 'border-indigo-500 bg-indigo-50'
                            : 'border-gray-200 hover:border-indigo-200'
                        }`}
                      >
                        <div className='flex justify-between items-start mb-2'>
                          <h3 className='font-semibold text-gray-900'>
                            {room.name}
                          </h3>
                          <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800'>
                            Capacity: {room.capacity}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Time Selection */}
                {availableTimes.length > 0 && (
                  <div className='space-y-4'>
                    <label className='block text-sm font-semibold text-gray-700'>
                      Available Times
                    </label>
                    <div className='grid grid-cols-2 sm:grid-cols-4 gap-3'>
                      {availableTimes.map((time) => (
                        <button
                          key={time}
                          className={`py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200 ${
                            selectedTime === time
                              ? 'bg-indigo-600 text-white shadow-md'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                          onClick={() => setSelectedTime(time)}
                        >
                          {time}:00
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Reservation Details */}
                <div className='space-y-6'>
                  <div>
                    <label
                      className='block text-sm font-semibold text-gray-700 mb-2'
                      htmlFor='title'
                    >
                      Reservation Title
                    </label>
                    <input
                      type='text'
                      id='title'
                      className='block w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-xl leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200'
                      value={reservationTitle}
                      onChange={(e) => setReservationTitle(e.target.value)}
                      placeholder='e.g., Team Meeting, Training Session'
                    />
                  </div>

                  <div>
                    <label
                      className='block text-sm font-semibold text-gray-700 mb-2'
                      htmlFor='doctor'
                    >
                      Request Doctor (Optional)
                    </label>
                    <select
                      id='doctor'
                      className='block w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-xl leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 appearance-none'
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
                  </div>

                  {/* Attendees */}
                  <div className='space-y-4'>
                    <label className='block text-sm font-semibold text-gray-700'>
                      Attendees
                    </label>
                    <div className='space-y-3'>
                      {attendees.map((attendee, index) => (
                        <div
                          key={index}
                          className='flex items-center justify-between bg-gray-50 p-3 rounded-xl'
                        >
                          <div className='flex items-center space-x-3'>
                            <div className='h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center'>
                              <span className='text-indigo-600 font-medium'>
                                {attendee.name.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <p className='font-medium text-gray-900'>
                                {attendee.name}
                              </p>
                              <p className='text-sm text-gray-500'>
                                ID: {attendee.id}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => removeAttendee(index)}
                            className='text-gray-400 hover:text-red-500 transition-colors duration-200'
                          >
                            <X size={20} />
                          </button>
                        </div>
                      ))}

                      <div className='flex gap-3'>
                        <input
                          type='text'
                          placeholder='Attendee Name'
                          className='flex-grow bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-xl leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200'
                          value={newAttendee.name}
                          onChange={(e) =>
                            setNewAttendee({
                              ...newAttendee,
                              name: e.target.value,
                            })
                          }
                        />
                        <input
                          type='text'
                          placeholder='ID Number'
                          className='w-32 sm:w-40 bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-xl leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200'
                          value={newAttendee.id}
                          onChange={(e) =>
                            setNewAttendee({
                              ...newAttendee,
                              id: e.target.value,
                            })
                          }
                        />
                        <button
                          onClick={handleAddAttendee}
                          className='bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-xl transition-colors duration-200 flex items-center justify-center'
                        >
                          <Plus size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {bookingError && (
                  <div className='rounded-xl bg-red-50 p-4 text-red-800'>
                    <h3 className='font-semibold mb-1'>Error</h3>
                    <p className='text-sm'>{bookingError}</p>
                  </div>
                )}

                <button
                  className='w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 px-6 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed'
                  onClick={handleBooking}
                  disabled={
                    !selectedRoom ||
                    !selectedTime ||
                    !reservationTitle ||
                    attendees.length === 0
                  }
                >
                  <Calendar size={20} />
                  <span>Complete Reservation</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <AlertDialog
          isOpen={showConfirmDialog}
          onClose={() => setShowConfirmDialog(false)}
          title='Confirm Reservation'
          description={`
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
