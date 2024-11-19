import { Calendar, ChevronDown, Plus, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import Layout from './Layout'

const rooms = [
  {
    id: 1,
    name: 'Room A',
    totalCapacity: 30,
    sections: 3,
    sectionCapacity: 10,
    availability: [9, 10, 11, 13, 14, 15],
  },
  {
    id: 2,
    name: 'Room B',
    totalCapacity: 20,
    sections: 2,
    sectionCapacity: 10,
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
  const [selectedTime, setSelectedTime] = useState(null)
  const [availableTimes, setAvailableTimes] = useState([])
  const [reservationTitle, setReservationTitle] = useState('')
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [attendeeList, setAttendeeList] = useState('')
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [bookingError, setBookingError] = useState(null)
  const [bookingNotes, setBookingNotes] = useState('')

  // Calculate required sections based on number of attendees
  const calculateRequiredSections = (attendees, sectionCapacity) => {
    return Math.ceil(attendees / sectionCapacity)
  }

  // Filter available rooms based on number of attendees
  const availableRooms = rooms.filter((room) => {
    const requiredAttendees = parseInt(numberOfAttendees)
    if (!requiredAttendees) return true

    const requiredSections = calculateRequiredSections(
      requiredAttendees,
      room.sectionCapacity
    )
    return requiredSections <= room.sections
  })

  // Get required sections for selected room
  const getRequiredSections = () => {
    if (!selectedRoom || !numberOfAttendees) return null
    const room = rooms.find((r) => r.id === selectedRoom)
    return calculateRequiredSections(
      parseInt(numberOfAttendees),
      room.sectionCapacity
    )
  }

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
    const requiredSections = getRequiredSections()

    console.log('Reservation confirmed:', {
      room: rooms.find((r) => r.id === selectedRoom).name,
      sectionsRequired: requiredSections,
      date: selectedDate.toDateString(),
      time: `${selectedTime}:00`,
      title: reservationTitle,
      numberOfAttendees,
      doctor: selectedDoctor
        ? doctors.find((d) => d.id === selectedDoctor).name
        : 'None',
      attendees,
      notes: bookingNotes,
    })

    // Reset form
    setSelectedRoom(null)
    setSelectedTime(null)
    setReservationTitle('')
    setSelectedDoctor(null)
    setAttendeeList('')
    setNumberOfAttendees('')
    setBookingNotes('')
    setShowConfirmDialog(false)
  }

  // Get section information text
  const getSectionInfo = () => {
    if (!selectedRoom || !numberOfAttendees) return null
    const room = rooms.find((r) => r.id === selectedRoom)
    const requiredSections = getRequiredSections()
    return `This booking will use ${requiredSections} section${
      requiredSections > 1 ? 's' : ''
    } of the room`
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
                {/* Reservation Title Input */}
                <div className='space-y-4'>
                  <label
                    className='block text-sm font-semibold text-gray-700'
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
                {/* Doctor Selection */}
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

                {/* Room Selection */}
                <div className='space-y-4'>
                  <label className='block text-sm font-semibold text-gray-700'>
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
                          {room.sections} sections of {room.sectionCapacity}{' '}
                          people each
                        </p>
                      </div>
                    ))}
                  </div>
                  {getSectionInfo() && (
                    <p className='text-sm text-indigo-600 font-medium mt-2'>
                      {getSectionInfo()}
                    </p>
                  )}
                </div>

                {/* Booking Notes */}
                <div className='space-y-4'>
                  <label className='block text-sm font-semibold text-gray-700'>
                    Booking Notes
                  </label>
                  <textarea
                    className='block w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-xl leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200'
                    rows='3'
                    value={bookingNotes}
                    onChange={(e) => setBookingNotes(e.target.value)}
                    placeholder='Add any additional notes or requirements for this booking...'
                  />
                </div>

                {/* Rest of the form remains the same */}

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
            Required Sections: ${getRequiredSections()}
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
            ${bookingNotes ? `\nNotes: ${bookingNotes}` : ''}
          `}
          onConfirm={confirmBooking}
        />
      </div>
    </Layout>
  )
}

export default RoomReservationPage
