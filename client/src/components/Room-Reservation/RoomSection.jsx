// RoomSection.js
import { Alert } from '@/components/ui/alert'
import { Circle, Square } from 'lucide-react'
import React from 'react'

// Constants - these could also be moved to a separate file
export const rooms = [
  {
    id: 1,
    name: 'Room A',
    icon: Square,
    totalCapacity: 30,
    sections: 3,
    sectionCapacity: 10,
    availability: [9, 10, 11, 13, 14, 15],
    features: ['Projector', 'Whiteboard', 'Video conferencing'],
  },
  {
    id: 2,
    name: 'Room B',
    icon: Circle,
    totalCapacity: 20,
    sections: 2,
    sectionCapacity: 10,
    availability: [10, 11, 12, 14, 15, 16],
    features: ['Whiteboard', 'Round table setup'],
  },
]

// Helper functions
export const calculateRequiredSections = (attendees, sectionCapacity) => {
  return Math.ceil(attendees / sectionCapacity)
}

export const validateSectionAvailability = (room, attendees) => {
  const requiredSections = calculateRequiredSections(
    attendees,
    room.sectionCapacity
  )

  // Example: If Room B needs all sections (11+ attendees), it's fully booked
  if (room.id === 2 && requiredSections > 1) {
    return false
  }

  // For Room A, if we need 1 section (1-10 people), only block 1/3 capacity
  if (room.id === 1) {
    return requiredSections <= room.sections
  }

  return true
}

const RoomSection = ({
  selectedRoom,
  setSelectedRoom,
  numberOfAttendees,
  showError = false,
  className = '',
}) => {
  // Component-specific helper
  const RoomIcon = ({ room }) => {
    const Icon = room.icon
    return <Icon className='w-6 h-6 text-gray-600' />
  }

  // Filter available rooms based on number of attendees
  const availableRooms = rooms.filter((room) => {
    if (!numberOfAttendees) return true
    return validateSectionAvailability(room, parseInt(numberOfAttendees))
  })

  // Get section info for selected room
  const getSectionInfo = () => {
    if (!selectedRoom || !numberOfAttendees) return null
    const room = rooms.find((r) => r.id === selectedRoom)
    if (!room) return null

    const requiredSections = calculateRequiredSections(
      parseInt(numberOfAttendees),
      room.sectionCapacity
    )
    return `This booking will use ${requiredSections} section${
      requiredSections > 1 ? 's' : ''
    } of the room`
  }

  // Format time for display
  const formatAvailabilityTime = (time) => {
    const period = time >= 12 ? 'PM' : 'AM'
    const displayHour = time > 12 ? time - 12 : time
    return `${displayHour}:00 ${period}`
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className='flex justify-between items-center'>
        <label className='block text-sm font-semibold text-gray-700'>
          Select Room
        </label>
        {showError && !selectedRoom && (
          <span className='text-sm text-red-500'>Please select a room</span>
        )}
      </div>

      {availableRooms.length === 0 && numberOfAttendees && (
        <Alert>
          <p className='text-red-600'>
            No rooms available for {numberOfAttendees} attendees
          </p>
        </Alert>
      )}

      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
        {availableRooms.map((room) => (
          <div
            key={room.id}
            onClick={() => setSelectedRoom(room.id)}
            className={`
              cursor-pointer rounded-xl border-2 p-4 
              transition-all duration-200 hover:shadow-md
              ${
                selectedRoom === room.id
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-200 hover:border-indigo-200'
              }
            `}
            role='button'
            tabIndex={0}
            aria-pressed={selectedRoom === room.id}
            onKeyPress={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                setSelectedRoom(room.id)
              }
            }}
          >
            <div className='flex items-center space-x-3 mb-2'>
              <RoomIcon room={room} />
              <h3 className='font-semibold text-gray-900'>{room.name}</h3>
              <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800'>
                Capacity: {room.totalCapacity}
              </span>
            </div>

            <div className='space-y-2'>
              <p className='text-sm text-gray-600'>
                {room.sections} sections of {room.sectionCapacity} people each
              </p>

              <div className='text-sm text-gray-500'>
                <p className='font-medium mb-1'>Available times:</p>
                <div className='flex flex-wrap gap-1'>
                  {room.availability.map((time) => (
                    <span key={time} className='px-2 py-1 bg-gray-100 rounded'>
                      {formatAvailabilityTime(time)}
                    </span>
                  ))}
                </div>
              </div>

              <div className='mt-2'>
                <p className='text-sm font-medium text-gray-600'>Features:</p>
                <div className='flex flex-wrap gap-2 mt-1'>
                  {room.features.map((feature) => (
                    <span
                      key={feature}
                      className='px-2 py-1 bg-gray-100 rounded text-xs text-gray-600'
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {getSectionInfo() && (
        <p className='text-sm text-indigo-600 font-medium mt-2'>
          {getSectionInfo()}
        </p>
      )}
    </div>
  )
}

export default RoomSection
