import { Calendar, CalendarIcon, MapPin, User } from 'lucide-react'
import EventCard from './EventCard'

const ColumnHeader = () => (
  <div className='grid grid-cols-5 p-4 bg-white rounded-lg shadow-sm border border-gray-100 mb-4'>
    <div className='flex items-center space-x-2'>
      <div className='text-sm font-medium text-gray-600'>Event Details</div>
    </div>
    <div className='flex items-center space-x-2'>
      <CalendarIcon className='text-gray-400' size={16} />
      <div className='text-sm font-medium text-gray-600'>Date Range</div>
    </div>
    <div className='flex items-center space-x-2'>
      <MapPin className='text-gray-400' size={16} />
      <div className='text-sm font-medium text-gray-600'>Location</div>
    </div>
    <div className='flex items-center space-x-2'>
      <User className='text-gray-400' size={16} />
      <div className='text-sm font-medium text-gray-600'>Created By</div>
    </div>
    <div className='flex justify-end'>
      <div className='text-sm font-medium text-gray-600'>Actions</div>
    </div>
  </div>
)

const LoadingSpinner = () => (
  <div className='flex items-center justify-center h-64'>
    <div className='relative w-24 h-24'>
      <div className='absolute top-0 left-0 w-full h-full border-4 border-indigo-100 rounded-full animate-pulse'></div>
      <div className='absolute top-0 left-0 w-full h-full border-t-4 border-indigo-500 rounded-full animate-spin'></div>
      <CalendarIcon
        className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-indigo-500'
        size={32}
      />
    </div>
    <p className='ml-4 text-lg font-medium text-indigo-600'>
      Loading Events...
    </p>
  </div>
)

const EventList = ({
  events = [], // Provide default empty array
  isLoading = false, // Provide default value
  expandedEventId,
  deletingEventId,
  onToggleDetails,
  onDeleteClick,
}) => {
  // Early return if loading
  if (isLoading) {
    return <LoadingSpinner />
  }

  // Check for empty events array
  if (!Array.isArray(events) || events.length === 0) {
    return (
      <div className='text-center bg-white rounded-lg shadow-sm border border-gray-100 p-8'>
        <Calendar className='mx-auto text-gray-400 mb-4' size={48} />
        <h3 className='text-lg font-medium text-gray-900 mb-1'>
          No events found
        </h3>
        <p className='text-gray-500'>Create your first event to get started</p>
      </div>
    )
  }

  return (
    <div>
      <ColumnHeader />
      <div className='space-y-4'>
        {events.map((event) => (
          <EventCard
            key={event._id}
            event={event}
            isExpanded={expandedEventId === event._id}
            deletingEventId={deletingEventId}
            onToggleDetails={onToggleDetails}
            onDeleteClick={onDeleteClick}
          />
        ))}
      </div>
    </div>
  )
}

export default EventList
