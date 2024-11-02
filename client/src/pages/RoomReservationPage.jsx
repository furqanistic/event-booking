import { Calendar, ChevronDown, Plus, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import Layout from './Layout'

// Enhanced mock data for rooms with sections
const rooms = [
  {
    id: 1,
    name: 'Room A',
    totalCapacity: 15,
    sections: 3,
    sectionCapacity: 5,
    availability: [9, 10, 11, 13, 14, 15],
  },
  {
    id: 2,
    name: 'Room B',
    totalCapacity: 5,
    sections: 1,
    sectionCapacity: 5,
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
  const [numberOfAttendees, setNumberOfAttendees] = useState('')
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [selectedSections, setSelectedSections] = useState(1)
  const [selectedTime, setSelectedTime] = useState(null)
  const [availableTimes, setAvailableTimes] = useState([])
  const [reservationTitle, setReservationTitle] = useState('')
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [attendeeList, setAttendeeList] = useState('')
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [bookingError, setBookingError] = useState(null)

  // Filter available rooms based on number of attendees
  const availableRooms = rooms.filter((room) => {
    const requiredAttendees = parseInt(numberOfAttendees)
    if (!requiredAttendees) return true
    return (
      room.sectionCapacity >= requiredAttendees ||
      room.totalCapacity >= requiredAttendees
    )
  })

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

  const handleAttendeesInput = (input) => {
    setAttendeeList(input)
  }

  const parseAttendees = () => {
    if (!attendeeList) return []
    return attendeeList
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .map((line) => {
        const [name, id] = line.split(/[,\t]/).map((item) => item.trim())
        return { name: name || '', id: id || '' }
      })
  }

  const handleBooking = () => {
    const attendees = parseAttendees()
    if (
      selectedRoom &&
      selectedTime &&
      reservationTitle &&
      attendees.length > 0 &&
      numberOfAttendees &&
      attendees.length === parseInt(numberOfAttendees)
    ) {
      setShowConfirmDialog(true)
    } else {
      setBookingError(
        'Please fill in all required fields and ensure the number of attendees matches the entered list.'
      )
    }
  }

  const confirmBooking = () => {
    const attendees = parseAttendees()
    console.log('Reservation confirmed:', {
      room: rooms.find((r) => r.id === selectedRoom).name,
      sections: selectedSections,
      date: selectedDate.toDateString(),
      time: `${selectedTime}:00`,
      title: reservationTitle,
      numberOfAttendees,
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
    setAttendeeList('')
    setNumberOfAttendees('')
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
            <div className='p-6'>
              <div className='max-w-2xl mx-auto space-y-8'>
                {/* Number of Attendees */}
                <div className='space-y-4'>
                  <label
                    className='block text-sm font-semibold text-gray-700'
                    htmlFor='attendees'
                  >
                    Number of Attendees
                  </label>
                  <input
                    type='number'
                    id='attendees'
                    min='1'
                    className='block w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-xl leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200'
                    value={numberOfAttendees}
                    onChange={(e) => setNumberOfAttendees(e.target.value)}
                    placeholder='Enter number of attendees'
                  />
                </div>

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
                    {availableRooms.map((room) => (
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
                            Capacity: {room.totalCapacity}
                          </span>
                        </div>
                        <p className='text-sm text-gray-600'>
                          Can be split into {room.sections} sections of{' '}
                          {room.sectionCapacity} people each
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section Selection */}
                {selectedRoom && (
                  <div className='space-y-4'>
                    <label className='block text-sm font-semibold text-gray-700'>
                      Number of Sections Needed
                    </label>
                    <select
                      className='block w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-xl leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200'
                      value={selectedSections}
                      onChange={(e) =>
                        setSelectedSections(Number(e.target.value))
                      }
                    >
                      {Array.from(
                        {
                          length: rooms.find((r) => r.id === selectedRoom)
                            .sections,
                        },
                        (_, i) => i + 1
                      ).map((num) => (
                        <option key={num} value={num}>
                          {num} section{num > 1 ? 's' : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

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

                  {/* Attendees List */}
                  <div className='space-y-4'>
                    <label className='block text-sm font-semibold text-gray-700'>
                      Attendee List
                    </label>
                    <div className='space-y-2'>
                      <textarea
                        className='block w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-xl leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200'
                        rows='6'
                        value={attendeeList}
                        onChange={(e) => handleAttendeesInput(e.target.value)}
                        placeholder='Paste attendee list here&#10;Format: Name, ID&#10;Example:&#10;John Doe, 12345&#10;Jane Smith, 67890'
                      ></textarea>
                      <p className='text-sm text-gray-500'>
                        Paste your attendee list with one person per line.
                        Format: Name, ID
                      </p>
                      {attendeeList && (
                        <div className='mt-4 p-4 bg-gray-50 rounded-xl'>
                          <h4 className='font-medium text-gray-900 mb-2'>
                            Preview:
                          </h4>
                          <div className='space-y-2'>
                            {parseAttendees().map((attendee, index) => (
                              <div
                                key={index}
                                className='flex items-center space-x-3 text-sm'
                              >
                                <div className='h-6 w-6 bg-indigo-100 rounded-full flex items-center justify-center'>
                                  <span className='text-indigo-600 font-medium'>
                                    {attendee.name.charAt(0)}
                                  </span>
                                </div>
                                <span className='font-medium'>
                                  {attendee.name}
                                </span>
                                <span className='text-gray-500'>
                                  ID: {attendee.id}
                                </span>
                              </div>
                            ))}
                          </div>
                          <p className='mt-2 text-sm text-gray-500'>
                            Total attendees: {parseAttendees().length} /{' '}
                            {numberOfAttendees || '?'}
                          </p>
                        </div>
                      )}
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
                    !numberOfAttendees ||
                    !attendeeList ||
                    parseAttendees().length !== parseInt(numberOfAttendees)
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
          Sections: ${selectedSections}
          Date: ${selectedDate.toDateString()}
          Time: ${selectedTime ? `${selectedTime}:00` : ''}
          Title: ${reservationTitle}
          Number of Attendees: ${numberOfAttendees}
          Doctor: ${
            selectedDoctor
              ? doctors.find((d) => d.id === selectedDoctor).name
              : 'None'
          }
          Total Attendees: ${parseAttendees().length}
        `}
          onConfirm={confirmBooking}
        />
      </div>
    </Layout>
  )
}

export default RoomReservationPage
