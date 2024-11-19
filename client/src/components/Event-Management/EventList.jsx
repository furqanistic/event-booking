import {
  Calendar,
  CalendarIcon,
  CalendarPlus,
  ChevronRight,
  Loader,
  MapPin,
  Plus,
  Search,
  Trash2,
  User,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { destinationData } from '../../dataFile'
import EventCard from './EventCard'

// Import destination data at the top of both files

const getEventStatus = (start, end, destination) => {
  const now = new Date()
  const startDate = new Date(start)
  const endDate = new Date(end)

  // Get destination data
  const destData = destinationData[destination?.toUpperCase()] || {
    daysToReach: 1,
    daysToReturn: 1,
    cleaningDays: 1,
  }

  // Calculate transit dates
  const transitStartDate = new Date(startDate)
  transitStartDate.setDate(startDate.getDate() - destData.daysToReach)

  const transitEndDate = new Date(endDate)
  transitEndDate.setDate(endDate.getDate() + destData.daysToReturn)

  // Calculate cleaning period
  const cleaningStartDate = new Date(transitEndDate)
  const cleaningEndDate = new Date(transitEndDate)
  cleaningEndDate.setDate(cleaningEndDate.getDate() + destData.cleaningDays)

  // Determine status based on current date
  if (now < transitStartDate) {
    return { label: 'Upcoming', color: 'bg-purple-500' }
  }

  if (now >= transitStartDate && now < startDate) {
    return { label: 'In-Transit', color: 'bg-yellow-500' }
  }

  if (now >= startDate && now <= endDate) {
    return { label: 'Happening', color: 'bg-green-500' }
  }

  if (now > endDate && now <= transitEndDate) {
    return { label: 'In-Transit', color: 'bg-yellow-500' }
  }

  if (now > transitEndDate && now <= cleaningEndDate) {
    return { label: 'Cleaning', color: 'bg-blue-500' }
  }

  return { label: 'Completed', color: 'bg-gray-500' }
}

const SearchBar = ({ onSearch }) => (
  <div className='relative w-full md:w-96 mb-6'>
    <input
      type='text'
      placeholder='Search events...'
      className='w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200'
      onChange={(e) => onSearch(e.target.value)}
    />
    <Search
      className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'
      size={18}
    />
  </div>
)

const ColumnHeader = () => (
  <div className='hidden lg:grid lg:grid-cols-6 p-4 bg-white rounded-xl shadow-sm mb-4 backdrop-blur-sm bg-white/50'>
    <div className='flex items-center space-x-2'>
      <div className='text-sm font-semibold text-gray-700'>Event Details</div>
    </div>
    <div className='flex items-center space-x-2'>
      <CalendarIcon className='text-indigo-500' size={16} />
      <div className='text-sm font-semibold text-gray-700'>Date Range</div>
    </div>
    <div className='flex items-center space-x-2'>
      <MapPin className='text-indigo-500' size={16} />
      <div className='text-sm font-semibold text-gray-700'>Location</div>
    </div>
    <div className='flex items-center space-x-2'>
      <div className='text-sm font-semibold text-gray-700'>Status</div>
    </div>
    <div className='flex items-center space-x-2'>
      <User className='text-indigo-500' size={16} />
      <div className='text-sm font-semibold text-gray-700'>Created By</div>
    </div>
    <div className='flex justify-end'>
      <div className='text-sm font-semibold text-gray-700'>Actions</div>
    </div>
  </div>
)

const LoadingSpinner = () => (
  <div className='flex flex-col items-center justify-center h-64 px-4'>
    <div className='relative w-24 h-24 mb-6'>
      <div className='absolute top-0 left-0 w-full h-full rounded-full animate-ping opacity-20 bg-indigo-500'></div>
      <div className='absolute top-0 left-0 w-full h-full border-4 border-indigo-100 rounded-full'></div>
      <div className='absolute top-0 left-0 w-full h-full border-t-4 border-indigo-500 rounded-full animate-spin'></div>
      <CalendarIcon
        className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-indigo-500'
        size={32}
      />
    </div>
    <p className='text-xl font-semibold text-indigo-600 text-center animate-pulse'>
      Loading Events...
    </p>
  </div>
)

const ExtendDateDialog = ({
  show,
  onClose,
  onConfirm,
  currentEndDate,
  isExtending,
}) => {
  const [newEndDate, setNewEndDate] = useState('')
  const [extensionNote, setExtensionNote] = useState('')

  if (!show) return null

  const formatDateForInput = (date) => {
    return format(new Date(date), 'yyyy-MM-dd')
  }

  const calculateDaysDifference = (startDate, endDate) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = end.getTime() - start.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const handleConfirm = () => {
    if (!extensionNote.trim()) {
      alert('Please provide a note for the extension')
      return
    }
    const daysExtended = calculateDaysDifference(currentEndDate, newEndDate)

    // Convert to ISO string format for MongoDB
    const dateForMongo = new Date(newEndDate).toISOString()
    console.log('Selected date in ISO format:', dateForMongo) // Should show something like "2024-11-14T00:00:00.000Z"

    onConfirm({
      daysExtended: daysExtended,
      note: extensionNote,
      date: dateForMongo,
      newEndDate: newEndDate,
    })
    setNewEndDate('')
    setExtensionNote('')
  }

  const minDate = formatDateForInput(currentEndDate)

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4'>
        <h2 className='text-xl font-semibold text-gray-900 mb-4'>
          Extend Event End Date
        </h2>
        <div className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Current End Date:{' '}
              {format(new Date(currentEndDate), 'MMM dd, yyyy')}
            </label>
            <input
              type='date'
              min={minDate}
              value={newEndDate}
              onChange={(e) => setNewEndDate(e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Extension Note
            </label>
            <textarea
              value={extensionNote}
              onChange={(e) => setExtensionNote(e.target.value)}
              placeholder='Please provide a reason for extending the event...'
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 h-24 resize-none'
              required
            />
          </div>
        </div>
        <div className='flex justify-end space-x-3 mt-6'>
          <button
            onClick={() => {
              onClose()
              setNewEndDate('')
              setExtensionNote('')
            }}
            className='px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors duration-200'
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!newEndDate || !extensionNote.trim() || isExtending}
            className='px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2'
          >
            {isExtending ? (
              <>
                <Loader className='animate-spin' size={16} />
                <span>Extending...</span>
              </>
            ) : (
              <>
                <CalendarPlus size={16} />
                <span>Extend Date</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

const MobileEventCard = ({
  event,
  onToggleDetails,
  onDeleteClick,
  onExtendDate,
  deletingEventId,
  extendingEventId,
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showExtendDialog, setShowExtendDialog] = useState(false)

  const status = getEventStatus(event.start, event.end, event.destination)

  const handleToggle = () => {
    setIsExpanded(!isExpanded)
    onToggleDetails(event._id)
  }

  return (
    <>
      {/* ... existing mobile card JSX ... */}
      {isExpanded && (
        <div className='border-t border-gray-100 bg-gray-50'>
          <div className='p-4 space-y-4'>
            <button
              onClick={() => setShowExtendDialog(true)}
              className='w-full px-4 py-2.5 text-sm font-medium text-white bg-indigo-500 rounded-lg hover:bg-indigo-600 transition-colors duration-200 flex items-center justify-center space-x-2'
            >
              <CalendarPlus size={16} />
              <span>Extend Event</span>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation()
                onDeleteClick(event._id)
              }}
              disabled={deletingEventId === event._id}
              className='w-full px-4 py-2.5 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2'
            >
              {deletingEventId === event._id ? (
                <>
                  <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                  <span>Deleting...</span>
                </>
              ) : (
                <>
                  <Trash2 size={16} />
                  <span>Delete Event</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
      <ExtendDateDialog
        show={showExtendDialog}
        onClose={() => setShowExtendDialog(false)}
        onExtendDate={onExtendDate}
        currentEndDate={event.end}
        isExtending={extendingEventId === event._id}
      />
    </>
  )
}

const EventList = ({
  events = [],
  isLoading = false,
  expandedEventId,
  deletingEventId,
  onToggleDetails,
  onDeleteClick,
  onExtendDate,
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const filteredEvents = useMemo(() => {
    if (!searchTerm.trim()) return events

    const searchLower = searchTerm.toLowerCase()
    return events.filter((event) => {
      return (
        event.title?.toLowerCase().includes(searchLower) ||
        event.eventType?.toLowerCase().includes(searchLower) ||
        event.district?.toLowerCase().includes(searchLower) ||
        event.department?.toLowerCase().includes(searchLower) ||
        event.createdBy?.toLowerCase().includes(searchLower) ||
        new Date(event.start)
          .toLocaleDateString()
          .toLowerCase()
          .includes(searchLower) ||
        new Date(event.end)
          .toLocaleDateString()
          .toLowerCase()
          .includes(searchLower) ||
        getEventStatus(event.start, event.end, event.destination)
          .label.toLowerCase()
          .includes(searchLower)
      )
    })
  }, [events, searchTerm])

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (!Array.isArray(events) || events.length === 0) {
    return (
      <div className='text-center bg-white rounded-xl shadow-sm border border-gray-100 p-8'>
        <div className='w-16 h-16 mx-auto mb-4 bg-indigo-50 rounded-full flex items-center justify-center'>
          <Calendar className='text-indigo-500' size={32} />
        </div>
        <h3 className='text-xl font-semibold text-gray-900 mb-2'>
          No events found
        </h3>
        <p className='text-gray-500 mb-6'>
          Get started by creating your first event
        </p>
        <button className='inline-flex items-center px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors duration-200'>
          <Plus size={18} className='mr-2' />
          Create Event
        </button>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      <SearchBar onSearch={setSearchTerm} />

      <ColumnHeader />

      {filteredEvents.length === 0 ? (
        <div className='text-center bg-white rounded-xl shadow-sm border border-gray-100 p-8'>
          <div className='w-16 h-16 mx-auto mb-4 bg-indigo-50 rounded-full flex items-center justify-center'>
            <Search className='text-indigo-500' size={32} />
          </div>
          <h3 className='text-xl font-semibold text-gray-900 mb-2'>
            No matching events found
          </h3>
          <p className='text-gray-500'>
            Try adjusting your search terms or clear the search
          </p>
        </div>
      ) : (
        <>
          {/* Desktop view */}
          <div className='hidden lg:block space-y-4'>
            {filteredEvents.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                isExpanded={expandedEventId === event._id}
                deletingEventId={deletingEventId}
                onToggleDetails={onToggleDetails}
                onDeleteClick={onDeleteClick}
                onExtendDate={onExtendDate}
              />
            ))}
          </div>

          {/* Mobile view */}
          <div className='lg:hidden space-y-4'>
            {filteredEvents.map((event) => (
              <MobileEventCard
                key={event._id}
                event={event}
                deletingEventId={deletingEventId}
                onToggleDetails={onToggleDetails}
                onDeleteClick={onDeleteClick}
                onExtendDate={onExtendDate}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default EventList
